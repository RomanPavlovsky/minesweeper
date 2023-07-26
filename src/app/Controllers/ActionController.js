import LoaderController from './LoaderController';

export default class ActionController extends LoaderController {
  constructor(model) {
    super(model);
  }
  saveGame() {
    this.model.saveGame();
  }
  openCell(e) {
    if (e.target.closest('.unit_closed')) {
      if (!this.model.isStartGame) {
        this.model.createMatrix(e.target.id);
        this.model.toggleTimer();
      }
      this.model.openCell(e.target.id);
      this.model.notify(this.model);
      this.model.openCells = null;
      this.model.checkWin();
    }
  }
  setFlag(e) {
    if (e.button === 2) {
      if (e.target.closest('.unit_closed')) {
        this.model.putFlag(e.target.id);
      } else if (e.target.closest('.unit_flag')) {
        this.model.downFlag(e.target.id);
      }
      this.model.notify(this.model);
      this.model.isFlag = null;
    }
  }
  toggleSmile(e) {
    if (e.target.closest('.unit_closed') && e.button !== 2) {
      this.model.toggleSmile(e.type);
      this.model.notify(this.model);
    }
  }
}
