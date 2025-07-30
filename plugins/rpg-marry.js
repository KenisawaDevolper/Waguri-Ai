let handler = async (m, { conn, args, usedPrefix, command }) => {
  const settings = global.db.data.settings[conn.user.jid] || {}
  let sender = m.sender
  let senderUser = global.db.data.users[sender]
  
  if (!m.mentionedJid[0]) {
    return m.reply(`✧ Menciona a alguien para pedirle matrimonio.\n\n*Ejemplo:* ${usedPrefix + command} @usuario`)
  }

let target = m.mentionedJid[0]
if (!global.db.data.users[target]) global.db.data.users[target] = {
  exp: 0,
  limit: 10,
  lastclaim: 0,
  registered: false,
  name: conn.getName(target),
  age: -1,
  regTime: -1,
  afk: -1,
  afkReason: '',
  banned: false,
  banReason: '',
  warn: 0,
  level: 0,
  role: 'Free user',
  autolevelup: false,
  bank: 0,
  married: null,
  marryPending: null
}
let targetUser = global.db.data.users[target]
  
  if (sender === target) return m.reply('✧ ¿Quieres casarte contigo mismo? 😅')
  if (senderUser.married) return m.reply(`✧ Ya estás casado con @${senderUser.married.split('@')[0]}`, null, { mentions: [senderUser.married] })
  if (targetUser.married) return m.reply(`✧ @${target.split('@')[0]} ya está casado con otra persona. 💔`, null, { mentions: [target] })

  // Comprobamos si el receptor ya tenía una solicitud pendiente
  if (targetUser.marryPending === sender) {
    senderUser.married = target
    targetUser.married = sender
    senderUser.marryPending = null
    targetUser.marryPending = null

    return conn.reply(m.chat, `💍 @${sender.split('@')[0]} y @${target.split('@')[0]} ¡ahora están casados! 🎉`, m, {
      mentions: [sender, target]
    })
  }

  // Si aún no hay solicitud recíproca, dejamos la solicitud registrada
  senderUser.marryPending = target
  return conn.reply(m.chat, `💌 Has enviado una propuesta de matrimonio a @${target.split('@')[0]}.\n\n✧ Si la acepta usando:\n*${usedPrefix + command} @${conn.getName(sender)}* serán pareja 💍`, m, {
    mentions: [target]
  })
}

handler.help = ['marry @usuario']
handler.tags = ['rpg', 'social']
handler.command = /^marry$/i
handler.register = true

export default handler