export interface User {
  id: string
  name: string
  age: number
  location: string
  bio: string
  photos: string[]
  interests: string[]
  occupation: string
}

export const demoUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 28,
    location: 'New York, NY',
    bio: 'Love traveling, coffee, and good conversations. Looking for someone to share adventures with!',
    photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400'],
    interests: ['Travel', 'Photography', 'Yoga', 'Cooking'],
    occupation: 'Marketing Manager'
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 32,
    location: 'San Francisco, CA',
    bio: 'Tech enthusiast, foodie, and weekend hiker. Always up for trying new restaurants!',
    photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'],
    interests: ['Technology', 'Hiking', 'Food', 'Reading'],
    occupation: 'Software Engineer'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    age: 26,
    location: 'Los Angeles, CA',
    bio: 'Artist and dog lover. Passionate about creativity and making the world a better place.',
    photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'],
    interests: ['Art', 'Dogs', 'Volunteering', 'Music'],
    occupation: 'Graphic Designer'
  },
  {
    id: '4',
    name: 'David Thompson',
    age: 35,
    location: 'Chicago, IL',
    bio: 'Fitness coach and adventure seeker. Love outdoor activities and staying active!',
    photos: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'],
    interests: ['Fitness', 'Outdoor Sports', 'Travel', 'Cooking'],
    occupation: 'Personal Trainer'
  },
  {
    id: '5',
    name: 'Jessica Martinez',
    age: 29,
    location: 'Austin, TX',
    bio: 'Bookworm, coffee addict, and nature enthusiast. Looking for meaningful connections.',
    photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400'],
    interests: ['Reading', 'Nature', 'Coffee', 'Writing'],
    occupation: 'Writer'
  },
  {
    id: '6',
    name: 'Ryan Park',
    age: 31,
    location: 'Seattle, WA',
    bio: 'Musician and food lover. Always exploring new sounds and flavors in the city.',
    photos: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
    interests: ['Music', 'Food', 'Concerts', 'Gaming'],
    occupation: 'Musician'
  }
]

export const currentUser: User = {
  id: 'current',
  name: 'You',
  age: 30,
  location: 'Your City',
  bio: 'Edit your profile to tell others about yourself!',
  photos: ['https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400'],
  interests: ['Add your interests'],
  occupation: 'Your Occupation'
}
