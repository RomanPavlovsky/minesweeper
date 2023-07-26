export default class MatrixModel {
  constructor(matrixSize, bombs) {
    this.matrixSize = matrixSize;
    this.bombs = bombs;
    this.matrix = [];
    this.matrixState = {};
    this.positionsBombs = [];
  }
  createMatrix(id) {
    for (let index = 0; index < this.matrixSize; index++) {
      let row = new Array(this.matrixSize);
      row.fill('-');
      this.matrix.push(row);
    }
    let max = this.matrixSize ** 2;
    const createBombPosition = (max, min) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    while (this.positionsBombs.length < this.bombs) {
      let position = createBombPosition(max, 1);
      if (position !== Number(id) && !this.positionsBombs.includes(position)) {
        this.positionsBombs.push(position);
      }
    }
    this.positionsBombs.forEach((elem) => {
      let col = (elem - 1) % this.matrixSize;
      let row = Math.floor((elem - 1) / this.matrixSize);
      this.matrix[row][col] = '+';
    });
    this.matrix.map((element, index, array) => {
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
  }
  getCell(id, flags) {
    const openSome = (row, col) => {
      const units = [];
      const id = row * this.matrixSize + col + 1;
      const isHasFlag = flags.has(`${id}`);
      if (!isHasFlag) {
        this.matrixState[id] = this.matrix[row][col];
        if (row !== 0) {
          units.push([this.matrix[row - 1][col], row - 1, col]);
        }
        if (row !== this.matrixSize - 1) {
          units.push([this.matrix[row + 1][col], row + 1, col]);
        }
        if (row !== 0 && col !== 0) {
          units.push([this.matrix[row - 1][col - 1], row - 1, col - 1]);
        }
        if (row !== this.matrixSize - 1 && col !== 0) {
          units.push([this.matrix[row + 1][col - 1], row + 1, col - 1]);
        }
        if (row !== this.matrixSize - 1 && col !== this.matrixSize - 1) {
          units.push([this.matrix[row + 1][col + 1], row + 1, col + 1]);
        }
        if (row !== 0 && col !== this.matrixSize - 1) {
          units.push([this.matrix[row - 1][col + 1], row - 1, col + 1]);
        }
        if (col !== 0) {
          units.push([this.matrix[row][col - 1], row, col - 1]);
        }
        if (col !== this.matrixSize - 1) {
          units.push([this.matrix[row][col + 1], row, col + 1]);
        }
        units.forEach((elem) => {
          const id = elem[1] * this.matrixSize + elem[2] + 1;
          const stateId = Object.keys(this.matrixState);
          if (elem[0] !== 0 && !stateId.includes(String(id))) {
            this.matrixState[id] = elem[0];
          } else if (elem[0] === 0 && !stateId.includes(String(id))) {
            openSome(elem[1], elem[2]);
          }
        });
      }
    };
    const col = (id - 1) % this.matrixSize;
    const row = Math.floor((id - 1) / this.matrixSize);
    if (this.matrix[row][col] === '+') {
      return { type: 'bomb', bombs: this.positionsBombs };
    } else if (this.matrix[row][col] === 0) {
      openSome(row, col);
    } else {
      this.matrixState[id] = this.matrix[row][col];
    }
    return this.matrixState;
  }
}
