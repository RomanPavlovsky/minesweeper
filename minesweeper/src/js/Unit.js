export class Unit {
  constructor(id, type = 'closed') {
    this.type = type;
    this.id = id;
  }
  createElement() {
    return `<div class="unit unit_closed" id="${this.id}"></div>`;
  }
}
// export default Unit;
