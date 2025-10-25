const { WAMessageStubType } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

// ... en tu manejador de mensajes (donde recibes el 'm' o 'msg')

if (m.body.startsWith('.getplugin')) {
    const args = m.body.split(' ');
    if (args.length < 2) {
        return m.reply('❌ Debes especificar el nombre del archivo. Ejemplo: .getplugin menu.js');
    }

    const fileName = args[1];
    // Asegúrate de que el archivo existe en una ruta segura (ej. ./plugins)
    const filePath = path.join(process.cwd(), 'plugins', fileName);

    try {
        // 1. Verificar que el archivo existe
        if (!fs.existsSync(filePath)) {
            return m.reply(`Archivo '${fileName}' no encontrado en la carpeta 'plugins/'.`);
        }

        // 2. Leer el contenido del archivo
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // 3. Responder con el contenido en formato de bloque de código
        const responseText = `\`\`\`javascript\n${fileContent}\n\`\`\``;
        
        // m.reply es una función auxiliar que envía el mensaje de vuelta al chat
        m.reply(responseText); 

    } catch (error) {
        console.error('Error al leer el plugin:', error);
        m.reply(`⚠️ Ocurrió un error al intentar leer el archivo: ${error.message}`);
    }
}
