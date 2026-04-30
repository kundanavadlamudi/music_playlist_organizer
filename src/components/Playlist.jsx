// =============================================
//  RHYTHMIX — Playlist Component
// =============================================
import React from 'react';
import SongCard from './SongCard';
import styles from './Playlist.module.css';

export default function Playlist({
  songs,
  showRank = false,
  playingId,
  favorites,
  onPlay,
  onFavorite,
  onRemove,
  emptyMessage = 'No songs found',
  emptyIcon = '🎵',
}) {
  if (songs.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>{emptyIcon}</span>
        <p className={styles.emptyText}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {songs.map((song, index) => (
        <SongCard
          key={song.id}
          song={song}
          rank={showRank ? index + 1 : null}
          isPlaying={playingId === song.id}
          isFavorite={favorites.has(song.id)}
          onPlay={onPlay}
          onFavorite={onFavorite}
          onRemove={onRemove}
          animationDelay={index * 40}
        />
      ))}
    </div>
  );
}
