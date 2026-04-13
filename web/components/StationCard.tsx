'use client'

import React, { memo } from 'react';
import { Station, usePlayer } from '@/context/PlayerContext';

const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="none"><circle cx="50" cy="50" r="50" fill="%230b0c10"/><path d="M40 30l30 20-30 20V30z" fill="%230ff"/></svg>`;

interface StationCardProps {
  station: Station;
}

const StationCard = memo(({ station }: StationCardProps) => {
  const { play, currentStation, isPlaying } = usePlayer();
  const isSelected = currentStation?.stationuuid === station.stationuuid;

  return (
    <div 
      className={`glass-panel ${isSelected ? 'playing-glow' : ''}`}
      style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', textAlign: 'center' }}
      onClick={() => play(station)}
    >
      <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', background: '#0b0c10', marginBottom: '15px' }} className={isSelected && isPlaying ? 'spin-anim' : ''}>
         <img 
            src={station.favicon || fallbackSvg} 
            onError={(e) => { e.currentTarget.src = fallbackSvg }}
            alt={station.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
      </div>
      <h3 className="line-clamp-2" style={{ margin: '0 0 10px 0', fontSize: '1.1rem', minHeight: '44px' }}>{station.name}</h3>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        {station.country}
      </div>
    </div>
  );
});

StationCard.displayName = 'StationCard';

export default StationCard;
