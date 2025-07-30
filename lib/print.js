import { WAMessageStubType } from '@adiwajshing/baileys'
import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import { watchFile } from 'fs'

const terminalImage = global.opts['img'] ? require('terminal-image') : ''
const urlRegex = (await import('url-regex-safe')).default({ strict: false })

export default async function (m, conn = { user: {} }) {
  let _name = await conn.getName(m.sender)
  let sender = PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international') + (_name ? ' ~' + _name : '')
  let type
  if (m.chat.endsWith("net")) {
  	type = "Private Chat"
  } else if (m.chat.endsWith("us")) {
  	type = "Group Chat"
  } else if (m.chat.endsWith("newsletter")) {
  	type = "Channel Message"
  } else {
  	type = "Status Message"
  }
  let from = await conn.getName(m.chat)
  if (!from) {
  	m.chat.endsWith("newsletter") ? from = "Channel" : from = "Status"
  }
  let chat = await conn.getName(m.chat)
  // let ansi = '\x1b['
  let img
  try {
    if (global.opts['img'])
      img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false
  } catch (e) {
    console.error(e)
  }
  let filesize = (m.msg ?
    m.msg.vcard ?
      m.msg.vcard.length :
      m.msg.fileLength ?
        m.msg.fileLength.low || m.msg.fileLength :
        m.msg.axolotlSenderKeyDistributionMessage ?
          m.msg.axolotlSenderKeyDistributionMessage.length :
          m.text ?
            m.text.length :
            0
    : m.text ? m.text.length : 0) || 0
  let user = global.DATABASE.data.users[m.sender]
  let me = PhoneNumber('+' + (conn.user?.jid).replace('@s.whatsapp.net', '')).getNumber('international')
  let headers = `${chalk.green.bold("+-------------------------------+")}
${chalk.white.bold("        # CHAT INFORMATION         ")}
${chalk.green.bold(`╠═════════> ${Intl.DateTimeFormat('es-AR', { timeZone: 'America/Buenos_Aires', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date())} TIME <═════════════`)}`
  let body = `${chalk.green.bold("║")}${chalk.blue.bold(`➤ Type: ${type}`)}
${chalk.green.bold("║")}${chalk.red.bold(`➤ Sender: ${m.sender.split("@")[0]} | ~ ${m.name}`)}
${chalk.green.bold("║")}${chalk.magenta.bold(`➤ Plugin: ${m.plugin ? m.plugin : "None"}`)}
${chalk.green.bold("║")}${chalk.yellow.bold(`➤ From: ${from}`)}
${chalk.green.bold("║")}${chalk.cyan.bold(`➤ Mimetype: `)}${chalk.black(chalk.bgGreen(m.messageStubType ? WAMessageStubType[m.messageStubType] : m.mtype))}`
  let command = `${chalk.green.bold("╠═══════════════════════════════")}
${m.isCommand ? chalk.yellow.underline(m.text) : m.error ? chalk.red.bold(m.text) : chalk.white.underline(m.text?.length > 100 ? m.text.slice(0,100) + ". . ." : m.text)}
${chalk.green.bold("╠═══════════════════════════════")}`
  let footer = chalk.white.bold(global.namebot);
  console.log(`${headers}\n${body}\n${command}\n${footer}`);
  if (img) console.log(img.trimEnd())
  if (m.messageStubParameters) console.log(m.messageStubParameters.map(jid => {
    jid = conn.decodeJid(jid)
    let name = conn.getName(jid)
    return chalk.gray(PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international') + (name ? ' ~' + name : ''))
  }).join(', '))
  if (/document/i.test(m.mtype)) console.log(`🗂️ ${m.msg.fileName || m.msg.displayName || 'Document'}`)
  else if (/ContactsArray/i.test(m.mtype)) console.log(`👨‍👩‍👧‍👦 ${' ' || ''}`)
  else if (/contact/i.test(m.mtype)) console.log(`👨 ${m.msg.displayName || ''}`)
  else if (/audio/i.test(m.mtype)) {
    const duration = m.msg.seconds
    console.log(`${m.msg.ptt ? '🎤 (PTT ' : '🎵 ('}AUDIO) ${Math.floor(duration / 60).toString().padStart(2, 0)}:${(duration % 60).toString().padStart(2, 0)}`)
  }

  console.log()
  // if (m.quoted) console.log(m.msg.contextInfo)
}

let file = global.__filename(import.meta.url)
watchFile(file, () => {
  console.log(chalk.redBright("Update 'lib/print.js'"))
})