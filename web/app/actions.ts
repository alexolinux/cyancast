'use server'

import { sendMpvCommand } from '@/lib/mpv';

export async function playRadio(url: string) {
  try {
    await sendMpvCommand({ command: ["loadfile", url] });
    return { success: true };
  } catch (error) {
    console.error('Play Radio Error:', error);
    return { success: false, error: 'Failed to play radio' };
  }
}

export async function stopRadio() {
  try {
    await sendMpvCommand({ command: ["playlist-clear"] });
    await sendMpvCommand({ command: ["stop"] });
    return { success: true };
  } catch (error) {
    console.error('Stop Radio Error:', error);
    return { success: false, error: 'Failed to stop radio' };
  }
}

export async function setVolume(volume: number) {
  try {
    const safeVolume = Math.max(0, Math.min(100, volume));
    await sendMpvCommand({ command: ["set_property", "volume", safeVolume] });
    return { success: true };
  } catch (error) {
    console.error('Set Volume Error:', error);
    return { success: false, error: 'Failed to set volume' };
  }
}

export async function setMute(muted: boolean) {
  try {
    await sendMpvCommand({ command: ["set_property", "mute", muted] });
    return { success: true };
  } catch (error) {
    console.error('Set Mute Error:', error);
    return { success: false, error: 'Failed to set mute' };
  }
}