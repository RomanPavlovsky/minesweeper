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
  const flagCounter = document.querySelector('.minesweeper__flag');
  const bombCounter = document.querySelector('.minesweeper__mines');
  const timer = document.querySelector('.minesweeper__timer');
  const menu = document.querySelector('.minesweeper__menu');
  const menuHeading = document.querySelector('.menu__pause-heading');
  const menuContainer = document.querySelector('.menu');
  const settingsMenu = document.querySelector('.settings');
  const settingsButton = document.querySelector('.settings-btn');
  const newGameButton = document.querySelector('.menu__new-game-btn');
  const resultsButton = document.querySelector('.menu__result-btn');
  const themeToggle = document.querySelector('.toggle__input');
  const minefieldLvl = document.querySelector('.radio-lvl');
  const minefieldCustomSize = document.querySelector('.radio-size');
  const inputBombs = document.querySelector('.mines__input');
  const inputProgress = document.querySelector('.mines__progress');
  const audioButton = document.querySelector('.settings__audio');
  const applyCustom = document.querySelector('.custom__apply');

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
  let flagCount = Number(state.flagCount);
  let time = Number(state.time);
  let setTime;
  let isStopAnimationBombs = false;
  const flags = new Set();
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

  if (localStorage.getItem('saveGame') !== null) {
    state.isStartGame = true;
    isFirstMove = false;
    const loadGame = JSON.parse(localStorage.getItem('saveGame'));
    matrix = new Matrix(loadGame.matrix.matrixSize, loadGame.matrix.bombs);
    matrix.flagsID = loadGame.matrix.flagsID;
    matrix.matrix = loadGame.matrix.matrix;
    matrix.matrixState = loadGame.matrix.matrixState;
    matrix.positionsBombs = loadGame.matrix.positionsBombs;
    console.log('state', state);
    state.flagCount = loadGame.flagCount;
    state.count = loadGame.count;
    count = Number(loadGame.count);
    flagCount = Number(loadGame.flagCount);
    time = Number(loadGame.time);
    state.minesCount = loadGame.minesCount;
    bombCounter.textContent = `${state.minesCount}`;
    setTime = setInterval(startTimer, 1000);
    matrix.flagsID.forEach((elem) => {
      if (matrix.positionsBombs.includes(Number(elem))) {
        bombCounter.textContent = `0${bombCounter.textContent - 1}`;
      }
    });
  }
  const checkSound = () => {
    if (state.settings.sound === true) {
      soundsArr.forEach((elem) => {
        elem.unmuted();
      });
    } else {
      soundsArr.forEach((elem) => {
        elem.muted();
        audioButton.classList.toggle('settings__audio_off');
      });
    }
  };
  checkSound();
  const saveSettings = () => {
    localStorage.setItem('settings', JSON.stringify(state.settings));
  };

  const newGame = () => {
    isStopAnimationBombs = true;
    localStorage.removeItem('saveGame');
    state.isSettings = false;
    state.isStartGame = false;
    state.isWin = false;
    state.isLose = false;
    state.isMenu = false;
    state.count = '000';
    state.time = '000';
    state.flagCount = '000';
    state.minesCount = '000';
    console.log('newGame');
    render();
    action();
  };
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
    localStorage.removeItem('saveGame');
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
    localStorage.removeItem('saveGame');
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
      flagCount += 1;
      if (flagCount < 10) {
        state.flagCount = `00${flagCount}`;
      } else if (flagCount >= 10 && flagCount < 100) {
        state.flagCount = `0${flagCount}`;
      } else if (flagCount >= 100) {
        state.flagCount = `${flagCount}`;
      }
      flagCounter.textContent = state.flagCount;
      flagAudio.playback();
      const unit = new Unit(e.target.id, 'flag');
      unit.putFlag();
      if (matrix === undefined) {
        flags.add(e.target.id);
      } else {
        matrix.addFlags(`${e.target.id}`);
        if (matrix.positionsBombs.includes(Number(e.target.id))) {
          bombCounter.textContent = `0${bombCounter.textContent - 1}`;
        }
      }
    } else if (e.button === 2 && e.target.closest('.unit_flag')) {
      flagCount -= 1;
      if (flagCount < 10) {
        state.flagCount = `00${flagCount}`;
      } else if (flagCount >= 10 && flagCount < 100) {
        state.flagCount = `0${flagCount}`;
      } else if (flagCount >= 100) {
        state.flagCount = `${flagCount}`;
      }
      flagCounter.textContent = state.flagCount;
      flagAudio.playback();
      const unit = new Unit(e.target.id, 'closed');
      unit.downFlag();
      if (matrix === undefined) {
        flags.delete(e.target.id);
      } else {
        matrix.deleteFlags(`${e.target.id}`);
        if (matrix.positionsBombs.includes(Number(e.target.id))) {
          bombCounter.textContent = `0${
            Number(bombCounter.textContent.slice(-2)) + 1
          }`;
        }
      }
    }
  };
  const saveGame = () => {
    let cells = document.querySelectorAll('.unit');
    if (!state.isWin && !state.isLose && state.isStartGame) {
      let matrixCopy = Object.assign(matrix);
      let game = {
        matrix: matrixCopy,
        count: state.count,
        time: state.time,
        flagCount: state.flagCount,
        minesCount: state.minesCount,
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
  };
  const selectLvl = (e) => {
    e.stopPropagation();
    if (e.target.closest('.radio-checkbox__input')) {
      console.log('lvl');
      e.target.setAttribute('checked', 'checked');
      document.querySelector('.custom').style.visibility = 'hidden';
      document.querySelector('.custom').classList.remove('custom_open');
      if (Number(e.target.value) === 10 && e.target.name === 'difficulty') {
        state.settings.matrixSize = Number(e.target.value);
        state.settings.bombs = 10;
        state.settings.isCustom = false;
        saveSettings();
        newGame();
      }
      if (Number(e.target.value) === 15 && e.target.name === 'difficulty') {
        state.settings.matrixSize = Number(e.target.value);
        state.settings.bombs = 45;
        state.settings.isCustom = false;
        saveSettings();
        newGame();
      }
      if (Number(e.target.value) === 25 && e.target.name === 'difficulty') {
        state.settings.matrixSize = Number(e.target.value);
        state.settings.bombs = 99;
        state.settings.isCustom = false;
        saveSettings();
        newGame();
      }
      if (e.target.value === 'custom') {
        state.settings.isCustom = true;
        console.log(state.settings.matrixSize);
        document.querySelector('.custom').style.visibility = 'visible';
        document.querySelector('.custom').classList.add('custom_open');
        saveSettings();
      }
    }
  };
  const selectSize = (e) => {
    e.stopPropagation();
    if (e.target.closest('.radio-checkbox__input')) {
      console.log('size');
      e.target.setAttribute('checked', 'checked');
      if (e.target.name === 'minefield') {
        state.settings.matrixSize = Number(e.target.value);
      }
      saveSettings();
    }
  };
  const changeBombs = () => {
    inputProgress.style.width = inputBombs.value + '%';
    state.settings.bombs = inputBombs.value;
    document.querySelector(
      '.mines__heading'
    ).textContent = `Mines: ${inputBombs.value}`;
    saveSettings();
  };

  const toggleSound = (e) => {
    e.stopPropagation();
    console.log('sound');
    if (audioButton.dataset.sound === 'true') {
      state.settings.sound = false;
      audioButton.classList.toggle('settings__audio_off');
      audioButton.dataset.sound = 'false';
      soundsArr.forEach((elem) => {
        elem.muted();
      });
    } else {
      audioButton.classList.toggle('settings__audio_off');
      audioButton.dataset.sound = 'true';
      state.settings.sound = true;
      soundsArr.forEach((elem) => {
        elem.unmuted();
      });
    }
    saveSettings();
    console.log(state.settings);
  };

  const swapTheme = (e) => {
    e.stopPropagation();
    console.log('theme');
    if (e.target.closest('.toggle__input')) {
      if (state.settings.theme === 'light' && themeToggle.checked === true) {
        state.settings.theme = 'dark';
        settingsMenu.style.color = '#ffffff';
        document.querySelector('.menu__pause-heading').style.color = '#ffffff';
        document.querySelector('.minesweeper__header').style.color = '#ffffff';
        document
          .getElementById('count-icon')
          .classList.add('minesweeper__count-icon_dark');
        document
          .getElementById('count-icon')
          .classList.remove('minesweeper__count-icon_light');
        document
          .getElementById('timer-icon')
          .classList.add('minesweeper__timer-icon_dark');
        document
          .getElementById('timer-icon')
          .classList.remove('minesweeper__timer-icon_light');
        document
          .getElementById('flag-icon')
          .classList.add('minesweeper__flag-icon_dark');
        document
          .getElementById('flag-icon')
          .classList.remove('minesweeper__flag-icon_light');
        document
          .getElementById('mines-icon')
          .classList.add('minesweeper__mines-icon_dark');
        document
          .getElementById('mines-icon')
          .classList.remove('minesweeper__mines-icon_light');
        menu.style.backgroundColor = '#091b2431';
        document.body.style.background =
          'linear-gradient(210deg, #193744, #282b26, #1a1108)';
      } else if (
        state.settings.theme === 'dark' &&
        themeToggle.checked === false
      ) {
        document.querySelector('.menu__pause-heading').style.color = '#000000';
        settingsMenu.style.color = '#000000';
        document.querySelector('.minesweeper__header').style.color = '#000000';
        document
          .getElementById('count-icon')
          .classList.add('minesweeper__count-icon_light');
        document
          .getElementById('count-icon')
          .classList.remove('minesweeper__count-icon_dark');
        document
          .getElementById('timer-icon')
          .classList.add('minesweeper__timer-icon_light');
        document
          .getElementById('timer-icon')
          .classList.remove('minesweeper__timer-icon_dark');
        document
          .getElementById('flag-icon')
          .classList.add('minesweeper__flag-icon_light');
        document
          .getElementById('flag-icon')
          .classList.remove('minesweeper__flag-icon_dark');
        document
          .getElementById('mines-icon')
          .classList.add('minesweeper__mines-icon_light');
        document
          .getElementById('mines-icon')
          .classList.remove('minesweeper__mines-icon_dark');
        state.settings.theme = 'light';
        menu.style.backgroundColor = '#1ecf2731';
        document.body.style.background =
          'linear-gradient(210deg, #3f87a6, #ebf8e1, #f69d3c)';
      }
    }
    saveSettings();
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

  const openSettings = () => {
    settingsButton.removeEventListener('click', openSettings);
    if (!state.isSettings) {
      document.querySelectorAll('.radio-checkbox__input').forEach((elem) => {
        if (elem.checked && elem.value === 'custom') {
          document.querySelector('.custom').style.visibility = 'visible';
          document.querySelector('.custom').classList.add('custom_open');
        }
      });
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
      document.querySelector('.custom').style.visibility = 'hidden';
      document.querySelector('.custom').classList.remove('custom_open');
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
      document.querySelector('.custom').style.visibility = 'hidden';
      document.querySelector('.custom').classList.remove('custom_open');
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
      bombCounter.textContent = `0${matrix.bombs}`;
      state.minesCount = `0${matrix.bombs}`;
      matrix.flagsID.forEach((elem) => {
        if (matrix.positionsBombs.includes(Number(elem))) {
          bombCounter.textContent = `0${bombCounter.textContent - 1}`;
        }
      });
    }
  };

  const move = (event) => {
    console.log(matrix);
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
          const explosion = () => {
            if (isStopAnimationBombs === true) {
              clearTimeout(animationTimer);
            } else {
              const unit = new Unit(elem[0], 'bomb');
              unit.openUnit(event.target.id);
            }
          };
          const animationTimer = setTimeout(explosion, delay);
          delay += 140;
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
  //settings
  themeToggle.addEventListener('click', swapTheme);
  minefieldLvl.addEventListener('click', selectLvl);
  audioButton.addEventListener('click', toggleSound);
  inputBombs.addEventListener('input', changeBombs);
  applyCustom.addEventListener('click', newGame);
  minefieldCustomSize.addEventListener('click', selectSize);
};

export default action;
