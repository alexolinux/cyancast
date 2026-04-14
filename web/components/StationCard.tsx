'use client'

import React, { memo } from 'react';
import { Station, usePlayer } from '@/context/PlayerContext';
import styles from './StationCard.module.css';

const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="none"><circle cx="50" cy="50" r="50" fill="%230b0c10"/><path d="M40 30l30 20-30 20V30z" fill="%230ff"/></svg>`;

interface StationCardProps {
  station: Station;
  index?: number;
}

const StationCard = memo(({ station, index = 0 }: StationCardProps) => {
  const { play, currentStation, isPlaying } = usePlayer();
  const isSelected = currentStation?.stationuuid === station.stationuuid;

  // Extract up to 2 genre tags from the station tags string
  const tags = station.tags
    ? station.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 2)
    : [];

  return (
    <div 
      className={`glass-panel ${styles.card} ${isSelected ? 'playing-glow' : ''}`}
      onClick={() => play(station)}
      role="button"
      tabIndex={0}
      aria-label={`Play ${station.name}${station.country ? ` from ${station.country}` : ''}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(station); } }}
      style={{ animationDelay: `${Math.min(index * 0.04, 0.6)}s` }}
    >
      <div className={`${styles.imageWrapper} ${isSelected && isPlaying ? styles.imageWrapperPlaying : ''}`}>
         <img 
            src={station.favicon || fallbackSvg} 
            onError={(e) => { e.currentTarget.src = fallbackSvg }}
            alt={station.name}
            className={styles.image}
            loading="lazy"
          />
      </div>
      <h3 className={`line-clamp-2 ${styles.name}`}>{station.name}</h3>
      <div className={styles.meta}>
        {station.country && <span className={styles.country}>{station.country}</span>}
        {station.bitrate > 0 && (
          <span className={styles.bitrate}>{station.bitrate}kbps</span>
        )}
        {tags.map((tag, i) => (
          <span key={i} className={styles.tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
});

StationCard.displayName = 'StationCard';

export default StationCard;
