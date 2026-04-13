'use client'

import React, { useState } from 'react';
import { Station } from '@/context/PlayerContext';
import StationCard from './StationCard';

export default function RadioSearch() {
  const [query, setQuery] = useState('');
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchStations = async (searchQuery: string, searchOffset: number) => {
    const res = await fetch(`https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(searchQuery)}&limit=20&offset=${searchOffset}`);
    return await res.json();
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setOffset(0);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', width: '100%', padding: '0 20px' }}>
      <form onSubmit={handleSearch} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search for web radios..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={isLoading} style={{ marginLeft: '-45px', background: 'none', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer', zIndex: 10 }}>
          {isLoading ? (
            <svg className="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.2"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          )}
        </button>
      </form>
      
      <div className="radio-grid" style={{ width: '100%', maxWidth: '1200px' }}>
        {stations.map((station, index) => (
          <StationCard key={`${station.stationuuid}-${index}`} station={station} />
        ))}
      </div>

      {hasMore && (
        <button 
          onClick={loadMore} 
          disabled={isLoadingMore}
          className="glass-panel text-cyan"
          style={{ padding: '10px 30px', cursor: 'pointer', background: 'var(--glass-bg-solid)' }}
        >
          {isLoadingMore ? 'Loading...' : 'Load More Radios'}
        </button>
      )}
    </div>
  );
}
