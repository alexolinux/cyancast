'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { playRadio, stopRadio, setVolume as setVolumeAction, setMute as setMuteAction } from '@/app/actions';
import Hls from 'hls.js';

export interface Station {
    stationuuid: string;
    name: string;
    url: string;
    url_resolved: string;
    favicon: string;
    tags: string;
    country: string;
    bitrate: number;
}

export type OutputMode = 'server' | 'client';

interface PlayerContextProps {
    currentStation: Station | null;
    isPlaying: boolean;
    isStopping: boolean;
    volume: number;
    isMuted: boolean;
    outputMode: OutputMode;
    play: (station: Station) => Promise<void>;
    stop: () => Promise<void>;
    togglePlayPause: () => Promise<void>;
    changeVolume: (vol: number) => Promise<void>;
    toggleOutputMode: () => void;
    toggleMute: () => void;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);
const OUTPUT_MODE_KEY = 'cyancast_output_mode';

export function PlayerProvider({ children }: { children: ReactNode }) {
    const [currentStation, setCurrentStation] = useState<Station | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isStopping, setIsStopping] = useState(false);
    const [volume, setVolume] = useState(50);
    const [isMuted, setIsMuted] = useState(false);
    const [outputMode, setOutputMode] = useState<OutputMode>('server');

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);
    const isSwitchingMode = useRef(false);

    // Load saved output mode preference from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem(OUTPUT_MODE_KEY) as OutputMode | null;
            if (savedMode === 'server' || savedMode === 'client') {
                setOutputMode(savedMode);
            }
        }
    }, []);

    // Set initial volume on server-side MPV
    useEffect(() => {
        setVolumeAction(50);
    }, []);

    // Initialize audio element
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const audio = new Audio();
        audioRef.current = audio;
        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
            audio.pause();
            audio.src = '';
        };
    }, []);

    // Cleanup HLS when switching modes or unmounting
    const cleanupHls = useCallback(() => {
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }
    }, []);

    // Check if URL is an HLS stream
    const isHlsStream = (url: string): boolean => {
        return url.includes('.m3u8') || url.includes('m3u8') || url.includes('hls');
    };

    // Play audio with HLS support for client mode
    const playClientAudio = useCallback(async (station: Station) => {
        if (!audioRef.current) return;

        // Cleanup previous HLS instance
        cleanupHls();

        const audio = audioRef.current;
        const url = station.url_resolved || station.url;
        audio.volume = isMuted ? 0 : volume / 100;

        if (isHlsStream(url)) {
            // Handle HLS stream
            if (Hls.isSupported()) {
                const hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                });
                hlsRef.current = hls;
                hls.loadSource(url);
                hls.attachMedia(audio);

                hls.on(Hls.Events.MANIFEST_PARSED, async () => {
                    try {
                        await audio.play();
                    } catch (e) {
                        console.error('HLS playback failed:', e);
                        setIsPlaying(false);
                        setCurrentStation(null);
                    }
                });

                hls.on(Hls.Events.ERROR, (_, data) => {
                    if (data.fatal) {
                        console.error('HLS fatal error:', data);
                        setIsPlaying(false);
                        setCurrentStation(null);
                    }
                });
            } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
                // Safari native HLS support
                audio.src = url;
                try {
                    await audio.play();
                } catch (e) {
                    console.error('Native HLS playback failed:', e);
                    setIsPlaying(false);
                    setCurrentStation(null);
                }
            } else {
                console.error('HLS is not supported in this browser');
                setIsPlaying(false);
                setCurrentStation(null);
            }
        } else {
            // Regular audio stream
            audio.src = url;
            try {
                await audio.play();
            } catch (e) {
                console.error('Audio playback failed:', e);
                setIsPlaying(false);
                setCurrentStation(null);
            }
        }
    }, [volume, isMuted, cleanupHls]);

    const play = useCallback(async (station: Station) => {
        if (isSwitchingMode.current) return;

        setCurrentStation(station);
        setIsPlaying(true);

        if (outputMode === 'server') {
            // Server-side playback via MPV
            try {
                const res = await playRadio(station.url_resolved || station.url);
                if (!res.success) {
                    setIsPlaying(false);
                    setCurrentStation(null);
                }
            } catch (e) {
                console.error(e);
                setIsPlaying(false);
                setCurrentStation(null);
            }
        } else {
            // Client-side playback
            await playClientAudio(station);
        }
    }, [outputMode, playClientAudio]);

    const stop = useCallback(async () => {
        if (isSwitchingMode.current) return;

        setIsStopping(true);
        try {
            if (outputMode === 'server') {
                await stopRadio();
            } else {
                // Cleanup client audio
                cleanupHls();
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.src = '';
                }
            }
            setCurrentStation(null);
            setIsPlaying(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsStopping(false);
        }
    }, [outputMode, cleanupHls]);

    const togglePlayPause = useCallback(async () => {
        if (!currentStation || isSwitchingMode.current) return;

        if (outputMode === 'server') {
            if (isPlaying) {
                setIsPlaying(false);
                await stopRadio();
            } else {
                setIsPlaying(true);
                await playRadio(currentStation.url_resolved || currentStation.url);
            }
        } else {
            if (isPlaying) {
                if (audioRef.current) {
                    audioRef.current.pause();
                }
                setIsPlaying(false);
            } else {
                if (audioRef.current) {
                    try {
                        await audioRef.current.play();
                        setIsPlaying(true);
                    } catch (e) {
                        console.error('Resume playback failed:', e);
                    }
                }
            }
        }
    }, [isPlaying, currentStation, outputMode]);

    const changeVolume = useCallback(async (newVol: number) => {
        setVolume(newVol);
        if (outputMode === 'server') {
            await setVolumeAction(newVol);
        } else if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : newVol / 100;
        }
    }, [outputMode, isMuted]);

    const toggleMute = useCallback(async () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        if (outputMode === 'server') {
            await setMuteAction(newMuted);
        } else if (audioRef.current) {
            audioRef.current.volume = newMuted ? 0 : volume / 100;
        }
    }, [isMuted, outputMode, volume]);

    const toggleOutputMode = useCallback(async () => {
        if (isSwitchingMode.current) return;
        isSwitchingMode.current = true;

        const newMode = outputMode === 'server' ? 'client' : 'server';
        const wasPlaying = isPlaying;
        const station = currentStation;

        try {
            // Stop current playback
            if (outputMode === 'server') {
                await stopRadio();
            } else {
                cleanupHls();
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.src = '';
                }
            }

            // Update mode
            setOutputMode(newMode);
            localStorage.setItem(OUTPUT_MODE_KEY, newMode);
            setIsPlaying(false);
            setCurrentStation(null);

            // Set mute state on server when switching modes
            if (newMode === 'client') {
                await setMuteAction(true);
            } else {
                await setMuteAction(false);
            }

            // Resume playback if was playing
            if (wasPlaying && station) {
                // Small delay to ensure mode switch is complete
                await new Promise(resolve => setTimeout(resolve, 100));
                setCurrentStation(station);
                setIsPlaying(true);
                if (newMode === 'server') {
                    await playRadio(station.url_resolved || station.url);
                } else {
                    await playClientAudio(station);
                }
            }
        } catch (e) {
            console.error('Mode switch error:', e);
        } finally {
            isSwitchingMode.current = false;
        }
    }, [outputMode, isPlaying, currentStation, cleanupHls, playClientAudio]);

    return (
        <PlayerContext.Provider
            value={{
                currentStation,
                isPlaying,
                isStopping,
                volume,
                isMuted,
                outputMode,
                play,
                stop,
                togglePlayPause,
                changeVolume,
                toggleOutputMode,
                toggleMute,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const context = useContext(PlayerContext);
    if (context === undefined) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
}