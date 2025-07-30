let handler = async (m, { args, conn }) => {
  const settings = global.db.data.settings[conn.user.jid] || {}
  const moneda = settings.moneda_rpg || '💰'

  let user = global.db.data.users[m.sender]
  let cartera = user.limit || 0
  let banco = user.bank || 0

  if (!args[0]) return m.reply(`✧ Ingresa la cantidad de *${moneda}* que deseas depositar.\n\nEjemplo: *depositar 100* o *depositar all*`)

  if (args[0].toLowerCase() === 'all') {
    if (cartera < 1) return m.reply(`✧ No tienes *${moneda}* suficientes en la cartera para depositar.`)
    
    user.limit = 0
    user.bank += cartera

    return m.reply(`
❀ *Depósito exitoso*

➪ Se depositó todo tu dinero:
> 💰 Cantidad: *${cartera} ${moneda}*
> 🏦 Nuevo saldo en banco: *${user.bank} ${moneda}*

${wm}
    `.trim())
  }

  if (isNaN(args[0])) return m.reply(`✧ La cantidad debe ser un número válido.`)

  let cantidad = parseInt(args[0])
  if (cantidad < 1) return m.reply(`✧ La cantidad mínima a depositar es *1 ${moneda}*.`)
  if (cartera < cantidad) return m.reply(`✧ Solo tienes *${cartera} ${moneda}* en tu cartera.`)

  user.limit -= cantidad
  user.bank += cantidad

  return m.reply(`
❀ *Depósito realizado*

➪ Cantidad depositada: *${cantidad} ${moneda}*
➪ Saldo restante en cartera: *${user.limit} ${moneda}*
➪ Saldo en banco: *${user.bank} ${moneda}*

${wm}
  `.trim())
}

handler.help = ['depositar']
handler.tags = ['rpg']
handler.command = ['deposit', 'depositar', 'dep']
handler.register = true

export default handler