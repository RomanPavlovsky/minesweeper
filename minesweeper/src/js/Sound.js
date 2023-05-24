import openAudio from '../assets/audio/open.mp3';
import flagAudio from '../assets/audio/flag.mp3';
import winAudio from '../assets/audio/win.mp3';
import boomAudio from '../assets/audio/boom.mp3';
import loseAudio from '../assets/audio/lose.mp3';
export class Sound {
  constructor(type) {
    this.type = type;
    if (type === 'flag') {
      this.audio = new Audio();
      this.audio.src = flagAudio;
    }
    if (type === 'open') {
      this.audio = new Audio();
      this.audio.src = openAudio;
    }
    if (type === 'win') {
      this.audio = new Audio();
      this.audio.src = winAudio;
    }
    if (type === 'boom') {
      this.audio = new Audio();
      this.audio.src = boomAudio;
    }
    if (type === 'lose') {
      this.audio = new Audio();
      this.audio.src = loseAudio;
    }
  }

  playback() {
    this.audio.play();
  }
  muted() {
    this.audio.muted = true;
  }
  unmuted() {
    this.audio.muted = false;
  }
}
