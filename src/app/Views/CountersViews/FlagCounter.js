import CounterView from './CounterView';

export default class FlagCounter extends CounterView {
  constructor(actionController) {
    super(actionController);
    this.name = 'flag';
  }
}
