const cooldownsP = {}

let handler = async (m, { conn, isPrems }) => {
  const name = await conn.getName(m.sender)
  const user = global.db.data.users[m.sender]
  const settings = global.db.data.settings[conn.user.jid] || {}
  const tiempoEspera = 3 * 60 // 3 minutos

  if (!isPrems) return m.reply('✧ Este comando es exclusivo para *usuarios premium*.')

  const recompensa = Math.floor(Math.random() * 8000) + 3000 // más generosa

  if (cooldownsP[m.sender] && Date.now() - cooldownsP[m.sender] < tiempoEspera * 1000) {
    let tiempoRestante = segundosAHMS(Math.ceil((cooldownsP[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
    return conn.reply(m.chat, `
✧ *Hola ${name}*, ya minaste hace poco (versión premium).
⏱ Espera *${tiempoRestante}* para minar otra vez.
`, m)
  }

  user.exp += recompensa
  cooldownsP[m.sender] = Date.now()

  const mensaje = `
💎 *Minería Premium completada*

➪ Recompensa: *+${recompensa} 💫 XP*
➪ Usuario: *${name}*

Gracias por apoyar como usuario premium.

${wm}
`.trim()

  await m.react('💎')
  await conn.reply(m.chat, mensaje, m)
}

handler.help = ['minarp']
handler.tags = ['rpg']
handler.command = ['minarp', 'minar-premium']
handler.register = true

export default handler

function segundosAHMS(segundos) {
  let minutos = Math.floor(segundos / 60)
  let segundosRestantes = segundos % 60
  return `${minutos}m ${segundosRestantes}s`
}