// Tipos de usuário
export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  bio: string | null;
  points: number;
  level: number;
  isPro: boolean;
  createdAt: string;
  coverImage: string | null;
  city: string | null;
  state: string | null;
  followers?: number;
  following?: number;
  location?: {
    city: string;
    state: string;
  } | null;
  work?: string;
  website?: string;
  postCount?: number;
  avatarUrl?: string;
  updatedAt?: string;
  stats?: {
    followers: number;
    following: number;
    posts: number;
    battles: number;
  };
  phone?: string;
  birthDate?: string | null;
  gender?: string;
  relationship?: string;
  education?: string;
  company?: string;
  name?: string;
  premium?: boolean;
  avatar?: string;
  achievements?: Achievement[];
  settings?: UserSettings;
  token?: string;
  privacyPosts?: string;
  privacyProfile?: string;
  passwordHash?: string;
}

export interface UserSettings {
  userId: string;
  theme?: string;
  language?: string;
  notifications?: any;
  privacy?: any;
  security?: any;
  contentPreferences?: any;
  feedSettings?: any;
  messages?: any;
  appearance?: any;
  activity?: any;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  points?: number;
  earnedAt?: string;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  imageURL?: string;
  tags: string[];
  reactions: {
    quaseAcreditei: number;
    hahaha: number;
    mentiraEpica: number;
  };
  userReactions: Record<string, boolean>;
  judgements: {
    crivel: number;
    inventiva: number;
    totalmentePirada: number;
  };
  userJudgements: Record<string, boolean>;
  createdAt: string;
  isGenerated?: boolean;
  commentCount?: number;
  user?: User;
}

export interface Storyment {
  id: string;
  userId: string;
  content: string;
  imageURL?: string;
  createdAt: string;
  expiresAt: string;
}

export interface Battle {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'finished' | 'upcoming';
  start_date: string;
  created_at: string;
  participants: string[];
  end_date?: string;
}

export interface BattleParticipant {
  id: string;
  battle_id: string;
  user_id: string;
  content: string;
  votes: number;
  created_at: string;
  updated_at?: string;
  battle?: Battle;
  user?: User;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  reactions?: {
    like: number;
    dislike: number;
  };
  userReactions?: Record<string, boolean>;
  user?: User;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  reward: number;
  startDate: string;
  endDate: string;
  participants: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  createdAt: string;
  isRead: boolean;
  roomId?: string;
}

export interface ChatRoom {
  id: string;
  name?: string;
  type: 'private' | 'global';
  participants: User[];
  createdAt: string;
  updatedAt?: string;
  lastMessage?: ChatMessage;
}

export enum ReactionType {
  QuaseAcreditei = 'quaseAcreditei',
  Hahaha = 'hahaha',
  MentiraEpica = 'mentiraEpica'
}

export enum JudgementType {
  Incrivel = 'crivel',
  Inventiva = 'inventiva',
  TotalmentePirada = 'totalmentePirada'
}

export const judgementLabels = {
  crivel: 'Crível',
  inventiva: 'Inventiva',
  totalmentePirada: 'Totalmente Pirada'
};

export interface Notification {
  id: string;
  user_id: string;
  type: 'reaction' | 'comment' | 'follow' | 'system';
  content: string;
  is_read: boolean;
  createdAt: string;
  related_id?: string | null;
  sender_id: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
} 