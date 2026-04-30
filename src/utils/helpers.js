// =============================================
//  RHYTHMIX — Utility Functions & DSA Logic
// =============================================

/**
 * Score formula: score = (0.6 × play_count) + (0.4 × likes)
 * Higher score = more popular
 */
export const getScore = (song) =>
  Math.round(0.6 * song.play_count + 0.4 * song.likes);

export const parseDurationToSeconds = (duration) => {
  const [mins = 0, secs = 0] = String(duration || '0:00').split(':').map(Number);
  return (mins * 60) + secs;
};

export const formatDuration = (seconds) => {
  const safeSeconds = Math.max(0, Math.round(seconds || 0));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getOptimizationValue = (song) => {
  const baseScore = getScore(song);
  if (baseScore > 0) return baseScore;

  // Keep generated mixes useful even when the upstream source has no popularity stats.
  const durationSeconds = parseDurationToSeconds(song.duration);
  return Math.max(1, 400 - Math.min(durationSeconds, 360));
};

// ── Max Heap Priority Queue ──────────────────
class MaxHeap {
  constructor() { this.heap = []; }

  _parent(i) { return Math.floor((i - 1) / 2); }
  _left(i)   { return 2 * i + 1; }
  _right(i)  { return 2 * i + 2; }

  _swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  insert(song) {
    this.heap.push({ song, score: getScore(song) });
    this._bubbleUp(this.heap.length - 1);
  }

  _bubbleUp(i) {
    while (i > 0) {
      const p = this._parent(i);
      if (this.heap[p].score < this.heap[i].score) {
        this._swap(p, i);
        i = p;
      } else break;
    }
  }

  extractMax() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop().song;
    const max = this.heap[0].song;
    this.heap[0] = this.heap.pop();
    this._heapifyDown(0);
    return max;
  }

  _heapifyDown(i) {
    const n = this.heap.length;
    let largest = i;
    const l = this._left(i), r = this._right(i);
    if (l < n && this.heap[l].score > this.heap[largest].score) largest = l;
    if (r < n && this.heap[r].score > this.heap[largest].score) largest = r;
    if (largest !== i) { this._swap(i, largest); this._heapifyDown(largest); }
  }

  /** Extract all in sorted order (descending score) */
  extractAll() {
    const result = [];
    while (this.heap.length > 0) result.push(this.extractMax());
    return result;
  }
}

/** Rank songs by popularity score using Max Heap */
export const rankByPopularity = (songs) => {
  const heap = new MaxHeap();
  songs.forEach(s => heap.insert(s));
  return heap.extractAll();
};

export const buildGreedyPlaylist = (songs, limitSeconds) => {
  const ranked = [...songs]
    .map((song) => {
      const durationSeconds = parseDurationToSeconds(song.duration);
      const optimizationValue = getOptimizationValue(song);
      return {
        song,
        durationSeconds,
        score: optimizationValue,
        density: durationSeconds > 0 ? optimizationValue / durationSeconds : optimizationValue,
      };
    })
    .sort((a, b) => {
      if (b.density !== a.density) return b.density - a.density;
      if (b.score !== a.score) return b.score - a.score;
      return a.durationSeconds - b.durationSeconds;
    });

  const selected = [];
  let totalSeconds = 0;
  let totalScore = 0;

  ranked.forEach((item) => {
    if (totalSeconds + item.durationSeconds <= limitSeconds) {
      selected.push(item.song);
      totalSeconds += item.durationSeconds;
      totalScore += item.score;
    }
  });

  return {
    songs: selected,
    totalSeconds,
    totalScore,
    algorithm: 'Greedy',
  };
};

export const buildOptimalPlaylistDP = (songs, limitSeconds) => {
  const SLOT_SIZE = 15;
  const normalizedSongs = songs.map((song) => ({
    song,
    score: getOptimizationValue(song),
    weight: Math.max(1, Math.ceil(parseDurationToSeconds(song.duration) / SLOT_SIZE)),
    durationSeconds: parseDurationToSeconds(song.duration),
  }));

  const capacity = Math.max(1, Math.floor(limitSeconds / SLOT_SIZE));
  const itemCount = normalizedSongs.length;
  const dp = Array.from({ length: itemCount + 1 }, () => Array(capacity + 1).fill(0));
  const take = Array.from({ length: itemCount + 1 }, () => Array(capacity + 1).fill(false));

  for (let i = 1; i <= itemCount; i += 1) {
    const { score, weight } = normalizedSongs[i - 1];
    for (let cap = 0; cap <= capacity; cap += 1) {
      dp[i][cap] = dp[i - 1][cap];
      if (weight <= cap) {
        const candidate = dp[i - 1][cap - weight] + score;
        if (candidate > dp[i][cap]) {
          dp[i][cap] = candidate;
          take[i][cap] = true;
        }
      }
    }
  }

  const selected = [];
  let totalSeconds = 0;
  let cap = capacity;

  for (let i = itemCount; i >= 1; i -= 1) {
    if (!take[i][cap]) continue;
    const item = normalizedSongs[i - 1];
    selected.push(item.song);
    totalSeconds += item.durationSeconds;
    cap -= item.weight;
  }

  selected.reverse();

  return {
    songs: selected,
    totalSeconds,
    totalScore: dp[itemCount][capacity],
    algorithm: 'Dynamic Programming',
  };
};

/** Format large numbers: 9800 → "9.8K" */
export const formatCount = (n) => {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
};

/** Format timestamp to "Just now", "2m ago", etc. */
export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return null;
  const diff = Date.now() - timestamp;
  const secs  = Math.floor(diff / 1000);
  const mins  = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (secs  < 60)  return 'Just now';
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  return `${days}d ago`;
};

/** Mood emoji map */
export const MOOD_EMOJI = {
  happy: '☀️',
  sad:   '🌧️',
  chill: '🌊',
  party: '🎉',
};

export const MOOD_LABEL = {
  happy: 'Happy',
  sad:   'Sad',
  chill: 'Chill',
  party: 'Party',
};
