import LoaderController from './LoaderController';

export default class SettingsController extends LoaderController {
  constructor(model) {
    super(model);
  }
  changeSettings(e) {
    if (e.target.closest('#audio__btn')) {
      this.model.toggleSound();
      this.model.notify(this.model);
    }
    if (e.target.closest('.toggle__input')) {
      this.model.swapTheme();
      this.model.notify(this.model);
    }
    if (e.target.closest('.custom__apply')) {
      this.model.setBombs();
      this.model.setSize();
      this.model.settings.isCustom = true;
      this.model.newGame();
      this.model.notify(this.model);
    }
    if (e.target.closest('.mines__input')) {
      this.model.settings.customBombs = e.target.value;
      this.model.notify(this.model);
    }
    if (e.target.closest('.radio-size')) {
      this.model.settings.customSize = e.target.value;
      this.model.notify(this.model);
    }

    if (e.target.name === 'difficulty') {
      if (Number(e.target.value) === 10) {
        this.model.changeLvl(10, Number(e.target.value));
      }
      if (Number(e.target.value) === 15) {
        this.model.changeLvl(45, Number(e.target.value));
      }
      if (Number(e.target.value) === 25) {
        this.model.changeLvl(99, Number(e.target.value));
      }
      if (e.target.value === 'custom') {
        this.model.isOpenCustom = true;
      }
      this.model.notify(this.model);
    }
  }
  saveSettings() {
    this.model.saveSettings();
  }
}
