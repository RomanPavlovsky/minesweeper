import Observer from './Observer';

export default class MinefieldView extends Observer {
  constructor(actionController) {
    super();
    this.minefield = document.querySelector('.minesweeper__minefield');
    this.actionController = actionController;
    this.actionController.model.addObserver(this);
    this.openCell = this.actionController.openCell.bind(this.actionController);
    this.setFlag = this.actionController.setFlag.bind(this.actionController);
    this.saveGame = this.actionController.saveGame.bind(this.actionController);
    this.toggleSmile = this.actionController.toggleSmile.bind(
      this.actionController
    );
    window.addEventListener('beforeunload', this.saveGame);
  }
  update(model) {
    const size = model.settings.matrixSize;
    if (model.isNewGame) {
      this.explosion(model.openBombs);
      this.minefield.innerHTML = '';
      this.minefield.addEventListener('click', this.openCell);
      this.minefield.addEventListener('mouseup', this.setFlag);
      this.minefield.addEventListener('mousedown', this.toggleSmile);
      this.minefield.addEventListener('mouseup', this.toggleSmile);
      this.minefield.style['grid-template-columns'] = `repeat(${size}, 1fr)`;
      this.minefield.style['grid-template-rows'] = `repeat(${size}, 1fr)`;
      if (!model.isStartGame) {
        this.fillMinefield(size);
      }
      if (model.isStartGame) {
        this.loadMinefield(model.state.cells);
      }
    }
    if (model.isGameOver) {
      this.explosion(model.openBombs);
    }
    if (model.isWin || model.isLose) {
      this.minefield.removeEventListener('click', this.openCell);
      this.minefield.removeEventListener('mouseup', this.setFlag);
      this.minefield.removeEventListener('mousedown', this.toggleSmile);
      this.minefield.removeEventListener('mouseup', this.toggleSmile);
    }
    if (model.openCells) {
      Object.entries(model.openCells).forEach((elem) => {
        const cell = document.getElementById(elem[0]);
        if (elem[1] === 0) {
          if (cell.dataset.type !== 'flag') {
            this.renderCell(elem[0], 'empty');
          }
        } else {
          if (cell.dataset.type !== 'flag') {
            this.renderCell(elem[0], 'value', elem[1]);
          }
        }
      });
    }
    document.querySelectorAll('.unit').forEach((elem) => {
      if (model.state.flags) {
        if (model.state.flags.has(elem.id)) {
          this.putFlag(elem.id);
        } else if (elem.dataset.type === 'flag') {
          this.downFlag(elem.id);
        }
      }
    });
  }

  fillMinefield(size) {
    for (let id = 1; id <= size ** 2; id++) {
      const cell = `<div class="unit unit_closed" data-type="closed" id="${id}"></div>`;
      this.minefield.insertAdjacentHTML('beforeend', cell);
    }
  }
  setColor(id, value) {
    const valueColors = [
      '#ffffff',
      '#1ce226',
      '#ffbb00',
      '#006eff',
      '#800080',
      '#ff0000',
      '#00573d',
      '#611212',
    ];
    document.getElementById(id).style.color = valueColors[value - 1];
  }
  explosion(listBombs) {
    let count = 0;
    if (listBombs === null) {
      clearInterval(this.renderBombs);
      count = 0;
    } else {
      document.getElementById(listBombs.id).classList.add('unit_fail-bomb');
      this.minefield.classList.add('snake');
      const openBombs = () => {
        if (listBombs.bombs[count] !== Number(listBombs.id)) {
          document
            .getElementById(listBombs.bombs[count])
            .classList.add('unit_bomb');
        }
        count += 1;
        if (count === listBombs.bombs.length) {
          clearInterval(this.renderBombs);
          count = 0;
        }
      };
      this.renderBombs = setInterval(openBombs, 100);
    }
  }
  renderCell(id, type, value) {
    document.getElementById(id).classList.remove('unit_closed');
    if (type === 'empty') {
      document.getElementById(id).classList.add('unit_empty');
      document.getElementById(id).dataset.type = 'empty';
    } else if (type === 'value') {
      document.getElementById(id).classList.add('unit_value');
      document.getElementById(id).textContent = value;
      document.getElementById(id).dataset.type = 'value';
      this.setColor(id, value);
    }
  }
  putFlag(id) {
    document.getElementById(id).classList.replace('unit_closed', 'unit_flag');
    document.getElementById(id).dataset.type = 'flag';
  }
  downFlag(id) {
    document.getElementById(id).classList.replace('unit_flag', 'unit_closed');
    document.getElementById(id).dataset.type = 'closed';
  }
  loadMinefield(cells) {
    for (const id in cells) {
      const cell = `<div class="unit unit_${cells[id].type}" data-type="${cells[id].type}" id="${id}">${cells[id].value}</div>`;
      this.minefield.insertAdjacentHTML('beforeend', cell);
      if (cells[id].value !== '') {
        this.setColor(id, Number(cells[id].value));
      }
    }
  }

  //game events
}
