const JAMENDO_API_BASE_URL = 'https://api.jamendo.com/v3.0/tracks/';

const MOOD_TAGS = {
  happy: 'pop',
  sad: 'acoustic',
  chill: 'chillout',
  party: 'dance',
};

const toDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getJamendoClientId = () => process.env.REACT_APP_JAMENDO_CLIENT_ID?.trim() || '';

export async function fetchJamendoTracks({ clientId, mood = 'all', searchQuery = '' }) {
  if (!clientId) return [];

  const params = new URLSearchParams({
    client_id: clientId,
    format: 'json',
    limit: '80',
    imagesize: '300',
    audioformat: 'mp31',
    include: 'musicinfo',
    groupby: 'artist_id',
  });

  if (searchQuery.trim()) {
    params.set('search', searchQuery.trim());
  } else {
    params.set('featured', '1');
    params.set('order', 'popularity_total');
  }

  const response = await fetch(`${JAMENDO_API_BASE_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Jamendo request failed with status ${response.status}`);
  }

  const data = await response.json();
  const results = Array.isArray(data.results) ? data.results : [];

  return results.map((track) => ({
    id: `jamendo-${track.id}`,
    sourceId: track.id,
    source: 'jamendo',
    name: track.name,
    artist: track.artist_name,
    mood: guessMood(track),
    play_count: Number(track.listens_total || track.stats?.listens_total || 0),
    likes: Number(track.likes || track.stats?.likes || 0),
    last_played: null,
    duration: toDuration(Number(track.duration || 0)),
    audioUrl: track.audio,
    image: track.album_image || track.image || '',
    album: track.album_name || '',
    shareUrl: track.shareurl || '',
  }));
}

function guessMood(track) {
  const tags = [
    ...(track.musicinfo?.tags?.genres || []),
    ...(track.musicinfo?.tags?.vartags || []),
    ...(track.musicinfo?.tags?.instruments || []),
  ].map((tag) => String(tag).toLowerCase());

  if (matchesMood(tags, MOOD_TAGS.party, ['dance', 'electronic', 'house', 'techno', 'hiphop', 'disco', 'club'])) {
    return 'party';
  }
  if (matchesMood(tags, MOOD_TAGS.chill, ['ambient', 'chillout', 'relaxation', 'lounge', 'downtempo', 'instrumental'])) {
    return 'chill';
  }
  if (matchesMood(tags, MOOD_TAGS.sad, ['acoustic', 'piano', 'sad', 'melancholic', 'ballad', 'soft'])) {
    return 'sad';
  }
  return 'happy';
}

function matchesMood(tags, primaryTag, fallbackTags) {
  return tags.some((tag) => tag === primaryTag || fallbackTags.includes(tag));
}
