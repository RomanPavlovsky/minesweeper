import { config } from './config';
import { Matrix } from './Matrix';
import { Unit } from './Unit';
const action = () => {
  let isFirstMove = true;
  let matrix;
  const firstMove = (event) => {
    if (event.target.closest('.unit') && isFirstMove !== false) {
      isFirstMove = false;
      matrix = new Matrix(config.matrixSize, config.bombs);
      matrix.createMatrix(event.target.id);
    }
  };
  const move = (event) => {
    console.log(matrix);
    if (event.target.closest('.unit_closed') && isFirstMove === false) {
      console.log(matrix.changeState(event.target.id));
    }
  };

  document.querySelector('.minesweeper').addEventListener('click', firstMove);
  document.querySelector('.minesweeper').addEventListener('click', move);
};

export default action;
