import Observer from './Observer';

export default class ResultView extends Observer {
  constructor(interfaceController) {
    super();
    this.interfaceController = interfaceController;
    this.interfaceController.model.addObserver(this);
    this.resultButton = document.querySelector('.menu__result-btn');
    this.menu = document.querySelector('.minesweeper__menu');
    this.openResults = this.interfaceController.openResults.bind(
      this.interfaceController
    );
    this.resultButton.addEventListener('click', this.openResults);
  }
  update(model) {
    if (!!model.results) {
      if (model.results === 'empty') {
        this.result.innerHTML = `
        <div class="result__close-btn"></div>
        <div class="result__empty">
            haven't results :( </br>
            try to win
        </div>`;
      } else {
        document
          .querySelector('.minesweeper__header')
          .insertAdjacentHTML('beforeend', `<div class="result"></div>`);
        this.result = document.querySelector('.result');
        this.result.classList.remove('result_close');
        this.result.classList.add('result_open');
        this.result.innerHTML = `
      <div class="result__close-btn"></div>
      <div class="result__heading">Last 10 wins:</div>
        <div class="result__container">
        <div class='result__date'>Date:</div>
                        <div class='result__count'>Moves:</div>
                          <div class='result__time'>Time:</div>
        </div>`;
        model.results.forEach((element) => {
          const results = `<div class='result__date'>${element[1].date}</div>
                          <div class='result__count'>${element[1].moves}</div>
                            <div class='result__time'>${element[1].time}</div>`;
          document
            .querySelector('.result__container')
            .insertAdjacentHTML('beforeend', results);
        });
      }
      this.closeResults = this.closeResults.bind(this);
      this.menu.addEventListener('click', this.closeResults);
      document
        .querySelector('.result__close-btn')
        .addEventListener('click', this.closeResults);
    }
  }
  closeResults() {
    this.menu.removeEventListener('click', this.closeResults);
    document
      .querySelector('.result__close-btn')
      .removeEventListener('click', this.closeResults);
    this.result.classList.remove('result_open');
    this.result.classList.add('result_close');
    setTimeout(() => {
      this.result.remove();
    }, 200);
  }
}
