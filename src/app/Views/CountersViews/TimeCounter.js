import CounterView from './CounterView';

export default class TimeCounter extends CounterView {
  constructor(actionController) {
    super(actionController);
    this.name = 'time';
  }
}
