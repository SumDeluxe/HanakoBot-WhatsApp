import fs from 'fs'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`✉️ *Usa:* ${usedPrefix + command} <mensaje>\n\nEjemplo:\n${usedPrefix + command} Hola gente, habrá mantenimiento hoy >_<`)
  await m.react('🕓')

  if (!global.owner.some(([id]) => m.sender.includes(id))) {
  await m.reply('🚫 Este comando solo puede usarlo el *Owner del bot*.')
  await m.react('❌')
  return
  }

  try {
    let totalGrupos = Object.entries(conn.chats)
      .filter(([id, data]) => id.endsWith('@g.us') && data.isChats)
      .map(([id]) => id)

    if (!totalGrupos.length) {
      await m.reply('⚠️ No hay grupos activos donde enviar el aviso.')
      await m.react('⚠️')
      return
    }

    m.reply(`📢 Enviando aviso a *${totalGrupos.length} grupos...*`)
    for (let id of totalGrupos) {
    await conn.sendMessage(id, {
    text: `. . . . . . . . . . . . . . . . . . . ꒰ ♡ ꒱ ,, ⌲˘͈ᵕ˘͈\nᴹᵉⁿˢᵃʲᵉ ᵈᵉ ˢᵒʸᴹᵃʸᶜᵒˡ\n\n> ${text}\n\n𝐃𝐞 𝐩𝐚𝐫𝐭𝐞 𝐝𝐞𝐥 𝐂𝐫𝐞𝐚𝐝𝐨𝐫 <3`,
    mentions: (await conn.groupMetadata(id)).participants.map(p => p.id)
    })
    await new Promise(res => setTimeout(res, 500)) // Pequeño delay para no saturar
    }

    await m.react('✅')
    await m.reply(`✅ Aviso enviado a *${totalGrupos.length} grupos.*`)
  } catch (e) {
    console.error(e)
    await m.reply('❌ Error al enviar el aviso.\n\n' + e.message)
    await m.react('⚠️')
  }
}

handler.help = ['avisar <texto>']
handler.tags = ['owner']
handler.command = ['avisar', 'broadcast', 'bcgrupos']
handler.rowner = true // Solo para el owner real

export default handler
