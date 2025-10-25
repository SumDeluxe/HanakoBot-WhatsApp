import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('[💖] Escribe algo para hablar con IA.')

  const url = `https://api-adonix.ultraplus.click/ai/iavoz?apikey=SoyMaycol<3&q=${encodeURIComponent(text)}&voice=Esperanza`

  try {
    console.log('🟢 [IAVOZ] Petición iniciada')
    console.log('📤 Texto recibido:', text)
    console.log('🌐 Solicitando a:', url)

    const res = await fetch(url)
    console.log('📦 Estado de respuesta:', res.status, res.statusText)

    if (!res.ok) throw new Error('Error al generar el audio.')

    const audioBuffer = await res.arrayBuffer()
    console.log('🎧 Audio recibido correctamente. Tamaño:', audioBuffer.byteLength, 'bytes')

    await conn.sendMessage(m.chat, {
      audio: Buffer.from(audioBuffer),
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

    console.log('✅ Audio enviado correctamente al chat:', m.chat)

  } catch (e) {
    console.error('❌ [IAVOZ] Error:', e)
    m.reply('> 👾 Ocurrió un error al generar la voz.')
  }
}

handler.help = ['iavoz']
handler.tags = ['ia']
handler.command = ['iavoz']

export default handler
