const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('WhatsApp Bot is Online & Active 24/7! 🚀'));
app.listen(PORT, () => console.log(`[HTTP] Server listening on port ${PORT}`));

const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason,
    fetchLatestBaileysVersion,
    downloadMediaMessage
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const botStartTime = Date.now();

function getRuntime() {
    const totalSeconds = Math.floor((Date.now() - botStartTime) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m${seconds}s`;
}

const funResponses = {
    roast: [
        "നിന്റെ തലച്ചോറ് 4G അല്ല, 2G റേഞ്ച് പോലുമില്ലാത്ത മൊബൈൽ ടവർ പോലെയാണ്!",
        "നീ സംസാരിക്കുമ്പോൾ ശാസ്ത്രലോകം ചിന്തിക്കും, മനുഷ്യൻ ശരിക്കും കുരങ്ങനിൽ നിന്നാണോ പരിണമിച്ചതെന്ന്!",
        "സൗന്ദര്യം ആയുസ്സിൽ ഒരിക്കലേ ഉണ്ടാവൂ എന്ന് കേട്ടിട്ടുണ്ട്, നിന്റെ കാര്യത്തിൽ അതും സംഭവിച്ചിട്ടില്ല!"
    ],
    respect: [
        "👑 സല്യൂട്ട് ബ്രോ! നിങ്ങൾ വേറെ ലെവൽ തന്നെയാണ്!",
        "🌟 Respect 100%! വാക്കുകൾക്ക് അതീതമായ ബഹുമാനം!",
        "💎 നിങ്ങൾ ഒരു ലെജൻഡ് തന്നെയാണ്!"
    ],
    dillagi: [
        "ദിൽ സേ ദിൽ തക്... മനസ്സ് തുറന്ന് ചിരിക്കൂ സുഹൃത്തേ! ❤️",
        "പ്രണയവും തമാശയും ഒക്കെ ജീവിതത്തിന്റെ ഭാഗമാണ്!"
    ],
    gaaliyan: [
        "മര്യാദക്ക് നിന്നോണം കേട്ടോ! 🤬",
        "ഗ്രൂപ്പ് കലക്കാൻ നോക്കിയാൽ തല്ലി പപ്പടമാക്കും!",
        "വായടച്ച് ഇരുന്നോ ഇല്ലെങ്കിൽ അഡ്മിൻ ചവിട്ടി പുറത്താക്കും!"
    ]
};

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
        console.log('\n[+] Requesting Pairing Code...');
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode('919567112860');
                console.log('====================================');
                console.log('🔥 YOUR PAIRING CODE:', code);
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
            const isGroup = from.endsWith('@g.us');

            const body = (
                msg.message.conversation || 
                msg.message.extendedTextMessage?.text || 
                msg.message.imageMessage?.caption || 
                msg.message.videoMessage?.caption || 
                ''
            ).trim();

            if (!body) continue;

            const prefix = '.';
            const isCmd = body.startsWith(prefix) || body.startsWith('!');
            const command = isCmd ? body.slice(1).trim().split(' ')[0].toLowerCase() : '';
            const args = isCmd ? body.slice(command.length + 1).trim() : '';

            // 1. MENU
            if (['menu', 'help'].includes(command)) {
                const runtime = getRuntime();
                const customMenu = 
`━━━━━━ 🤖 ʙᴏᴛ ɪɴғᴏ ━━━━━━
◉ 👑 ᴏᴡɴᴇʀ: solo_boy_og
◉ 📜 ᴄᴏᴍᴍᴀɴᴅs: 790
◉ ⏱️ ʀᴜɴᴛɪᴍᴇ: ${runtime}
◉ 📦 ᴘʀᴇғɪx: .
◉ ⚙️ ᴍᴏᴅᴇ: public
◉ 🏷️ ᴠᴇʀsɪᴏɴ: 12.0.0 Bᴇᴛᴀ

━━━━━『 ɢʀᴏᴜᴘ 』━━━━━
◉ ➤ .tagall
◉ ➤ .kick [@mention]
◉ ➤ .promote [@mention]
◉ ➤ .demote [@mention]
◉ ➤ .mute / .unmute

━━━━━『 ᴀɪ 』━━━━━
◉ ➤ .gemini [ചോദ്യം]
◉ ➤ .gpt4 [ചോദ്യം]
◉ ➤ .deepseek [ചോദ്യം]

━━━━━『 ᴅᴏᴡɴʟᴏᴀᴅ 』━━━━━
◉ ➤ .instagram [ലിങ്ക്]
◉ ➤ .tiktok [ലിങ്ക്]
◉ ➤ .play [പാട്ടിന്റെ പേര്]

━━━━━『 ᴀɴɪᴍᴇ & ᴅᴘ 』━━━━━
◉ ➤ .waifu
◉ ➤ .neko
◉ ➤ .boydp
◉ ➤ .girldp

━━━━━『 sᴛɪᴄᴋᴇʀ 』━━━━━
◉ ➤ .sticker (ചിത്രത്തോടൊപ്പം അയക്കുക)
◉ ➤ .s

━━━━━『 ғᴜɴ & ǫᴜᴏᴛᴇs 』━━━━━
◉ ➤ .roast
◉ ➤ .respect
◉ ➤ .dillagi
◉ ➤ .gaaliyan

━━━━━『 ᴍᴀɪɴ 』━━━━━
◉ ➤ .ping
◉ ➤ .alive
◉ ➤ .uptime

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ solo_boy_og*`;
                await sock.sendMessage(from, { text: customMenu }, { quoted: msg });
                continue;
            }

            // 2. PING & ALIVE
            if (command === 'ping') {
                const start = Date.now();
                await sock.sendMessage(from, { text: `⚡ *Pong!* Speed: ${Date.now() - start}ms` }, { quoted: msg });
                continue;
            }

            if (command === 'alive' || command === 'uptime') {
                await sock.sendMessage(from, { 
                    text: `👋 Hey! I am alive & working perfectly on Render Cloud 24/7!\n⏱️ *Runtime:* ${getRuntime()}` 
                }, { quoted: msg });
                continue;
            }

            // 3. AI COMMANDS
            const aiCommands = ['gemini', 'gpt4', 'deepseek'];
            if (aiCommands.includes(command)) {
                if (!args) {
                    await sock.sendMessage(from, { text: `❗ ദയവായി ഒരു ചോദ്യം ചോദിക്കൂ.\nഉദാഹരണം: \`.${command} കേരളത്തിന്റെ തലസ്ഥാനം ഏതാണ്?\`` }, { quoted: msg });
                    continue;
                }
                await sock.sendMessage(from, { text: '💭 _ആലോചിക്കുന്നു... ദയവായി കാത്തിരിക്കൂ..._' }, { quoted: msg });
                try {
                    const res = await axios.get(`https://api.vreden.my.id/api/ai/gemini?query=${encodeURIComponent(args)}`);
                    const reply = res.data?.result || res.data?.response || "മറുപടി ലഭ്യമായില്ല.";
                    await sock.sendMessage(from, { text: `🤖 *[${command.toUpperCase()}]:*\n\n${reply}` }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(from, { text: `⚠️ AI സെർവറിൽ തടസ്സം നേരിട്ടു.` }, { quoted: msg });
                }
                continue;
            }

            // 4. DOWNLOAD COMMANDS
            if (['instagram', 'ig', 'tiktok', 'tt'].includes(command)) {
                if (!args || !args.startsWith('http')) {
                    await sock.sendMessage(from, { text: `❗ ലിങ്ക് നൽകുക.\nഉദാഹരണം: \`.${command} https://...\`` }, { quoted: msg });
                    continue;
                }
                await sock.sendMessage(from, { text: '⏳ _വീഡിയോ ഡൗൺലോഡ് ചെയ്യുന്നു..._' }, { quoted: msg });
                try {
                    const apiUrl = ['instagram', 'ig'].includes(command)
                        ? `https://api.vreden.my.id/api/download/instagram?url=${encodeURIComponent(args)}`
                        : `https://api.vreden.my.id/api/download/tiktok?url=${encodeURIComponent(args)}`;
                    const res = await axios.get(apiUrl);
                    const videoUrl = res.data?.result?.video || res.data?.result?.url || res.data?.result?.[0]?.url;
                    if (videoUrl) {
                        await sock.sendMessage(from, { video: { url: videoUrl }, caption: `✅ ഡൗൺലോഡ് വിജയകരം!` }, { quoted: msg });
                    } else {
                        await sock.sendMessage(from, { text: '⚠️ വീഡിയോ കണ്ടെത്താൻ കഴിഞ്ഞില്ല.' }, { quoted: msg });
                    }
                } catch (e) {
                    await sock.sendMessage(from, { text: '⚠️ ഡൗൺലോഡർ സെർവർ ഡൗൺ ആണ്.' }, { quoted: msg });
                }
                continue;
            }

            // Play Audio
            if (command === 'play') {
                if (!args) {
                    await sock.sendMessage(from, { text: '❗ പാട്ടിന്റെ പേര് നൽകുക: `.play jimikki kammal`' }, { quoted: msg });
                    continue;
                }
                await sock.sendMessage(from, { text: `🎵 *${args}* തിരയുന്നു...` }, { quoted: msg });
                try {
                    const searchRes = await axios.get(`https://api.vreden.my.id/api/ytplay?query=${encodeURIComponent(args)}`);
                    const audioUrl = searchRes.data?.result?.download?.url || searchRes.data?.result?.url;
                    if (audioUrl) {
                        await sock.sendMessage(from, { audio: { url: audioUrl }, mimetype: 'audio/mp4', ptt: false }, { quoted: msg });
                    } else {
                        await sock.sendMessage(from, { text: '⚠️ ഓഡിയോ കണ്ടെത്താനായില്ല.' }, { quoted: msg });
                    }
                } catch (e) {
                    await sock.sendMessage(from, { text: '⚠️ പാട്ട് ലഭ്യമാക്കാൻ കഴിഞ്ഞില്ല.' }, { quoted: msg });
                }
                continue;
            }

            // 5. ANIME & RANDOM DP
            if (['waifu', 'neko'].includes(command)) {
                try {
                    const res = await axios.get(`https://api.waifu.pics/sfw/${command}`);
                    if (res.data?.url) {
                        await sock.sendMessage(from, { image: { url: res.data.url }, caption: `🌸 Anime: *${command.toUpperCase()}*` }, { quoted: msg });
                    }
                } catch (e) {
                    await sock.sendMessage(from, { text: '⚠️ ചിത്രം ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല.' }, { quoted: msg });
                }
                continue;
            }

            if (command.startsWith('boydp') || command.startsWith('girldp')) {
                const isBoy = command.startsWith('boydp');
                const imgUrl = isBoy 
                    ? `https://picsum.photos/seed/boy_${Math.floor(Math.random() * 1000)}/600/600`
                    : `https://picsum.photos/seed/girl_${Math.floor(Math.random() * 1000)}/600/600`;
                await sock.sendMessage(from, { image: { url: imgUrl }, caption: `🖼️ *${isBoy ? 'BOY' : 'GIRL'} DP*` }, { quoted: msg });
                continue;
            }

            // 6. GROUP COMMANDS
            if (isGroup) {
                if (command === 'tagall') {
                    const groupMetadata = await sock.groupMetadata(from);
                    const participants = groupMetadata.participants;
                    let text = `📢 *ഗ്രൂപ്പ് അനൗൺസ്‌മെന്റ്!*\n💬 *മെസ്സേജ്:* ${args || 'ശ്രദ്ധിക്കുക'}\n\n`;
                    let mentions = [];
                    for (const mem of participants) {
                        text += `👉 @${mem.id.split('@')[0]}\n`;
                        mentions.push(mem.id);
                    }
                    await sock.sendMessage(from, { text, mentions }, { quoted: msg });
                    continue;
                }

                if (command === 'mute') {
                    await sock.groupSettingUpdate(from, 'announcement');
                    await sock.sendMessage(from, { text: '🔒 *ഗ്രൂപ്പ് മ്യൂട്ട് ചെയ്തു.*' }, { quoted: msg });
                    continue;
                }

                if (command === 'unmute') {
                    await sock.groupSettingUpdate(from, 'not_announcement');
                    await sock.sendMessage(from, { text: '🔓 *ഗ്രൂപ്പ് അൺമ്യൂട്ട് ചെയ്തു.*' }, { quoted: msg });
                    continue;
                }

                const targetUser = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
                if (['kick', 'promote', 'demote'].includes(command)) {
                    if (!targetUser) {
                        await sock.sendMessage(from, { text: `❗ ഒരാളെ മെൻഷൻ ചെയ്യുക: \`.${command} @user\`` }, { quoted: msg });
                        continue;
                    }
                    if (command === 'kick') {
                        await sock.groupParticipantsUpdate(from, [targetUser], 'remove');
                        await sock.sendMessage(from, { text: '👋 നീക്കം ചെയ്തു!' }, { quoted: msg });
                    } else if (command === 'promote') {
                        await sock.groupParticipantsUpdate(from, [targetUser], 'promote');
                        await sock.sendMessage(from, { text: '⭐ അഡ്മിൻ ആക്കി!' }, { quoted: msg });
                    } else if (command === 'demote') {
                        await sock.groupParticipantsUpdate(from, [targetUser], 'demote');
                        await sock.sendMessage(from, { text: '🔻 അഡ്മിൻ പദവിയിൽ നിന്ന് നീക്കി.' }, { quoted: msg });
                    }
                    continue;
                }
            }

            // 7. FUN COMMANDS
            const funAliases = ['roast', 'respect', 'dillagi', 'gaaliyan'];
            if (funAliases.includes(command)) {
                const list = funResponses[command] || funResponses['roast'];
                const randomMsg = list[Math.floor(Math.random() * list.length)];
                await sock.sendMessage(from, { text: randomMsg }, { quoted: msg });
                continue;
            }
        }
    });
}

startBot().catch(console.error);
