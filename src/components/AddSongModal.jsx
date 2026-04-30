// =============================================
//  RHYTHMIX — Add Song Modal
// =============================================
import React, { useState } from 'react';
import styles from './AddSongModal.module.css';

const MOODS = ['happy', 'sad', 'chill', 'party'];
const MOOD_EMOJI = { happy: '☀️', sad: '🌧️', chill: '🌊', party: '🎉' };

export default function AddSongModal({ onAdd, onClose }) {
  const [form, setForm] = useState({
    name: '', artist: '', mood: 'happy',
    play_count: '', likes: '', duration: '3:00'
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name   = 'Song name is required';
    if (!form.artist.trim()) e.artist = 'Artist is required';
    const pc = Number(form.play_count);
    const lk = Number(form.likes);
    if (!form.play_count || isNaN(pc) || pc < 0) e.play_count = 'Enter a valid play count';
    if (!form.likes || isNaN(lk) || lk < 0)      e.likes      = 'Enter valid likes';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd({
      id: Date.now(),
      name: form.name.trim(),
      artist: form.artist.trim(),
      mood: form.mood,
      play_count: Number(form.play_count),
      likes: Number(form.likes),
      duration: form.duration || '3:00',
      last_played: null,
    });
    onClose();
  };

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add New Song</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.row}>
            <Field label="Song Name" error={errors.name}>
              <input className={`${styles.input} ${errors.name ? styles.invalid : ''}`}
                placeholder="e.g. Midnight City"
                value={form.name} onChange={e => set('name', e.target.value)} />
            </Field>
            <Field label="Artist" error={errors.artist}>
              <input className={`${styles.input} ${errors.artist ? styles.invalid : ''}`}
                placeholder="e.g. M83"
                value={form.artist} onChange={e => set('artist', e.target.value)} />
            </Field>
          </div>

          <Field label="Mood">
            <div className={styles.moodGrid}>
              {MOODS.map(m => (
                <button key={m} type="button"
                  className={`${styles.moodOpt} ${form.mood === m ? styles.moodActive : ''}`}
                  onClick={() => set('mood', m)}>
                  {MOOD_EMOJI[m]} {m}
                </button>
              ))}
            </div>
          </Field>

          <div className={styles.row}>
            <Field label="Play Count" error={errors.play_count}>
              <input className={`${styles.input} ${errors.play_count ? styles.invalid : ''}`}
                type="number" min="0" placeholder="e.g. 5000"
                value={form.play_count} onChange={e => set('play_count', e.target.value)} />
            </Field>
            <Field label="Likes" error={errors.likes}>
              <input className={`${styles.input} ${errors.likes ? styles.invalid : ''}`}
                type="number" min="0" placeholder="e.g. 3200"
                value={form.likes} onChange={e => set('likes', e.target.value)} />
            </Field>
            <Field label="Duration">
              <input className={styles.input} placeholder="3:30"
                value={form.duration} onChange={e => set('duration', e.target.value)} />
            </Field>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.addBtn}>Add Song ✦</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
}
