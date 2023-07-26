import LoaderController from './LoaderController';

export default class MenuController extends LoaderController {
  constructor(model) {
    super(model);
  }
  toggleMenu() {
    this.model.toggleMenu();
  }
  toggleSettings() {
    this.model.toggleSettings();
  }
  newGame() {
    this.model.newGame();
    this.model.notify(this.model);
  }
  openResults() {
    this.model.openResults();
    this.model.notify(this.model);
    this.model.results = null;
  }
}
