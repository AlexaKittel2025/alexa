// Utilitários para gerar avatares e imagens de usuários

// Funções para gerar URLs de avatares únicos
export const generateAvatar = (options: {
  gender?: 'men' | 'women';
  seed?: string;
  style?: 'pixel' | 'identicon' | 'avataaars' | 'bottts' | 'initials';
  name?: string;
}): string => {
  const { gender = 'men', seed, style = 'identicon', name } = options;
  
  // Usar diferentes provedores de avatar
  const providers = [
    // DiceBear Avatars (com diferentes estilos)
    () => {
      const styles = ['avataaars', 'bottts', 'micah', 'personas', 'pixel-art', 'identicon'];
      const selectedStyle = style || styles[Math.floor(Math.random() * styles.length)];
      const seedParam = seed || Math.random().toString(36).substring(7);
      return `https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${seedParam}`;
    },
    // UI Avatars (com iniciais)
    () => {
      const background = Math.floor(Math.random()*16777215).toString(16);
      const color = 'ffffff';
      const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
      return `https://ui-avatars.com/api/?name=${initials}&background=${background}&color=${color}&size=200&rounded=true`;
    },
    // Random User (pessoas reais)
    () => {
      const id = Math.floor(Math.random() * 99) + 1;
      return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
    },
    // Picsum (fotos aleatórias)
    () => {
      const id = Math.floor(Math.random() * 100) + 200;
      return `https://i.pravatar.cc/300?img=${id}`;
    }
  ];
  
  // Escolher um provedor aleatoriamente
  const provider = providers[Math.floor(Math.random() * providers.length)];
  return provider();
};

// Gerar avatar com estilo específico
export const generateStyledAvatar = (name: string, style: string = 'avataaars'): string => {
  const seed = name.toLowerCase().replace(/\s/g, '');
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

// Gerar avatar baseado em iniciais
export const generateInitialsAvatar = (name: string, bgColor?: string): string => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  const background = bgColor || Math.floor(Math.random()*16777215).toString(16);
  return `https://ui-avatars.com/api/?name=${initials}&background=${background}&color=fff&size=200&rounded=true`;
};

// Gerar avatar de pessoa real aleatória
export const generateRealPersonAvatar = (gender?: 'men' | 'women'): string => {
  const selectedGender = gender || (Math.random() > 0.5 ? 'men' : 'women');
  const id = Math.floor(Math.random() * 99) + 1;
  return `https://randomuser.me/api/portraits/${selectedGender}/${id}.jpg`;
};

// Gerar imagem de capa aleatória
export const generateCoverImage = (): string => {
  const coverImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1500&q=80',
    'https://images.unsplash.com/photo-1502472584811-0a2f2feb8968?w=1500&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1500&q=80',
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1500&q=80',
    'https://images.unsplash.com/photo-1517816743373-6c0dc65d2e0d?w=1500&q=80',
    'https://images.unsplash.com/photo-1533470192478-9897d90d830c?w=1500&q=80',
    'https://images.unsplash.com/photo-1493807742375-fbc46d996e8f?w=1500&q=80',
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1500&q=80',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1500&q=80',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1500&q=80'
  ];
  
  return coverImages[Math.floor(Math.random() * coverImages.length)];
};

// Gerar imagem de post aleatória
export const generatePostImage = (): string => {
  const postImages = [
    'https://picsum.photos/600/600?random=' + Math.random(),
    'https://source.unsplash.com/600x600/?funny,' + Math.random(),
    'https://loremflickr.com/600/600/funny?random=' + Math.random(),
    'https://placekitten.com/600/600',
    'https://placebear.com/600/600',
    'https://www.placecage.com/600/600',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560015534-cee980c94d0e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop'
  ];
  
  return postImages[Math.floor(Math.random() * postImages.length)];
};