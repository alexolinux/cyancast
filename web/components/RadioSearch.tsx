'use client'

import React, { useState, useRef } from 'react';
import { Station } from '@/context/PlayerContext';
import StationCard from './StationCard';
import styles from './RadioSearch.module.css';

export default function RadioSearch() {
  const [query, setQuery] = useState('');
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const fetchStations = async (searchQuery: string, searchOffset: number) => {
    const res = await fetch(`https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(searchQuery)}&limit=20&offset=${searchOffset}`);
    return await res.json();
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setOffset(0);
    setHasSearched(true);
    try {
      const data = await fetchStations(query, 0);
      setStations(data);
      setHasMore(data.length === 20);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    const nextOffset = offset + 20;
    try {
      const data = await fetchStations(query, nextOffset);
      setStations(prev => [...prev, ...data]);
      setOffset(nextOffset);
      setHasMore(data.length === 20);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.searchWrapper}>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search for web radios..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search radio stations"
          />
          <button 
            type="submit" 
            disabled={isLoading} 
            className={styles.searchButton}
            aria-label="Search"
          >
            {isLoading ? (
              <svg className="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.2"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            )}
          </button>
        </div>
      </form>
      
      {/* Results count */}
      <div aria-live="polite" className={styles.srOnly}>
        {hasSearched && !isLoading && `${stations.length} stations found`}
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className={`radio-grid ${styles.gridWrapper}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`glass-panel ${styles.skeleton}`}>
              <div className={styles.skeletonCircle} />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLineShort} />
            </div>
          ))}
        </div>
      )}

      {/* Results grid */}
      {!isLoading && stations.length > 0 && (
        <div ref={resultsRef} className={`radio-grid ${styles.gridWrapper}`}>
          {stations.map((station, index) => (
            <StationCard key={`${station.stationuuid}-${index}`} station={station} index={index} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && hasSearched && stations.length === 0 && (
        <div className={styles.emptyState}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
          <p>No stations found</p>
          <span>Try a different search term</span>
        </div>
      )}

      {/* Load more */}
      {hasMore && !isLoading && (
        <button 
          onClick={loadMore} 
          disabled={isLoadingMore}
          className={`glass-panel text-cyan ${styles.loadMoreButton}`}
        >
          {isLoadingMore ? (
            <>
              <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.2"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
              Loading...
            </>
          ) : (
            'Load More Radios'
          )}
        </button>
      )}
    </div>
  );
}
