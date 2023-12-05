import './OneCell.scss';
import { CreateElement } from '../common/Utils';
import { OPEN_STATUS, HIDDEN_STATUS } from '../common/const';

export default class OneCell {
  element = CreateElement('button', 'simple-cell');

  hiddenStatus = 0;

  index = {};

  status = OPEN_STATUS.HIDDEN;

  constructor(field, i, j) {
    this.index.x = i;
    this.index.y = j;
    this.field = field;

    this.element.addEventListener('click', () => {
      if (this.field.notSet) {
        this.field.setField(i, j);
      }
      if (this.status === OPEN_STATUS.HIDDEN) {
        if (+this.hiddenStatus !== 0 && this.hiddenStatus !== HIDDEN_STATUS.MINE) {
          this.element.textContent = this.hiddenStatus;
        }
        else if (+this.hiddenStatus === 0) {
          this.field.emptyFieldClear(i, j);
          this.field.audio.playClear();
        }
        this.status = OPEN_STATUS.OPEN;
        if (this.hiddenStatus === HIDDEN_STATUS.MINE) {
          this.field.audio.playExplode();
          window.setTimeout(() => { this.field.endGame() }, 1500);
        }
        this.setStyle();
        if (this.field.checkSuccess()) {
          this.field.endGame(true);
        }
        this.field.updateClicks();
      }
    });

    this.element.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      this.field.audio.playMark();
      if (this.status === OPEN_STATUS.HIDDEN) {
        this.status = OPEN_STATUS.MARKED;
        this.setStyle();
      }
      else if (this.status === OPEN_STATUS.MARKED) {
        this.status = OPEN_STATUS.HIDDEN;
        this.setStyle();
      }
      this.field.game.saveInfo();
    });
  }

  setThisCell(status, hiddenStatus) {
    this.status = status;
    this.hiddenStatus = hiddenStatus;
    if (status === OPEN_STATUS.OPEN && +hiddenStatus !== 0) {
      this.element.textContent = hiddenStatus;
    }
    this.setStyle();
  }

  openCell() {
    this.status = OPEN_STATUS.OPEN;
    if (+this.hiddenStatus !== 0) {
      this.element.textContent = this.hiddenStatus;
    }
    this.setStyle();
    if (this.field.checkSuccess()) {
      this.field.endGame(true);
    }
  }

  setStyle() {
    this.element.className = 'simple-cell';
    this.element.className += ` ${this.status}-cell`;
    if (this.status === OPEN_STATUS.OPEN) {
      this.element.className += ` cell-is-${this.hiddenStatus}`;
    }
  }
}
