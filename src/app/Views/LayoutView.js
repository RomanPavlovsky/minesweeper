import Observer from './Observer';

export default class LayoutView extends Observer {
  constructor(interfaceController) {
    super();
    this.interfaceController = interfaceController;
    this.interfaceController.model.addObserver(this);
    document.body.innerHTML = `<div class="minesweeper">
    <div class="minesweeper__result"></div>
    <div class="minesweeper__header">
      <div class="menu">
        <div class="menu__pause-heading">PAUSE</div>
        <div class="menu__new-game-btn">New Game</div>
        <div class="menu__result-btn">Results</div>
      </div>
      <div class="settings"></div>
      <div class="settings-btn"></div>
      <div id="minesweeper__menu-btn" class="minesweeper__menu-btn_normal "></div>
      <div class="minesweeper__counters"></div>
    </div>
    <div class="minesweeper__minefield"></div>
    <div class="minesweeper__menu">
    </div>
  </div>`;
    this.menu = document.querySelector('.minesweeper__menu');
    this.menuButton = document.querySelector('#minesweeper__menu-btn');
    this.minesweeper = document.querySelector('.minesweeper');
    this.resultTitle = document.querySelector('.minesweeper__result');
    this.heading = document.querySelector('.menu__pause-heading');
    this.settingsButton = document.querySelector('.settings-btn');
    this.resultButton = document.querySelector('.menu__result-btn');
    this.newGameButton = document.querySelector('.menu__new-game-btn');
    this.minesweeper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }
  update(model) {
    this.checkTheme(model.settings.theme);
    this.resultTitle.classList.remove('minesweeper__result_open');
    this.resultTitle.innerHTML = '';
    if (model.isWin) {
      this.menuButton.className = '';
      this.menuButton.classList.add('minesweeper__menu-btn_win');
      this.heading.textContent = 'WIN';
      this.resultTitle.innerHTML = `Hooray! <br/> You found all mines in ${model.state.counters.time} seconds <br/> and ${model.state.counters.action} moves`;
      this.resultTitle.classList.add('minesweeper__result_open');
    }
    if (model.isLose) {
      this.menuButton.className = '';
      this.menuButton.classList.add('minesweeper__menu-btn_lose');
      this.heading.textContent = 'LOSE';
      this.resultTitle.innerHTML = `Game over. Try again`;
      this.resultTitle.classList.add('minesweeper__result_open');
    }
    if (!model.isLose && !model.isWin && !model.isWaitUp) {
      this.menuButton.className = '';
      this.menuButton.classList.add('minesweeper__menu-btn_normal');
      this.heading.textContent = 'PAUSE';
    }
    if (model.isWaitUp) {
      this.menuButton.className = '';
      this.menuButton.classList.add('minesweeper__menu-btn_wait');
    }
  }
  checkTheme(theme) {
    if (theme === 'light') {
      this.resultButton.style.backgroundColor = '#fbd65d';
      this.resultButton.style.color = '#000000';
      this.newGameButton.style.backgroundColor = '#fbd65d';
      this.newGameButton.style.color = '#000000';
      this.settingsButton.classList.remove('settings-btn_dark');
      this.settingsButton.classList.add('settings-btn_light');
      document.body.classList.remove('bg_dark');
      document.body.classList.add('bg_light');
      this.menu.style.backgroundColor = '#1ecf2731';
      this.heading.style.color = '#000000';
      this.resultTitle.style.color = '#000000';
    } else {
      this.resultButton.style.backgroundColor = '#006ea1';
      this.resultButton.style.color = '#ffffff';
      this.newGameButton.style.backgroundColor = '#006ea1';
      this.newGameButton.style.color = '#ffffff';
      this.settingsButton.classList.remove('settings-btn_light');
      this.settingsButton.classList.add('settings-btn_dark');
      document.body.classList.remove('bg_light');
      document.body.classList.add('bg_dark');
      this.menu.style.backgroundColor = '#091b2431';
      this.heading.style.color = '#ffffff';
      this.resultTitle.style.color = '#ffffff';
    }
  }
}
