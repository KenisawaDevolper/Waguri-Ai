import db from '../lib/database.js';

let handler = async (m, { args, usedPrefix, command }) => {
  const settings = global.db.data.settings[conn.user.jid] || {}
  const moneda = settings.moneda_rpg || '💰'

  // Verificación básica
  if (args.length < 2 || !m.mentionedJid[0]) {
    return m.reply(`✧ Uso correcto:\n${usedPrefix + command} @usuario <cantidad>\n\nEjemplo:\n${usedPrefix + command} @usuario 1000`)
  }

  const receiver = m.mentionedJid[0]
  const amount = parseInt(args[1])

  if (isNaN(amount) || amount <= 0) {
    return m.reply('✧ La cantidad debe ser un número válido mayor que 0.')
  }

  const sender = m.sender

  db.data.users[sender] = db.data.users[sender] || { eris: 0 }
  db.data.users[receiver] = db.data.users[receiver] || { eris: 0 }

  if (db.data.users[sender].eris < amount) {
    return m.reply(`✧ No tienes suficiente ${moneda} para transferir esa cantidad.\nSaldo actual: *${db.data.users[sender].eris} ${moneda}*`)
  }

  // Transferencia
  db.data.users[sender].eris -= amount
  db.data.users[receiver].eris += amount

  const mensaje = `
❀ *Transferencia realizada*

➪ De: @${sender.split('@')[0]}
➪ A: @${receiver.split('@')[0]}
➪ Cantidad: *${amount} ${moneda}*

💱 ¡Gracias por compartir tus recursos!

${wm}
  `.trim()

  await m.reply(mensaje, null, { mentions: [sender, receiver] })
}

handler.help = ['transferir @usuario <cantidad>']
handler.tags = ['rpg']
handler.command = ['transferir', 'enviar', 'dar']
handler.group = true

export default handler