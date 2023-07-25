import Observer from './Observer';

export default class MenuView extends Observer {
  constructor(interfaceController) {
    super();
    this.interfaceController = interfaceController;
    interfaceController.model.addObserver(this);
    this.menuButton = document.querySelector('#minesweeper__menu-btn');
    this.menu = document.querySelector('.minesweeper__menu');
    this.settingsButton = document.querySelector('.settings-btn');
    this.newGameButton = document.querySelector('.menu__new-game-btn');
    this.resultButton = document.querySelector('.menu__result-btn');
    this.settingsMenu = document.querySelector('.settings');
    this.menuHeading = document.querySelector('.menu__pause-heading');
    this.menuContainer = document.querySelector('.menu');
    this.toggleMenu = this.interfaceController.toggleMenu.bind(
      this.interfaceController
    );
    this.toggleSettings = this.interfaceController.toggleSettings.bind(
      this.interfaceController
    );
    this.newGame = this.interfaceController.newGame.bind(
      this.interfaceController
    );
    this.menuButton.addEventListener('click', this.toggleMenu);
    this.settingsButton.addEventListener('click', this.toggleSettings);
    this.newGameButton.addEventListener('click', this.newGame);
  }
  update(model) {
    if (model.isGameOver) {
      this.menuButton.removeEventListener('click', this.toggleMenu);
    }
    if (model.isGameOver) {
      this.menuButton.removeEventListener('click', this.toggleMenu);
    }
    if (model.isOpenMenu && model.isChangeMenu) {
      this.openMenu();
    }
    if (!model.isOpenMenu && model.isChangeMenu) {
      this.closeMenu();
    }
    if (model.isOpenSettings && model.isChangeSettings) {
      this.openSettings();
    }
    if (!model.isOpenSettings && model.isChangeSettings) {
      this.closeSettings();
    }
  }

  openMenu() {
    this.newGameButton.removeEventListener('click', this.newGame);
    this.menuButton.removeEventListener('click', this.toggleMenu);
    this.settingsMenu.classList.remove('settings_close');
    this.newGameButton.classList.remove('menu__new-game-btn_close');
    this.resultButton.classList.remove('menu__result-btn_close');
    this.menuHeading.classList.remove('menu__pause-heading_close');
    this.settingsButton.classList.remove('settings-btn_close');
    this.menuContainer.style.visibility = 'visible';
    this.newGameButton.classList.add('menu__new-game-btn_open');
    this.resultButton.classList.add('menu__result-btn_open');
    this.menuHeading.classList.add('menu__pause-heading_open');
    this.settingsButton.classList.add('settings-btn_open');
    this.settingsButton.style.visibility = 'visible';
    this.menu.classList.add('minesweeper__menu_open');
    setTimeout(() => {
      this.menuButton.addEventListener('click', this.toggleMenu);
      this.newGameButton.addEventListener('click', this.newGame);
    }, 400);
  }
  closeMenu() {
    this.newGameButton.removeEventListener('click', this.newGame);
    this.menuButton.removeEventListener('click', this.toggleMenu);
    document.querySelector('.custom').style.visibility = 'hidden';
    document.querySelector('.custom').classList.remove('custom_open');
    this.menu.classList.remove('minesweeper__menu_open');
    this.menu.classList.add('minesweeper__menu_close');
    this.newGameButton.classList.add('menu__new-game-btn_close');
    this.resultButton.classList.add('menu__result-btn_close');
    this.menuHeading.classList.add('menu__pause-heading_close');
    this.settingsButton.classList.add('settings-btn_close');
    this.settingsMenu.classList.add('settings_close');
    this.menu.classList.remove('minesweeper__menu_close');
    this.menuButton.addEventListener('click', this.toggleMenu);
    this.newGameButton.addEventListener('click', this.newGame);
    this.menuContainer.style.visibility = 'hidden';
    this.settingsButton.classList.remove('settings-btn_close');
    this.settingsButton.classList.remove('settings-btn_open');
    this.newGameButton.classList.remove('menu__new-game-btn_open');
    this.resultButton.classList.remove('menu__result-btn_open');
    this.menuHeading.classList.remove('menu__pause-heading_open');
    this.settingsMenu.style.visibility = 'hidden';
    this.settingsButton.style.visibility = 'hidden';
    this.settingsButton.classList.remove('settings-btn_left');
    this.settingsButton.classList.remove('settings-btn_right');
  }
  openSettings() {
    this.settingsButton.removeEventListener('click', this.toggleSettings);
    document.querySelectorAll('.radio-checkbox__input').forEach((elem) => {
      if (elem.checked && elem.value === 'custom') {
        document.querySelector('.custom').style.visibility = 'visible';
        document.querySelector('.custom').classList.add('custom_open');
      }
    });
    document.querySelector('.toggle').style.display = 'block';
    this.menuContainer.classList.add('menu_left');
    this.settingsButton.classList.remove('settings-btn_right');
    this.settingsButton.classList.add('settings-btn_left');
    this.settingsMenu.style.visibility = 'visible';
    this.settingsMenu.classList.add('settings_left');
    setTimeout(() => {
      this.menuContainer.style.visibility = 'hidden';
      this.settingsMenu.classList.remove('settings_left');
      this.menuContainer.classList.remove('menu_left');
      this.settingsButton.addEventListener('click', this.toggleSettings);
    }, 300);
  }
  closeSettings() {
    this.settingsButton.removeEventListener('click', this.toggleSettings);
    document.querySelector('.custom').style.visibility = 'hidden';
    document.querySelector('.custom').classList.remove('custom_open');
    this.menuContainer.style.visibility = 'visible';
    this.menuContainer.classList.add('menu_right');
    this.settingsButton.classList.remove('settings-btn_left');
    this.settingsButton.classList.add('settings-btn_right');
    this.settingsMenu.classList.add('settings_right');
    setTimeout(() => {
      document.querySelector('.toggle').style.display = 'none';
      this.settingsMenu.style.visibility = 'hidden';
      this.menuContainer.classList.remove('menu_right');
      this.settingsMenu.classList.remove('settings_right');
      this.settingsButton.addEventListener('click', this.toggleSettings);
    }, 300);
  }
}
