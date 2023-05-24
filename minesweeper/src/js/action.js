import { state } from './state';
import { Matrix } from './Matrix';
import { Unit } from './Unit';
import { Sound } from './Sound';
import render from './render';

const action = () => {
  const minesweeper = document.querySelector('.minesweeper');
  const resultTitle = document.querySelector('.minesweeper__result');
  const minefield = document.querySelector('.minesweeper__minefield');
  const pauseButton = document.querySelector('.minesweeper__btn');
  const counter = document.querySelector('.minesweeper__count');
  const timer = document.querySelector('.minesweeper__timer');
  const menu = document.querySelector('.minesweeper__menu');
  const menuHeading = document.querySelector('.menu__pause-heading');
  const menuContainer = document.querySelector('.menu');
  const settingsMenu = document.querySelector('.settings');
  const settingsButton = document.querySelector('.settings-btn');
  const newGameButton = document.querySelector('.menu__new-game-btn');
  const resultsButton = document.querySelector('.menu__result-btn');
  const themeToggle = document.querySelector('.toggle__input');
  const minefieldSize = document.querySelector('.radio');

  const soundsArr = [
    new Sound('open'),
    new Sound('flag'),
    new Sound('lose'),
    new Sound('win'),
    new Sound('boom'),
  ];

  let [openAudio, flagAudio, loseAudio, winAudio, boomAudio] = soundsArr;
  let isFirstMove = true;
  let matrix;
  let count = Number(state.count);
  let time = Number(state.time);
  let setTime;
  const flags = new Set();
  const newGame = () => {
    localStorage.removeItem('saveGame');
    state.isSettings = false;
    state.isStartGame = false;
    state.isWin = false;
    state.isLose = false;
    state.isMenu = false;
    state.count = '000';
    state.time = '000';
    console.log('newGame ');
    render();
    action();
  };

  const loadSaveGame = () => {};
  const showResults = (e) => {
    e.stopPropagation();
    const resultModal = `<div class="result"></div>`;
    document
      .querySelector('.minesweeper__header')
      .insertAdjacentHTML('beforeend', resultModal);
    document.querySelector('.result').classList.remove('result_close');
    document.querySelector('.result').classList.add('result_open');
    menu.addEventListener('click', closeResults);
    if (!!localStorage.getItem('results')) {
      document.querySelector('.result').innerHTML = `
      <div class="result__close-btn"></div>
      <div class="result__heading">You Results:</div>
        <div class="result__container">
        <div class='result__date'>Date:</div>
                        <div class='result__count'>Clicks:</div>
                          <div class='result__time'>Time:</div>
        </div>`;
      let results = Object.entries(JSON.parse(localStorage.getItem('results')));
      results.forEach((element) => {
        let results = `<div class='result__date'>${element[1].date}</div>
                        <div class='result__count'>${element[1].click}</div>
                          <div class='result__time'>${element[1].time}</div>`;
        document
          .querySelector('.result__container')
          .insertAdjacentHTML('beforeend', results);
      });
    } else {
      document.querySelector('.result').innerHTML = `
      <div class="result__close-btn"></div>
      <div class="result__empty">
          haven't results :( </br>
          try to win 
      </div>`;
    }
    document
      .querySelector('.result__close-btn')
      .addEventListener('click', closeResults);
  };
  const closeResults = () => {
    menu.removeEventListener('click', closeResults);
    document
      .querySelector('.result__close-btn')
      .removeEventListener('click', closeResults);
    document.querySelector('.result').classList.remove('result_open');
    document.querySelector('.result').classList.add('result_close');
    setTimeout(() => {
      document.querySelector('.result').remove();
    }, 200);
  };
  const win = () => {
    winAudio.playback();
    minefield.removeEventListener('click', firstMove);
    minefield.removeEventListener('click', move);
    minesweeper.removeEventListener('mouseup', putFlag);
    pauseButton.classList.add('minesweeper__btn_win');
    document.querySelector('.menu__pause-heading').textContent = 'WIN';
    if (!state.isMenu) {
      resultTitle.innerHTML = `Hooray! <br/> You found all mines in ${time} seconds <br/> and ${count} moves`;
      resultTitle.classList.add('minesweeper__result_open');
      clearInterval(setTime);
      openMenu();
      setTimeout(() => {
        pauseButton.addEventListener('click', openMenu);
      }, 300);
    }
  };
  const lose = () => {
    pauseButton.removeEventListener('click', openMenu);
    pauseButton.classList.add('minesweeper__btn_lose');
    document.querySelector('.menu__pause-heading').textContent = 'LOSE';
    setTimeout(() => {
      if (!state.isMenu) {
        clearInterval(setTime);
        loseAudio.playback();
        resultTitle.innerHTML = `Game over. Try again`;
        resultTitle.classList.add('minesweeper__result_open');
        openMenu();
        pauseButton.addEventListener('click', openMenu);
      }
    }, 2000);
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
          saveResults();
        }
      }
    }
  };
  const putFlag = (e) => {
    if (e.button === 2 && e.target.closest('.unit_closed')) {
      flagAudio.playback();
      const unit = new Unit(e.target.id, 'flag');
      unit.putFlag();
      if (matrix === undefined) {
        flags.add(e.target.id);
      } else {
        matrix.addFlags(`${e.target.id}`);
      }
    } else if (e.button === 2 && e.target.closest('.unit_flag')) {
      flagAudio.playback();
      const unit = new Unit(e.target.id, 'closed');
      unit.downFlag();
      if (matrix === undefined) {
        flags.delete(e.target.id);
      } else {
        matrix.deleteFlags(`${e.target.id}`);
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

  const saveResults = () => {
    let date = new Date();
    let saveDate = `${date.getDate()}.${
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1
    }.${date.getFullYear()} ${
      date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    }:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
    if (!localStorage.getItem('results')) {
      const results = {
        1: { click: state.count, time: state.time, date: saveDate },
      };
      localStorage.setItem('results', JSON.stringify(results));
    } else {
      let results = Object.entries(JSON.parse(localStorage.getItem('results')));
      const length = results.length;
      if (length === 10) {
        results = results.map((elem) => {
          return [elem[0] - 1, elem[1]];
        });
        results = results.slice(1, 11);
        results.push([
          10,
          { click: state.count, time: state.time, date: saveDate },
        ]);
        localStorage.setItem(
          'results',
          JSON.stringify(Object.fromEntries(results))
        );
      } else {
        results.push([
          length + 1,
          { click: state.count, time: state.time, date: saveDate },
        ]);
        localStorage.setItem(
          'results',
          JSON.stringify(Object.fromEntries(results))
        );
      }
    }

    let results = [
      [1, { time: 1, click: 2 }],
      [2, { time: 5, click: 3 }],
    ];
    let json = JSON.stringify(Object.fromEntries(results));
  };
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
      menuContainer.classList.add('menu_left');
      settingsButton.classList.remove('settings-btn_right');
      settingsButton.classList.add('settings-btn_left');
      settingsMenu.style.visibility = 'visible';
      settingsMenu.classList.add('settings_left');
      setTimeout(() => {
        menuContainer.style.visibility = 'hidden';
        settingsMenu.classList.remove('settings_left');
        menuContainer.classList.remove('menu_left');
        settingsButton.addEventListener('click', openSettings);
      }, 300);
    } else {
      state.isSettings = false;
      menuContainer.style.visibility = 'visible';
      menuContainer.classList.add('menu_right');
      settingsButton.classList.remove('settings-btn_left');
      settingsButton.classList.add('settings-btn_right');
      settingsMenu.classList.add('settings_right');
      setTimeout(() => {
        document.querySelector('.toggle').style.display = 'none';
        settingsMenu.style.visibility = 'hidden';
        menuContainer.classList.remove('menu_right');
        settingsMenu.classList.remove('settings_right');
        settingsButton.addEventListener('click', openSettings);
      }, 300);
    }
  };

  const openMenu = () => {
    state.isSettings = false;
    pauseButton.removeEventListener('click', openMenu);
    if (state.isMenu && state.isStartGame && !state.isLose && !state.isWin) {
      setTime = setInterval(startTimer, 1000);
    }
    if (state.isMenu) {
      state.isMenu = false;
      menu.classList.remove('minesweeper__menu_open');
      menu.classList.add('minesweeper__menu_close');
      newGameButton.classList.add('menu__new-game-btn_close');
      resultsButton.classList.add('menu__result-btn_close');
      menuHeading.classList.add('menu__pause-heading_close');
      settingsButton.classList.add('settings-btn_close');
      settingsMenu.classList.add('settings_close');
      setTimeout(() => {
        menu.classList.remove('minesweeper__menu_close');
        pauseButton.addEventListener('click', openMenu);
        menuContainer.style.visibility = 'hidden';
        settingsButton.classList.remove('settings-btn_close');
        settingsButton.classList.remove('settings-btn_open');
        newGameButton.classList.remove('menu__new-game-btn_open');
        resultsButton.classList.remove('menu__result-btn_open');
        menuHeading.classList.remove('menu__pause-heading_open');
        settingsMenu.style.visibility = 'hidden';
        settingsButton.style.visibility = 'hidden';
        settingsButton.classList.remove('settings-btn_left');
        settingsButton.classList.remove('settings-btn_right');
      }, 400);
    } else {
      state.isMenu = true;
      settingsMenu.classList.remove('settings_close');
      newGameButton.classList.remove('menu__new-game-btn_close');
      resultsButton.classList.remove('menu__result-btn_close');
      menuHeading.classList.remove('menu__pause-heading_close');
      settingsButton.classList.remove('settings-btn_close');
      menuContainer.style.visibility = 'visible';
      newGameButton.classList.add('menu__new-game-btn_open');
      resultsButton.classList.add('menu__result-btn_open');
      menuHeading.classList.add('menu__pause-heading_open');
      settingsButton.classList.add('settings-btn_open');
      settingsButton.style.visibility = 'visible';
      clearInterval(setTime);
      menu.classList.add('minesweeper__menu_open');
      setTimeout(() => {
        pauseButton.addEventListener('click', openMenu);
      }, 400);
    }
  };

  const firstMove = (event) => {
    if (event.target.closest('.unit_closed') && isFirstMove === true) {
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
      openAudio.playback();
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
          boomAudio.playback();
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
          delay += 150;

          console.log(delay);
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
  const smileDown = (e) => {
    if (
      !state.isLose &&
      !state.isWin &&
      e.target.closest('.unit_closed') &&
      e.button !== 2
    ) {
      pauseButton.classList.add('minesweeper__btn_wait');
    }
  };
  const smileUp = (e) => {
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

  minefield.addEventListener('mousedown', smileDown);
  minefield.addEventListener('mouseup', smileUp);
  resultsButton.addEventListener('click', showResults);
  newGameButton.addEventListener('click', newGame);
};

export default action;
