import openAudio from '../../assets/audio/open.mp3';
import flagAudio from '../../assets/audio/flag.mp3';
import winAudio from '../../assets/audio/win.mp3';
import boomAudio from '../../assets/audio/boom.mp3';
import loseAudio from '../../assets/audio/lose.mp3';
import Observer from './Observer';

export default class SoundView extends Observer {
  constructor(interfaceController) {
    super();
    this.interfaceController = interfaceController;
    this.interfaceController.model.addObserver(this);
    this.openAudio = new Audio();
    this.openAudio.src = openAudio;
    this.flagAudio = new Audio();
    this.flagAudio.src = flagAudio;
    this.winAudio = new Audio();
    this.winAudio.src = winAudio;
    this.bombAudio = new Audio();
    this.bombAudio.src = boomAudio;
    this.loseAudio = new Audio();
    this.loseAudio.src = loseAudio;
    this.sounds = [
      this.openAudio,
      this.flagAudio,
      this.winAudio,
      this.loseAudio,
      this.bombAudio,
    ];
  }
  update(model) {
    if (model.isNewGame) {
      this.stopPlay();
    }
    if (model.isGameOver && model.isLose) {
      this.bombAudio.play();
    }
    if (model.isGameOver && model.isWin) {
      this.winAudio.play();
    }
    if (model.isGameOver && model.isLose) {
      this.loseAudio.play();
    }
    if (model.openCells !== null && !model.isLose) {
      this.openAudio.play();
    }
    if (model.isFlag) {
      this.flagAudio.play();
    }
    if (model.settings.sound) {
      this.unmuted();
    }
    if (!model.settings.sound) {
      this.muted();
    }
  }
  stopPlay() {
    this.sounds.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
  muted() {
    this.sounds.forEach((audio) => {
      audio.muted = true;
    });
  }
  unmuted() {
    this.sounds.forEach((audio) => {
      audio.muted = false;
    });
  }
}
