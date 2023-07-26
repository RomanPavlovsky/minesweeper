import CounterView from './CounterView';

export default class BombCounter extends CounterView {
  constructor(actionController) {
    super(actionController);
    this.name = 'bomb';
  }
}
