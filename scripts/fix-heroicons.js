/**
 * Script para corrigir as importações do Heroicons no projeto
 * Alterando de @heroicons/react/24/outline para @heroicons/react/outline
 * e de @heroicons/react/24/solid para @heroicons/react/solid
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Mapeamento de nomes dos ícones da v2 para v1
const iconNameMapping = {
  // Outline
  'MagnifyingGlassIcon': 'SearchIcon',
  'PlusSquareIcon': 'PlusIcon',
  'ChatBubbleOvalLeftIcon': 'ChatIcon',
  'ChatBubbleLeftIcon': 'ChatIcon',
  'ChatBubbleLeftEllipsisIcon': 'ChatAltIcon',
  'ChatBubbleOvalLeftEllipsisIcon': 'ChatAltIcon',
  'EllipsisHorizontalIcon': 'DotsHorizontalIcon',
  'FaceSmileIcon': 'EmojiHappyIcon',
  'PencilSquareIcon': 'PencilIcon',
  'XMarkIcon': 'XIcon',
  'ArrowTopRightOnSquareIcon': 'ExternalLinkIcon',
  'MapPinIcon': 'LocationMarkerIcon',
  'PaperAirplaneIcon': 'PaperAirplaneIcon',
  'ArrowTrendingUpIcon': 'TrendingUpIcon',
  'ArrowPathIcon': 'RefreshIcon',
  'PhotoIcon': 'PhotographIcon',
  'CheckBadgeIcon': 'BadgeCheckIcon',
  'ExclamationTriangleIcon': 'ExclamationIcon',
  'ArrowLongRightIcon': 'ArrowRightIcon',
  'ArrowLongLeftIcon': 'ArrowLeftIcon',
  'UserPlusIcon': 'UserAddIcon',
  'UserMinusIcon': 'UserRemoveIcon',
  'ChatBubbleLeftRightIcon': 'ChatAlt2Icon',
  'ChatBubbleBottomCenterTextIcon': 'ChatAlt2Icon',
  'XCircleIcon': 'XCircleIcon',
  'ComputerDesktopIcon': 'DesktopComputerIcon',
  
  // E mais mapeamentos conforme necessário
};

// Procure todos os arquivos TypeScript/JavaScript no projeto
const files = glob.sync('src/**/*.{ts,tsx,js,jsx}');

files.forEach(file => {
  const filePath = path.resolve(file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Substituir importações de @heroicons/react/24/outline para @heroicons/react/outline
  if (content.includes('@heroicons/react/24/outline')) {
    content = content.replace(/@heroicons\/react\/24\/outline/g, '@heroicons/react/outline');
    modified = true;
  }

  // Substituir importações de @heroicons/react/24/solid para @heroicons/react/solid
  if (content.includes('@heroicons/react/24/solid')) {
    content = content.replace(/@heroicons\/react\/24\/solid/g, '@heroicons/react/solid');
    modified = true;
  }

  // Substituir nomes dos ícones
  for (const [v2Name, v1Name] of Object.entries(iconNameMapping)) {
    const regExp = new RegExp(v2Name, 'g');
    if (content.match(regExp)) {
      content = content.replace(regExp, v1Name);
      modified = true;
    }
  }

  // Salvar as alterações
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Arquivo atualizado: ${file}`);
  }
});

console.log('Processo de atualização concluído!'); 