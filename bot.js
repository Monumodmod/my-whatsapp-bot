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

const botStartTime = Date.now();

function getRuntime() {
    const totalSeconds = Math.floor((Date.now() - botStartTime) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m${seconds}s`;
}

// Fancy text converter
function toFancy(text) {
    const fonts = {
        bold: '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭',
        italic: '𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝲵𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡',
        mono: '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉'
    };
    const normal = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let res = '';
    for (let char of text) {
        const idx = normal.indexOf(char);
        res += idx !== -1 ? Array.from(fonts.bold)[idx] : char;
    }
    return res;
}

// Fun Datasets
const funData = {
    roast: [
        "നിന്റെ തലച്ചോറ് 4G അല്ല, 2G റേഞ്ച് പോലുമില്ലാത്ത മൊബൈൽ ടവർ പോലെയാണ്!",
        "നീ സംസാരിക്കുമ്പോൾ ശാസ്ത്രലോകം ചിന്തിക്കും, മനുഷ്യൻ ശരിക്കും കുരങ്ങനിൽ നിന്നാണോ പരിണമിച്ചതെന്ന്!",
        "സൗന്ദര്യം ആയുസ്സിൽ ഒരിക്കലേ ഉണ്ടാവൂ എന്ന് കേട്ടിട്ടുണ്ട്, നിന്റെ കാര്യത്തിൽ അതും സംഭവിച്ചിട്ടില്ല!",
        "ജീവിതത്തിൽ ഒരു ലക്ഷ്യം ഒക്കെ വേണ്ടേ സുഹൃത്തേ, വെറുതെ ഗ്രൂപ്പിൽ സ്പാം ചെയ്യാൻ ജനിച്ചതാണോ?"
    ],
    respect: [
        "👑 സല്യൂട്ട് ബ്രോ! നിങ്ങൾ വേറെ ലെവൽ തന്നെയാണ്!",
        "🌟 Respect 100%! വാക്കുകൾക്ക് അതീതമായ ബഹുമാനം!",
        "🙌 താങ്കളുടെ സാന്നിധ്യം തന്നെ ഈ ഗ്രൂപ്പിന് ഐശ്വര്യമാണ്!",
        "💎 നിങ്ങൾ ഒരു ലെജൻഡ് തന്നെയാണ്!"
    ],
    dillagi: [
        "ദിൽ സേ ദിൽ തക്... മനസ്സ് തുറന്ന് ചിരിക്കൂ സുഹൃത്തേ! ❤️",
        "പ്രണയവും തമാശയും ഒക്കെ ജീവിതത്തിന്റെ ഭാഗമാണ്, കാര്യമായിട്ടെടുക്കല്ലേ!",
        "ചില ഇഷ്ടങ്ങൾ അങ്ങനെയാണ്, പറഞ്ഞറിയിക്കാൻ കഴിയില്ല... ✨"
    ],
    gaaliyan: [
        "മര്യാദക്ക് നിന്നോണം കേട്ടോ! 🤬",
        "ഗ്രൂപ്പ് കലക്കാൻ നോക്കിയാൽ തല്ലി പപ്പടമാക്കും!",
        "വായടച്ച് ഇരുന്നോ ഇല്ലെങ്കിൽ അഡ്മിൻ ചവിട്ടി പുറത്താക്കും!",
        "നിനക്ക് വേറെ പണി ഒന്നുമില്ലേടേയ്?!"
    ],
    flirt: [
        "നിന്റെ പുഞ്ചിരി കണ്ടാൽ ആരും വഴിമാറിപ്പോകും... അത്രയ്ക്കും ക്യൂട്ട് ആണ്! ✨",
        "Google-ൽ പോലും തിരഞ്ഞാൽ കിട്ടാത്ത ഒരാളാണ് നീ! ❤️",
        "നിന്റെ കണ്ണുകളിൽ എന്തോ ഒരു മാന്ത്രികതയുണ്ട്, നോക്കി നിന്നാൽ സമയം പോകുന്നത് അറിയില്ല!"
    ],
    shayari: [
        "ആരും കാണാതെ ഉള്ളിൽ സൂക്ഷിച്ച ഒരു ഇഷ്ടമുണ്ടായിരുന്നു... ഇന്നും മായാത്ത ചില ഓർമ്മകൾ പോലെ! 🥀",
        "പെയ്യാൻ മറന്ന മഴ പോലെ ചില സ്വപ്നങ്ങൾ ഇന്നും മനസ്സിൽ ബാക്കിയാണ്... 🌧️",
        "കൂടെയുണ്ടായിരുന്നപ്പോൾ അറിഞ്ഞില്ല, അകന്നപ്പോഴാണ് മനസ്സിലായത് ഓർമ്മകളുടെ വില... ✨"
    ],
    truth: [
        "നിങ്ങളുടെ ഫോണിലെ ഏറ്റവും സീക്രട്ട് ആയ കാര്യം എന്താണ്?",
        "ഇതുവരെ ആരോടും പറയാത്ത ഒരു വലിയ കള്ളം പറയൂ?",
        "ഈ ഗ്രൂപ്പിൽ നിങ്ങൾക്ക് ഏറ്റവും ക്രഷ് തോന്നിയ ആൾ ആരാണ്?",
        "നിങ്ങൾ അവസാനമായി കരഞ്ഞത് എപ്പോഴാണ്, എന്തിന് വേണ്ടി?",
        "നിങ്ങൾക്ക് തിരുത്താൻ കഴിഞ്ഞിരുന്നെങ്കിൽ തിരുത്തുമായിരുന്ന ഒരു പഴയ തെറ്റ്?"
    ],
    dare: [
        "നിങ്ങളുടെ ക്രഷിന് WhatsApp-ൽ 'I Love You' എന്ന് മെസ്സേജ് അയക്കുക!",
        "ഒരു മിനിറ്റ് വോയ്‌സ് നോട്ടിൽ പാട്ട് പാടി ഈ ഗ്രൂപ്പിലേക്ക് ഇടുക!",
        "നിങ്ങളുടെ വാട്സാപ്പ് സ്റ്റാറ്റസിൽ 'ഞാൻ ഇന്ന് എല്ലാവർക്കും ബിരിയാണി വാങ്ങി തരും' എന്ന് ഇടുക!",
        "നിങ്ങളുടെ ഗാലറിയിലെ അവസാനത്തെ ഫോട്ടോ ഗ്രൂപ്പിൽ ഷെയർ ചെയ്യുക!",
        "ഗ്രൂപ്പിലെ ഏതെങ്കിലും ഒരാളെക്കുറിച്ച് 3 നല്ല കാര്യങ്ങൾ വോയ്‌സ് അയക്കുക!"
    ],
    jokes: [
        "അധ്യാപകൻ: അക്ബറിന്റെ ശവകുടീരം എവിടെയാണ്?\nവിദ്യാർത്ഥി: മണ്ണിൽ, സർ!",
        "ഡോക്ടർ: ദിവസവും 5 കിലോമീറ്റർ നടക്കണം.\nരോഗി: നടക്കാം ഡോക്ടർ, പക്ഷെ തിരിച്ചു വരാൻ ഓട്ടോക്കൂലി വേണം!",
        "ഒരു കൊതുകിന്റെ ആത്മകഥ: മനുഷ്യന്മാർ എന്നെ കാണുമ്പോൾ കൈയടിക്കുന്നത് ഞാൻ വലിയ സ്റ്റാർ ആയതുകൊണ്ടല്ല!"
    ],
    facts: [
        "നക്ഷത്രമീനുകൾക്ക് (Starfish) തലച്ചോറില്ല!",
        "ഒരു തേനീച്ചയ്ക്ക് 5 കണ്ണുകളുണ്ട്!",
        "ഒട്ടകപ്പക്ഷിയുടെ കണ്ണ് അതിന്റെ തലച്ചോറിനേക്കാൾ വലുതാണ്!",
        "വെള്ളം കുടിക്കാത്ത ഒരേയൊരു ജീവിയാണ് കംഗാരു എലി (Kangaroo Rat)!"
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
        console.log('\n[+] Requesting Pairing Code for Render...');
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
                console.log('[*] Reconnecting...');
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
◉ ➤ .tagall [മെസ്സേജ്]
◉ ➤ .hidetag [മെസ്സേജ്]
◉ ➤ .link
◉ ➤ .kick [@mention]
◉ ➤ .promote [@mention]
◉ ➤ .demote [@mention]
◉ ➤ .mute / .unmute

━━━━━『 ᴛᴏᴏʟs & ᴜᴛɪʟɪᴛʏ 』━━━━━
◉ ➤ .sticker / .s (ഫോട്ടോയ്ക്ക് റിപ്ലൈ ആയി)
◉ ➤ .fancy [വാചകം]
◉ ➤ .calc [കണക്ക്] (ഉദാ: .calc 50*12)
◉ ➤ .wiki [വിഷയം]
◉ ➤ .short [ലിങ്ക്]
◉ ➤ .ss [വെബ്സൈറ്റ്]
◉ ➤ .tts [വാചകം]
◉ ➤ .qr [ലിങ്ക്]
◉ ➤ .weather [സ്ഥലം]
◉ ➤ .lyrics [പാട്ടിന്റെ പേര്]

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

━━━━━『 ғᴜɴ & ɢᴀᴍᴇs 』━━━━━
◉ ➤ .lovemeter
◉ ➤ .flirt
◉ ➤ .shayari
◉ ➤ .truth
◉ ➤ .dare
◉ ➤ .joke
◉ ➤ .fact
◉ ➤ .roast
◉ ➤ .respect
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

            // 3. FANCY FONT GENERATOR
            if (command === 'fancy') {
                if (!args) {
                    await sock.sendMessage(from, { text: '❗ സ്റ്റൈൽ മാറ്റേണ്ട ഇംഗ്ലീഷ് വാചകം നൽകുക.\nഉദാഹരണം: `.fancy solo boy`' }, { quoted: msg });
                    continue;
                }
                const styled = toFancy(args);
                await sock.sendMessage(from, { text: `✨ *Fancy Text:*\n\n${styled}` }, { quoted: msg });
                continue;
            }

            // 4. CALCULATOR
            if (['calc', 'calculate'].includes(command)) {
                if (!args) {
                    await sock.sendMessage(from, { text: '❗ കണക്ക് നൽകുക.\nഉദാഹരണം: `.calc 1500 * 18 / 100`' }, { quoted: msg });
                    continue;
                }
                try {
                    const cleanMath = args.replace(/[^0-9+\-*/().]/g, '');
                    const result = Function(`'use strict'; return (${cleanMath})`)();
                    await sock.sendMessage(from, { text: `🧮 *കണക്ക്:* ${cleanMath}\n📊 *ഉത്തരം:* *${result}*` }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(from, { text: '⚠️ നൽകിയ കണക്ക് ശരിയല്ല.' }, { quoted: msg });
                }
                continue;
            }

            // 5. WIKIPEDIA
            if (command === 'wiki') {
                if (!args) {
                    await sock.sendMessage(from, { text: '❗ തിരയേണ്ട വിഷയം നൽകുക.\nഉദാഹരണം: `.wiki Kerala`' }, { quoted: msg });
                    continue;
                }
                await sock.sendMessage(from, { text: '🔍 _വിക്കിപീഡിയ പരിശോധിക്കുന്നു..._' }, { quoted: msg });
                try {
                    const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(args)}`);
                    if (res.data?.extract) {
                        const wikiReply = `📚 *WIKIPEDIA:* ${res.data.title}\n\n${res.data.extract}\n\n🔗 ${res.data.content_urls?.desktop?.page || ''}`;
                        await sock.sendMessage(from, { text: wikiReply }, { quoted: msg });
                    } else {
                        await sock.sendMessage(from, { text: '⚠️ വിവരങ്ങൾ ലഭ്യമായില്ല.' }, { quoted: msg });
                    }
                } catch (e) {
                    await sock.sendMessage(from, { text: '⚠️ വിക്കിപീഡിയയിൽ കണ്ടെത്താൻ കഴിഞ്ഞില്ല.' }, { quoted: msg });
                }
                continue;
            }

            // 6. SHORT LINK
            if (command === 'short') {
                if (!args || !args.startsWith('http')) {
                    await sock.sendMessage(from, { text: '❗ ലിങ്ക് നൽകുക.\nഉദാഹരണം: `.short https://www.google.com`' }, { quoted: msg });
                    continue;
                }
                try {
                    const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(args)}`);
                    await sock.sendMessage(from, { text: `🔗 *Short Link:* ${res.data}` }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(from, { text: '⚠️ ലിങ്ക് ചെറുതാക്കാൻ കഴിഞ്ഞില്ല.' }, { quoted: msg });
                }
                continue;
            }

            // 7. SCREENSHOT TOOL
            if (command === 'ss') {
                if (!args || !args.startsWith('http')) {
                    await sock.sendMessage(from, { text: '❗ വെബ്സൈറ്റ് ലിങ്ക് നൽകുക.\nഉദാഹരണം: `.ss https://github.com`' }, { quoted: msg });
                    continue;
                }
                await sock.sendMessage(from, { text: '📸 _സ്ക്രീൻഷോട്ട് എടുക്കുന്നു..._' }, { quoted: msg });
                const ssUrl = `https://image.thum.io/get/width/1200/crop/800/${args}`;
                try {
                    await sock.sendMessage(from, { image: { url: ssUrl }, caption: `📸 *Screenshot of:* ${args}` }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(from, { text: '⚠️ സ്ക്രീൻഷോട്ട് എടുക്കാൻ കഴിഞ്ഞില്ല.' }, { quoted: msg });
                }
                continue;
            }

            // 8. STICKER MAKER
            if (['s', 'sticker'].includes(command)) {
                const quotedMsg = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
                const isImage = msg.message.imageMessage || quotedMsg?.imageMessage;

                if (!isImage) {
                    await sock.sendMessage(from, { text: '❗ ഏതെങ്കിലും ചിത്രത്തോടൊപ്പം `.sticker` എന്ന് അയക്കുക, അല്ലെങ്കിൽ ഫോട്ടോയ്ക്ക് റിപ്ലൈ ആയി `.s` അടിക്കുക.' }, { quoted: msg });
                    continue;
                }
                await sock.sendMessage(from, { text: '🎨 _സ്റ്റിക്കർ തയ്യാറാക്കുന്നു..._' }, { quoted: msg });
                try {
                    const mediaMsg = msg.message.imageMessage ? msg : { message: quotedMsg };
                    const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {});
                    await sock.sendMessage(from, { sticker: buffer }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(from, { text: '⚠️ സ്റ്റിക്കർ മാറ്റുന്നതിൽ തടസ്സം നേരിട്ടു.' }, { quoted: msg });
                }
                continue;
            }

            // 9. LOVE METER
            if (['lovemeter', 'lovetest'].includes(command)) {
                const percent = Math.floor(Math.random() * 51) + 50;
                await sock.sendMessage(from, { 
                    text: `❤️ *LOVE METER TEST*\n\n💖 സ്നേഹത്തിന്റെ അളവ്: *${percent}\%*\n✨ ${percent > 85 ? 'സ്വർഗ്ഗത്തിൽ വെച്ച് തീർച്ചയാക്കിയ ബന്ധം!' : 'നല്ലൊരു പ്രണയബന്ധം സാധ്യമാണ്!'}` 
                }, { quoted: msg });
                continue;
            }

            // 10. TTS
            if (['tts', 'say'].includes(command)) {
                if (!args) {
                    await sock.sendMessage(from, { text: '❗ ശബ്ദമാക്കി മാറ്റേണ്ട വാചകം നൽകുക.\nഉദാഹരണം: `.tts സുഖമാണോ കൂട്ടുകാരെ?`' }, { quoted: msg });
                    continue;
                }
                try {
                    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(args)}&tl=ml&client=tw-ob`;
                    await sock.sendMessage(from, { 
                        audio: { url: ttsUrl }, 
                        mimetype: 'audio/mp4', 
                        ptt: true 
                    }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(from, { text: '⚠️ ശബ്ദം തയ്യാറാക്കുന്നതിൽ തടസ്സം നേരിട്ടു.' }, { quoted: msg });
                }
                continue;
            }

            // 11. QR CODE MAKER
            if (command === 'qr') {
                if (!args) {
                    await sock.sendMessage(from, { text: '❗ QR കോഡ് ഉണ്ടാക്കാൻ ഉള്ള ലിങ്കോ ടെക്സ്റ്റോ നൽകുക.\nഉദാഹരണം: `.qr https://google.com`' }, { quoted: msg });
                    continue;
                }
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(args)}`;
                await sock.sendMessage(from, { 
                    image: { url: qrUrl }, 
                    caption: `✅ *QR Code Generated!*\n📝 *Data:* ${args}` 
                }, { quoted: msg });
                continue;
            }

            // 12. WEATHER
            if (command === 'weather') {
                if (!args) {
                    await sock.sendMessage(from, { text: '❗ സ്ഥലത്തിന്റെ പേര് നൽകുക.\nഉദാഹരണം: `.weather Kozhikode`' }, { quoted: msg });
                    continue;
                }
                try {
                    const res = await axios.get(`https://wttr.in/${encodeURIComponent(args)}?format=j1`);
                    const current = res.data?.current_condition?.[0];
                    if (current) {
                        const weatherText = `🌤️ *WEATHER REPORT:* ${args.toUpperCase()}\n\n🌡️ *താപനില:* ${current.temp_C}°C\n💧 *ഈർപ്പം (Humidity):* ${current.humidity}%\n💨 *കാറ്റിന്റെ വേഗത:* ${current.windspeedKmph} km/h\n☁️ *സ്ഥിതി:* ${current.weatherDesc?.[0]?.value || 'Normal'}`;
                        await sock.sendMessage(from, { text: weatherText }, { quoted: msg });
                    } else {
                        await sock.sendMessage(from, { text: '⚠️ സ്ഥലവിവരം ലഭ്യമായില്ല.' }, { quoted: msg });
                    }
                } catch (e) {
                    await sock.sendMessage(from, { text: '⚠️ കാലാവസ്ഥാ വിവരങ്ങൾ എടുക്കുന്നതിൽ തടസ്സം നേരിട്ടു.' }, { quoted: msg });
                }
                continue;
            }

            // 13. LYRICS
            if (command === 'lyrics') {
                if (!args) {
                    await sock.sendMessage(from, { text: '❗ പാട്ടിന്റെ പേര് നൽകുക.\nഉദാഹരണം: `.lyrics jimikki kammal`' }, { quoted: msg });
                    continue;
                }
                await sock.sendMessage(from, { text: '🔍 _വരികൾ തിരയുന്നു..._' }, { quoted: msg });
                try {
                    const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(args)}/${encodeURIComponent(args)}`);
                    if (res.data?.lyrics) {
                        await sock.sendMessage(from, { text: `📜 *LYRICS:* ${args.toUpperCase()}\n\n${res.data.lyrics}` }, { quoted: msg });
                    } else {
                        await sock.sendMessage(from, { text: '⚠️ ഈ പാട്ടിന്റെ വരികൾ കണ്ടെത്താനായില്ല.' }, { quoted: msg });
                    }
                } catch (e) {
                    await sock.sendMessage(from, { text: '⚠️ വരികൾ ലഭ്യമാക്കാൻ കഴിഞ്ഞില്ല.' }, { quoted: msg });
                }
                continue;
            }

            // 14. AI COMMANDS
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

            // 15. DOWNLOAD COMMANDS
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

            // 16. ANIME & RANDOM DP
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

            // 17. GROUP COMMANDS
            if (isGroup) {
                // TAGALL
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

                // HIDETAG
                if (command === 'hidetag') {
                    const groupMetadata = await sock.groupMetadata(from);
                    const mentions = groupMetadata.participants.map(p => p.id);
                    await sock.sendMessage(from, { text: args || '🔔 ഗ്രൂപ്പ് ശ്രദ്ധിക്കുക!', mentions }, { quoted: msg });
                    continue;
                }

                // GROUP LINK
                if (['link', 'grouplink'].includes(command)) {
                    try {
                        const code = await sock.groupInviteCode(from);
                        await sock.sendMessage(from, { text: `🔗 *ഗ്രൂപ്പ് ലിങ്ക്:*\nhttps://chat.whatsapp.com/${code}` }, { quoted: msg });
                    } catch (e) {
                        await sock.sendMessage(from, { text: '⚠️ ഗ്രൂപ്പ് ലിങ്ക് എടുക്കാൻ ബോട്ടിന് അഡ്മിൻ അധികാരം വേണം.' }, { quoted: msg });
                    }
                    continue;
                }

                // MUTE & UNMUTE
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

                // KICK, PROMOTE, DEMOTE
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

            // 18. FUN & GAMES
            const funKeys = ['roast', 'respect', 'dillagi', 'gaaliyan', 'truth', 'dare', 'jokes', 'joke', 'facts', 'fact', 'flirt', 'shayari'];
            if (funKeys.includes(command)) {
                let key = command;
                if (key === 'joke') key = 'jokes';
                if (key === 'fact') key = 'facts';
                const list = funData[key] || funData['roast'];
                const randomMsg = list[Math.floor(Math.random() * list.length)];
                await sock.sendMessage(from, { text: randomMsg }, { quoted: msg });
                continue;
            }
        }
    });
}

startBot().catch(console.error);
