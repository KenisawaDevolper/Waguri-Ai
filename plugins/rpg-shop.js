const xpperlimit = 450

let handler = async (m, { conn, command, args }) => {
  const settings = global.db.data.settings[conn.user.jid] || {}
  const moneda = settings.moneda_rpg || '💰'
  const user = global.db.data.users[m.sender]

  let count = command.replace(/^buycoins/i, '')
  count = count
    ? /all/i.test(count)
      ? Math.floor(user.exp / xpperlimit)
      : parseInt(count)
    : args[0]
      ? parseInt(args[0])
      : 1

  count = Math.max(1, count)

  const totalCost = xpperlimit * count

  if (user.exp >= totalCost) {
    user.exp -= totalCost
    user.limit += count

    const mensaje = `
╭─〔 🛒 *R P G - S H O P* 〕─❍
│
│ ✧ Compra: *+${count} ${moneda}*
│ ✧ Costo: *-${totalCost} 💫 XP*
│
╰───────────────⭑

${wm}
    `.trim()

    return conn.reply(m.chat, mensaje, m)
  } else {
    return conn.reply(m.chat, `
✧ *No tienes suficiente experiencia.*

➪ Intentaste comprar: *${count} ${moneda}*
➪ Costo requerido: *${totalCost} 💫 XP*
➪ Tu XP actual: *${user.exp}*

Sigue jugando para ganar más experiencia.

${wm}
    `.trim(), m)
  }
}

handler.help = ['buycoins', 'buyall']
handler.tags = ['rpg']
handler.command = ['buycoins', 'buyall']
handler.register = true

export default handler