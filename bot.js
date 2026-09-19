const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot Active 24/7'));
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const pino = require('pino');

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
        console.log('\n[+] Requesting Pairing Code for Render...');
        setTimeout(async () => {
            try {
                // Your WhatsApp Number
                const code = await sock.requestPairingCode('919567112860');
                console.log('====================================');
                console.log('🔥 NEW PAIRING CODE:', code);
                console.log('====================================');
            } catch (err) {
                console.error('[-] Pairing Error:', err);
            }
        }, 5000);
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                startBot();
            }
        } else if (connection === 'open') {
            console.log('[+] BOT IS FULLY CONNECTED AND READY!');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const msg of messages) {
            if (!msg.message) continue;

            const from = msg.key.remoteJid;
            const body = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').trim();

            if (!body) continue;

            console.log(`[MSG RECEIVED] From: ${from} | Text: ${body}`);

            if (body.toLowerCase() === '!ping') {
                await sock.sendMessage(from, { text: '🏓 Pong! Bot is 100% active on Render Cloud.' }, { quoted: msg });
                continue;
            }

            if (body.toLowerCase() === '!help') {
                await sock.sendMessage(from, { text: '📱 *Bot Active!*\nCommands: `!ping`' }, { quoted: msg });
                continue;
            }
        }
    });
}

startBot().catch(console.error);
