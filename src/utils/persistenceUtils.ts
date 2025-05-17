// Utilitários para persistência de dados no localStorage

export interface PersistedPostData {
  postId: string;
  isLiked: boolean;
  likeCount: number;
  comments: Comment[];
  isSaved: boolean;
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  createdAt: string;
}

export interface BattleVote {
  battleId: string;
  votedFor: 'left' | 'right';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    enabled: boolean;
    email: boolean;
    push: boolean;
    mentions: boolean;
    newFollowers: boolean;
    likes: boolean;
    comments: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showEmail: boolean;
    showFollowers: boolean;
    showFollowing: boolean;
    showOnlineStatus: boolean;
    activityVisibility: string;
    searchVisibility: string;
    shareProfile: boolean;
    contentVisibility: string;
    commentPermission: string;
    showShare: boolean;
    tagPermission: string;
    allowMentions: boolean;
  };
  security: {
    blockedUsers: string[];
    reportedUsers: string[];
    twoFactorEnabled: boolean;
    loginNotifications: boolean;
    allowAccountRecovery: boolean;
  };
  interface: {
    darkMode: boolean;
    compactMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
    colorScheme: string;
  };
}

export interface FollowData {
  userId: string;
  following: string[];
  followers: string[];
}

export interface PostDraft {
  content: string;
  tags: string[];
  imagePreview?: string;
  savedAt: string;
}

// Chaves do localStorage
const LIKES_KEY = 'mentei_post_likes';
const COMMENTS_KEY = 'mentei_post_comments';
const SAVED_POSTS_KEY = 'savedPosts';
const POST_DATA_KEY = 'mentei_post_data';
const BATTLE_VOTES_KEY = 'mentei_battle_votes';
const CHAT_MESSAGES_KEY = 'mentei_chat_messages';
const USER_SETTINGS_KEY = 'mentei_user_settings';
const FOLLOW_DATA_KEY = 'mentei_follow_data';
const USER_STATS_KEY = 'mentei_user_stats';
const POST_DRAFT_KEY = 'mentei_post_draft';

// Salvar dados do post
export const savePostData = (postId: string, data: Partial<PersistedPostData>) => {
  const allPostData = JSON.parse(localStorage.getItem(POST_DATA_KEY) || '{}');
  allPostData[postId] = {
    ...allPostData[postId],
    ...data,
    postId
  };
  localStorage.setItem(POST_DATA_KEY, JSON.stringify(allPostData));
};

// Carregar dados do post
export const loadPostData = (postId: string): PersistedPostData | null => {
  const allPostData = JSON.parse(localStorage.getItem(POST_DATA_KEY) || '{}');
  return allPostData[postId] || null;
};

// Salvar curtida
export const saveLike = (postId: string, isLiked: boolean, likeCount: number) => {
  const savedData = loadPostData(postId) || {} as any;
  savePostData(postId, {
    ...savedData,
    isLiked,
    likeCount
  });
};

// Salvar comentários
export const saveComments = (postId: string, comments: Comment[]) => {
  const savedData = loadPostData(postId) || {} as any;
  savePostData(postId, {
    ...savedData,
    comments
  });
};

// Salvar posts salvos
export const saveSavedPost = (postId: string, isSaved: boolean) => {
  const savedData = loadPostData(postId) || {} as any;
  savePostData(postId, {
    ...savedData,
    isSaved
  });
  
  // Também mantém a lista de IDs salvos para compatibilidade
  const savedPosts = JSON.parse(localStorage.getItem(SAVED_POSTS_KEY) || '[]');
  if (isSaved) {
    if (!savedPosts.includes(postId)) {
      savedPosts.push(postId);
    }
  } else {
    const index = savedPosts.indexOf(postId);
    if (index > -1) {
      savedPosts.splice(index, 1);
    }
  }
  localStorage.setItem(SAVED_POSTS_KEY, JSON.stringify(savedPosts));
};

// Carregar lista de posts salvos
export const getSavedPostIds = (): string[] => {
  return JSON.parse(localStorage.getItem(SAVED_POSTS_KEY) || '[]');
};

// Verificar se um post está salvo
export const isPostSaved = (postId: string): boolean => {
  const savedData = loadPostData(postId);
  return savedData?.isSaved || false;
};

// Batalhas
export const saveBattleVote = (battleId: string, votedFor: 'left' | 'right') => {
  const votes = JSON.parse(localStorage.getItem(BATTLE_VOTES_KEY) || '[]');
  const newVote: BattleVote = {
    battleId,
    votedFor,
    timestamp: new Date().toISOString()
  };
  
  // Remove voto anterior se existir
  const filteredVotes = votes.filter((v: BattleVote) => v.battleId !== battleId);
  filteredVotes.push(newVote);
  
  localStorage.setItem(BATTLE_VOTES_KEY, JSON.stringify(filteredVotes));
};

export const getBattleVote = (battleId: string): BattleVote | null => {
  const votes = JSON.parse(localStorage.getItem(BATTLE_VOTES_KEY) || '[]');
  return votes.find((v: BattleVote) => v.battleId === battleId) || null;
};

// Chat
export const saveChatMessages = (channel: string, messages: ChatMessage[]) => {
  const key = `${CHAT_MESSAGES_KEY}_${channel}`;
  localStorage.setItem(key, JSON.stringify(messages));
};

export const loadChatMessages = (channel: string): ChatMessage[] => {
  const key = `${CHAT_MESSAGES_KEY}_${channel}`;
  return JSON.parse(localStorage.getItem(key) || '[]');
};

export const addChatMessage = (channel: string, message: Omit<ChatMessage, 'id' | 'createdAt'>) => {
  const messages = loadChatMessages(channel);
  const newMessage: ChatMessage = {
    ...message,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  messages.push(newMessage);
  
  // Limitar a 100 mensagens para não sobrecarregar o localStorage
  if (messages.length > 100) {
    messages.shift();
  }
  
  saveChatMessages(channel, messages);
  return newMessage;
};

// Configurações do usuário
export const saveUserSettings = (settings: UserSettings) => {
  localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));
};

export const loadUserSettings = (): UserSettings | null => {
  const settings = localStorage.getItem(USER_SETTINGS_KEY);
  return settings ? JSON.parse(settings) : null;
};

// Follow/Following
export const saveFollowData = (userId: string, followData: Partial<FollowData>) => {
  const allFollowData = JSON.parse(localStorage.getItem(FOLLOW_DATA_KEY) || '{}');
  allFollowData[userId] = {
    ...allFollowData[userId],
    ...followData,
    userId
  };
  localStorage.setItem(FOLLOW_DATA_KEY, JSON.stringify(allFollowData));
};

export const loadFollowData = (userId: string): FollowData | null => {
  const allFollowData = JSON.parse(localStorage.getItem(FOLLOW_DATA_KEY) || '{}');
  return allFollowData[userId] || null;
};

export const toggleFollow = (currentUserId: string, targetUserId: string, isFollowing: boolean) => {
  // Atualizar dados do usuário atual
  const currentUserData = loadFollowData(currentUserId) || { userId: currentUserId, following: [], followers: [] };
  
  if (isFollowing) {
    if (!currentUserData.following.includes(targetUserId)) {
      currentUserData.following.push(targetUserId);
    }
  } else {
    currentUserData.following = currentUserData.following.filter(id => id !== targetUserId);
  }
  
  saveFollowData(currentUserId, currentUserData);
  
  // Atualizar dados do usuário alvo
  const targetUserData = loadFollowData(targetUserId) || { userId: targetUserId, following: [], followers: [] };
  
  if (isFollowing) {
    if (!targetUserData.followers.includes(currentUserId)) {
      targetUserData.followers.push(currentUserId);
    }
  } else {
    targetUserData.followers = targetUserData.followers.filter(id => id !== currentUserId);
  }
  
  saveFollowData(targetUserId, targetUserData);
};

// Estatísticas do usuário
export const saveUserStats = (userId: string, stats: any) => {
  const allStats = JSON.parse(localStorage.getItem(USER_STATS_KEY) || '{}');
  allStats[userId] = {
    ...allStats[userId],
    ...stats,
    lastUpdated: new Date().toISOString()
  };
  localStorage.setItem(USER_STATS_KEY, JSON.stringify(allStats));
};

export const loadUserStats = (userId: string) => {
  const allStats = JSON.parse(localStorage.getItem(USER_STATS_KEY) || '{}');
  return allStats[userId] || null;
};

// Post Draft
export const savePostDraft = (draft: PostDraft) => {
  localStorage.setItem(POST_DRAFT_KEY, JSON.stringify(draft));
};

export const loadPostDraft = (): PostDraft | null => {
  const draft = localStorage.getItem(POST_DRAFT_KEY);
  return draft ? JSON.parse(draft) : null;
};

export const clearPostDraft = () => {
  localStorage.removeItem(POST_DRAFT_KEY);
};