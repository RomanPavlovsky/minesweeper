export class Unit {
  constructor(id, type = 'closed') {
    this.type = type;
    this.id = id;
  }
  createUnit() {
    return `<div class="unit unit_closed" data-type="${this.type}" id="${this.id}"></div>`;
  }
  putFlag() {
    document.getElementById(this.id).classList.remove('unit_closed');
    document.getElementById(this.id).classList.add('unit_flag');
    document.getElementById(this.id).dataset.type = 'flag';
  }
  downFlag() {
    document.getElementById(this.id).classList.remove('unit_flag');
    document.getElementById(this.id).classList.add('unit_closed');
    document.getElementById(this.id).dataset.type = 'closed';
  }
  openUnit(value) {
    document.getElementById(this.id).classList.remove('unit_closed');
    if (this.type === 'empty') {
      document.getElementById(this.id).classList.add('unit_empty');
      document.getElementById(this.id).dataset.type = 'empty';
    } else if (this.type === 'value') {
      document.getElementById(this.id).classList.add('unit_value');
      document.getElementById(this.id).textContent = value;
      document.getElementById(this.id).dataset.type = 'value';
      if (value === 1) {
        document.getElementById(this.id).style.color = '#ffffff';
      }
      if (value === 2) {
        document.getElementById(this.id).style.color = ' #4eb153';
      }
      if (value === 3) {
        document.getElementById(this.id).style.color = '#ffbb00';
      }
      if (value === 4) {
        document.getElementById(this.id).style.color = '#006eff';
      }
      if (value === 5) {
        document.getElementById(this.id).style.color = '#800080';
      }
      if (value === 6) {
        document.getElementById(this.id).style.color = '#ff0000';
      }
      if (value === 7) {
        document.getElementById(this.id).style.color = '#00573d';
      }
      if (value === 8) {
        document.getElementById(this.id).style.color = '#611212';
      }
    } else if (this.type === 'bomb') {
      document.getElementById(value).classList.add('unit_fail-bomb');
      if (this.id !== value) {
        document.getElementById(this.id).classList.add('unit_bomb');
      }
    }
  }
}
