import { Post } from "@/services/postsService";

export const dummyReelsData: Post[] = [
  // Images
  {
    id: "img-1",
    title: "Sunset Portrait Session",
    description: "A beautiful golden hour portrait session capturing the essence of natural light and emotion.",
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1494790108755-2616c8e72cc4?w=500&h=600&fit=crop",
    creator_name: "Emma Thompson",
    creator_profession: "Photographer",
    category: "Photography",
    like_count: 124,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    created_by: "user-1",
    tags: ["photography", "portrait", "golden-hour"],
    external_url: "https://emmathompson.com/portfolio"
  },
  {
    id: "img-2", 
    title: "Fashion Editorial",
    description: "High-fashion editorial shoot featuring bold colors and dramatic lighting techniques.",
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=600&fit=crop",
    creator_name: "Marcus Chen",
    creator_profession: "Fashion Photographer",
    category: "Fashion",
    like_count: 89,
    created_at: "2024-01-14T15:20:00Z",
    updated_at: "2024-01-14T15:20:00Z",
    created_by: "user-2",
    tags: ["fashion", "editorial", "photography"]
  },

  // Videos
  {
    id: "vid-1",
    title: "Cinematic Short Film",
    description: "A 3-minute cinematic piece exploring themes of memory and time through visual storytelling.",
    media_type: "video",
    media_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    creator_name: "Alex Rodriguez",
    creator_profession: "Filmmaker",
    category: "Cinematography",
    like_count: 256,
    created_at: "2024-01-13T09:15:00Z",
    updated_at: "2024-01-13T09:15:00Z",
    created_by: "user-3",
    tags: ["film", "cinematography", "short-film"]
  },
  {
    id: "vid-2",
    title: "Dance Performance",
    description: "Contemporary dance performance showcasing fluid movements and emotional expression.",
    media_type: "video", 
    media_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    creator_name: "Sofia Martinez",
    creator_profession: "Dancer",
    category: "Performance",
    like_count: 178,
    created_at: "2024-01-12T14:45:00Z",
    updated_at: "2024-01-12T14:45:00Z",
    created_by: "user-4",
    tags: ["dance", "performance", "contemporary"]
  },

  // Documents
  {
    id: "doc-1",
    title: "Film Production Guide",
    description: "Comprehensive guide for independent filmmakers covering pre-production to post-production workflows.",
    media_type: "document",
    media_url: "/sample.pdf",
    creator_name: "David Wilson",
    creator_profession: "Producer",
    category: "Education",
    like_count: 67,
    created_at: "2024-01-11T11:30:00Z",
    updated_at: "2024-01-11T11:30:00Z",
    created_by: "user-5",
    tags: ["education", "filmmaking", "guide"]
  },
  {
    id: "doc-2",
    title: "Acting Workshop Materials", 
    description: "Workshop materials and exercises for method acting techniques and character development.",
    media_type: "document",
    media_url: "/workshop.pdf",
    creator_name: "Rachel Green",
    creator_profession: "Acting Coach",
    category: "Education",
    like_count: 43,
    created_at: "2024-01-10T16:20:00Z",
    updated_at: "2024-01-10T16:20:00Z",
    created_by: "user-6",
    tags: ["acting", "workshop", "education"]
  },

  // Scripts
  {
    id: "script-1",
    title: "The Last Coffee Shop",
    description: "A heartwarming short screenplay about connections made in unexpected places during difficult times.",
    media_type: "script",
    media_url: "/script.pdf",
    creator_name: "James Patterson",
    creator_profession: "Screenwriter",
    category: "Writing",
    like_count: 92,
    created_at: "2024-01-09T13:10:00Z",
    updated_at: "2024-01-09T13:10:00Z",
    created_by: "user-7",
    tags: ["screenplay", "script", "writing"]
  },
  {
    id: "script-2",
    title: "Midnight Conversations",
    description: "A dialogue-driven piece exploring the complexity of human relationships through late-night conversations.",
    media_type: "script", 
    media_url: "/midnight.pdf",
    creator_name: "Anna Taylor",
    creator_profession: "Writer",
    category: "Writing",
    like_count: 76,
    created_at: "2024-01-08T20:30:00Z",
    updated_at: "2024-01-08T20:30:00Z",
    created_by: "user-8",
    tags: ["script", "dialogue", "writing"]
  },

  // Audio
  {
    id: "audio-1",
    title: "Acoustic Session",
    description: "Intimate acoustic performance featuring original compositions with guitar and vocals.",
    media_type: "audio",
    media_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    creator_name: "Lucas Brown",
    creator_profession: "Singer-Songwriter",
    category: "Music",
    like_count: 134,
    created_at: "2024-01-07T18:45:00Z",
    updated_at: "2024-01-07T18:45:00Z",
    created_by: "user-9",
    tags: ["music", "acoustic", "original"]
  },
  {
    id: "audio-2",
    title: "Podcast Episode: Behind the Scenes",
    description: "Exclusive behind-the-scenes discussion about the creative process in independent film production.",
    media_type: "audio",
    media_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    creator_name: "Maya Johnson",
    creator_profession: "Podcast Host",
    category: "Education",
    like_count: 58,
    created_at: "2024-01-06T12:00:00Z",
    updated_at: "2024-01-06T12:00:00Z",
    created_by: "user-10",
    tags: ["podcast", "education", "film"]
  },

  // Additional mixed content
  {
    id: "img-3",
    title: "Behind the Camera",
    description: "Candid moments from a film set showcasing the collaborative nature of filmmaking.",
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&h=600&fit=crop",
    creator_name: "Tom Anderson",
    creator_profession: "Cinematographer", 
    category: "Photography",
    like_count: 156,
    created_at: "2024-01-05T14:20:00Z",
    updated_at: "2024-01-05T14:20:00Z",
    created_by: "user-11",
    tags: ["photography", "behind-the-scenes", "film"]
  },
  {
    id: "vid-3",
    title: "Time-lapse: Set Construction",
    description: "Mesmerizing time-lapse footage of a film set being built from the ground up.",
    media_type: "video",
    media_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    creator_name: "Lisa Chang",
    creator_profession: "Production Designer",
    category: "Behind the Scenes",
    like_count: 203,
    created_at: "2024-01-04T09:30:00Z",
    updated_at: "2024-01-04T09:30:00Z",
    created_by: "user-12",
    tags: ["timelapse", "construction", "film"]
  }
];