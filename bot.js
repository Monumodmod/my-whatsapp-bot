const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Render Web Service-ന് വേണ്ടിയുള്ള വെബ് സെർവർ
app.get('/', (req, res) => {
    res.send('WhatsApp Bot is running live 24/7 on Render!');
});

app.listen(PORT, () => {
    console.log(`Web server listening on port ${PORT}`);
});

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
            console.log('[+] Connected successfully! WhatsApp Bot is live on Render.');
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
                await sock.sendMessage(from, { text: '🏓 Pong! Bot is active on Render Cloud 24/7.' }, { quoted: msg });
                continue;
            }

            if (body.toLowerCase() === '!help') {
                await sock.sendMessage(from, { 
                    text: '📱 *Bot Commands:*\n• `!ping` - ബോട്ട് ലൈവ് ആണോ എന്ന് അറിയാൻ\n• `!help` - സഹായം ലഭിക്കാൻ' 
                }, { quoted: msg });
                continue;
            }
        }
    });
}

startBot().catch(console.error);
