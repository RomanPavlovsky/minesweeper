import StateModel from './StateModel';
import MatrixModel from './MatrixModel';
export default class GameModel extends StateModel {
  constructor() {
    super();
    this.isChangeMenu = false;
    this.isOpenMenu = false;
    this.isChangeSettings = false;
    this.isOpenSettings = false;
    this.isOpenCustom = false;
    this.isGameOver = false;
    this.isWin = false;
    this.isLose = false;
    this.isNewGame = true;
    this.openCells = null;
    this.openBombs = null;
    this.isWaitUp = false;
    this.isFlag = null;
    this.results = null;
  }
  toggleSmile(type) {
    if (type === 'mousedown') {
      this.isWaitUp = true;
    } else {
      this.isWaitUp = false;
    }
  }
  toggleMenu() {
    this.isChangeMenu = true;
    this.isOpenSettings = false;
    this.isOpenCustom = false;
    if (this.isOpenMenu) {
      this.isOpenMenu = false;
    } else {
      this.isOpenMenu = true;
    }
    this.toggleTimer();
    this.notify(this);
    this.isChangeMenu = false;
  }
  toggleSettings() {
    this.isChangeSettings = true;
    if (this.isOpenSettings) {
      this.isOpenSettings = false;
    } else {
      this.isOpenSettings = true;
    }
    this.notify(this);
    this.isChangeSettings = false;
  }
  createMatrix(id) {
    this.matrixModel = new MatrixModel(
      this.settings.matrixSize,
      this.settings.bombs
    );
    if (this.isStartGame) {
      this.matrixModel.matrix = this.state.matrix.matrix;
      this.matrixModel.matrixState = this.state.matrix.matrixState;
      this.matrixModel.positionsBombs = this.state.matrix.positionsBombs;
    } else {
      this.isStartGame = true;
      this.matrixModel.createMatrix(id);
      this.state.matrix = { ...this.matrixModel };
      this.state.flags.forEach((elem) => {
        if (this.matrixModel.positionsBombs.includes(Number(elem))) {
          this.state.counters.bomb -= 1;
        }
      });
    }
  }
  openCell(id) {
    this.state.counters.action += 1;
    const response = this.matrixModel.getCell(id, this.state.flags);
    if (response.type === 'bomb') {
      this.openBombs = { id, bombs: [...response.bombs] };
      this.lose();
    } else {
      this.openCells = this.matrixModel.getCell(id, this.state.flags);
    }
  }
  putFlag(id) {
    if (this.state.flags.size < this.settings.bombs) {
      this.isFlag = true;
      this.state.counters.flag += 1;
      this.state.flags.add(id);
      if (this.isStartGame) {
        if (this.matrixModel.positionsBombs.includes(Number(id))) {
          this.state.counters.bomb -= 1;
        }
      }
    }
  }
  downFlag(id) {
    this.isFlag = true;
    this.state.counters.flag -= 1;
    this.state.flags.delete(id);
    if (this.isStartGame) {
      if (this.matrixModel.positionsBombs.includes(Number(id))) {
        this.state.counters.bomb += 1;
      }
    }
  }
  lose() {
    this.isGameOver = true;
    this.isLose = true;
    this.toggleTimer();
    setTimeout(() => {
      this.isGameOver = false;
      this.toggleMenu();
    }, 2000);
  }
  win() {
    this.isGameOver = true;
    this.isWin = true;
    this.toggleTimer();
    setTimeout(() => {
      this.isGameOver = false;
      this.toggleMenu();
    }, 300);
  }

  toggleTimer() {
    if (!this.isLose && !this.isWin && !this.isOpenMenu && this.isStartGame) {
      this.intervalId = setInterval(this.startTimer.bind(this), 1000);
    } else {
      clearInterval(this.intervalId);
    }
  }
  checkWin() {
    let cells = document.querySelectorAll('.unit');
    let idArr = [];
    cells.forEach((cell) => {
      if (cell.dataset.type === 'closed' || cell.dataset.type === 'flag') {
        idArr.push(Number(cell.id));
      }
    });
    let bombsId = this.matrixModel.positionsBombs.sort((a, b) => a - b);
    if (idArr.length === bombsId.length) {
      let count = 0;
      for (let i = 0; i < idArr.length; i++) {
        const element = idArr[i];
        if (element === bombsId[i]) {
          count += 1;
        }
      }
      if (count === idArr.length) {
        this.isWin = true;
        this.win();
        this.notify(this);
        this.saveResults();
      }
    }
  }
  newGame() {
    this.toggleMenu();
    this.state.counters.time = 0;
    this.state.counters.flag = 0;
    this.state.counters.bomb = this.settings.bombs;
    this.state.counters.action = 0;
    this.state.matrix = null;
    this.state.cells = null;
    this.isWin = false;
    this.isLose = false;
    this.openCells = null;
    this.openBombs = null;
    this.isStartGame = false;
    this.state.flags.clear();
    this.toggleTimer();
    this.isNewGame = true;
    this.notify(this);
    this.isNewGame = false;
  }
  saveResults() {
    const date = new Date();
    const saveDate = `${date.getDate()}.${
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1
    }.${date.getFullYear()} ${
      date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    }:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
    if (!localStorage.getItem('results')) {
      const results = {
        1: {
          moves: this.state.counters.action,
          time: this.state.counters.action,
          date: saveDate,
        },
      };
      localStorage.setItem('results', JSON.stringify(results));
    } else {
      let results = Object.entries(JSON.parse(localStorage.getItem('results')));
      const length = results.length;
      if (length === 10) {
        results = results.map((elem) => {
          return [elem[0] - 1, elem[1]];
        });
        results = results.slice(1, 11);
        results.push([
          10,
          {
            moves: this.state.counters.action,
            time: this.state.counters.action,
            date: saveDate,
          },
        ]);
        localStorage.setItem(
          'results',
          JSON.stringify(Object.fromEntries(results))
        );
      } else {
        results.push([
          length + 1,
          {
            moves: this.state.counters.action,
            time: this.state.counters.action,
            date: saveDate,
          },
        ]);
        localStorage.setItem(
          'results',
          JSON.stringify(Object.fromEntries(results))
        );
      }
    }
  }
  openResults() {
    if (!!localStorage.getItem('results')) {
      this.results = Object.entries(
        JSON.parse(localStorage.getItem('results'))
      );
    } else {
      this.results = 'empty';
    }
  }
  changeLvl(bomb, size) {
    this.settings.isCustom = false;
    this.settings.matrixSize = size;
    this.settings.bombs = bomb;
    this.settings.customSize = null;
    this.newGame();
  }
  saveGame() {
    const cells = document.querySelectorAll('.unit');
    if (!this.isWin && !this.isLose && this.isStartGame) {
      const state = {
        counters: {
          flag: this.state.counters.flag,
          bomb: this.state.counters.bomb,
          time: this.state.counters.time,
          action: this.state.counters.action,
        },
        matrix: { ...this.state.matrix },
        cells: {},
        flags: [...this.state.flags],
      };
      cells.forEach((cell) => {
        const id = cell.id;
        state.cells[id] = {
          type: cell.dataset.type,
          value: cell.innerText,
        };
      });
      localStorage.setItem('saveGame', JSON.stringify(state));
    }
  }
  loadState() {
    console.log('loader state');
    this.state = JSON.parse(localStorage.getItem('saveGame'));
    this.state.flags = new Set(this.state.flags);
    this.isStartGame = true;
    localStorage.removeItem('saveGame');
  }
}
