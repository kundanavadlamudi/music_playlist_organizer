import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Playlist from '../components/Playlist';
import { SAMPLE_SONGS } from '../data/songs';
import {
  rankByPopularity,
  formatTimeAgo,
  MOOD_EMOJI,
  getScore,
  formatCount,
  buildGreedyPlaylist,
  buildOptimalPlaylistDP,
  formatDuration,
  parseDurationToSeconds,
} from '../utils/helpers';
import { fetchJamendoTracks, getJamendoClientId } from '../utils/jamendo';
import { buildMoodBuckets, filterSongsByQuery } from '../utils/musicIndex';
import styles from './Dashboard.module.css';

const MOODS = ['all', 'happy', 'sad', 'chill', 'party'];
const TABS = ['playlist', 'top10', 'smartmix', 'greedy', 'favorites', 'recent'];
const MIX_BUDGETS = [15, 30, 45, 60];
const FAVORITES_STORAGE_KEY = 'rhythmix-liked-song-ids';

const TAB_LABELS = {
  playlist: 'Playlist',
  top10: 'Top 10',
  smartmix: 'Smart Mix',
  greedy: 'Quick Mix',
  favorites: 'Liked Songs',
  recent: 'Recent',
};

export default function Dashboard() {
  const clientId = getJamendoClientId();
  const audioRef = useRef(null);

  const [apiSongs, setApiSongs] = useState(() => SAMPLE_SONGS.map(s => ({ ...s })));
  const [customSongs, setCustomSongs] = useState([]);
  const [mood, setMood] = useState('all');
  const [tab, setTab] = useState('playlist');
  const [searchQuery, setSearch] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  });
  const [recentlyPlayed, setRecent] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [mixBudgetMinutes, setMixBudgetMinutes] = useState(30);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [songsError, setSongsError] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);

  const songs = useMemo(() => {
    return [...customSongs, ...apiSongs];
  }, [apiSongs, customSongs]);

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  useEffect(() => {
    if (!clientId) {
      setApiSongs(SAMPLE_SONGS.map(s => ({ ...s })));
      setSongsError('');
      setLoadingSongs(false);
      return undefined;
    }

    let ignore = false;
    setLoadingSongs(true);
    setSongsError('');

    fetchJamendoTracks({ clientId, mood, searchQuery })
      .then((tracks) => {
        if (!ignore) setApiSongs(tracks);
      })
      .catch((error) => {
        if (!ignore) {
          setApiSongs([]);
          setSongsError(error.message || 'Unable to load songs from Jamendo.');
        }
      })
      .finally(() => {
        if (!ignore) setLoadingSongs(false);
      });

    return () => {
      ignore = true;
    };
  }, [clientId, mood, searchQuery]);

  const updateSongPlayCount = useCallback((song) => {
    if (song.source === 'jamendo') {
      setApiSongs((prev) =>
        prev.map((item) => item.id === song.id ? { ...item, play_count: item.play_count + 1 } : item)
      );
      return;
    }

    setCustomSongs((prev) =>
      prev.map((item) => item.id === song.id ? { ...item, play_count: item.play_count + 1 } : item)
    );
  }, []);

  const markSongAsRecent = useCallback((song) => {
    setRecent((prev) => {
      const entry = { ...song, last_played: Date.now() };
      const filtered = prev.filter((item) => item.id !== song.id);
      return [entry, ...filtered].slice(0, 20);
    });
  }, []);

  const startSong = useCallback((song) => {
    setPlayingId(song.id);
    setIsPaused(false);
    markSongAsRecent(song);
    updateSongPlayCount(song);
  }, [markSongAsRecent, updateSongPlayCount]);

  const handlePlay = useCallback((song) => {
    if (playingId === song.id) {
      setIsPaused((prev) => !prev);
      return;
    }

    startSong(song);
  }, [playingId, startSong]);

  const handleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      const isRemoving = next.has(id);
      isRemoving ? next.delete(id) : next.add(id);

      // Update the likes count on the song object
      const delta = isRemoving ? -1 : 1;
      const updateLikes = (songs) =>
        songs.map((song) =>
          song.id === id ? { ...song, likes: Math.max(0, song.likes + delta) } : song
        );

      setApiSongs(updateLikes);
      setCustomSongs(updateLikes);

      return next;
    });
  }, []);

  const handleRemove = useCallback((id) => {
    setApiSongs((prev) => prev.filter((song) => song.id !== id));
    setCustomSongs((prev) => prev.filter((song) => song.id !== id));
    setFavorites((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setRecent((prev) => prev.filter((song) => song.id !== id));
    if (playingId === id) {
      setPlayingId(null);
      setIsPaused(false);
    }
  }, [playingId]);

  const moodBuckets = useMemo(() => buildMoodBuckets(songs), [songs]);

  const filteredBase = useMemo(() => {
    const baseList = moodBuckets.get(mood) || [];
    return filterSongsByQuery(baseList, searchQuery);
  }, [moodBuckets, mood, searchQuery]);

  const sortedPlaylist = useMemo(() => {
    if (sortBy === 'score') return rankByPopularity([...filteredBase]);
    if (sortBy === 'likes') return [...filteredBase].sort((a, b) => b.likes - a.likes);
    if (sortBy === 'plays') return [...filteredBase].sort((a, b) => b.play_count - a.play_count);
    return filteredBase;
  }, [filteredBase, sortBy]);

  const top10 = useMemo(() => rankByPopularity([...(moodBuckets.get('all') || [])]).slice(0, 10), [moodBuckets]);

  const favoritesSongs = useMemo(() =>
    songs.filter((song) => favorites.has(song.id)), [songs, favorites]);

  const recentSongs = useMemo(() =>
    [...recentlyPlayed].sort((a, b) => b.last_played - a.last_played),
  [recentlyPlayed]);

  const mixCandidateSongs = useMemo(() => {
    return filteredBase.length ? filteredBase : (moodBuckets.get('all') || []);
  }, [filteredBase, moodBuckets]);

  const optimalMix = useMemo(
    () => buildOptimalPlaylistDP(mixCandidateSongs, mixBudgetMinutes * 60),
    [mixBudgetMinutes, mixCandidateSongs]
  );

  const greedyMix = useMemo(
    () => buildGreedyPlaylist(mixCandidateSongs, mixBudgetMinutes * 60),
    [mixBudgetMinutes, mixCandidateSongs]
  );

  const activeQueue = useMemo(() => {
    if (tab === 'top10') return top10;
    if (tab === 'smartmix') return optimalMix.songs;
    if (tab === 'greedy') return greedyMix.songs;
    if (tab === 'favorites') return favoritesSongs;
    if (tab === 'recent') return recentSongs;
    return sortedPlaylist;
  }, [favoritesSongs, greedyMix.songs, optimalMix.songs, recentSongs, sortedPlaylist, tab, top10]);

  const currentSong = useMemo(
    () => songs.find((song) => song.id === playingId) || null,
    [playingId, songs]
  );

  const playbackQueue = useMemo(() => {
    const queue = activeQueue.length ? activeQueue : songs;
    if (!currentSong) return queue;
    return queue.some((song) => song.id === currentSong.id) ? queue : songs;
  }, [activeQueue, currentSong, songs]);

  const currentIndex = useMemo(
    () => playbackQueue.findIndex((song) => song.id === playingId),
    [playbackQueue, playingId]
  );

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex >= 0 && currentIndex < playbackQueue.length - 1;

  const handleTogglePlayback = useCallback(() => {
    if (!currentSong) return;
    setIsPaused((prev) => !prev);
  }, [currentSong]);

  const handleSeek = useCallback((event) => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextTime = Number(event.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, []);

  const handlePrevious = useCallback(() => {
    if (!canGoPrevious) return;
    startSong(playbackQueue[currentIndex - 1]);
  }, [canGoPrevious, currentIndex, playbackQueue, startSong]);

  const handleNext = useCallback(() => {
    if (!canGoNext) {
      setPlayingId(null);
      setIsPaused(false);
      return;
    }

    startSong(playbackQueue[currentIndex + 1]);
  }, [canGoNext, currentIndex, playbackQueue, startSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentSong?.audioUrl) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      setCurrentTime(0);
      setDurationSeconds(0);
      return;
    }

    if (audio.src !== currentSong.audioUrl) {
      audio.src = currentSong.audioUrl;
      audio.load();
      setCurrentTime(0);
    }

    if (isPaused) {
      audio.pause();
      return;
    }

    audio.play().catch(() => {
      setIsPaused(true);
    });
  }, [currentSong, isPaused]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const syncPaused = () => setIsPaused(audio.paused);
    const syncTime = () => setCurrentTime(audio.currentTime || 0);
    const syncDuration = () => setDurationSeconds(Number.isFinite(audio.duration) ? audio.duration : 0);
    audio.addEventListener('play', syncPaused);
    audio.addEventListener('pause', syncPaused);
    audio.addEventListener('timeupdate', syncTime);
    audio.addEventListener('loadedmetadata', syncDuration);
    audio.addEventListener('durationchange', syncDuration);
    audio.addEventListener('ended', handleNext);

    return () => {
      audio.removeEventListener('play', syncPaused);
      audio.removeEventListener('pause', syncPaused);
      audio.removeEventListener('timeupdate', syncTime);
      audio.removeEventListener('loadedmetadata', syncDuration);
      audio.removeEventListener('durationchange', syncDuration);
      audio.removeEventListener('ended', handleNext);
    };
  }, [handleNext]);

  const totalDuration = useMemo(() => {
    const totalMins = songs.reduce((acc, song) => {
      const [mins, secs] = song.duration.split(':').map(Number);
      return acc + mins + secs / 60;
    }, 0);
    const hours = Math.floor(totalMins / 60);
    const mins = Math.round(totalMins % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }, [songs]);

  const topScore = useMemo(() =>
    songs.length ? Math.max(...songs.map(getScore)) : 0, [songs]);

  const playlistEmptyMessage = loadingSongs
    ? 'Loading songs...'
    : (searchQuery ? `No results for "${searchQuery}"` : 'No songs for this mood');

  const mixSummary = useMemo(() => ({
    candidateCount: mixCandidateSongs.length,
    budgetLabel: `${mixBudgetMinutes} min`,
    optimalDuration: formatDuration(optimalMix.totalSeconds),
    greedyDuration: formatDuration(greedyMix.totalSeconds),
  }), [greedyMix.totalSeconds, mixBudgetMinutes, mixCandidateSongs.length, optimalMix.totalSeconds]);

  const formatPlayerTime = useCallback((seconds) => {
    const safeSeconds = Math.max(0, Math.floor(seconds || 0));
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const renderTabContent = () => {
    switch (tab) {
      case 'top10':
        return (
          <Playlist
            songs={top10}
            showRank
            playingId={playingId}
            favorites={favorites}
            onPlay={handlePlay}
            onFavorite={handleFavorite}
            onRemove={handleRemove}
            emptyMessage="No songs yet"
          />
        );
      case 'favorites':
        return (
          <Playlist
            songs={favoritesSongs}
            playingId={playingId}
            favorites={favorites}
            onPlay={handlePlay}
            onFavorite={handleFavorite}
            onRemove={handleRemove}
            emptyMessage="No liked songs yet - click the heart on any song"
            emptyIcon="♡"
          />
        );
      case 'smartmix':
        return (
          <div className={styles.algorithmPane}>
            <div className={styles.algorithmSummary}>
              <div className={styles.algorithmCard}>
                <span className={styles.algorithmLabel}>Made For You</span>
                <strong>Smart Mix</strong>
                <p>Best-fit playlist for your selected listening window, balancing song value and total time.</p>
              </div>
              <div className={styles.algorithmCard}>
                <span className={styles.algorithmLabel}>Playlist Fit</span>
                <strong>{optimalMix.songs.length} songs</strong>
                <p>{mixSummary.optimalDuration} total length · tuned for the strongest overall mix</p>
              </div>
            </div>
            <Playlist
              songs={optimalMix.songs}
              playingId={playingId}
              favorites={favorites}
              onPlay={handlePlay}
              onFavorite={handleFavorite}
              onRemove={handleRemove}
              emptyMessage="No valid DP playlist found for this budget"
              emptyIcon="DP"
            />
          </div>
        );
      case 'greedy':
        return (
          <div className={styles.algorithmPane}>
            <div className={styles.algorithmSummary}>
              <div className={styles.algorithmCard}>
                <span className={styles.algorithmLabel}>Fast Pick</span>
                <strong>Quick Mix</strong>
                <p>A faster mix builder that favors high-impact songs first for a quick session.</p>
              </div>
              <div className={styles.algorithmCard}>
                <span className={styles.algorithmLabel}>Playlist Fit</span>
                <strong>{greedyMix.songs.length} songs</strong>
                <p>{mixSummary.greedyDuration} total length · built for speed and momentum</p>
              </div>
            </div>
            <Playlist
              songs={greedyMix.songs}
              playingId={playingId}
              favorites={favorites}
              onPlay={handlePlay}
              onFavorite={handleFavorite}
              onRemove={handleRemove}
              emptyMessage="No greedy playlist found for this budget"
              emptyIcon="G"
            />
          </div>
        );
      case 'recent':
        return recentSongs.length === 0 ? (
          <div className={styles.emptyRecent}>
            <span>Recent</span>
            <p>Play some songs to see them here</p>
          </div>
        ) : (
          <div className={styles.recentList}>
            {recentSongs.map((song, index) => (
              <div
                key={`${song.id}-${song.last_played}`}
                className={`${styles.recentRow} ${playingId === song.id ? styles.recentPlaying : ''}`}
                onClick={() => handlePlay(song)}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <span className={styles.recentEmoji}>{MOOD_EMOJI[song.mood]}</span>
                <div className={styles.recentInfo}>
                  <span className={styles.recentName}>{song.name}</span>
                  <span className={styles.recentArtist}>{song.artist}</span>
                </div>
                <span className={styles.recentTime}>{formatTimeAgo(song.last_played)}</span>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <Playlist
            songs={sortedPlaylist}
            playingId={playingId}
            favorites={favorites}
            onPlay={handlePlay}
            onFavorite={handleFavorite}
            onRemove={handleRemove}
            emptyMessage={playlistEmptyMessage}
            emptyIcon={searchQuery ? 'Search' : 'Music'}
          />
        );
    }
  };

  return (
    <div className={styles.page}>
      <Navbar searchQuery={searchQuery} onSearch={setSearch} />

      <main className={styles.main}>
        <div className={styles.statsBar}>
          {[
            { label: 'Total Songs', value: songs.length, icon: 'Music' },
            { label: 'Total Duration', value: totalDuration, icon: 'Time' },
            { label: 'Liked Songs', value: favorites.size, icon: 'Love' },
            { label: 'Top Score', value: formatCount(topScore), icon: 'Hot' },
          ].map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <span className={styles.statIcon}>{stat.icon}</span>
              <div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.content}>
          <aside className={styles.sidebar}>
            <div className={styles.sideSection}>
              <div className={styles.sideTitle}>Mood</div>
              <div className={styles.moodList}>
                {MOODS.map((item) => (
                  <button
                    key={item}
                    className={`${styles.moodBtn} ${mood === item ? styles.moodActive : ''}`}
                    onClick={() => setMood(item)}
                  >
                    <span>{item === 'all' ? 'All' : MOOD_EMOJI[item]}</span>
                    <span>{item === 'all' ? 'All Moods' : item.charAt(0).toUpperCase() + item.slice(1)}</span>
                    <span className={styles.moodCount}>
                      {(moodBuckets.get(item) || []).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.sideSection}>
              <div className={styles.sideTitle}>Sort By</div>
              <div className={styles.sortList}>
                {[
                  { key: 'default', label: 'Default' },
                  { key: 'score', label: 'Popularity' },
                  { key: 'plays', label: 'Play Count' },
                  { key: 'likes', label: 'Most Liked' },
                ].map((item) => (
                  <button
                    key={item.key}
                    className={`${styles.sortBtn} ${sortBy === item.key ? styles.sortActive : ''}`}
                    onClick={() => setSortBy(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.sideSection}>
              <div className={styles.sideTitle}>Listening Session</div>
              <div className={styles.algorithmControls}>
                <p className={styles.algorithmCopy}>
                  Pick how long you want to listen and Rhythmix will shape a better session for that time window.
                </p>
                <div className={styles.budgetChips}>
                  {MIX_BUDGETS.map((minutes) => (
                    <button
                      key={minutes}
                      type="button"
                      className={`${styles.budgetChip} ${mixBudgetMinutes === minutes ? styles.budgetChipActive : ''}`}
                      onClick={() => setMixBudgetMinutes(minutes)}
                    >
                      {minutes}m
                    </button>
                  ))}
                </div>
                <div className={styles.algorithmFacts}>
                  <div><strong>{mixSummary.candidateCount}</strong> songs available</div>
                  <div><strong>{mixSummary.budgetLabel}</strong> session length</div>
                  <div><strong>{optimalMix.songs.length}</strong> songs in your best-fit mix</div>
                </div>
              </div>
            </div>
          </aside>

          <div className={styles.panel}>
            <div className={styles.tabs}>
              {TABS.map((item) => (
                <button
                  key={item}
                  className={`${styles.tab} ${tab === item ? styles.tabActive : ''}`}
                  onClick={() => setTab(item)}
                >
                  {TAB_LABELS[item]}
                  {item === 'favorites' && favorites.size > 0 && (
                    <span className={styles.tabBadge}>{favorites.size}</span>
                  )}
                </button>
              ))}
            </div>

            {tab === 'playlist' && (
              <div className={styles.listHeader}>
                <span className={styles.resultsCount}>
                  {sortedPlaylist.length} song{sortedPlaylist.length !== 1 ? 's' : ''}
                  {mood !== 'all' && ` · ${mood}`}
                  {searchQuery && ` · "${searchQuery}"`}
                </span>
                {songsError && <span className={styles.resultsCount}>{songsError}</span>}
              </div>
            )}

            {(tab === 'smartmix' || tab === 'greedy') && (
              <div className={styles.listHeader}>
                <span className={styles.resultsCount}>
                  Budget {mixSummary.budgetLabel} · {mixSummary.candidateCount} candidate song{mixSummary.candidateCount !== 1 ? 's' : ''}
                </span>
                <span className={styles.resultsCount}>
                  {tab === 'smartmix'
                    ? `${optimalMix.songs.length} songs shaped for the strongest session flow`
                    : `${greedyMix.songs.length} songs selected for a faster high-energy mix`}
                </span>
              </div>
            )}

            <div className={styles.tabContent}>
              {renderTabContent()}
            </div>
          </div>
        </div>
      </main>

      {currentSong && (() => {
        const song = currentSong;
        const previewAvailable = Boolean(song.audioUrl);

        return (
          <div className={styles.nowPlaying}>
            <div className={styles.npLeft}>
              <div className={styles.npEqualizer}>
                {[1, 2, 3, 4].map((index) => (
                  <span
                    key={index}
                    className={styles.npBar}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  />
                ))}
              </div>
              <div>
                <div className={styles.npName}>{song.name}</div>
                <div className={styles.npArtist}>{song.artist}</div>
              </div>
            </div>
            <div className={styles.npCenter}>
              <div className={styles.npControls}>
                <button
                  type="button"
                  className={styles.npIconButton}
                  onClick={handlePrevious}
                  disabled={!canGoPrevious}
                  aria-label="Previous song"
                  title="Previous"
                >
                  ⏮
                </button>
                <button
                  type="button"
                  className={`${styles.npPrimaryButton} ${!previewAvailable ? styles.npDisabledButton : ''}`}
                  onClick={handleTogglePlayback}
                  disabled={!previewAvailable}
                  aria-label={isPaused ? 'Play song' : 'Pause song'}
                  title={isPaused ? 'Play' : 'Pause'}
                >
                  {isPaused ? '▶' : '⏸'}
                </button>
                <button
                  type="button"
                  className={styles.npIconButton}
                  onClick={handleNext}
                  disabled={!canGoNext}
                  aria-label="Next song"
                  title="Next"
                >
                  ⏭
                </button>
              </div>
              <div className={styles.npProgressRow}>
                <span className={styles.npTime}>{formatPlayerTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={Math.max(durationSeconds, 1)}
                  step="0.1"
                  value={Math.min(currentTime, Math.max(durationSeconds, 1))}
                  onChange={handleSeek}
                  disabled={!previewAvailable}
                  className={styles.npProgress}
                  style={{
                    '--progress': `${durationSeconds > 0 ? (currentTime / durationSeconds) * 100 : 0}%`,
                  }}
                  aria-label="Song progress"
                />
                <span className={styles.npTime}>
                  {formatPlayerTime(durationSeconds || parseDurationToSeconds(song.duration))}
                </span>
              </div>
            </div>
            <div className={styles.npMood}>{MOOD_EMOJI[song.mood]} {song.mood}</div>
            <button
              type="button"
              className={`${styles.npLike} ${favorites.has(song.id) ? styles.npLiked : ''}`}
              onClick={() => handleFavorite(song.id)}
              aria-label={favorites.has(song.id) ? 'Unlike song' : 'Like song'}
              title={favorites.has(song.id) ? 'Unlike' : 'Like'}
            >
              {favorites.has(song.id) ? '♥' : '♡'}
            </button>
            <button
              type="button"
              className={styles.npStop}
              onClick={() => {
                setPlayingId(null);
                setIsPaused(false);
              }}
              aria-label={previewAvailable ? 'Stop playback' : 'Close player'}
              title={previewAvailable ? 'Stop' : 'Close'}
            >
              ✕
            </button>
          </div>
        );
      })()}

      <audio ref={audioRef} hidden />
    </div>
  );
}
