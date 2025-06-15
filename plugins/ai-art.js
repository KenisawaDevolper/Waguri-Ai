let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Ingresa un Promt.\nEjemplo : artai Cute Girl')
  await conn.sendMessage(m.chat, {
    image: { url: `https://www.abella.icu/art-ai?q=${encodeURIComponent(text)}` }
  }, { quoted: m })
}

handler.help = ['artai']
handler.tags = ['ai']
handler.command = ['artai','art']

export default handler