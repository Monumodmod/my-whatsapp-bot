const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
​app.get('/', (req, res) => res.send('WhatsApp Bot is Online & Active 24/7! 🚀'));
app.listen(PORT, () => console.log([HTTP] Server listening on port ${PORT}));
​const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
fetchLatestBaileysVersion,
downloadMediaMessage
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const axios = require('axios');
​const botStartTime = Date.now();
​/* STREAMING_CHUNK:Setting up runtime tracker and fancy font generator... */
function getRuntime() {
const totalSeconds = Math.floor((Date.now() - botStartTime) / 1000);
const hours = Math.floor(totalSeconds / 3600);
const minutes = Math.floor((totalSeconds % 3600) / 60);
const seconds = totalSeconds % 60;
return ${hours}h ${minutes}m${seconds}s;
}
​function toFancy(text) {
const fonts = {
bold: '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭'
};
const normal = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let res = '';
for (let char of text) {
const idx = normal.indexOf(char);
res += idx !== -1 ? Array.from(fonts.bold)[idx] : char;
}
return res;
}
​/* STREAMING_CHUNK:Configuring datasets for games, roasts, and entertainment... */
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
"നിങ്ങൾ അവസാനമായി കരഞ്ഞത് എപ്പോഴാണ്, എന്തിന് വേണ്ടി?"
],
dare: [
"നിങ്ങളുടെ ക്രഷിന് WhatsApp-ൽ 'I Love You' എന്ന് മെസ്സേജ് അയക്കുക!",
"ഒരു മിനിറ്റ് വോയ്‌സ് നോട്ടിൽ പാട്ട് പാടി ഈ ഗ്രൂപ്പിലേക്ക് ഇടുക!",
"നിങ്ങളുടെ വാട്സാപ്പ് സ്റ്റാറ്റസിൽ 'ഞാൻ ഇന്ന് എല്ലാവർക്കും ബിരിയാണി വാങ്ങി തരും' എന്ന് ഇടുക!",
"ഗ്രൂപ്പിലെ ഏതെങ്കിലും ഒരാളെക്കുറിച്ച് 3 നല്ല കാര്യങ്ങൾ വോയ്‌സ് അയക്കുക!"
],
eightBall: [
"തീർച്ചയായും അതെ! 🎱",
"ഒരിക്കലും സംഭവിക്കില്ല! ❌",
"സാധ്യത വളരെ കൂടുതലാണ്! ✨",
"ഇപ്പോൾ പറയാൻ കഴിയില്ല, വീണ്ടും ശ്രമിക്കൂ. 🔮",
"എന്റെ ഉത്തരം 'ഇല്ല' എന്നാണ്! 🚫",
"തീർച്ചയായും ഇത് സംഭവിക്കും! 💯"
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
​/* STREAMING_CHUNK:Initializing Baileys WhatsApp client and pairing logic... */
async function startBot() {
const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');
const { version } = await fetchLatestBaileysVersion();
​const sock = makeWASocket({
version,
logger: pino({ level: 'silent' }),
printQRInTerminal: false,
auth: state,
browser: ['Ubuntu', 'Chrome', '20.0.04']
});
​if (!sock.authState.creds.registered) {
console.log('\n[+] Requesting Pairing Code for Render...');
setTimeout(async () => {
try {
const code = await sock.requestPairingCode('919567112860');
console.log('');
console.log('🔥 YOUR PAIRING CODE:', code);
console.log('');
} catch (err) {
console.error('[-] Pairing Error:', err);
}
}, 5000);
}
​sock.ev.on('creds.update', saveCreds);
​sock.ev.on('connection.update', (update) => {
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
​/* STREAMING_CHUNK:Parsing incoming messages and commands... */
sock.ev.on('messages.upsert', async ({ messages, type }) => {
if (type !== 'notify') return;
​for (const msg of messages) {
if (!msg.message) continue;
​const from = msg.key.remoteJid;
const isGroup = from.endsWith('@g.us');
​const body = (
msg.message.conversation ||
msg.message.extendedTextMessage?.text ||
msg.message.imageMessage?.caption ||
msg.message.videoMessage?.caption ||
''
).trim();
​if (!body) continue;
​const prefix = '.';
const isCmd = body.startsWith(prefix) || body.startsWith('!');
const command = isCmd ? body.slice(1).trim().split(' ')[0].toLowerCase() : '';
const args = isCmd ? body.slice(command.length + 1).trim() : '';
​/* STREAMING_CHUNK:Executing menu, ping, and uptime commands... */
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
​━━━━━『 ɢʀᴏᴜᴘ 』━━━━━
◉ ➤ .tagall [മെസ്സേജ്]
◉ ➤ .hidetag [മെസ്സേജ്]
◉ ➤ .link
◉ ➤ .kick [@mention]
◉ ➤ .promote [@mention]
◉ ➤ .demote [@mention]
◉ ➤ .mute / .unmute
​━━━━━『 ᴛᴏᴏʟs & ᴜᴛɪʟɪᴛʏ 』━━━━━
◉ ➤ .sticker / .s (ഫോട്ടോയ്ക്ക് റിപ്ലൈ ആയി)
◉ ➤ .del (മെസ്സേജിന് റിപ്ലൈ ആയി)
◉ ➤ .fancy [വാചകം]
◉ ➤ .calc [കണക്ക്]
◉ ➤ .wiki [വിഷയം]
◉ ➤ .github [username]
◉ ➤ .praytime [സ്ഥലം]
◉ ➤ .readmore [തലക്കെട്ട് | ഉള്ളടക്കം]
◉ ➤ .base64 [വാചകം] / .unbase64 [കോഡ്]
◉ ➤ .binary [വാചകം] / .dbinary [ബൈനറി]
◉ ➤ .short [ലിങ്ക്]
◉ ➤ .ss [വെബ്സൈറ്റ്]
◉ ➤ .tts [വാചകം]
◉ ➤ .qr [ലിങ്ക്]
◉ ➤ .weather [സ്ഥലം]
◉ ➤ .lyrics [പാട്ടിന്റെ പേര്]
​━━━━━『 ᴀɪ 』━━━━━
◉ ➤ .gemini [ചോദ്യം]
◉ ➤ .gpt4 [ചോദ്യം]
◉ ➤ .deepseek [ചോദ്യം]
​━━━━━『 ᴅᴏᴡɴʟᴏᴀᴅ 』━━━━━
◉ ➤ .instagram [ലിങ്ക്]
◉ ➤ .tiktok [ലിങ്ക്]
◉ ➤ .play [പാട്ടിന്റെ പേര്]
​━━━━━『 ᴀɴɪᴍᴇ & ᴅᴘ 』━━━━━
◉ ➤ .waifu
◉ ➤ .neko
◉ ➤ .boydp
◉ ➤ .girldp
​━━━━━『 ғᴜɴ & ɢᴀᴍᴇs 』━━━━━
◉ ➤ .8ball [ചോദ്യം]
◉ ➤ .coinflip
◉ ➤ .roll
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
​━━━━━『 ᴍᴀɪɴ 』━━━━━
◉ ➤ .ping
◉ ➤ .alive
◉ ➤ .uptime
​© ᴘᴏᴡᴇʀᴇᴅ ʙʏ solo_boy_og`;
await sock.sendMessage(from, { text: customMenu }, { quoted: msg });
continue;
}
​if (command === 'ping') {
const start = Date.now();
await sock.sendMessage(from, { text: ⚡ *Pong!* Speed: ${Date.now() - start}ms }, { quoted: msg });
continue;
}
​if (command === 'alive' || command === 'uptime') {
await sock.sendMessage(from, {
text: 👋 Hey! I am alive & working perfectly on Render Cloud 24/7!\n⏱️ *Runtime:* ${getRuntime()}
}, { quoted: msg });
continue;
}
​/* STREAMING_CHUNK:Executing message deletion and spoiler maker... */
// 2. DELETE MESSAGE (.del)
if (['del', 'delete'].includes(command)) {
const quoted = msg.message?.extendedTextMessage?.contextInfo;
if (!quoted?.stanzaId) {
await sock.sendMessage(from, { text: '❗ കളയേണ്ട മെസ്സേജിന് റിപ്ലൈ ആയി .del എന്ന് അയക്കുക.' }, { quoted: msg });
continue;
}
const deleteKey = {
remoteJid: from,
fromMe: quoted.participant ? quoted.participant === sock.user.id.split(':')[0] + '@s.whatsapp.net' : true,
id: quoted.stanzaId,
participant: quoted.participant
};
try {
await sock.sendMessage(from, { delete: deleteKey });
} catch (e) {
await sock.sendMessage(from, { text: '⚠️ മെസ്സേജ് ഡിലീറ്റ് ചെയ്യാൻ ബോട്ടിന് ഗ്രൂപ്പ് അഡ്മിൻ അധികാരം വേണം.' }, { quoted: msg });
}
continue;
}
​// 3. READMORE SPOILER
if (['readmore', 'spoiler'].includes(command)) {
if (!args.includes('|')) {
await sock.sendMessage(from, { text: '❗ ഉപയോഗിക്കേണ്ട വിധം:\n.readmore മുന്നിൽ കാണേണ്ട വാചകം | ഒളിപ്പിക്കേണ്ട രഹസ്യം' }, { quoted: msg });
continue;
}
const [front, hidden] = args.split('|').map(s => s.trim());
const readMoreChar = String.fromCharCode(8206).repeat(4001);
await sock.sendMessage(from, { text: ${front} ${readMoreChar}\n\n${hidden} }, { quoted: msg });
continue;
}
​/* STREAMING_CHUNK:Executing GitHub stalker and prayer times... */
// 4. GITHUB STALKER
if (['github', 'gitstalk'].includes(command)) {
if (!args) {
await sock.sendMessage(from, { text: '❗ GitHub യൂസർനെയിം നൽകുക: .github torvalds' }, { quoted: msg });
continue;
}
await sock.sendMessage(from, { text: '🔍 GitHub പ്രൊഫൈൽ തിരയുന്നു...' }, { quoted: msg });
try {
const res = await axios.get(https://api.github.com/users/${encodeURIComponent(args)});
const d = res.data;
const ghText = 🐙 *GITHUB PROFILE:* ${d.login}\n\n👤 *പേര്:* ${d.name \vert{}\vert{} 'N/A'}\n📝 *Bio:* ${d.bio || 'None'}\n🏢 *കമ്പനി:* ${d.company \vert{}\vert{} 'N/A'}\n📍 *സ്ഥലം:* ${d.location || 'N/A'}\n📦 *Public Repos:* ${d.public_repos}\n👥 *Followers:* ${d.followers} | *Following:* ${d.following}\n🔗 *Link:* ${d.html_url};
if (d.avatar_url) {
await sock.sendMessage(from, { image: { url: d.avatar_url }, caption: ghText }, { quoted: msg });
} else {
await sock.sendMessage(from, { text: ghText }, { quoted: msg });
}
} catch (e) {
await sock.sendMessage(from, { text: '⚠️ ഇങ്ങനെയൊരു യൂസർ പ്രൊഫൈൽ GitHub-ൽ കണ്ടെത്താനായില്ല.' }, { quoted: msg });
}
continue;
}
​// 5. PRAYER TIMES
if (['praytime', 'prayer', 'namaz'].includes(command)) {
const place = args || 'Kozhikode';
try {
const res = await axios.get(https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(place)}&country=India&method=2);
const t = res.data?.data?.timings;
if (t) {
const prayText = 🕌 *നിസ്കാര സമയം:* ${place.toUpperCase()}\n📅 *തീയതി:* ${res.data.data.date.readable}\n\n🌅 *Subhi (Fajr):* ${t.Fajr}\n☀️ *Sunrise:* ${t.Sunrise}\n☀️ *Luhar (Dhuhr):* ${t.Dhuhr}\n⛅ *Asr:*${t.Asr}\n🌇 *Maghrib:* ${t.Maghrib}\n🌙 *Isha:* ${t.Isha};
await sock.sendMessage(from, { text: prayText }, { quoted: msg });
}
} catch (e) {
await sock.sendMessage(from, { text: '⚠️ നിസ്കാര സമയവിവരങ്ങൾ ലഭ്യമായില്ല.' }, { quoted: msg });
}
continue;
}
​/* STREAMING_CHUNK:Executing Base64 and binary conversions... */
// 6. UTILITY ENCODERS (Base64 & Binary)
if (command === 'base64') {
if (!args) { await sock.sendMessage(from, { text: '❗ മാറ്റേണ്ട വാചകം നൽകുക: .base64 ഹലോ' }, { quoted: msg }); continue; }
const b64 = Buffer.from(args).toString('base64');
await sock.sendMessage(from, { text: 🔐 *Base64 Encoded:*\n\``${b64}```` }, { quoted: msg });
continue;
}
​if (command === 'unbase64') {
if (!args) { await sock.sendMessage(from, { text: '❗ ഡീകോഡ് ചെയ്യേണ്ട Base64 നൽകുക: .unbase64 aGVsbG8=' }, { quoted: msg }); continue; }
try {
const decoded = Buffer.from(args, 'base64').toString('utf-8');
await sock.sendMessage(from, { text: 🔓 *Decoded Text:*\n${decoded} }, { quoted: msg });
} catch {
await sock.sendMessage(from, { text: '⚠️ അസാധുവായ Base64 കോഡ്.' }, { quoted: msg });
}
continue;
}
​if (command === 'binary') {
if (!args) { await sock.sendMessage(from, { text: '❗ വാചകം നൽകുക: .binary hello' }, { quoted: msg }); continue; }
const bin = args.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
await sock.sendMessage(from, { text: 💻 *Binary:*\n\``${bin}```` }, { quoted: msg });
continue;
}
​if (command === 'dbinary') {
if (!args) { await sock.sendMessage(from, { text: '❗ ബൈനറി കോഡ് നൽകുക.' }, { quoted: msg }); continue; }
try {
const str = args.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
await sock.sendMessage(from, { text: 📄 *Text:*\n${str} }, { quoted: msg });
} catch {
await sock.sendMessage(from, { text: '⚠️ അസാധുവായ ബൈനറി.' }, { quoted: msg });
}
continue;
}
​/* STREAMING_CHUNK:Executing 8ball, coinflip, dice roll, and fancy text... */
// 7. 8BALL, COINFLIP, ROLL
if (['8ball', 'fortune'].includes(command)) {
if (!args) { await sock.sendMessage(from, { text: '❗ ചോദ്യം ചോദിക്കൂ: .8ball ഞാൻ ഇന്ന് ജയിക്കുമോ?' }, { quoted: msg }); continue; }
const ans = funData.eightBall[Math.floor(Math.random() * funData.eightBall.length)];
await sock.sendMessage(from, { text: 🎱 *ചോദ്യം:* ${args}\n🔮 *ഉത്തരം:* ${ans} }, { quoted: msg });
continue;
}
​if (command === 'coinflip') {
const flip = Math.random() < 0.5 ? '🪙 HEADS (തല)' : '🪙 TAILS (വാൽ)';
await sock.sendMessage(from, { text: ടോസ് ഫലം:\n${flip} }, { quoted: msg });
continue;
}
​if (command === 'roll') {
const roll = Math.floor(Math.random() * 6) + 1;
await sock.sendMessage(from, { text: 🎲 ഡൈസ് ഉരുട്ടി കിട്ടിയ നമ്പർ: *${roll}* }, { quoted: msg });
continue;
}
​// 8. FANCY FONT GENERATOR
if (command === 'fancy') {
if (!args) {
await sock.sendMessage(from, { text: '❗ വാചകം നൽകുക: .fancy solo boy' }, { quoted: msg });
continue;
}
const styled = toFancy(args);
await sock.sendMessage(from, { text: ✨ *Fancy Text:*\n\n${styled} }, { quoted: msg });
continue;
}
​/* STREAMING_CHUNK:Executing calculator, Wikipedia, shortener, and screenshot... /
// 9. CALCULATOR
if (['calc', 'calculate'].includes(command)) {
if (!args) {
await sock.sendMessage(from, { text: '❗ കണക്ക് നൽകുക: .calc 1500 * 18 / 100' }, { quoted: msg });
continue;
}
try {
const cleanMath = args.replace(/[^0-9+-/().]/g, '');
const result = Function('use strict'; return (${cleanMath}))();
await sock.sendMessage(from, { text: 🧮 *കണക്ക്:* ${cleanMath}\n📊 *ഉത്തരം:* *${result}* }, { quoted: msg });
} catch (e) {
await sock.sendMessage(from, { text: '⚠️ നൽകിയ കണക്ക് ശരിയല്ല.' }, { quoted: msg });
}
continue;
}
​// 10. WIKIPEDIA
if (command === 'wiki') {
if (!args) {
await sock.sendMessage(from, { text: '❗ തിരയേണ്ട വിഷയം നൽകുക: .wiki Kerala' }, { quoted: msg });
continue;
}
await sock.sendMessage(from, { text: '🔍 വിക്കിപീഡിയ പരിശോധിക്കുന്നു...' }, { quoted: msg });
try {
const res = await axios.get(https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(args)});
if (res.data?.extract) {
const wikiReply = 📚 *WIKIPEDIA:* ${res.data.title}\n\n${res.data.extract}\n\n🔗 ${res.data.content_urls?.desktop?.page || ''};
await sock.sendMessage(from, { text: wikiReply }, { quoted: msg });
} else {
await sock.sendMessage(from, { text: '⚠️ വിവരങ്ങൾ ലഭ്യമായില്ല.' }, { quoted: msg });
}
} catch (e) {
await sock.sendMessage(from, { text: '⚠️ വിക്കിപീഡിയയിൽ കണ്ടെത്താൻ കഴിഞ്ഞില്ല.' }, { quoted: msg });
}
continue;
}
​// 11. SHORT LINK & SCREENSHOT
if (command === 'short') {
if (!args || !args.startsWith('http')) {
await sock.sendMessage(from, { text: '❗ ലിങ്ക് നൽകുക: .short https://www.google.com' }, { quoted: msg });
continue;
}
try {
const res = await axios.get(https://tinyurl.com/api-create.php?url=${encodeURIComponent(args)});
await sock.sendMessage(from, { text: 🔗 *Short Link:* ${res.data} }, { quoted: msg });
} catch (e) {
await sock.sendMessage(from, { text: '⚠️ ലിങ്ക് ചെറുതാക്കാൻ കഴിഞ്ഞില്ല.' }, { quoted: msg });
}
continue;
}
​if (command === 'ss') {
if (!args || !args.startsWith('http')) {
await sock.sendMessage(from, { text: '❗ വെബ്സൈറ്റ് ലിങ്ക് നൽകുക: .ss https://github.com' }, { quoted: msg });
continue;
}
await sock.sendMessage(from, { text: '📸 സ്ക്രീൻഷോട്ട് എടുക്കുന്നു...' }, { quoted: msg });
const ssUrl = https://image.thum.io/get/width/1200/crop/800/${args};
try {
await sock.sendMessage(from, { image: { url: ssUrl }, caption: 📸 *Screenshot of:* ${args} }, { quoted: msg });
} catch (e) {
await sock.sendMessage(from, { text: '⚠️ സ്ക്രീൻഷോട്ട് എടുക്കാൻ കഴിഞ്ഞില്ല.' }, { quoted: msg });
}
continue;
}
​/* STREAMING_CHUNK:Executing sticker maker, TTS voice notes, QR code, and weather... */
// 12. STICKER MAKER
if (['s', 'sticker'].includes(command)) {
const quotedMsg = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
const isImage = msg.message.imageMessage || quotedMsg?.imageMessage;
​if (!isImage) {
await sock.sendMessage(from, { text: '❗ ചിത്രത്തോടൊപ്പം .sticker എന്ന് അയക്കുക, അല്ലെങ്കിൽ ഫോട്ടോയ്ക്ക് റിപ്ലൈ ആയി .s അടിക്കുക.' }, { quoted: msg });
continue;
}
await sock.sendMessage(from, { text: '🎨 സ്റ്റിക്കർ തയ്യാറാക്കുന്നു...' }, { quoted: msg });
try {
const mediaMsg = msg.message.imageMessage ? msg : { message: quotedMsg };
const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {});
await sock.sendMessage(from, { sticker: buffer }, { quoted: msg });
} catch (e) {
await sock.sendMessage(from, { text: '⚠️ സ്റ്റിക്കർ മാറ്റുന്നതിൽ തടസ്സം നേരിട്ടു.' }, { quoted: msg });
}
continue;
}
​// 13. TTS & QR & WEATHER
if (['tts', 'say'].includes(command)) {
if (!args) {
await sock.sendMessage(from, { text: '❗ ശബ്ദമാക്കി മാറ്റേണ്ട വാചകം നൽകുക: .tts സുഖമാണോ കൂട്ടുകാരെ?' }, { quoted: msg });
continue;
}
try {
const ttsUrl = https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(args)}&tl=ml&client=tw-ob;
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
​if (command === 'qr') {
if (!args) {
await sock.sendMessage(from, { text: '❗ QR കോഡ് ഉണ്ടാക്കാൻ ഉള്ള വിവരങ്ങൾ നൽകുക: .qr https://google.com' }, { quoted: msg });
continue;
}
const qrUrl = https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(args)};
await sock.sendMessage(from, {
image: { url: qrUrl },
caption: ✅ *QR Code Generated!*\n📝 *Data:* ${args}
}, { quoted: msg });
continue;
}
​if (command === 'weather') {
if (!args) {
await sock.sendMessage(from, { text: '❗ സ്ഥലത്തിന്റെ പേര് നൽകുക: .weather Kozhikode' }, { quoted: msg });
continue;
}
try {
const res = await axios.get(https://wttr.in/${encodeURIComponent(args)}?format=j1);
const current = res.data?.current_condition?.[0];
if (current) {
const weatherText = 🌤️ *WEATHER REPORT:* ${args.toUpperCase()}\n\n🌡️ *താപനില:* ${current.temp_C}°C\n💧 *ഈർപ്പം (Humidity):* ${current.humidity}%\n💨 *കാറ്റിന്റെ വേഗത:* ${current.windspeedKmph} km/h\n☁️ *സ്ഥിതി:* ${current.weatherDesc?.[0]?.value || 'Normal'};
await sock.sendMessage(from, { text: weatherText }, { quoted: msg });
} else {
await sock.sendMessage(from, { text: '⚠️ സ്ഥലവിവരം ലഭ്യമായില്ല.' }, { quoted: msg });
}
} catch (e) {
await sock.sendMessage(from, { text: '⚠️ കാലാവസ്ഥാ വിവരങ്ങൾ എടുക്കുന്നതിൽ തടസ്സം നേരിട്ടു.' }, { quoted: msg });
}
continue;
}
​/* STREAMING_CHUNK:Executing lyrics finder, AI chatbots, and media downloaders... */
// 14. LYRICS
if (command === 'lyrics') {
if (!args) {
await sock.sendMessage(from, { text: '❗ പാട്ടിന്റെ പേര് നൽകുക: .lyrics jimikki kammal' }, { quoted: msg });
continue;
}
await sock.sendMessage(from, { text: '🔍 വരികൾ തിരയുന്നു...' }, { quoted: msg });
try {
const res = await axios.get(https://api.lyrics.ovh/v1/${encodeURIComponent(args)}/${encodeURIComponent(args)});
if (res.data?.lyrics) {
await sock.sendMessage(from, { text: 📜 *LYRICS:* ${args.toUpperCase()}\n\n${res.data.lyrics} }, { quoted: msg });
} else {
await sock.sendMessage(from, { text: '⚠️ ഈ പാട്ടിന്റെ വരികൾ കണ്ടെത്താനായില്ല.' }, { quoted: msg });
}
} catch (e) {
await sock.sendMessage(from, { text: '⚠️ വരികൾ ലഭ്യമാക്കാൻ കഴിഞ്ഞില്ല.' }, { quoted: msg });
}
continue;
}
​// 15. AI COMMANDS
const aiCommands = ['gemini', 'gpt4', 'deepseek'];
if (aiCommands.includes(command)) {
if (!args) {
await sock.sendMessage(from, { text: ❗ ചോദ്യം ചോദിക്കൂ: \.{command} കേരളത്തിന്റെ തലസ്ഥാനം ഏതാണ്?\`` }, { quoted: msg });
continue;
}
await sock.sendMessage(from, { text: '💭 _ആലോചിക്കുന്നു... ദയവായി കാത്തിരിക്കൂ..._' }, { quoted: msg });
try {
const res = await axios.get(`https://api.vreden.my.id/api/ai/gemini?query={encodeURIComponent(args)}); const reply = res.data?.result || res.data?.response || "മറുപടി ലഭ്യമായില്ല."; await sock.sendMessage(from, { text: 🤖 [${command.toUpperCase()}]:\n\n${reply}}, { quoted: msg }); } catch (e) { await sock.sendMessage(from, { text:⚠️ AI സെർവറിൽ തടസ്സം നേരിട്ടു.` }, { quoted: msg });
}
continue;
}
​// 16. DOWNLOAD COMMANDS
if (['instagram', 'ig', 'tiktok', 'tt'].includes(command)) {
if (!args || !args.startsWith('http')) {
await sock.sendMessage(from, { text: ❗ ലിങ്ക് നൽകുക: \.{command} https://...\`` }, { quoted: msg });
continue;
}
await sock.sendMessage(from, { text: '⏳ _വീഡിയോ ഡൗൺലോഡ് ചെയ്യുന്നു..._' }, { quoted: msg });
try {
const apiUrl = ['instagram', 'ig'].includes(command)
? `https://api.vreden.my.id/api/download/instagram?url={encodeURIComponent(args)}:https://api.vreden.my.id/api/download/tiktok?url=${encodeURIComponent(args)}; const res = await axios.get(apiUrl); const videoUrl = res.data?.result?.video || res.data?.result?.url || res.data?.result?.[0]?.url; if (videoUrl) { await sock.sendMessage(from, { video: { url: videoUrl }, caption: ✅ ഡൗൺലോഡ് വിജയകരം!` }, { quoted: msg });
} else {
await sock.sendMessage(from, { text: '⚠️ വീഡിയോ കണ്ടെത്താൻ കഴിഞ്ഞില്ല.' }, { quoted: msg });
}
} catch (e) {
await sock.sendMessage(from, { text: '⚠️ ഡൗൺലോഡർ സെർവർ ഡൗൺ ആണ്.' }, { quoted: msg });
}
continue;
}
​if (command === 'play') {
if (!args) {
await sock.sendMessage(from, { text: '❗ പാട്ടിന്റെ പേര് നൽകുക: .play jimikki kammal' }, { quoted: msg });
continue;
}
await sock.sendMessage(from, { text: 🎵 *${args}* തിരയുന്നു... }, { quoted: msg });
try {
const searchRes = await axios.get(https://api.vreden.my.id/api/ytplay?query=${encodeURIComponent(args)});
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
​/* STREAMING_CHUNK:Executing anime and profile pictures... */
// 17. ANIME & RANDOM DP
if (['waifu', 'neko'].includes(command)) {
try {
const res = await axios.get(https://api.waifu.pics/sfw/${command});
if (res.data?.url) {
await sock.sendMessage(from, { image: { url: res.data.url }, caption: 🌸 Anime: *${command.toUpperCase()}* }, { quoted: msg });
}
} catch (e) {
await sock.sendMessage(from, { text: '⚠️ ചിത്രം ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല.' }, { quoted: msg });
}
continue;
}
​if (command.startsWith('boydp') || command.startsWith('girldp')) {
const isBoy = command.startsWith('boydp');
const imgUrl = isBoy
? https://picsum.photos/seed/boy_${Math.floor(Math.random() * 1000)}/600/600
: https://picsum.photos/seed/girl_${Math.floor(Math.random() * 1000)}/600/600;
await sock.sendMessage(from, { image: { url: imgUrl }, caption: 🖼️ *${isBoy ? 'BOY' : 'GIRL'} DP* }, { quoted: msg });
continue;
}
​/* STREAMING_CHUNK:Executing group administration tools... */
// 18. GROUP COMMANDS
if (isGroup) {
if (command === 'tagall') {
const groupMetadata = await sock.groupMetadata(from);
const participants = groupMetadata.participants;
let text = 📢 *ഗ്രൂപ്പ് അനൗൺസ്‌മെന്റ്!*\n💬 *മെസ്സേജ്:* ${args || 'ശ്രദ്ധിക്കുക'}\n\n;
let mentions = [];
for (const mem of participants) {
text += 👉 @${mem.id.split('@')[0]}\n;
mentions.push(mem.id);
}
await sock.sendMessage(from, { text, mentions }, { quoted: msg });
continue;
}
​if (command === 'hidetag') {
const groupMetadata = await sock.groupMetadata(from);
const mentions = groupMetadata.participants.map(p => p.id);
await sock.sendMessage(from, { text: args || '🔔 ഗ്രൂപ്പ് ശ്രദ്ധിക്കുക!', mentions }, { quoted: msg });
continue;
}
​if (['link', 'grouplink'].includes(command)) {
try {
const code = await sock.groupInviteCode(from);
await sock.sendMessage(from, { text: 🔗 *ഗ്രൂപ്പ് ലിങ്ക്:*\nhttps://chat.whatsapp.com/${code} }, { quoted: msg });
} catch (e) {
await sock.sendMessage(from, { text: '⚠️ ഗ്രൂപ്പ് ലിങ്ക് എടുക്കാൻ ബോട്ടിന് അഡ്മിൻ അധികാരം വേണം.' }, { quoted: msg });
}
continue;
}
​if (command === 'mute') {
await sock.groupSettingUpdate(from, 'announcement');
await sock.sendMessage(from, { text: '🔒 ഗ്രൂപ്പ് മ്യൂട്ട് ചെയ്തു.' }, { quoted: msg });
continue;
}
​if (command === 'unmute') {
await sock.groupSettingUpdate(from, 'not_announcement');
await sock.sendMessage(from, { text: '🔓 ഗ്രൂപ്പ് അൺമ്യൂട്ട് ചെയ്തു.' }, { quoted: msg });
continue;
}
​const targetUser = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
if (['kick', 'promote', 'demote'].includes(command)) {
if (!targetUser) {
await sock.sendMessage(from, { text: ❗ ഒരാളെ മെൻഷൻ ചെയ്യുക: \.${command} @user`` }, { quoted: msg });
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
​/* STREAMING_CHUNK:Executing interactive fun entertainment quotes... */
// 19. FUN & GAMES
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
​startBot().catch(console.error);
/* STREAMING_CHUNK:Closing cat heredoc and committing changes to GitHub... */
