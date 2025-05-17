import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

// Cores para o ícone
const ICON_BG_COLOR = '#8b5cf6'; // Roxo
const TEXT_COLOR = '#ffffff'; // Branco

// Função para criar um SVG simples com um texto
function createSvgIcon(size: number, text: string = 'M'): string {
  const fontSize = Math.floor(size * 0.6);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${ICON_BG_COLOR}" rx="${size * 0.2}" ry="${size * 0.2}" />
    <text x="50%" y="50%" dy=".1em" 
          fill="${TEXT_COLOR}" 
          font-family="Arial, sans-serif" 
          font-weight="bold" 
          font-size="${fontSize}px" 
          text-anchor="middle" 
          dominant-baseline="middle">${text}</text>
  </svg>`;
}

// Rota para gerar ícones
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const size = parseInt(searchParams.get('size') || '192');
    const text = searchParams.get('text') || 'M';
    
    // Gerar o SVG
    const svg = createSvgIcon(size, text);
    
    // Verificar se o diretório de ícones existe
    const iconDir = path.join(process.cwd(), 'public', 'icons');
    try {
      await fsPromises.access(iconDir);
    } catch {
      await fsPromises.mkdir(iconDir, { recursive: true });
    }
    
    // Salvar os ícones necessários
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
    
    for (const iconSize of sizes) {
      const iconPath = path.join(iconDir, `icon-${iconSize}x${iconSize}.png`);
      
      // Verificar se o ícone já existe
      try {
        await fsPromises.access(iconPath);
        console.log(`Ícone ${iconSize}x${iconSize} já existe.`);
      } catch {
        // Se não existir, criar um SVG para este tamanho e salvá-lo como PNG
        // Esta é apenas uma simulação, pois realmente converter SVG para PNG
        // requer bibliotecas adicionais como sharp, que não estamos instalando agora.
        const iconSvg = createSvgIcon(iconSize, text);
        await fsPromises.writeFile(
          path.join(iconDir, `icon-${iconSize}x${iconSize}.svg`), 
          iconSvg, 
          'utf-8'
        );
        
        console.log(`Ícone SVG ${iconSize}x${iconSize} criado.`);
      }
    }
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Erro ao gerar ícones:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar ícones' },
      { status: 500 }
    );
  }
} 