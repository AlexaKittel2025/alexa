const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Mapeamento de ícones para correção
const iconMappings = {
  'HandThumbUpIcon': 'ThumbUpIcon',
  'BoltIcon': 'LightningBoltIcon',
  'EmojiHappyIcon as EmojiHappyIcon': 'EmojiHappyIcon',
  'ExclamationIcon as ExclamationIcon': 'ExclamationIcon',
};

// Função para corrigir as importações em um arquivo
function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  // Corrigir importações from '@heroicons/react/outline'
  const outlineRegex = /from '@heroicons\/react\/outline';\s*import\s+(\w+)\s+from\s+'@heroicons\/react\/outline\/\w+'/g;
  content = content.replace(outlineRegex, (match, iconName) => {
    hasChanges = true;
    return `from '@heroicons/react/outline';`;
  });

  // Corrigir importações individuais
  const singleImportRegex = /import\s+(\w+)\s+from\s+'@heroicons\/react\/(outline|solid)\/\w+'/g;
  content = content.replace(singleImportRegex, (match, iconName, type) => {
    hasChanges = true;
    return '';
  });

  // Corrigir imports from '@heroicons/react/solid'
  content = content.replace(/from '@heroicons\/react\/solid'/g, () => {
    hasChanges = true;
    return "from '@heroicons/react/solid'";
  });

  // Remover duplicatas de imports
  const importRegex = /import\s+{([^}]+)}\s+from\s+'@heroicons\/react\/(outline|solid)'/g;
  const imports = {};

  content.replace(importRegex, (match, icons, type) => {
    const iconList = icons.split(',').map(icon => icon.trim());
    if (!imports[type]) imports[type] = new Set();
    iconList.forEach(icon => imports[type].add(icon));
    return match;
  });

  // Reconstruir os imports
  if (Object.keys(imports).length > 0) {
    let newImports = '';
    
    if (imports.outline && imports.outline.size > 0) {
      const outlineIcons = Array.from(imports.outline).join(', ');
      newImports += `import { ${outlineIcons} } from '@heroicons/react/outline';\n`;
    }
    
    if (imports.solid && imports.solid.size > 0) {
      const solidIcons = Array.from(imports.solid).join(', ');
      newImports += `import { ${solidIcons} } from '@heroicons/react/solid';\n`;
    }

    // Substituir imports antigos
    content = content.replace(importRegex, '');
    
    // Adicionar novos imports no início do arquivo
    const firstImportIndex = content.indexOf('import');
    if (firstImportIndex !== -1) {
      content = content.slice(0, firstImportIndex) + newImports + content.slice(firstImportIndex);
      hasChanges = true;
    }
  }

  // Corrigir nomes de ícones
  Object.entries(iconMappings).forEach(([oldName, newName]) => {
    const regex = new RegExp(oldName, 'g');
    if (content.match(regex)) {
      content = content.replace(regex, newName);
      hasChanges = true;
    }
  });

  // Salvar o arquivo se houver mudanças
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Corrigido: ${filePath}`);
  }
}

// Buscar todos os arquivos TypeScript/React
const files = glob.sync('src/**/*.{ts,tsx}', { cwd: path.join(__dirname, '..') });

console.log(`Encontrados ${files.length} arquivos para verificar...`);

files.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  fixImportsInFile(fullPath);
});

console.log('✅ Correção de importações concluída!');