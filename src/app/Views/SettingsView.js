import Observer from './Observer';

export default class SettingsView extends Observer {
  constructor(settingsController) {
    super();
    this.settingsController = settingsController;
    this.settingsController.model.addObserver(this);
    this.menu = document.querySelector('.minesweeper__menu');
    this.settingsMenu = document.querySelector('.settings');
  }
  update(model) {
    if (model.isNewGame) {
      this.renderSettings(model.settings);
    }
    this.checkTheme(model.settings);
    if (model.isOpenSettings) {
      if (model.isOpenCustom || model.settings.isCustom) {
        document.querySelector('.custom').style.visibility = 'visible';
        document.querySelector('.custom').classList.add('custom_open');
      }
    }
    this.renderLvl(model);
    this.renderMines();
  }
  checkTheme(settings) {
    if (settings.theme === 'light') {
      this.settingsMenu.style.color = '#000000';
      if (settings.sound) {
        this.audioButton.classList.remove('settings__audio_on_dark');
        this.audioButton.classList.remove('settings__audio_off_dark');
        this.audioButton.classList.remove('settings__audio_off_light');
        this.audioButton.classList.add('settings__audio_on_light');
      } else {
        this.audioButton.classList.remove('settings__audio_on_dark');
        this.audioButton.classList.remove('settings__audio_on_light');
        this.audioButton.classList.remove('settings__audio_off_dark');
        this.audioButton.classList.add('settings__audio_off_light');
      }
    }
    if (settings.theme === 'dark') {
      this.settingsMenu.style.color = '#ffffff';
      if (settings.sound) {
        this.audioButton.classList.remove('settings__audio_on_light');
        this.audioButton.classList.remove('settings__audio_off_light');
        this.audioButton.classList.remove('settings__audio_off_dark');
        this.audioButton.classList.add('settings__audio_on_dark');
      } else {
        this.audioButton.classList.remove('settings__audio_on_light');
        this.audioButton.classList.remove('settings__audio_off_light');
        this.audioButton.classList.remove('settings__audio_on_dark');
        this.audioButton.classList.add('settings__audio_off_dark');
      }
    }
  }
  renderLvl(model) {
    const sizeInputs = document.querySelectorAll('.radio-checkbox__input');
    for (const input of sizeInputs) {
      if (input.value === 'custom') {
        if (model.isOpenCustom || model.settings.isCustom) {
          input.checked = 'checked';
        }
      }
      if (
        input.name === 'difficulty' &&
        model.settings.matrixSize === Number(input.value)
      ) {
        if (!model.isOpenCustom && !model.settings.isCustom) {
          input.checked = 'checked';
        }
      }
      if (input.name === 'minefield') {
        if (!!model.settings.customSize) {
          if (input.value === model.settings.customSize) {
            input.checked = 'checked';
          }
        } else {
          if (Number(input.value) === model.settings.matrixSize) {
            input.checked = 'checked';
          }
        }
      }
    }
  }
  renderMines() {
    const inputBombs = document.querySelector('.mines__input');
    const inputProgress = document.querySelector('.mines__progress');
    inputProgress.style.width = inputBombs.value + '%';
    document.querySelector(
      '.mines__heading'
    ).textContent = `Mines: ${inputBombs.value}`;
  }
  renderSettings(settings) {
    document.querySelector(
      '.settings'
    ).innerHTML = `<div class="settings__heading">SETTINGS</div>
    <div class="settings__theme">
      <div class="heading">Theme</div>
      <label class="toggle" for="theme">
        <input class="toggle__input" type="checkbox" name="theme" id="theme" ${
          settings.theme === 'dark' ? 'checked' : null
        }/>
        <span class="toggle__custom"></span>
      </label>
    </div>
    <div class="settings__audio settings__audio_${
      settings.sound ? 'on' : 'off'
    }_${settings.theme}" ></div>
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
        <div class="mines__heading">Mines: ${settings.bombs}</div>
        <div class="mines">
          <div class="mines__line"></div>
          <input class="mines__input" type="range" min="10" max="99" value="${
            settings.bombs
          }" step="1" />
          <div class="mines__progress"></div>
        </div>
      </div>
      <div class="custom__size">
        <div class="heading">Minefield size:</div>
        <div class="radio-size radio">
          <label class="radio-checkbox">
            <input class="radio-checkbox__input" type="radio" name="minefield" value="10" />
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
    </div>`;
    this.themeToggle = document.querySelector('.toggle__input');
    this.gameLvl = document.querySelector('.radio-lvl');
    this.minefieldCustomSize = document.querySelector('.radio-size');
    this.inputBombs = document.querySelector('.mines__input');
    this.inputProgress = document.querySelector('.mines__progress');
    this.audioButton = document.querySelector('.settings__audio');
    this.applyCustom = document.querySelector('.custom__apply');

    this.changeSettings = this.settingsController.changeSettings.bind(
      this.settingsController
    );
    this.saveSettings = this.settingsController.saveSettings.bind(
      this.settingsController
    );
    this.themeToggle.addEventListener('click', this.changeSettings);
    this.gameLvl.addEventListener('click', this.changeSettings);
    this.applyCustom.addEventListener('click', this.changeSettings);
    this.inputBombs.addEventListener('input', this.changeSettings);
    this.minefieldCustomSize.addEventListener('click', this.changeSettings);
    this.audioButton.addEventListener('click', this.changeSettings);
    window.addEventListener('beforeunload', this.saveSettings);
  }
}
