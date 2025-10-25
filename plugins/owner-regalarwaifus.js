import { promises as fs } from 'fs'

const charactersFilePath = './database/characters.json'
const haremFilePath = './database/harem.json'

async function loadCharacters() {
  const data = await fs.readFile(charactersFilePath, 'utf-8')
  return JSON.parse(data)
}

async function saveHarem(harem) {
  await fs.writeFile(haremFilePath, JSON.stringify(harem, null, 2), 'utf-8')
}

async function loadHarem() {
  try {
    const data = await fs.readFile(haremFilePath, 'utf-8')
    const parsed = JSON.parse(data)
    return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

let handler = async (m, { conn, text }) => {
  if (!m.fromMe && !global.owner.some(([id]) => m.sender.includes(id))) {
  await m.reply('🚫 Este comando solo puede usarlo el *Owner del bot*.')
  await m.react('❌')
  return
  }

  let cantidad = parseInt(text) || 5 // Por defecto regala a 5 personas
  await m.reply(`🎁 Repartiendo waifus a *${cantidad} personas aleatorias* de todos los grupos...`)
  await m.react('🕓')

  try {
    const characters = await loadCharacters()
    const harem = await loadHarem()

    // Obtener todos los grupos activos
    let grupos = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats)
    let miembrosTotales = []

    for (let [id, data] of grupos) {
      try {
        let metadata = await conn.groupMetadata(id)
        miembrosTotales.push(...metadata.participants.map(p => p.id))
      } catch (e) {
        console.warn('Error al obtener miembros de', id)
      }
    }

    // Filtramos duplicados
    miembrosTotales = [...new Set(miembrosTotales.filter(u => !u.startsWith('status@')))]

    if (miembrosTotales.length === 0) return m.reply('❌ No se encontraron miembros en los grupos.')

    // Selecciona aleatoriamente X personas
    let seleccionados = []
    for (let i = 0; i < cantidad; i++) {
      const random = miembrosTotales[Math.floor(Math.random() * miembrosTotales.length)]
      if (!seleccionados.includes(random)) seleccionados.push(random)
    }

    // Ahora regalamos una waifu aleatoria a cada uno
    for (let usuario of seleccionados) {
      const randomCharacter = characters[Math.floor(Math.random() * characters.length)]
      const randomImage = randomCharacter.img[Math.floor(Math.random() * randomCharacter.img.length)]

      if (!harem[usuario]) harem[usuario] = []
      if (!harem[usuario].some(c => c.id === randomCharacter.id)) {
        harem[usuario].push({
          id: randomCharacter.id,
          name: randomCharacter.name,
          value: randomCharacter.value,
          source: randomCharacter.source,
          gender: randomCharacter.gender
        })
      }

      // Enviar mensaje personalizado
      await conn.sendFile(usuario, randomImage, `${randomCharacter.name}.jpg`,
        `🎁 *¡Felicidades!* Fuiste elegido para recibir una waifu sorpresa 💖\n\n` +
        `🌸 Nombre: *${randomCharacter.name}*\n⚥ Género: *${randomCharacter.gender}*\n` +
        `✰ Valor: *${randomCharacter.value}*\n📚 Fuente: *${randomCharacter.source}*\n\n` +
        `> Regalo enviado por *Maycol 💕*`, null)
      await new Promise(r => setTimeout(r, 2000)) // delay para evitar flood
    }

    await saveHarem(harem)
    await m.react('✅')
    await m.reply(`✅ Se regalaron waifus a *${seleccionados.length} personas aleatorias*. ✨`)
  } catch (err) {
    console.error(err)
    await m.reply('❌ Error al repartir waifus: ' + err.message)
    await m.react('⚠️')
  }
}

handler.help = ['regalarwaifus [cantidad]']
handler.tags = ['owner']
handler.command = ['regalarwaifus', 'givewaifu', 'rwgift']
handler.rowner = true

export default handler
