import StateModel from './Models/StateModel';
import GameModel from './Models/GameModel';
import ActionController from './Controllers/ActionController';
import LoaderController from './Controllers/LoaderController';
import InterfaceController from './Controllers/InterfaceController';
import SettingsController from './Controllers/SettingsController';
import ActionCounter from './Views/CountersViews/ActionCounter';
import BombCounter from './Views/CountersViews/BombCounter';
import FlagCounter from './Views/CountersViews/FlagCounter';
import TimeCounter from './Views/CountersViews/TimeCounter';
import LayoutView from './Views/LayoutView';
import MenuView from './Views/MenuView';
import MinefieldView from './Views/MinefieldView';
import SettingsView from './Views/SettingsView';
import SoundView from './Views/SoundView';
import ResultView from './Views/ResultView';

export default class App {
  constructor() {
    this.stateModel = new StateModel();
    this.gameModel = new GameModel();
    this.loaderController = new LoaderController(this.gameModel);
    this.actionController = new ActionController(this.gameModel);
    this.interfaceController = new InterfaceController(this.gameModel);
    this.settingsController = new SettingsController(this.gameModel);
    this.layoutView = new LayoutView(this.interfaceController);
    this.minefieldView = new MinefieldView(this.actionController);
    this.settingsView = new SettingsView(this.settingsController);
    this.menuView = new MenuView(this.interfaceController);
    this.soundView = new SoundView(this.interfaceController);
    this.flagCounter = new FlagCounter(this.actionController);
    this.bombCounter = new BombCounter(this.actionController);
    this.actionCounter = new ActionCounter(this.actionController);
    this.timeCounter = new TimeCounter(this.actionController);
    this.resultView = new ResultView(this.interfaceController);
  }

  start() {
    this.loaderController.loadApp();
  }
}
