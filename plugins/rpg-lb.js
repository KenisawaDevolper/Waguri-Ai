let handler = async (m, { conn, args, participants }) => {
  const settings = global.db.data.settings[conn.user.jid] || {}
  const users = Object.entries(global.db.data.users).map(([jid, user]) => ({ ...user, jid }))

  let sortedExp = users.map(toNumber('exp')).sort(sort('exp'))
  let sortedLim = users.map(toNumber('limit')).sort(sort('limit'))
  let sortedLevel = users.map(toNumber('level')).sort(sort('level'))

  let usersExp = sortedExp.map(enumGetKey)
  let usersLim = sortedLim.map(enumGetKey)
  let usersLevel = sortedLevel.map(enumGetKey)

  let len = args[0] && args[0].length > 0 ? Math.min(10, Math.max(parseInt(args[0]), 10)) : Math.min(10, sortedExp.length)

  const nombreUsuario = global.db.data.users[m.sender]?.name || 'Tú'

  const tabla = (lista, propiedad, icono, titulo) => {
    const top = lista.slice(0, len).map(({ jid, [propiedad]: valor }, i) => {
      const esParticipante = participants.some(p => jid === p.jid)
      const tag = esParticipante ? `@${jid.split('@')[0]}` : `wa.me/${jid.split('@')[0]}`
      return `> ${i + 1}. ${tag} » *${valor} ${icono}*`
    }).join('\n')

    const posicion = lista.findIndex(u => u.jid === m.sender) + 1
    const total = lista.length

    return `
╭─〔 *${titulo}* 〕─❍
│ 𖦹 Tú estás en el puesto *#${posicion}* de *${total}*
│
${top}
╰───────────────⭑
    `.trim()
  }

  let mensaje = `
ꕥ *TOP ${len} GLOBALS*

${tabla(sortedLim, 'limit', settings.moneda_rpg || '💰', `Top ${settings.moneda_rpg || 'Monedas'}`)}

${tabla(sortedExp, 'exp', '💫', 'Top Experiencia')}

${tabla(sortedLevel, 'level', '📈', 'Top Nivel')}

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
 ${wm}
  `.trim()

  conn.sendMessage(m.chat, { text: mensaje, mentions: conn.parseMention(mensaje) }, { quoted: m })
}

handler.help = ['leaderboard', 'lb']
handler.tags = ['rpg']
handler.command = /^leaderboard|lb$/i
handler.register = true
handler.fail = null
handler.exp = 0

export default handler

function sort(property, ascending = true) {
  if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
  else return (...args) => args[ascending & 1] - args[!ascending & 1]
}

function toNumber(property, _default = 0) {
  if (property) return (a, i, b) => {
    return { ...b[i], [property]: a[property] === undefined ? _default : a[property] }
  }
  else return a => a === undefined ? _default : a
}

function enumGetKey(a) {
  return a.jid
}