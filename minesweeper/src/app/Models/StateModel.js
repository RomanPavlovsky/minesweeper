import Observable from './Observable';

export default class StateModel extends Observable {
  constructor() {
    super();
    this.settings = {
      matrixSize: 10,
      bombs: 10,
      theme: 'light',
      sound: true,
      isCustom: false,
      customBombs: null,
      customSize: null,
    };
    this.state = {
      counters: {
        flag: 0,
        bomb: this.settings.bombs,
        time: 0,
        action: 0,
      },
      matrix: null,
      cells: null,
      flags: new Set(),
    };
    this.isStartGame = false;
  }
  loadSettings() {
    console.log('loader settings');
    const settings = JSON.parse(localStorage.getItem('settings'));
    for (const iterator in settings) {
      this.settings[iterator] = settings[iterator];
    }
    this.state.counters.bomb = this.settings.bombs;
  }
  startTimer() {
    this.state.counters.time += 1;
    this.notify(this);
  }
  swapTheme() {
    if (this.settings.theme === 'light') {
      this.settings.theme = 'dark';
      // document.body.classList.replace('background_light', 'background_dark');
    } else {
      this.settings.theme = 'light';
      // document.body.classList.replace('background_dark', 'background_light');
    }
  }

  setBombs() {
    if (!!this.settings.customBombs) {
      this.settings.bombs = Number(this.settings.customBombs);
    }
  }
  setSize() {
    if (!!this.settings.customSize) {
      this.settings.matrixSize = Number(this.settings.customSize);
    }
  }
  toggleSound() {
    if (this.settings.sound) {
      this.settings.sound = false;
    } else {
      this.settings.sound = true;
    }
  }
  saveSettings() {
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }
}
