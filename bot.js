require('express')().get('/', (req, res) => res.send('OK')).listen(process.env.PORT || 3000);
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

app.get('/', (req, res) => {
    res.send('WhatsApp Bot is running live on Render!');
});

app.listen(PORT, () => {
    console.log(`Port ${PORT} is open and active.`);
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
                    text: '📱 *Bot Commands:*\n• `!ping` - ടെസ്റ്റ് ചെയ്യാൻ\n• `!help` - കമാൻഡുകൾ കാണാൻ' 
                }, { quoted: msg });
                continue;
            }
        }
    });
}

startBot().catch(console.error);
