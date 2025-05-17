// Importação direta de ícones disponíveis
import {
  ClockIcon,
  TagIcon,
  HeartIcon,
  SearchIcon,
  CheckIcon,
  EyeIcon,
  ExclamationIcon,
  UserGroupIcon,
  UserIcon,
  BellIcon,
  XIcon,
} from '@heroicons/react/outline';

// Reexportando ícones com nomes alternativos
export { ClockIcon, TagIcon, HeartIcon, SearchIcon, CheckIcon, EyeIcon };
export { ExclamationIcon, UserGroupIcon, UserIcon, BellIcon, XIcon };

// Aliases para ícones que não existem ou têm nomes diferentes
export const ChatIcon = BellIcon; // Substituição
export const ChatAlt2Icon = BellIcon; // Substituição para mensagens
export const LocationMarkerIcon = SearchIcon; // Usamos como alternativa
export const DocumentTextIcon = ClockIcon; // Usamos como alternativa
export const NoSymbolIcon = XIcon;
export const ShieldCheckIcon = UserIcon; // Substituição
export const ShieldIcon = UserIcon; // Substituição
export const SpeakerWaveIcon = BellIcon;
export const XCircleIcon = XIcon;
export const NewspaperIcon = ClockIcon; // Usamos como alternativa 