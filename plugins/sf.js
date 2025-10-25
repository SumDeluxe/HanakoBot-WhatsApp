// ...

if (m.body.startsWith('.sf')) {
    const args = m.body.split(' ');
    const filePathArg = args[1]; // ej. plugin/menu.js

    // 1. Verificar si está citando un mensaje
    if (!m.quoted) {
        return m.reply('❌ Debes citar/responder al mensaje que contiene el *nuevo código* para el archivo.');
    }
    
    // 2. Extraer el contenido del mensaje citado (el nuevo contenido)
    const newContent = m.quoted.text;
    
    if (!newContent) {
        return m.reply('El mensaje citado no contiene texto.');
    }

    // 3. Determinar la ruta segura del archivo (ej. ./plugins/menu.js)
    const baseDir = path.join(process.cwd(), 'plugins'); // Asumiendo que todos los archivos están en 'plugins'
    const fileName = path.basename(filePathArg); // Obtiene solo 'menu.js' si es 'plugin/menu.js'
    const filePath = path.join(baseDir, fileName);


    try {
        // 4. Escribir/Sobrescribir el contenido del archivo
        fs.writeFileSync(filePath, newContent, 'utf8');
        
        m.reply(`✅ Archivo **${fileName}** actualizado con éxito.
        
        *Ruta:* ${filePath}
        *Caracteres guardados:* ${newContent.length}`);

    } catch (error) {
        console.error('Error al guardar el archivo con .sf:', error);
        m.reply(`⚠️ Ocurrió un error al guardar el archivo: ${error.message}`);
    }
}
