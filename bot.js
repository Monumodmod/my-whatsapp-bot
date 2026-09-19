const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const readline = require('readline');
const fs = require('fs');
const { exec } = require('child_process');
const yts = require('yt-search');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ['Ubuntu', 'Chrome', '20.0.04']
    });

    if (!sock.authState.creds.registered) {
        console.log('\n[+] Pairing Mode Activated');
        const phoneNumber = await question('👉 Enter your WhatsApp phone number with country code: ');
        const cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');

        setTimeout(async () => {
            try {
                const pairingCode = await sock.requestPairingCode(cleanedNumber);
                console.log('\n==================================================');
                console.log(`🔑 YOUR PAIRING CODE: ${pairingCode}`);
                console.log('==================================================\n');
            } catch (err) {
                console.error('[-] Pairing error:', err);
            }
        }, 3000);
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('[*] Reconnecting...');
                startBot();
            } else {
                console.log('[-] Logged out.');
            }
        } else if (connection === 'open') {
            console.log('[+] Connected successfully! Termux WhatsApp Bot is live.');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const msg of messages) {
            if (!msg.message || msg.key.fromMe) continue;

            const from = msg.key.remoteJid;
            const body = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').trim();

            if (!body) continue;

            if (body.toLowerCase() === '!ping') {
                await sock.sendMessage(from, { text: '🏓 Pong! Bot is active.' }, { quoted: msg });
                continue;
            }

            if (body.toLowerCase() === '!help') {
                await sock.sendMessage(from, { 
                    text: '📱 *Commands:*\n• `!music <name>` - Audio ഡൗൺലോഡ് ചെയ്യാൻ\n• `!ping` - ടെസ്റ്റ് ചെയ്യാൻ' 
                }, { quoted: msg });
                continue;
            }

            if (body.toLowerCase().startsWith('!music ')) {
                const query = body.slice(7).trim();

                if (!query) {
                    await sock.sendMessage(from, { text: '⚠️ പാട്ടിന്റെ പേര് നൽകുക! Ex: `!music Mahabooba`' }, { quoted: msg });
                    continue;
                }

                try {
                    await sock.sendMessage(from, { text: `🔍 *"${query}"* തിരയുന്നു... അല്പം കാത്തിരിക്കൂ!` }, { quoted: msg });

                    const searchResults = await yts(query);
                    const video = searchResults.videos[0];

                    if (!video) {
                        await sock.sendMessage(from, { text: '❌ പാട്ട് കണ്ടെത്താനായില്ല.' }, { quoted: msg });
                        continue;
                    }

                    const tempFileName = `audio_${Date.now()}`;
                    const tempFilePath = `./${tempFileName}.mp3`;

                    // Download using yt-dlp (Bypasses YouTube restrictions)
                    const cmd = `yt-dlp -x --audio-format mp3 -o "./${tempFileName}.%(ext)s" "${video.url}"`;

                    exec(cmd, async (error) => {
                        if (error) {
                            console.error('[-] yt-dlp error:', error);
                            await sock.sendMessage(from, { text: '❌ പാട്ട് ഡൗൺലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല.' }, { quoted: msg });
                            return;
                        }

                        try {
                            if (fs.existsSync(tempFilePath)) {
                                await sock.sendMessage(from, {
                                    audio: fs.readFileSync(tempFilePath),
                                    mimetype: 'audio/mp4',
                                    ptt: false,
                                    fileName: `${video.title}.mp3`
                                }, { quoted: msg });

                                fs.unlinkSync(tempFilePath);
                            } else {
                                await sock.sendMessage(from, { text: '❌ ഫയൽ സേവ് ചെയ്യാൻ കഴിഞ്ഞില്ല.' }, { quoted: msg });
                            }
                        } catch (sendErr) {
                            console.error('[-] Send error:', sendErr);
                            await sock.sendMessage(from, { text: '❌ ഓഡിയോ അയക്കാൻ പറ്റിയില്ല.' }, { quoted: msg });
                        }
                    });

                } catch (err) {
                    console.error('[-] Music handler error:', err);
                    await sock.sendMessage(from, { text: '❌ തകരാറുണ്ടായി.' }, { quoted: msg });
                }
                continue;
            }
        }
    });
}

startBot().catch(console.error);
