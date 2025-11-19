# Phase 5: Core Marketplace Features - Implementation Guide

## Overview
This guide covers implementing the core marketplace features: ad management, messaging, favorites, search, and user profiles.

## Feature 1: Enhanced Ad Management

### 1.1 Create Ad Improvements

**Current Status:** ✅ Basic form exists
**Improvements Needed:**
- Image upload to Supabase Storage
- Real-time image preview
- Drag & drop support
- Image compression
- Progress indicators

**Implementation:**
```javascript
// src/lib/adService.js
export const uploadAdImages = async (files, adId) => {
  const uploadedUrls = []
  
  for (const file of files) {
    const { data, error } = await supabase.storage
      .from('ad-images')
      .upload(`${adId}/${file.name}`, file)
    
    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage
      .from('ad-images')
      .getPublicUrl(`${adId}/${file.name}`)
    
    uploadedUrls.push(publicUrl)
  }
  
  return uploadedUrls
}

export const createAd = async (adData, images) => {
  // Create ad in database
  const { data: ad, error: adError } = await supabase
    .from('ads')
    .insert([adData])
    .select()
    .single()
  
  if (adError) throw adError
  
  // Upload images
  if (images.length > 0) {
    const imageUrls = await uploadAdImages(images, ad.id)
    
    // Update ad with image URLs
    const { error: updateError } = await supabase
      .from('ads')
      .update({ images: imageUrls })
      .eq('id', ad.id)
    
    if (updateError) throw updateError
  }
  
  return ad
}
```

### 1.2 Edit Ad Functionality

**Implementation:**
```javascript
export const updateAd = async (adId, updates) => {
  const { data, error } = await supabase
    .from('ads')
    .update(updates)
    .eq('id', adId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteAd = async (adId) => {
  // Delete images from storage
  const { data: files } = await supabase.storage
    .from('ad-images')
    .list(adId)
  
  if (files) {
    for (const file of files) {
      await supabase.storage
        .from('ad-images')
        .remove([`${adId}/${file.name}`])
    }
  }
  
  // Delete ad from database
  const { error } = await supabase
    .from('ads')
    .delete()
    .eq('id', adId)
  
  if (error) throw error
}
```

### 1.3 Ad Status Management

**Database Schema Update:**
```sql
ALTER TABLE ads ADD COLUMN status TEXT DEFAULT 'active';
-- Values: 'active', 'inactive', 'sold', 'archived'

ALTER TABLE ads ADD COLUMN views INT DEFAULT 0;
ALTER TABLE ads ADD COLUMN favorites_count INT DEFAULT 0;
ALTER TABLE ads ADD COLUMN messages_count INT DEFAULT 0;
```

## Feature 2: Messaging System

### 2.1 Database Schema

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  receiver_id UUID NOT NULL REFERENCES auth.users(id),
  ad_id UUID REFERENCES ads(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_1_id UUID NOT NULL REFERENCES auth.users(id),
  user_2_id UUID NOT NULL REFERENCES auth.users(id),
  last_message_id UUID REFERENCES messages(id),
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.2 Message Service

```javascript
// src/lib/messageService.js
export const sendMessage = async (receiverId, content, adId = null) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('messages')
    .insert([{
      sender_id: user.id,
      receiver_id: receiverId,
      ad_id: adId,
      content
    }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getConversations = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      user_1:profiles!user_1_id(*),
      user_2:profiles!user_2_id(*),
      last_message:messages(*)
    `)
    .or(`user_1_id.eq.${user.id},user_2_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getMessages = async (conversationId) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data
}

export const markAsRead = async (messageId) => {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId)
  
  if (error) throw error
}
```

### 2.3 Real-time Messaging with Supabase Realtime

```javascript
// Subscribe to new messages
export const subscribeToMessages = (conversationId, callback) => {
  const subscription = supabase
    .from(`messages:conversation_id=eq.${conversationId}`)
    .on('INSERT', payload => {
      callback(payload.new)
    })
    .subscribe()
  
  return subscription
}
```

## Feature 3: Favorites System

### 3.1 Database Schema

```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  ad_id UUID NOT NULL REFERENCES ads(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ad_id)
);
```

### 3.2 Favorites Service

```javascript
// src/lib/favoriteService.js
export const addToFavorites = async (adId) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('favorites')
    .insert([{
      user_id: user.id,
      ad_id: adId
    }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const removeFromFavorites = async (adId) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('ad_id', adId)
  
  if (error) throw error
}

export const isFavorited = async (adId) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('ad_id', adId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return !!data
}

export const getUserFavorites = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('favorites')
    .select('ads(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data.map(fav => fav.ads)
}
```

## Feature 4: Advanced Search & Filtering

### 4.1 Search Service

```javascript
// src/lib/searchService.js
export const searchAds = async (filters = {}) => {
  let query = supabase
    .from('ads')
    .select('*')
    .eq('status', 'active')
  
  // Text search
  if (filters.query) {
    query = query.or(
      `title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
    )
  }
  
  // Category filter
  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  
  // Location filter
  if (filters.location) {
    query = query.eq('location', filters.location)
  }
  
  // Price range filter
  if (filters.minPrice) {
    query = query.gte('price', filters.minPrice)
  }
  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice)
  }
  
  // Sorting
  const sortBy = filters.sortBy || 'created_at'
  const ascending = filters.ascending !== false
  query = query.order(sortBy, { ascending })
  
  // Pagination
  const page = filters.page || 1
  const limit = filters.limit || 20
  const offset = (page - 1) * limit
  query = query.range(offset, offset + limit - 1)
  
  const { data, error, count } = await query
  
  if (error) throw error
  return { data, count, page, limit }
}

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('ads')
    .select('category')
    .distinct()
  
  if (error) throw error
  return data.map(item => item.category).filter(Boolean)
}

export const getLocations = async () => {
  const { data, error } = await supabase
    .from('ads')
    .select('location')
    .distinct()
  
  if (error) throw error
  return data.map(item => item.location).filter(Boolean)
}
```

## Feature 5: User Profiles

### 5.1 Enhanced Profile Schema

```sql
ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN bio TEXT;
ALTER TABLE profiles ADD COLUMN rating DECIMAL(3,2) DEFAULT 5.0;
ALTER TABLE profiles ADD COLUMN total_reviews INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN response_time_hours INT;
ALTER TABLE profiles ADD COLUMN verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN seller_since TIMESTAMP WITH TIME ZONE;

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID NOT NULL REFERENCES auth.users(id),
  reviewed_user_id UUID NOT NULL REFERENCES auth.users(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  ad_id UUID REFERENCES ads(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5.2 Profile Service

```javascript
// src/lib/profileService.js
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export const updateUserProfile = async (updates) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const uploadProfileImage = async (file) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`${user.id}/avatar`, file, { upsert: true })
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(`${user.id}/avatar`)
  
  return publicUrl
}

export const getUserReviews = async (userId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('reviewed_user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const addReview = async (reviewedUserId, rating, comment, adId) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('reviews')
    .insert([{
      reviewer_id: user.id,
      reviewed_user_id: reviewedUserId,
      rating,
      comment,
      ad_id: adId
    }])
    .select()
    .single()
  
  if (error) throw error
  return data
}
```

## Implementation Timeline

### Week 1: Ad Management
- [ ] Image upload functionality
- [ ] Edit ad page
- [ ] Delete ad functionality
- [ ] Ad status management
- [ ] Testing

### Week 2: Messaging
- [ ] Messaging database setup
- [ ] Send message functionality
- [ ] Conversation list
- [ ] Message history
- [ ] Real-time updates
- [ ] Testing

### Week 3: Favorites & Search
- [ ] Favorites functionality
- [ ] Advanced search
- [ ] Filtering
- [ ] Sorting
- [ ] Pagination
- [ ] Testing

### Week 4: User Profiles
- [ ] Enhanced profile page
- [ ] Profile image upload
- [ ] User reviews
- [ ] Rating system
- [ ] Testing

## Database Migrations

Run these SQL commands in Supabase SQL Editor:

```sql
-- Create ads table if not exists
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active',
  views INT DEFAULT 0,
  favorites_count INT DEFAULT 0,
  messages_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  receiver_id UUID NOT NULL REFERENCES auth.users(id),
  ad_id UUID REFERENCES ads(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  ad_id UUID NOT NULL REFERENCES ads(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ad_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID NOT NULL REFERENCES auth.users(id),
  reviewed_user_id UUID NOT NULL REFERENCES auth.users(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  ad_id UUID REFERENCES ads(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
```

## Testing Checklist

- [ ] Create ad with images
- [ ] Edit ad
- [ ] Delete ad
- [ ] Send message
- [ ] Receive message
- [ ] View conversation
- [ ] Add to favorites
- [ ] Remove from favorites
- [ ] Search with filters
- [ ] View user profile
- [ ] Add review
- [ ] View reviews

## Next Steps

1. Choose which feature to implement first
2. Set up database tables
3. Create service functions
4. Build UI components
5. Test thoroughly
6. Deploy to production

## Resources

- Supabase Docs: https://supabase.com/docs
- React Hooks: https://react.dev/reference/react
- Tailwind CSS: https://tailwindcss.com/docs
- Lucide Icons: https://lucide.dev
