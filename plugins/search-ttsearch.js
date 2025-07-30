import axios from 'axios'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = (await import('@adiwajshing/baileys')).default

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) throw m.reply("❌ Ingresa el término de búsqueda. Ejemplo:\n.ttsearch Messi")
  
  const wait = "⏳ Buscando video, espera un momento..."
  await m.reply(wait)

  try {
    let { title, no_watermark } = await tiktoks(text)

    const vid = await prepareWAMessageMedia({ video: { url: no_watermark }, mimetype: 'video/mp4' }, { upload: conn.waUploadToServer })

    const msg = generateWAMessageFromContent(m.chat, {
      videoMessage: vid.videoMessage,
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

    await conn.sendMessage(m.chat, {
      text: `🎬 *${title}*\n\nPresiona el botón para buscar otro video.`,
      footer: 'TikTok Search',
      buttons: [
        { buttonId: `.ttsearch ${text}`, buttonText: { displayText: '🔁 Buscar otro' }, type: 1 }
      ],
      headerType: 1
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    throw m.reply('❌ Error al obtener video. Intenta con otra palabra clave.')
  }
}

handler.help = ['ttiktoksearch']
handler.tags = ['downloader']
handler.command = /^(ttsearch|tiktoksearch)$/i
handler.limit = true
handler.register = true

export default handler

async function tiktoks(query) {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://tikwm.com/api/feed/search',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'current_language=en',
        'User-Agent': 'Mozilla/5.0'
      },
      data: {
        keywords: query,
        count: 10,
        cursor: 0,
        HD: 1
      }
    })

    const videos = response.data.data.videos
    if (!videos || videos.length === 0) throw "❌ No se encontraron videos."

    const random = Math.floor(Math.random() * videos.length)
    const video = videos[random]

    return {
      title: video.title,
      no_watermark: video.play,
    }

  } catch (error) {
    throw error
  }
}