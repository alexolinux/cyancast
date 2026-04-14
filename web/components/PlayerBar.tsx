'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import styles from './PlayerBar.module.css';

const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="none"><circle cx="50" cy="50" r="50" fill="%230b0c10"/><path d="M40 30l30 20-30 20V30z" fill="%230ff"/></svg>`;

export default function PlayerBar() {
  const {
    currentStation,
    isPlaying,
    isStopping,
    volume,
    isMuted,
    outputMode,
    stop,
    togglePlayPause,
    changeVolume,
    toggleOutputMode,
    toggleMute,
  } = usePlayer();

  if (!currentStation && !isStopping) return null;

  return (
    <div className={styles.playerBar} role="region" aria-label="Audio player">
      {/* Mobile Row 1: Station Info + Controls */}
      <div className={styles.mobileRow1}>
        {/* Station Info - Left */}
        <div className={styles.stationInfo}>
          <div className={`${styles.stationImageWrapper} ${isPlaying ? styles.playing : ''}`}>
            <img
              src={currentStation?.favicon || fallbackSvg}
              onError={(e) => { e.currentTarget.src = fallbackSvg; }}
              alt={currentStation?.name || 'Station'}
              className={styles.stationImage}
            />
          </div>
          <div className={styles.stationDetails}>
            <div className={styles.stationName}>
              {currentStation?.name || 'Stopping...'}
            </div>
            <div className={`${styles.stationStatus} ${isPlaying ? styles.playing : styles.stopped}`}>
              {isPlaying ? '● LIVE' : '○ STOPPED'}
            </div>
          </div>
        </div>

        {/* Playback Controls - Center */}
        <div className={styles.controls}>
          <button
            className={`${styles.controlButton} ${styles.stopButton}`}
            onClick={stop}
            disabled={isStopping}
            title="Stop"
            aria-label="Stop playback"
          >
            {isStopping ? (
              <svg className={styles.spin} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            )}
          </button>
          <button
            className={`${styles.controlButton} ${styles.playButton}`}
            onClick={togglePlayPause}
            disabled={isStopping}
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause playback' : 'Resume playback'}
          >
            {isPlaying ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Row 2: Volume + Output */}
      <div className={styles.mobileRow2}>
        {/* Right Section: Volume + Output Toggle */}
        <div className={styles.rightSection}>
          <div className={styles.volumeSection}>
            <button
              className={`${styles.muteButton} ${isMuted ? styles.muted : ''}`}
              onClick={toggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            >
              {isMuted ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M18.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M14.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>

            {/* Volume Slider */}
            <div className={styles.volumeSliderWrapper}>
              <div className={styles.volumeTrack}>
                <div
                  className={styles.volumeFill}
                  style={{ width: `${volume}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => changeVolume(parseInt(e.target.value))}
                className={styles.volumeSlider}
                title={`Volume: ${volume}%`}
                aria-label="Volume"
                aria-valuenow={volume}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>

            <div className={styles.volumeValueContainer}>
              <span className={styles.volumeValue}>{volume}%</span>
            </div>
          </div>

          {/* Output Mode Toggle */}
          <button
            className={`${styles.outputToggle} ${outputMode === 'server' ? styles.server : styles.client}`}
            onClick={toggleOutputMode}
            title={outputMode === 'server' ? 'Server Output - Click to switch to Client' : 'Client Output - Click to switch to Server'}
            aria-label={`Audio output: ${outputMode}. Click to switch.`}
          >
            <div className={styles.outputIcon}>
              {outputMode === 'server' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="6" height="12" rx="1" />
                  <path d="M8 6l6-4v16l-6-4" />
                  <path d="M18 9v6" />
                  <path d="M21 12h-6" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="6" height="12" rx="1" />
                  <path d="M8 6l6-4v16l-6-4" />
                  <circle cx="18" cy="12" r="3" />
                </svg>
              )}
            </div>
            <span className={styles.outputLabel}>
              {outputMode === 'server' ? 'Server' : 'Client'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}