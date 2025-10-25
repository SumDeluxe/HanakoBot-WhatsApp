const handler = async (msg, { conn, isOwner }) => {
  try {
    const chatId = msg.key.remoteJid
    const sender = (msg.key.participant || msg.key.remoteJid).replace(/[^0-9]/g, '')
    const isGroup = chatId.endsWith('@g.us')
    const isBotMessage = msg.key.fromMe

    if (!isGroup) {
      await conn.sendMessage(chatId, { text: '⚠️ *Este comando solo se puede usar en grupos.*' }, { quoted: msg })
      return
    }

    const metadata = await conn.groupMetadata(chatId)
    const participant = metadata.participants.find(p => p.id.includes(sender))
    const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin'

    if (!isAdmin && !isOwner && !isBotMessage) {
      await conn.sendMessage(chatId, { text: '❌ *Este comando solo puede usarlo un administrador o el dueño del bot.*' }, { quoted: msg })
      return
    }

    const participants = metadata.participants
    const mentionIds = participants.map(p => p.id)
    const mentionText = mentionIds.map(id => `@${id.split('@')[0]}`).join(' ')

    await conn.sendMessage(chatId, {
      text: mentionText,
      mentions: mentionIds
    }, { quoted: msg })

  } catch (error) {
    console.error('❌ Error en el comando tagall:', error)
    await conn.sendMessage(msg.key.remoteJid, { text: '❌ Ocurrió un error al ejecutar el comando tagall.' }, { quoted: msg })
  }
}

handler.tags = ['group']
handler.help = ['tagall']
handler.command = ['tagall', 'invocar', 'todos']
handler.group = true

export default handler
