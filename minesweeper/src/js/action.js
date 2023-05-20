import { config } from './config';
import { Matrix } from './Matrix';
import { Unit } from './Unit';
const action = () => {
  const mineSweeper = document.querySelector('.minesweeper__minefield');
  const pauseButton = document.querySelector('.minesweeper__btn');
  const minesweeperMenu = document.querySelector('.minesweeper__menu');
  const menuContainer = document.querySelector('.menu');
  const settingsMenu = document.querySelector('.settings');
  const settingsButton = document.querySelector('.settings-btn');
  const newGameButton = document.querySelector('.minesweeper__new-game-btn');
  const resultsButton = document.querySelector('.minesweeper__result-btn');
  const themeToggle = document.querySelector('.toggle__input');
  themeToggle.addEventListener('click', (e) => {
    if (e.target.closest('.toggle__input')) {
      console.log(themeToggle.checked);
    }
  });
  let isFirstMove = true;
  let matrix;
  const startNewGame = () => {};
  const continueGame = () => {};
  const putFlag = () => {};
  const openSettings = () => {
    settingsButton.removeEventListener('click', openSettings);
    console.log('click settings');
    if (!config.isSettings) {
      document.querySelector('.toggle').style.display = 'block';
      config.isSettings = true;
      menuContainer.classList.add('menu_close');
      settingsButton.classList.remove('settings-btn_close');
      settingsButton.classList.add('settings-btn_open');
      settingsMenu.style.visibility = 'visible';
      settingsMenu.classList.add('settings_open');
      setTimeout(() => {
        menuContainer.style.visibility = 'hidden';
        settingsMenu.classList.remove('settings_open');
        menuContainer.classList.remove('menu_close');
        settingsButton.addEventListener('click', openSettings);
      }, 300);
    } else {
      config.isSettings = false;
      menuContainer.style.visibility = 'visible';
      menuContainer.classList.add('menu_open');
      settingsButton.classList.remove('settings-btn_open');
      settingsButton.classList.add('settings-btn_close');
      settingsMenu.classList.add('settings_close');
      setTimeout(() => {
        document.querySelector('.toggle').style.display = 'none';
        settingsMenu.style.visibility = 'hidden';
        menuContainer.classList.remove('menu_open');
        settingsMenu.classList.remove('settings_close');
        settingsButton.addEventListener('click', openSettings);
      }, 300);
    }
  };
  const openMenu = () => {
    config.isSettings = false;

    pauseButton.removeEventListener('click', openMenu);
    if (config.isMenu) {
      config.isMenu = false;
      minesweeperMenu.classList.remove('minesweeper__menu_open');
      minesweeperMenu.classList.add('minesweeper__menu_close');
      setTimeout(() => {
        minesweeperMenu.classList.remove('minesweeper__menu_close');
        pauseButton.addEventListener('click', openMenu);
        menuContainer.style.visibility = 'visible';
        settingsMenu.style.visibility = 'hidden';
        settingsButton.classList.remove('settings-btn_open');
        settingsButton.classList.remove('settings-btn_close');
      }, 500);
    } else {
      config.isMenu = true;
      minesweeperMenu.classList.add('minesweeper__menu_open');
      setTimeout(() => {
        pauseButton.addEventListener('click', openMenu);
      }, 500);
    }
  };
  const firstMove = (event) => {
    if (event.target.closest('.unit') && isFirstMove !== false) {
      isFirstMove = false;
      matrix = new Matrix(config.matrixSize, config.bombs);
      matrix.createMatrix(event.target.id);
    }
  };
  const move = (event) => {
    console.log(matrix);
    if (event.target.closest('.unit_closed') && isFirstMove === false) {
      const response = matrix.getCell(event.target.id);
      console.log(Object.entries(response));
      Object.entries(response).forEach((elem) => {
        if (elem[1] === 0) {
          const unit = new Unit(elem[0], 'empty');
          unit.openUnit();
        } else if (elem[1] === 'bomb') {
          const unit = new Unit(elem[0], 'bomb');
          unit.openUnit();
        } else {
          const unit = new Unit(elem[0], 'value');
          unit.openUnit(elem[1]);
        }
      });
    }
  };

  mineSweeper.addEventListener('click', firstMove);
  mineSweeper.addEventListener('click', move);
  pauseButton.addEventListener('click', openMenu);
  settingsButton.addEventListener('click', openSettings);
  // document.addEventListener('click', (event) => {
  //   console.log(event.target);
  // });
};

export default action;
