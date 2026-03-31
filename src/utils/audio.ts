import { Howl } from 'howler';

type TrackName = 'day' | 'night' | 'challenge' | 'date' | 'ceremony' | 'menu';

class AudioManager {
  private tracks: Partial<Record<TrackName, Howl>> = {};
  private currentTrack: TrackName | null = null;
  private sfxCache: Record<string, Howl> = {};
  private masterVolume = 0.5;
  private musicVolume = 0.3;
  private sfxVolume = 0.5;
  private muted = false;

  // For prototype: we won't have actual audio files, so this is a stub
  // that would be wired up when audio assets are added

  init() {
    // Audio tracks would be loaded here in production:
    // this.tracks.day = new Howl({ src: ['/audio/day-lofi.mp3'], loop: true, volume: 0 });
    // etc.
    console.log('[AudioManager] Initialized (no audio files in prototype)');
  }

  playTrack(name: TrackName, fadeIn = 2000) {
    if (this.currentTrack === name) return;

    // Fade out current
    if (this.currentTrack && this.tracks[this.currentTrack]) {
      const current = this.tracks[this.currentTrack]!;
      current.fade(this.musicVolume, 0, fadeIn);
      setTimeout(() => current.stop(), fadeIn);
    }

    // Fade in new
    if (this.tracks[name]) {
      const track = this.tracks[name]!;
      track.volume(0);
      track.play();
      track.fade(0, this.musicVolume, fadeIn);
    }

    this.currentTrack = name;
  }

  stopAll() {
    Object.values(this.tracks).forEach(t => t?.stop());
    this.currentTrack = null;
  }

  playSFX(name: string) {
    if (this.muted) return;
    // In production: play SFX from cache
    // this.sfxCache[name]?.play();
  }

  setMasterVolume(v: number) {
    this.masterVolume = v;
    Howler.volume(v);
  }

  setMusicVolume(v: number) {
    this.musicVolume = v;
    if (this.currentTrack && this.tracks[this.currentTrack]) {
      this.tracks[this.currentTrack]!.volume(v);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    Howler.mute(this.muted);
    return this.muted;
  }
}

export const audioManager = new AudioManager();
