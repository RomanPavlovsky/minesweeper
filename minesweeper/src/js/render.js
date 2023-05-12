import { config } from './config';
import { Unit } from './Unit';
const render = () => {
  document.body.innerHTML = `<div class="minesweeper"></div>`;

  for (let index = 0; index < config.matrixSize ** 2; index++) {
    const unit = new Unit(index).createElement();
    document
      .querySelector('.minesweeper')
      .insertAdjacentHTML('beforeend', unit);
  }
};

export default render;
