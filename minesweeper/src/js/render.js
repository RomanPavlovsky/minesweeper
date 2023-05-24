import { state } from './state';
import { Unit } from './Unit';

const render = () => {
  const loadSettings = () => {
    if (localStorage.getItem('settings') !== null) {
      const settings = JSON.parse(localStorage.getItem('settings'));
      for (const iterator in settings) {
        state.settings[iterator] = settings[iterator];
      }
    }
  };
  loadSettings();
  console.log('load state', state.settings);
  document.body.innerHTML = `  <div class="minesweeper">
  <div class="minesweeper__result"></div>
  <div class="minesweeper__header">
    <div class="menu">
      <div class="menu__pause-heading">PAUSE</div>
      <div class="menu__new-game-btn">New Game</div>
      <div class="menu__result-btn">last 10 results</div>
    </div>
    <div class="settings">
      <div class="settings__heading">SETTINGS</div>
      <div class="settings__theme">
        <div class="heading">Theme</div>
        <label class="toggle" for="theme">
          <input class="toggle__input" type="checkbox" name="theme" id="theme" />
          <span class="toggle__custom"></span>
        </label>
      </div>
      <div class="settings__audio" data-sound="${state.settings.sound}"></div>
      <div class="settings__difficulty-level">
        <div class="heading">Difficulty level:</div>
        <div class="radio-lvl radio">
          <label class="radio-checkbox tooltip">
            <span class="tooltip__text">Size:10x10 Mines:10</span>
            <input class="radio-checkbox__input" type="radio" name="difficulty" value="10" checked="checked" />
            <span class="radio-checkbox__custom"></span>
            Easy
          </label>
          <label class="radio-checkbox tooltip">
            <span class="tooltip__text">Size:15x15 Mines:45</span>
            <input class="radio-checkbox__input" type="radio" name="difficulty" value="15" />
            <span class="radio-checkbox__custom"></span>
            Medium
          </label>
          <label class="radio-checkbox tooltip">
            <span class="tooltip__text">Size:25x25 Mines:99</span>
            <input class="radio-checkbox__input" type="radio" name="difficulty" value="25" />
            <span class="radio-checkbox__custom"></span>
            Hard
          </label>
          <label class="radio-checkbox tooltip">
            <span class="tooltip__text">Custom settings</span>
            <input class="radio-checkbox__input" type="radio" name="difficulty" value="custom" />
            <span class="radio-checkbox__custom"></span>
            Custom
          </label>
        </div>
      </div>
      <div class="custom">
        <div class="custom__mines">
          <div class="mines__heading">Mines: ${state.settings.bombs}</div>
          <div class="mines">
            <div class="mines__line"></div>
            <input class="mines__input" type="range" min="10" max="99" value="${state.settings.bombs}" step="1" />
            <div class="mines__progress"></div>
          </div>
        </div>
        <div class="custom__size">
          <div class="heading">Minefield size:</div>
          <div class="radio-size radio">
            <label class="radio-checkbox">
              <input class="radio-checkbox__input" type="radio" name="minefield" value="10" checked="checked" />
              <span class="radio-checkbox__custom"></span> 10
            </label>
            <label class="radio-checkbox">
              <input class="radio-checkbox__input" type="radio" name="minefield" value="15" />
              <span class="radio-checkbox__custom"></span> 15
            </label>
            <label class="radio-checkbox">
              <input class="radio-checkbox__input" type="radio" name="minefield" value="25" />
              <span class="radio-checkbox__custom"></span> 25
            </label>
          </div>
        </div>
        <div class='custom__apply'>Apply</div>
      </div>
    </div>
    <div class="settings-btn"></div>
    <div class="minesweeper__count">${state.count}</div>
    <div class="minesweeper__btn"></div>
    <div class="minesweeper__timer">000</div>
  </div>
  <div class="minesweeper__minefield"></div>
  <div class="minesweeper__menu">
  </div>
</div>`;
  const menu = document.querySelector('.minesweeper__menu');
  const themeToggle = document.querySelector('.toggle__input');
  const renderTheme = () => {
    if (state.settings.theme === 'dark') {
      themeToggle.checked = true;
      menu.style.backgroundColor = '#091b2431';
      document.body.style.background =
        'linear-gradient(210deg, #193744, #282b26, #1a1108)';
    } else if (state.settings.theme === 'light') {
      themeToggle.checked = false;
      menu.style.backgroundColor = '#1ecf2731';
      document.body.style.background =
        'linear-gradient(210deg, #3f87a6, #ebf8e1, #f69d3c)';
    }
  };
  const renderLvl = () => {
    const sizeInputs = document.querySelectorAll('.radio-checkbox__input');
    for (const input of sizeInputs) {
      console.log(input);
      if (state.settings.isCustom === true && input.value === 'custom') {
        input.checked = 'checked';
      } else if (state.settings.matrixSize === Number(input.value)) {
        input.checked = 'checked';
      }
    }
  };
  const renderSize = () => {
    const sizeInputs = document.querySelectorAll('.radio-checkbox__input');
    for (const input of sizeInputs) {
      if (
        state.settings.isCustom === true &&
        input.name === 'minefield' &&
        Number(input.value) === state.settings.matrixSize
      ) {
        input.checked = 'checked';
      }
    }
  };
  const renderMines = () => {
    const inputBombs = document.querySelector('.mines__input');
    const inputProgress = document.querySelector('.mines__progress');
    inputProgress.style.width = inputBombs.value + '%';
  };
  renderLvl();
  renderSize();
  renderMines();
  renderTheme();
  const mineSweeper = document.querySelector('.minesweeper__minefield');
  if (state.settings.matrixSize === 15) {
    mineSweeper.style['grid-template-columns'] = 'repeat(15, 1fr)';
    mineSweeper.style['grid-template-rows'] = 'repeat(15, 1fr)';
  }
  if (state.settings.matrixSize === 25) {
    mineSweeper.style['grid-template-columns'] = 'repeat(25, 1fr)';
    mineSweeper.style['grid-template-rows'] = 'repeat(25, 1fr)';
  }
  for (let index = 1; index < state.settings.matrixSize ** 2 + 1; index++) {
    const unit = new Unit(index).createUnit();
    mineSweeper.insertAdjacentHTML('beforeend', unit);
  }
};

export default render;
