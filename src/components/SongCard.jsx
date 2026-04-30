import React from 'react';
import { getScore, formatCount, MOOD_EMOJI } from '../utils/helpers';
import styles from './SongCard.module.css';

export default function SongCard({
  song,
  rank,
  isPlaying,
  isFavorite,
  onPlay,
  onFavorite,
  onRemove,
  animationDelay = 0,
}) {
  const score = getScore(song);

  const moodColors = {
    happy: 'var(--mood-happy)',
    sad: 'var(--mood-sad)',
    chill: 'var(--mood-chill)',
    party: 'var(--mood-party)',
  };

  return (
    <div
      className={`${styles.card} ${isPlaying ? styles.playing : ''}`}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={() => onPlay(song)}
    >
      {rank && (
        <div className={`${styles.rank} ${rank <= 3 ? styles.topRank : ''}`}>
          {rank <= 3 ? ['1', '2', '3'][rank - 1] : `#${rank}`}
        </div>
      )}

      <div className={styles.artwork} style={{ '--mood-color': moodColors[song.mood] }}>
        {isPlaying ? (
          <div className={styles.equalizer}>
            {[1, 2, 3].map((item) => (
              <span key={item} className={styles.eqBar} style={{ animationDelay: `${item * 0.12}s` }} />
            ))}
          </div>
        ) : (
          <span className={styles.artworkEmoji}>{MOOD_EMOJI[song.mood]}</span>
        )}
        <div className={styles.playOverlay}>Play</div>
      </div>

      <div className={styles.info}>
        <div className={styles.name} title={song.name}>{song.name}</div>
        <div className={styles.artist}>{song.artist}</div>
        <div className={styles.meta}>
          <span
            className={styles.moodBadge}
            style={{ color: moodColors[song.mood], background: `${moodColors[song.mood]}18` }}
          >
            {MOOD_EMOJI[song.mood]} {song.mood}
          </span>
          <span className={styles.duration}>{song.duration}</span>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statIcon}>Play</span>
          <span>{formatCount(song.play_count)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>Like</span>
          <span>{formatCount(song.likes)}</span>
        </div>
        <div className={styles.scorePill} title="Popularity score">
          Score {formatCount(score)}
        </div>
      </div>

      <div className={styles.actions} onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className={`${styles.favBtn} ${isFavorite ? styles.favorited : ''}`}
          onClick={(e) => { e.stopPropagation(); onFavorite(song.id); }}
          title={isFavorite ? 'Remove from liked songs' : 'Add to liked songs'}
          aria-label={isFavorite ? 'Remove from liked songs' : 'Add to liked songs'}
        >
          {isFavorite ? '❤️ Liked' : '🤍 Like'}
        </button>
        <button
          type="button"
          className={styles.removeBtn}
          onClick={(e) => { e.stopPropagation(); onRemove(song.id); }}
          title="Remove song"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
