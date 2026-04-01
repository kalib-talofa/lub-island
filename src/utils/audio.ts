import { Howl, Howler } from 'howler';

type TrackName = 'day' | 'night';

// ---------------------------------------------------------------------------
// Synthesized SFX via Web Audio API
// ---------------------------------------------------------------------------

let _audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext {
  if (!_audioCtx) _audioCtx = new AudioContext();
  return _audioCtx;
}

/** Cute chirp/blip sound for text reveal (~40ms) */
function playTypewriterTick(volume = 0.07) {
  const ctx = getAudioCtx();
  if (ctx.state === 'suspended') ctx.resume();

  const now = ctx.currentTime;

  // Soft sine chirp with slight pitch variation for personality
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  const baseFreq = 800 + Math.random() * 200; // 800-1000 Hz range
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + 0.04);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.045);
}

/** UI button tap — a short pop/click (~50ms) */
function playButtonTap(volume = 0.15) {
  const ctx = getAudioCtx();
  if (ctx.state === 'suspended') ctx.resume();

  const now = ctx.currentTime;

  // Quick sine pop
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.06);
}

// ---------------------------------------------------------------------------
// Music manager (Howler)
// ---------------------------------------------------------------------------

class AudioManager {
  private tracks: Partial<Record<TrackName, Howl>> = {};
  private currentTrack: TrackName | null = null;
  private musicVolume = 0.3;
  private sfxEnabled = true;
  private muted = false;
  private initialized = false;

  init() {
    if (this.initialized) return;
    this.initialized = true;

    this.tracks.day = new Howl({
      src: ['/audio/DayMusic.mp3'],
      loop: true,
      volume: 0,
    });

    this.tracks.night = new Howl({
      src: ['/audio/NightMusic.mp3'],
      loop: true,
      volume: 0,
    });

    console.log('[AudioManager] Initialized with DayMusic and NightMusic');
  }

  playTrack(name: TrackName, fadeIn = 2000) {
    this.init();

    if (this.currentTrack === name) return;

    // Fade out current track
    if (this.currentTrack && this.tracks[this.currentTrack]) {
      const current = this.tracks[this.currentTrack]!;
      const currentVol = current.volume();
      current.fade(currentVol, 0, fadeIn);
      const trackToStop = current;
      setTimeout(() => trackToStop.stop(), fadeIn);
    }

    // Fade in new track
    const track = this.tracks[name];
    if (track) {
      track.volume(0);
      track.play();
      track.fade(0, this.musicVolume, fadeIn);
    }

    this.currentTrack = name;
  }

  stopAll(fadeOut = 1000) {
    Object.values(this.tracks).forEach(t => {
      if (t && t.playing()) {
        t.fade(t.volume(), 0, fadeOut);
        setTimeout(() => t.stop(), fadeOut);
      }
    });
    this.currentTrack = null;
  }

  // -------------------------------------------------------------------------
  // SFX
  // -------------------------------------------------------------------------

  /** Play typewriter tick (called per character in dialogue) */
  typewriterTick() {
    if (this.muted || !this.sfxEnabled) return;
    playTypewriterTick();
  }

  /** Play UI button tap sound */
  buttonTap() {
    if (this.muted || !this.sfxEnabled) return;
    playButtonTap();
  }

  // -------------------------------------------------------------------------
  // Volume & mute
  // -------------------------------------------------------------------------

  setMusicVolume(v: number) {
    this.musicVolume = v;
    if (this.currentTrack && this.tracks[this.currentTrack]) {
      this.tracks[this.currentTrack]!.volume(v);
    }
  }

  getMusicVolume() {
    return this.musicVolume;
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    Howler.mute(this.muted);
    return this.muted;
  }
}

export const audioManager = new AudioManager();
