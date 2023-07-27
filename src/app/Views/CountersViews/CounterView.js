import Observer from '../Observer';

export default class CounterView extends Observer {
  constructor(actionController) {
    super();
    this.actionController = actionController;
    this.actionController.model.addObserver(this);
    this.counters = document.querySelector('.minesweeper__counters');
  }
  update(model) {
    const count = model.state.counters[this.name];
    const counter =
      count >= 0 && count < 10
        ? '00' + count
        : count >= 10 && count < 100
        ? '0' + count
        : count >= 100 && count < 1000
        ? count
        : 999;
    if (model.isNewGame) {
      const counterLayout = `<div class="${this.name}-counter">
      <div
        id="${this.name}__icon"
        class="${this.name}__icon_${model.settings.theme}"></div>
      <div class="${this.name}__count">
      ${counter}
      </div>
    </div>`;
      if (document.querySelector(`.${this.name}-counter`) !== null) {
        document.querySelector(`.${this.name}-counter`).remove();
      }
      this.counters.insertAdjacentHTML('beforeend', counterLayout);
    } else {
      document.querySelector(`.${this.name}__count`).textContent = counter;
    }
    this.checkTheme(model.settings.theme);
  }
  checkTheme(theme) {
    const icon = document.getElementById(`${this.name}__icon`);
    if (theme === 'light') {
      icon.classList.replace(
        `${this.name}__icon_dark`,
        `${this.name}__icon_light`
      );
      document.querySelector(`.${this.name}__count`).style.color = '#000000';
    } else {
      icon.classList.replace(
        `${this.name}__icon_light`,
        `${this.name}__icon_dark`
      );
      document.querySelector(`.${this.name}__count`).style.color = '#ffffff';
    }
  }
}
