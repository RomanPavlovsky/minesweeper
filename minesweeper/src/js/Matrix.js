export class Matrix {
  constructor(matrixSize = 10, bombs = 10) {
    this.matrixSize = matrixSize;
    this.bombs = bombs;
  }
  createMatrix(id) {
    let positionsBombs = [];
    let matrix = [];
    for (let index = 0; index < this.matrixSize; index++) {
      let row = new Array(this.matrixSize);
      row.fill('-');
      matrix.push(row);
    }

    const createBombPosition = () => {
      return Math.floor(Math.random() * this.matrixSize ** 2);
    };
    while (positionsBombs.length < this.bombs) {
      let position = createBombPosition();
      if (position !== Number(id) && !positionsBombs.includes(position)) {
        positionsBombs.push(position);
      }
    }
    positionsBombs = positionsBombs.map((elem) => {
      return Array.from(String(elem));
    });
    positionsBombs.forEach((elem) => {
      if (elem.length === 1) {
        matrix[0][elem] = '+';
      } else {
        matrix[elem[0]][elem[1]] = '+';
      }
    });
    matrix.map((element, index, array) => {
      for (let i = 0; i < element.length; i++) {
        let count = 0;
        if (element[i] !== '+') {
          if (element[i - 1] === '+') {
            count += 1;
          }
          if (element[i + 1] === '+') {
            count += 1;
          }
          if (array[index - 1] !== undefined) {
            if (array[index - 1][i - 1] === '+') {
              count += 1;
            }
            if (array[index - 1][i] === '+') {
              count += 1;
            }
            if (array[index - 1][i + 1] === '+') {
              count += 1;
            }
          }
          if (array[index + 1] !== undefined) {
            if (array[index + 1][i - 1] === '+') {
              count += 1;
            }
            if (array[index + 1][i] === '+') {
              count += 1;
            }
            if (array[index + 1][i + 1] === '+') {
              count += 1;
            }
          }
          element[i] = count;
        }
      }
    });
    return matrix;
  }
}
