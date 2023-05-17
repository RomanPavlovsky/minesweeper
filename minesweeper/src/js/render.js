import { config } from './config';
import { Unit } from './Unit';
const render = () => {
  document.body.innerHTML = `<div class="minesweeper"></div>`;
  const mineSweeper = document.querySelector('.minesweeper');
  if (config.matrixSize === 15) {
    mineSweeper.style['grid-template-columns'] = 'repeat(15, 1fr)';
    mineSweeper.style['grid-template-rows'] = 'repeat(15, 1fr)';
  }
  if (config.matrixSize === 25) {
    mineSweeper.style['grid-template-columns'] = 'repeat(25, 1fr)';
    mineSweeper.style['grid-template-rows'] = 'repeat(25, 1fr)';
  }

  for (let index = 1; index < config.matrixSize ** 2 + 1; index++) {
    const unit = new Unit(index).createElement();
    mineSweeper.insertAdjacentHTML('beforeend', unit);
  }
};

export default render;
