const free = 50000
const prem = 100000
const cooldowns = {}

let handler = async (m, { conn, isPrems }) => {
  const settings = global.db.data.settings[conn.user.jid] || {}
  const user = global.db.data.users[m.sender]
  const tiempoEspera = 24 * 60 * 60 // 24 horas

  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
    const tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
    const texto = `
❀ *Reclamo diario ya hecho*

> Solo puedes reclamar 1 vez cada *24h*.
> Recompensa pendiente: *+${isPrems ? prem : free} 💫 XP*
> Tiempo restante: ⏱ *${tiempoRestante}*

${wm}
    `.trim()
    return conn.reply(m.chat, texto, m)
  }

  user.exp += isPrems ? prem : free
  cooldowns[m.sender] = Date.now()

  const texto = `
✦ *¡Reclamo exitoso!*

➪ Has reclamado tu recompensa diaria:
> 🎁 XP Ganado: *+${isPrems ? prem : free} 💫*
> ${isPrems ? '🟢 Cuenta Premium' : '🔵 Cuenta Gratuita'}

⏱ Vuelve mañana para más.

${wm}
  `.trim()

  return conn.reply(m.chat, texto, m)
}

handler.help = ['claim']
handler.tags = ['rpg']
handler.command = ['daily', 'claim']
handler.register = true

export default handler

function segundosAHMS(segundos) {
  const horas = Math.floor(segundos / 3600)
  const minutos = Math.floor((segundos % 3600) / 60)
  const segundosRestantes = segundos % 60
  return `${horas}h ${minutos}m ${segundosRestantes}s`
}