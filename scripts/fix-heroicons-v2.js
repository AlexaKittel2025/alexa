const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Lista de ícones disponíveis no @heroicons/react v1.0.6
const validIcons = {
  outline: [
    'AcademicCapIcon', 'AdjustmentsIcon', 'AnnotationIcon', 'ArchiveIcon',
    'ArrowCircleDownIcon', 'ArrowCircleLeftIcon', 'ArrowCircleRightIcon', 'ArrowCircleUpIcon',
    'ArrowDownIcon', 'ArrowLeftIcon', 'ArrowNarrowDownIcon', 'ArrowNarrowLeftIcon',
    'ArrowNarrowRightIcon', 'ArrowNarrowUpIcon', 'ArrowRightIcon', 'ArrowUpIcon',
    'ArrowsExpandIcon', 'AtSymbolIcon', 'BackspaceIcon', 'BadgeCheckIcon',
    'BanIcon', 'BeakerIcon', 'BellIcon', 'BookOpenIcon',
    'BookmarkIcon', 'BookmarkAltIcon', 'BriefcaseIcon', 'CakeIcon',
    'CalculatorIcon', 'CalendarIcon', 'CameraIcon', 'CashIcon',
    'ChartBarIcon', 'ChartPieIcon', 'ChartSquareBarIcon', 'ChatIcon',
    'ChatAlt2Icon', 'ChatAltIcon', 'CheckIcon', 'CheckCircleIcon',
    'ChevronDoubleDownIcon', 'ChevronDoubleLeftIcon', 'ChevronDoubleRightIcon', 'ChevronDoubleUpIcon',
    'ChevronDownIcon', 'ChevronLeftIcon', 'ChevronRightIcon', 'ChevronUpIcon',
    'ChipIcon', 'ClipboardIcon', 'ClipboardCheckIcon', 'ClipboardCopyIcon',
    'ClipboardListIcon', 'ClockIcon', 'CloudIcon', 'CloudDownloadIcon',
    'CloudUploadIcon', 'CodeIcon', 'CogIcon', 'CollectionIcon',
    'ColorSwatchIcon', 'ComputerDesktopIcon', 'CreditCardIcon', 'CubeIcon',
    'CubeTransparentIcon', 'CurrencyBangladeshiIcon', 'CurrencyDollarIcon', 'CurrencyEuroIcon',
    'CurrencyPoundIcon', 'CurrencyRupeeIcon', 'CurrencyYenIcon', 'CursorClickIcon',
    'DatabaseIcon', 'DesktopComputerIcon', 'DeviceMobileIcon', 'DeviceTabletIcon',
    'DocumentIcon', 'DocumentAddIcon', 'DocumentDownloadIcon', 'DocumentDuplicateIcon',
    'DocumentRemoveIcon', 'DocumentReportIcon', 'DocumentSearchIcon', 'DocumentTextIcon',
    'DotsCircleHorizontalIcon', 'DotsHorizontalIcon', 'DotsVerticalIcon', 'DownloadIcon',
    'DuplicateIcon', 'EmojiHappyIcon', 'EmojiSadIcon', 'ExclamationIcon',
    'ExclamationCircleIcon', 'ExternalLinkIcon', 'EyeIcon', 'EyeOffIcon',
    'FastForwardIcon', 'FilmIcon', 'FilterIcon', 'FingerPrintIcon',
    'FireIcon', 'FlagIcon', 'FolderIcon', 'FolderAddIcon',
    'FolderDownloadIcon', 'FolderOpenIcon', 'FolderRemoveIcon', 'GiftIcon',
    'GlobeIcon', 'GlobeAltIcon', 'HandIcon', 'HashtagIcon',
    'HeartIcon', 'HomeIcon', 'IdentificationIcon', 'InboxIcon',
    'InboxInIcon', 'InformationCircleIcon', 'KeyIcon', 'LibraryIcon',
    'LightBulbIcon', 'LightningBoltIcon', 'LinkIcon', 'LocationMarkerIcon',
    'LockClosedIcon', 'LockOpenIcon', 'LoginIcon', 'LogoutIcon',
    'MailIcon', 'MailOpenIcon', 'MapIcon', 'MenuIcon',
    'MenuAlt1Icon', 'MenuAlt2Icon', 'MenuAlt3Icon', 'MenuAlt4Icon',
    'MicrophoneIcon', 'MinusIcon', 'MinusCircleIcon', 'MinusSmIcon',
    'MoonIcon', 'MusicNoteIcon', 'NewspaperIcon', 'OfficeBuildingIcon',
    'PaperAirplaneIcon', 'PaperClipIcon', 'PauseIcon', 'PencilIcon',
    'PencilAltIcon', 'PhoneIcon', 'PhoneIncomingIcon', 'PhoneMissedCallIcon',
    'PhoneOutgoingIcon', 'PhotographIcon', 'PlayIcon', 'PlusIcon',
    'PlusCircleIcon', 'PlusSmIcon', 'PresentationChartBarIcon', 'PresentationChartLineIcon',
    'PrinterIcon', 'PuzzleIcon', 'QrcodeIcon', 'QuestionMarkCircleIcon',
    'ReceiptRefundIcon', 'ReceiptTaxIcon', 'RefreshIcon', 'ReplyIcon',
    'RewindIcon', 'RssIcon', 'SaveIcon', 'SaveAsIcon',
    'ScaleIcon', 'ScissorsIcon', 'SearchIcon', 'SearchCircleIcon',
    'SelectorIcon', 'ServerIcon', 'ShareIcon', 'ShieldCheckIcon',
    'ShieldExclamationIcon', 'ShoppingBagIcon', 'ShoppingCartIcon', 'SortAscendingIcon',
    'SortDescendingIcon', 'SparklesIcon', 'SpeakerphoneIcon', 'StarIcon',
    'StatusOfflineIcon', 'StatusOnlineIcon', 'StopIcon', 'SunIcon',
    'SupportIcon', 'SwitchHorizontalIcon', 'SwitchVerticalIcon', 'TableIcon',
    'TagIcon', 'TemplateIcon', 'TerminalIcon', 'ThumbDownIcon',
    'ThumbUpIcon', 'TicketIcon', 'TranslateIcon', 'TrashIcon',
    'TrendingDownIcon', 'TrendingUpIcon', 'TruckIcon', 'UploadIcon',
    'UserIcon', 'UserAddIcon', 'UserCircleIcon', 'UserGroupIcon',
    'UserRemoveIcon', 'UsersIcon', 'VariableIcon', 'VideoCameraIcon',
    'ViewBoardsIcon', 'ViewGridIcon', 'ViewGridAddIcon', 'ViewListIcon',
    'VolumeOffIcon', 'VolumeUpIcon', 'WifiIcon', 'XIcon',
    'XCircleIcon', 'ZoomInIcon', 'ZoomOutIcon'
  ],
  solid: [
    // Similar list but for solid icons
    'HeartIcon', 'StarIcon', 'CheckCircleIcon', 'XCircleIcon',
    'ExclamationCircleIcon', 'InformationCircleIcon', 'QuestionMarkCircleIcon',
    'PlusCircleIcon', 'MinusCircleIcon', 'ArrowCircleDownIcon', 'ArrowCircleLeftIcon',
    'ArrowCircleRightIcon', 'ArrowCircleUpIcon'
  ]
};

// Correções de nomes comuns
const nameCorrections = {
  'LightningLightningBoltIcon': 'LightningBoltIcon',
  'LightningLightningLightningBoltIcon': 'LightningBoltIcon',
  'Cog6ToothIcon': 'CogIcon',
  'HandThumbUpIcon': 'ThumbUpIcon',
  'BoltIcon': 'LightningBoltIcon',
  'ChatBubbleBottomCenterIcon': 'ChatIcon',
  'ChatBubbleBottomCenterTextIcon': 'ChatIcon',
  'BookmarkSquareIcon': 'BookmarkIcon',
  'PencilSquareIcon': 'PencilIcon',
  'HeartIconSolid': 'HeartIcon',
  'ComputerDesktopIcon': 'DesktopComputerIcon'
};

function fixHeroiconsImports(content) {
  let hasChanges = false;
  let newContent = content;

  // Remover linhas vazias seguidas de imports duplicados
  newContent = newContent.replace(/;\s*;\s*/g, ';');

  // Corrigir nomes incorretos de ícones
  Object.entries(nameCorrections).forEach(([wrong, correct]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, 'g');
    if (newContent.match(regex)) {
      newContent = newContent.replace(regex, correct);
      hasChanges = true;
      console.log(`  Corrigido: ${wrong} → ${correct}`);
    }
  });

  // Extrair todas as importações do @heroicons/react
  const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]@heroicons\/react\/(outline|solid)['"];?/g;
  const imports = { outline: new Set(), solid: new Set() };
  let match;

  while ((match = importRegex.exec(newContent)) !== null) {
    const icons = match[1].split(',').map(icon => icon.trim());
    const type = match[2];
    icons.forEach(icon => {
      if (icon && validIcons[type]?.includes(icon)) {
        imports[type].add(icon);
      }
    });
  }

  // Remover todas as importações antigas
  newContent = newContent.replace(importRegex, '');

  // Reconstruir imports corretos
  let newImports = '';
  if (imports.outline.size > 0) {
    const outlineIcons = Array.from(imports.outline).sort().join(', ');
    newImports += `import { ${outlineIcons} } from '@heroicons/react/outline';\n`;
  }
  if (imports.solid.size > 0) {
    const solidIcons = Array.from(imports.solid).sort().join(', ');
    newImports += `import { ${solidIcons} } from '@heroicons/react/solid';\n`;
  }

  // Adicionar imports no início do arquivo após 'use client'
  const firstImportMatch = newContent.match(/^['"]use client['"];?\s*\n/);
  if (firstImportMatch) {
    newContent = newContent.replace(firstImportMatch[0], firstImportMatch[0] + newImports);
  } else {
    // Se não tem 'use client', adicionar no início
    newContent = newImports + newContent;
  }

  // Corrigir HeartIconSolid
  newContent = newContent.replace(/HeartIconSolid/g, 'HeartIcon');

  // Remover linhas vazias extras e imports duplicados
  newContent = newContent.replace(/(\n\s*\n){2,}/g, '\n\n');
  newContent = newContent.replace(/;\s*\n\s*;/g, ';');

  return { content: newContent, hasChanges: hasChanges || newImports.length > 0 };
}

// Buscar e corrigir arquivos
const files = glob.sync('src/**/*.{ts,tsx}', { cwd: path.join(__dirname, '..') });

console.log(`Verificando ${files.length} arquivos...\n`);

let totalFixed = 0;
files.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  const content = fs.readFileSync(fullPath, 'utf8');
  
  // Verificar se o arquivo usa heroicons
  if (content.includes('@heroicons/react')) {
    console.log(`Analisando: ${file}`);
    const { content: fixedContent, hasChanges } = fixHeroiconsImports(content);
    
    if (hasChanges) {
      fs.writeFileSync(fullPath, fixedContent);
      console.log(`✅ Corrigido: ${file}\n`);
      totalFixed++;
    } else {
      console.log(`✓ Já está correto: ${file}\n`);
    }
  }
});

console.log(`\n✅ Correção concluída! ${totalFixed} arquivos foram corrigidos.`);