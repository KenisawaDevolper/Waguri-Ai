let handler = async (m, { conn, usedPrefix }) => {
  let who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
  const settings = global.db.data.settings[conn.user.jid] || {};
  
  if (who === conn.user.jid) return m.react('✖️');
  if (!(who in global.db.data.users)) return m.reply(`❌ *El usuario no se encuentra en mi base de datos.*`);

  let user = global.db.data.users[who];
  let saldo = user.bank || 0;
  let moneda = settings.moneda_rpg || '💰';

  let texto = `
❀ *Información de Banco*

➪ *Usuario ›* ${who === m.sender ? 'Tú' : `@${who.split('@')[0]}`}
> ⚿ Banco › *${saldo} ${moneda}*

${wm} ⚙️
  `.trim();

  await conn.sendMessage(m.chat, { text: texto, mentions: [who] }, { quoted: m });
};

handler.help = ['bank'];
handler.tags = ['rpg'];
handler.command = ['bank', 'banco'];
handler.register = true;

export default handler;