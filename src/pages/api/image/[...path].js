import fs from 'fs';
import path from 'path';

export async function GET({ params, request }) {
  try {
    // Obtener el path de la imagen - params.path es un array en [...path]
    const imagePath = Array.isArray(params.path) ? params.path.join('/') : params.path;
    
    // Construir la ruta completa a la imagen
    const fullPath = path.join(process.cwd(), '..', 'DB', 'UMAS', 'img', imagePath);
    
    console.log('Requested image:', imagePath);
    console.log('Full path:', fullPath);
    console.log('File exists:', fs.existsSync(fullPath));
    
    // Verificar si el archivo existe
    if (!fs.existsSync(fullPath)) {
      return new Response('Image not found', { status: 404 });
    }
    
    // Leer el archivo
    const imageBuffer = fs.readFileSync(fullPath);
    
    // Determinar el content-type basado en la extensión
    const ext = path.extname(fullPath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
    }
    
    // Retornar la imagen con los headers apropiados
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache por 1 año
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
