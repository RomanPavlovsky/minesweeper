export default class LoaderController {
  constructor(model) {
    this.model = model;
  }
  loadApp() {
    if (localStorage.getItem('settings') !== null) {
      this.model.loadSettings();
    }
    if (localStorage.getItem('saveGame') !== null) {
      this.model.loadState();
      this.model.createMatrix();
      this.model.toggleTimer();
    }
    if (this.model.isNewGame) {
      this.model.notify(this.model);
      this.model.isNewGame = false;
    }
  }
}
