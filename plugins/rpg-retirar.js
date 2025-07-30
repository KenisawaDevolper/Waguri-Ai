let handler = async (m, { args, conn }) => {
  const settings = global.db.data.settings[conn.user.jid] || {}
  const moneda = settings.moneda_rpg || '💰'

  const user = global.db.data.users[m.sender]
  const banco = user.bank || 0
  const cartera = user.limit || 0

  if (!args[0]) return m.reply(`✧ Ingresa la cantidad de *${moneda}* que deseas retirar.\n\nEjemplo: *retirar 100* o *retirar all*`)

  if (args[0].toLowerCase() === 'all') {
    if (banco < 1) return m.reply(`✧ No tienes *${moneda}* en el banco para retirar.`)

    user.bank = 0
    user.limit += banco

    return m.reply(`
❀ *Retiro exitoso*

> Cantidad retirada: *${banco} ${moneda}*
> Nuevo saldo en cartera: *${user.limit} ${moneda}*

${wm}
    `.trim())
  }

  if (isNaN(args[0])) return m.reply('✧ La cantidad debe ser un número válido.')
  const cantidad = parseInt(args[0])
  if (cantidad < 1) return m.reply(`✧ La cantidad mínima a retirar es *1 ${moneda}*.`)
  if (banco < cantidad) return m.reply(`✧ Solo tienes *${banco} ${moneda}* en el banco.`)

  user.bank -= cantidad
  user.limit += cantidad

  return m.reply(`
❀ *Retiro realizado*

> Cantidad retirada: *${cantidad} ${moneda}*
> Saldo restante en banco: *${user.bank} ${moneda}*
> Nuevo saldo en cartera: *${user.limit} ${moneda}*

${wm}
  `.trim())
}

handler.help = ['retirar']
handler.tags = ['rpg']
handler.command = ['withdraw', 'retirar', 'wd']
handler.register = true

export default handler