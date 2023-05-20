export class Unit {
  constructor(id, type = 'closed') {
    this.type = type;
    this.id = id;
  }
  createUnit() {
    return `<div class="unit unit_closed" id="${this.id}"></div>`;
  }
  openUnit(value) {
    document.getElementById(this.id).classList.remove('unit_closed');
    if (this.type === 'empty') {
      document.getElementById(this.id).classList.add('unit_empty');
    } else if (this.type === 'value') {
      document.getElementById(this.id).classList.add('unit_value');
      document.getElementById(this.id).textContent = value;
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
      console.log(typeof value);
    } else if (this.type === 'bomb') {
      document.getElementById(this.id).classList.add('unit_bomb');
    }
  }
}
