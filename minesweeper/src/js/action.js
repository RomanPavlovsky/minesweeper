import { config } from './config';
import { Matrix } from './Matrix';
import { Unit } from './Unit';
const action = () => {
  let isFirstMove = true;
  const firstMove = (event) => {
    if (event.target.closest('.unit') && isFirstMove !== false) {
      isFirstMove = false;
      let matrix = new Matrix().createMatrix(event.target.id);
      console.log(matrix);
    }
  };
  document.querySelector('.minesweeper').addEventListener('click', firstMove);
};

export default action;
