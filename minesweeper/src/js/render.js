import { state } from './state';
import { Unit } from './Unit';

const render = () => {
  const loadSettings = () => {
    if (localStorage.getItem('settings') !== null) {
      console.log('load settings');
      const settings = JSON.parse(localStorage.getItem('settings'));
      console.log('save settings', settings);
      for (const iterator in settings) {
        state.settings[iterator] = settings[iterator];
      }
    }
  };
  loadSettings();
  console.log('load state', state.settings);
  document.body.innerHTML = `<div class="minesweeper">
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
            <input class="toggle__input" type="checkbox" name="theme" id="theme"/>
            <span class="toggle__custom"></span>
          </label>
        </div>
        <div class="settings__mines">
          <div class="heading">Mines</div>
          <div class="mines">
            <div class="mines__line"></div>
            <input class="mines__input" type="range" min="10" max="99" value="10" step="1"/>
            <div class="mines__progress"></div>
          </div>
        </div>
        <div class="settings__minefield">
          <div class="heading">Minefield size</div>
          <div class="radio">
            <label class="radio-checkbox">
              <input class="radio-checkbox__input" type="radio" name="minefield" value="10" checked="checked"/>
            <span class="radio-checkbox__custom"></span>
                10
            </label>
            <label class="radio-checkbox">
              <input class="radio-checkbox__input" type="radio" name="minefield" value="15"/>
            <span class="radio-checkbox__custom"></span>
                15
            </label>
            <label class="radio-checkbox">
              <input class="radio-checkbox__input" type="radio" name="minefield" value="25"/>
            <span class="radio-checkbox__custom"></span>
                25
            </label>
          </div>
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
