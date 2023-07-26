import CounterView from './CounterView';

export default class ActionCounter extends CounterView {
  constructor(actionController) {
    super(actionController);
    this.name = 'action';
  }
}
