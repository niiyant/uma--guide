import fs from 'fs';
import path from 'path';

export const prerender = false;

export async function GET({ params }) {
  try {
    // Obtener el nombre de la imagen de los parámetros de ruta
    const imageName = params.imageName;
    
    console.log('Requested image:', imageName);
    
    if (!imageName) {
      return new Response('Image name required', { status: 400 });
    }
    
    // Construir la ruta completa a la imagen
    const fullPath = path.join(process.cwd(), '..', 'DB', 'UMAS', 'img', imageName);
    
    console.log('Full path:', fullPath);
    console.log('File exists:', fs.existsSync(fullPath));
    
    // Verificar si el archivo existe
    if (!fs.existsSync(fullPath)) {
      return new Response('Image not found', { status: 404 });
    }
    
    // Leer el archivo
    const imageBuffer = fs.readFileSync(fullPath);
    
    // Determinar el content-type
    const ext = path.extname(fullPath).toLowerCase();
    let contentType = 'image/png';
    
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
    
    // Retornar la imagen
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
