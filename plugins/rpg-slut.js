const cooldowns = {}

let handler = async (m, { conn }) => {
  const settings = global.db.data.settings[conn.user.jid] || {}
  const user = global.db.data.users[m.sender]
  const tiempoEspera = 5 * 60 // 5 minutos
  const moneda = settings.moneda_rpg || '💰'

  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
    const tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
    return conn.reply(m.chat, `✧ Espera *${tiempoRestante}* para volver a usar el comando.`, m)
  }

  cooldowns[m.sender] = Date.now()

  const resultado = Math.floor(Math.random() * 1000) + 500
  const evento = pickRandom(works)
  user.limit += resultado

  const texto = `
🔮 *Trabajo atrevido completado*

✧ ${evento}
➪ Ganancia: *+${toNum(resultado)}* ${moneda}

${wm}
  `.trim()

  return conn.reply(m.chat, texto, m)
}

handler.help = ['slut']
handler.tags = ['rpg']
handler.command = ['slut']
handler.register = true

export default handler

function segundosAHMS(segundos) {
  const minutos = Math.floor((segundos % 3600) / 60)
  const segundosRestantes = segundos % 60
  return `${minutos}m ${segundosRestantes}s`
}

function toNum(number) {
  if (number >= 1_000_000) return (number / 1_000_000).toFixed(1) + 'M'
  if (number >= 1_000) return (number / 1_000).toFixed(1) + 'k'
  return number.toString()
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

// Lista segura (doble sentido, humor, sin violencia ni sexualización explícita)
const works = [
  "Te tomas selfies vendiendo tus pies online",
  "Hiciste stream jugando mal y aún así te pagaron",
  "Vendiste stickers de anime en grupos random",
  "Alguien te pagó por hacer un cosplay terrible",
  "Te disfrazaste de gato y pediste propinas",
  "Cantaste mal en la calle y te dieron monedas para que te vayas",
  "Fuiste payaso en una fiesta de niños y saliste corriendo",
  "Te contrataron para ser el meme viviente del grupo",
  "Diste abrazos gratis (y cobraste por ellos)",
  "Bailaste en una boda ajena por propina",
  "Hiciste ASMR con bolsas de papitas",
  "Actuaste como NPC en una plaza pública",
  "Vendiste consejos motivacionales por WhatsApp",
  "Cobrabas por dar spoilers falsos de películas",
  "Te disfrazaste de repartidor y entregaste abrazos"
]