// =============================================
//  RHYTHMIX — Sample Songs Dataset
//  50 songs across 4 moods with rich metadata
// =============================================

export const SAMPLE_SONGS = [
  // ── HAPPY ──
  { id: 1,  name: "Golden Hour",          artist: "JVKE",              mood: "happy",  play_count: 9800, likes: 7200, last_played: null, duration: "3:22" },
  { id: 2,  name: "Good as Hell",         artist: "Lizzo",             mood: "happy",  play_count: 8500, likes: 6800, last_played: null, duration: "2:39" },
  { id: 3,  name: "Levitating",           artist: "Dua Lipa",          mood: "happy",  play_count: 9200, likes: 7600, last_played: null, duration: "3:23" },
  { id: 4,  name: "Happy",                artist: "Pharrell Williams", mood: "happy",  play_count: 9900, likes: 8100, last_played: null, duration: "3:53" },
  { id: 5,  name: "Can't Stop the Feeling",artist: "Justin Timberlake",mood: "happy",  play_count: 8800, likes: 7000, last_played: null, duration: "3:56" },
  { id: 6,  name: "Shake It Off",         artist: "Taylor Swift",      mood: "happy",  play_count: 9600, likes: 8400, last_played: null, duration: "3:39" },
  { id: 7,  name: "Uptown Funk",          artist: "Mark Ronson ft. Bruno Mars", mood: "happy", play_count: 9700, likes: 8600, last_played: null, duration: "4:30" },
  { id: 8,  name: "Walking on Sunshine",  artist: "Katrina & The Waves",mood: "happy", play_count: 7200, likes: 5900, last_played: null, duration: "3:58" },
  { id: 9,  name: "Best Day of My Life",  artist: "American Authors",  mood: "happy",  play_count: 7800, likes: 6200, last_played: null, duration: "3:14" },
  { id: 10, name: "Sugar",                artist: "Maroon 5",          mood: "happy",  play_count: 8300, likes: 6700, last_played: null, duration: "3:55" },
  { id: 11, name: "Sunflower",            artist: "Post Malone",       mood: "happy",  play_count: 9100, likes: 7800, last_played: null, duration: "2:38" },
  { id: 12, name: "Dynamite",             artist: "BTS",               mood: "happy",  play_count: 9400, likes: 8200, last_played: null, duration: "3:19" },

  // ── SAD ──
  { id: 13, name: "Someone Like You",     artist: "Adele",             mood: "sad",    play_count: 9500, likes: 8800, last_played: null, duration: "4:45" },
  { id: 14, name: "The Night We Met",     artist: "Lord Huron",        mood: "sad",    play_count: 7400, likes: 6600, last_played: null, duration: "3:28" },
  { id: 15, name: "Skinny Love",          artist: "Bon Iver",          mood: "sad",    play_count: 7000, likes: 6400, last_played: null, duration: "3:59" },
  { id: 16, name: "Fix You",              artist: "Coldplay",          mood: "sad",    play_count: 8900, likes: 7700, last_played: null, duration: "4:55" },
  { id: 17, name: "Hurt",                 artist: "Johnny Cash",       mood: "sad",    play_count: 7600, likes: 7000, last_played: null, duration: "3:38" },
  { id: 18, name: "The Sound of Silence", artist: "Simon & Garfunkel", mood: "sad",    play_count: 7200, likes: 6500, last_played: null, duration: "3:05" },
  { id: 19, name: "Everybody Hurts",      artist: "R.E.M.",            mood: "sad",    play_count: 6900, likes: 6100, last_played: null, duration: "5:17" },
  { id: 20, name: "Tears in Heaven",      artist: "Eric Clapton",      mood: "sad",    play_count: 7100, likes: 6300, last_played: null, duration: "4:33" },
  { id: 21, name: "When the Party's Over",artist: "Billie Eilish",     mood: "sad",    play_count: 8800, likes: 7900, last_played: null, duration: "3:16" },
  { id: 22, name: "All I Want",           artist: "Kodaline",          mood: "sad",    play_count: 7500, likes: 6800, last_played: null, duration: "5:23" },
  { id: 23, name: "Liability",            artist: "Lorde",             mood: "sad",    play_count: 7300, likes: 6700, last_played: null, duration: "3:01" },
  { id: 24, name: "Let Her Go",           artist: "Passenger",         mood: "sad",    play_count: 8200, likes: 7300, last_played: null, duration: "4:17" },

  // ── CHILL ──
  { id: 25, name: "Redbone",              artist: "Childish Gambino",  mood: "chill",  play_count: 9000, likes: 7800, last_played: null, duration: "5:26" },
  { id: 26, name: "Slow Burn",            artist: "Kacey Musgraves",   mood: "chill",  play_count: 7600, likes: 6500, last_played: null, duration: "3:44" },
  { id: 27, name: "Electric Feel",        artist: "MGMT",              mood: "chill",  play_count: 8100, likes: 6900, last_played: null, duration: "3:49" },
  { id: 28, name: "Tenerife Sea",         artist: "Ed Sheeran",        mood: "chill",  play_count: 7800, likes: 7100, last_played: null, duration: "4:01" },
  { id: 29, name: "Featherstone",         artist: "The Paper Kites",   mood: "chill",  play_count: 5900, likes: 5400, last_played: null, duration: "3:07" },
  { id: 30, name: "Pink + White",         artist: "Frank Ocean",       mood: "chill",  play_count: 8600, likes: 7500, last_played: null, duration: "3:02" },
  { id: 31, name: "The Less I Know The Better", artist: "Tame Impala", mood: "chill",  play_count: 9300, likes: 8000, last_played: null, duration: "3:36" },
  { id: 32, name: "Ribs",                 artist: "Lorde",             mood: "chill",  play_count: 7100, likes: 6300, last_played: null, duration: "3:49" },
  { id: 33, name: "Bloom",                artist: "The Paper Kites",   mood: "chill",  play_count: 6200, likes: 5700, last_played: null, duration: "2:57" },
  { id: 34, name: "Sunday Morning",       artist: "Maroon 5",          mood: "chill",  play_count: 7900, likes: 7000, last_played: null, duration: "4:03" },
  { id: 35, name: "From Eden",            artist: "Hozier",            mood: "chill",  play_count: 7400, likes: 6600, last_played: null, duration: "4:22" },
  { id: 36, name: "Soak Up the Sun",      artist: "Sheryl Crow",       mood: "chill",  play_count: 6700, likes: 5900, last_played: null, duration: "4:51" },

  // ── PARTY ──
  { id: 37, name: "Blinding Lights",      artist: "The Weeknd",        mood: "party",  play_count: 9999, likes: 9200, last_played: null, duration: "3:20" },
  { id: 38, name: "Don't Start Now",      artist: "Dua Lipa",          mood: "party",  play_count: 9400, likes: 8300, last_played: null, duration: "3:27" },
  { id: 39, name: "HUMBLE.",              artist: "Kendrick Lamar",    mood: "party",  play_count: 9600, likes: 8700, last_played: null, duration: "2:57" },
  { id: 40, name: "God's Plan",           artist: "Drake",             mood: "party",  play_count: 9800, likes: 8900, last_played: null, duration: "3:18" },
  { id: 41, name: "Sorry Not Sorry",      artist: "Demi Lovato",       mood: "party",  play_count: 8400, likes: 7400, last_played: null, duration: "3:27" },
  { id: 42, name: "Turn Down for What",   artist: "DJ Snake & Lil Jon",mood: "party",  play_count: 8700, likes: 7500, last_played: null, duration: "3:33" },
  { id: 43, name: "SICKO MODE",           artist: "Travis Scott",      mood: "party",  play_count: 9200, likes: 8100, last_played: null, duration: "5:12" },
  { id: 44, name: "Rockstar",             artist: "Post Malone ft. 21 Savage", mood: "party", play_count: 9100, likes: 8000, last_played: null, duration: "3:38" },
  { id: 45, name: "Bad Guy",              artist: "Billie Eilish",     mood: "party",  play_count: 9500, likes: 8500, last_played: null, duration: "3:14" },
  { id: 46, name: "Boom",                 artist: "Tiësto",            mood: "party",  play_count: 8300, likes: 7100, last_played: null, duration: "2:58" },
  { id: 47, name: "Closer",              artist: "The Chainsmokers",   mood: "party",  play_count: 9000, likes: 7900, last_played: null, duration: "4:05" },
  { id: 48, name: "One Dance",            artist: "Drake",             mood: "party",  play_count: 9300, likes: 8200, last_played: null, duration: "2:54" },
  { id: 49, name: "Shape of You",         artist: "Ed Sheeran",        mood: "party",  play_count: 9700, likes: 9100, last_played: null, duration: "3:54" },
  { id: 50, name: "Starboy",              artist: "The Weeknd ft. Daft Punk", mood: "party", play_count: 9400, likes: 8400, last_played: null, duration: "3:50" },
];

// Dummy user credentials
export const USERS = [
  { username: "demo",  password: "demo123",  name: "Alex Rivera",   avatar: "AR" },
  { username: "admin", password: "admin123", name: "Sam Chen",      avatar: "SC" },
  { username: "music", password: "music123", name: "Jordan Park",   avatar: "JP" },
];
