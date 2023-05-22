import { state } from './state';
import { Matrix } from './Matrix';
import { Unit } from './Unit';

const action = () => {
  const minesweeper = document.querySelector('.minesweeper');
  const minefield = document.querySelector('.minesweeper__minefield');
  const pauseButton = document.querySelector('.minesweeper__btn');
  const counter = document.querySelector('.minesweeper__count');
  const timer = document.querySelector('.minesweeper__timer');
  const menu = document.querySelector('.minesweeper__menu');
  const menuContainer = document.querySelector('.menu');
  const settingsMenu = document.querySelector('.settings');
  const settingsButton = document.querySelector('.settings-btn');
  const newGameButton = document.querySelector('.minesweeper__new-game-btn');
  const resultsButton = document.querySelector('.minesweeper__result-btn');
  const themeToggle = document.querySelector('.toggle__input');
  const minefieldSize = document.querySelector('.radio');

  let isFirstMove = true;
  let matrix;
  let count = Number(state.count);
  let time = Number(state.time);
  let setTime;
  const flags = new Set();
  const newGame = () => {};

  const win = () => {
    pauseButton.classList.add('minesweeper__btn_win');
    document.querySelector('.menu__pause-header').textContent = 'WIN';
    if (!state.isMenu) {
      clearInterval(setTime);
      menu.classList.add('minesweeper__menu_open');
      setTimeout(() => {
        pauseButton.addEventListener('click', openMenu);
      }, 500);
    }
  };
  const lose = () => {
    pauseButton.classList.add('minesweeper__btn_lose');
    document.querySelector('.menu__pause-header').textContent = 'LOSE';
    setTimeout(() => {
      if (!state.isMenu) {
        clearInterval(setTime);
        menu.classList.add('minesweeper__menu_open');
        setTimeout(() => {
          pauseButton.addEventListener('click', openMenu);
        }, 500);
      }
    }, 3000);
  };
  const checkWin = () => {
    let cells = document.querySelectorAll('.unit');
    if (!state.isLose) {
      let idArr = [];
      cells.forEach((elem) => {
        if (elem.dataset.type === 'closed' || elem.dataset.type === 'flag') {
          idArr.push(Number(elem.id));
        }
      });
      let bombsId = matrix.positionsBombs.sort((a, b) => a - b);
      if (idArr.length === bombsId.length) {
        let count = 0;
        for (let i = 0; i < idArr.length; i++) {
          const element = idArr[i];
          if (element === bombsId[i]) {
            count += 1;
          }
        }
        if (count === idArr.length) {
          state.isWin = true;
          win();
        }
      }

      console.log(matrix);
    }
  };
  const putFlag = (e) => {
    if (e.button === 2 && e.target.closest('.unit_closed')) {
      const unit = new Unit(event.target.id, 'flag');
      unit.putFlag();
      if (matrix === undefined) {
        flags.add(event.target.id);
      } else {
        console.log(matrix);
        matrix.addFlags(`${event.target.id}`);
      }
    } else if (e.button === 2 && e.target.closest('.unit_flag')) {
      const unit = new Unit(event.target.id, 'closed');
      unit.downFlag();
      if (matrix === undefined) {
        flags.delete(event.target.id);
      } else {
        matrix.deleteFlags(`${event.target.id}`);
      }
    }
  };

  const saveSettings = () => {
    localStorage.setItem('settings', JSON.stringify(state.settings));
  };
  const saveGame = () => {
    let cells = document.querySelectorAll('.unit');
    if (!state.isWin && !state.isLose && state.isStartGame) {
      let game = {
        matrix: matrix,
        count: state.count,
        time: state.time,
        cells: {},
      };
      cells.forEach((elem) => {
        let id = elem.id;
        game.cells[id] = {
          type: elem.dataset.type,
          value: elem.innerText,
        };
      });
      localStorage.setItem('saveGame', JSON.stringify(game));
      // console.log(JSON.parse(localStorage.getItem('saveGame')));
    }
  };

  const saveResults = () => {};
  const changeMinefieldSize = (e) => {
    if (e.target.closest('.radio-checkbox__input')) {
      e.target.setAttribute('checked', 'checked');
      state.settings.matrixSize = Number(e.target.value);
      saveSettings();
    }
  };

  const swapTheme = (e) => {
    if (e.target.closest('.toggle__input')) {
      if (state.settings.theme === 'light' && themeToggle.checked === true) {
        state.settings.theme = 'dark';
        menu.style.backgroundColor = '#091b2431';
        document.body.style.background =
          'linear-gradient(210deg, #193744, #282b26, #1a1108)';
      } else if (
        state.settings.theme === 'dark' &&
        themeToggle.checked === false
      ) {
        state.settings.theme = 'light';
        menu.style.backgroundColor = '#1ecf2731';
        document.body.style.background =
          'linear-gradient(210deg, #3f87a6, #ebf8e1, #f69d3c)';
      }
    }
  };
  const clickCount = () => {
    count += 1;
    if (count < 10) {
      state.count = `00${count}`;
    } else if (count >= 10 && count < 100) {
      state.count = `0${count}`;
    } else if (count >= 100) {
      state.count = `${count}`;
    }
    counter.textContent = state.count;
  };
  const startTimer = () => {
    time += 1;
    if (time < 10) {
      state.time = `00${time}`;
    } else if (time >= 10 && time < 100) {
      state.time = `0${time}`;
    } else if (time >= 100) {
      state.time = `${time}`;
    }
    timer.textContent = state.time;
  };

  const openSettings = () => {
    settingsButton.removeEventListener('click', openSettings);
    if (!state.isSettings) {
      document.querySelector('.toggle').style.display = 'block';
      state.isSettings = true;
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
      state.isSettings = false;
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
    state.isSettings = false;
    pauseButton.removeEventListener('click', openMenu);
    if (state.isMenu && state.isStartGame && !state.isLose) {
      setTime = setInterval(startTimer, 1000);
    }
    if (state.isMenu) {
      state.isMenu = false;
      menu.classList.remove('minesweeper__menu_open');
      menu.classList.add('minesweeper__menu_close');
      setTimeout(() => {
        menu.classList.remove('minesweeper__menu_close');
        pauseButton.addEventListener('click', openMenu);
        menuContainer.style.visibility = 'visible';
        settingsMenu.style.visibility = 'hidden';
        settingsButton.classList.remove('settings-btn_open');
        settingsButton.classList.remove('settings-btn_close');
      }, 400);
    } else {
      state.isMenu = true;
      clearInterval(setTime);
      menu.classList.add('minesweeper__menu_open');
      setTimeout(() => {
        pauseButton.addEventListener('click', openMenu);
      }, 400);
    }
  };

  const firstMove = (event) => {
    if (event.target.closest('.unit') && isFirstMove !== false) {
      isFirstMove = false;
      state.isStartGame = true;
      setTime = setInterval(startTimer, 1000);
      matrix = new Matrix(state.settings.matrixSize, state.settings.bombs);
      flags.forEach((elem) => {
        matrix.addFlags(elem);
      });
      matrix.createMatrix(event.target.id);
    }
  };

  const move = (event) => {
    let delay = 0;
    if (event.target.closest('.unit_closed') && isFirstMove === false) {
      clickCount();
      const response = matrix.getCell(event.target.id);
      // console.log(Object.entries(response));
      Object.entries(response).forEach((elem) => {
        let cell = document.getElementById(elem[0]);
        if (elem[1] === 0) {
          if (cell.dataset.type !== 'flag') {
            const unit = new Unit(elem[0], 'empty');
            unit.openUnit();
          }
        } else if (elem[1] === 'bomb') {
          state.isLose = true;
          lose();
          clearInterval(setTime);
          minefield.classList.add('snake');
          minefield.removeEventListener('click', firstMove);
          minefield.removeEventListener('click', move);
          minesweeper.removeEventListener('mouseup', putFlag);
          setTimeout(() => {
            const unit = new Unit(elem[0], 'bomb');
            unit.openUnit(event.target.id);
          }, delay);
          delay += 200;
        } else {
          if (cell.dataset.type !== 'flag') {
            const unit = new Unit(elem[0], 'value');
            unit.openUnit(elem[1]);
          }
        }
      });
      checkWin();
    }
  };
  const addWaitSmile = () => {
    if (!state.isLose && !state.isWin) {
      pauseButton.classList.add('minesweeper__btn_wait');
    }
  };
  const removeWaitSmile = (e) => {
    if (!state.isLose && !state.isWin) {
      pauseButton.classList.remove('minesweeper__btn_wait');
    }
  };

  minefield.addEventListener('click', firstMove);
  minefield.addEventListener('click', move);
  pauseButton.addEventListener('click', openMenu);
  settingsButton.addEventListener('click', openSettings);
  themeToggle.addEventListener('click', swapTheme);
  minefieldSize.addEventListener('click', changeMinefieldSize);
  window.addEventListener('beforeunload', saveSettings);
  window.addEventListener('beforeunload', saveGame);
  minesweeper.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
  minesweeper.addEventListener('mouseup', putFlag);

  minefield.addEventListener('mousedown', addWaitSmile);
  minefield.addEventListener('mouseup', removeWaitSmile);
};

export default action;
