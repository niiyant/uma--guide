import fs from 'fs';
import path from 'path';

export async function GET({ request }) {
  try {
    // Extraer el nombre de la imagen de la URL
    const url = new URL(request.url);
    const imageName = url.searchParams.get('name');
    
    console.log('Request URL:', request.url);
    console.log('URL searchParams:', url.searchParams.toString());
    console.log('All params:', [...url.searchParams.entries()]);
    console.log('Requested image:', imageName);
    
    if (!imageName) {
      console.log('No image name found in URL');
      return new Response(`Image name required. URL: ${request.url}`, { status: 400 });
    }
    
    // Construir la ruta completa a la imagen
    const fullPath = path.join(process.cwd(), '..', 'DB', 'UMAS', 'img', imageName);
    
    console.log('Requested image:', imageName);
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
    let contentType = 'image/png'; // Por defecto PNG
    
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
