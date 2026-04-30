export function buildMoodBuckets(songs) {
  const buckets = new Map([
    ['all', []],
    ['happy', []],
    ['sad', []],
    ['chill', []],
    ['party', []],
  ]);

  songs.forEach((song) => {
    buckets.get('all').push(song);

    if (buckets.has(song.mood) && !isExcludedFromMood(song, song.mood)) {
      buckets.get(song.mood).push(song);
    }
  });

  return buckets;
}

export function filterSongsByQuery(songs, searchQuery) {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return songs;

  return songs.filter((song) =>
    song.name.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query)
  );
}

function isExcludedFromMood(song, mood) {
  return mood === 'happy' && song.name.trim().toLowerCase() === "hips don't lie";
}
