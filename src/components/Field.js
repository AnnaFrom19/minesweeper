import './Field.scss';
import OneCell from './OneCell';
import { CreateElement, randomPair } from '../common/Utils';
import { SIZES, HIDDEN_STATUS, OPEN_STATUS, DIFFICULT_NAME } from '../common/const';

export default class Field {
  size = SIZES[2];

  minesQuantity = 10;

  fieldCells = [];

  element = CreateElement('div', 'minesweeper-field');

  notSet = true;

  minesSet = [];

  constructor(game, audio,  difficult = 1, mines = 10) {
    this.audio = audio;
    this.game = game;
    this.size = SIZES[difficult];
    this.minesQuantity = mines;
    this.element.classList.add(`size-is-${DIFFICULT_NAME[+difficult]}`);
    const loadFields = window.localStorage.getItem('field');
    if (loadFields) this.loadFieldCells(loadFields);
    else this.setNewFieldCells();
  }

  setNewFieldCells() {
    for (let i = 0; i < this.size; i += 1) {
      this.fieldCells[i] = [];
      for (let j = 0; j < this.size; j += 1) {
        const newCell = new OneCell(this, i, j);
        this.fieldCells[i].push(newCell);
        this.element.append(newCell.element);
      }
    }
  }


  updateClicks() {
    this.audio.playClick();
    this.game.addClick();
  }

  setMines(currentI, currentJ) {
    while (this.minesSet.length < this.minesQuantity) {      
      const [i, j] = randomPair(0, this.size);
      if ((currentI !== i || currentJ !== j) && +this.fieldCells[i][j].hiddenStatus === 0) {
        this.fieldCells[i][j].hiddenStatus = HIDDEN_STATUS.MINE;
        this.minesSet.push([i, j]);
      }
    }
  }

  checkSuccess() {
    const allOpened = this.fieldCells.flat().filter(cell => !(cell.status === OPEN_STATUS.OPEN || cell.hiddenStatus === HIDDEN_STATUS.MINE));
    return allOpened.length === 0;
  }

  setCellToTestArray(i, j) {
    const cellsArray = [[i - 1, j - 1], [i, j - 1], [i + 1, j - 1],
                      [i - 1, j], [i + 1, j],
                      [i - 1, j + 1], [i, j + 1], [i + 1, j + 1]];
    return this.onlyRealCells(cellsArray);
  }

  setCellToClearArray(i, j) {
    const cellsArray = [[i - 1, j], [i, j - 1], [i + 1, j], [i, j + 1]];
    return this.onlyRealCells(cellsArray);
  }

  onlyRealCells(array) {
    return array.filter(([currentI, currentJ]) => (currentI >= 0 && currentI<this.size) &&
    (currentJ >= 0 && currentJ<this.size));
  }
  


  emptyFieldClear(i, j) {
    const array = this.setCellToTestArray(i, j);
    const emptyArray = array.filter(([currentI, currentJ]) => {
      const thisCell =  this.fieldCells[currentI][currentJ];
      if (thisCell.status === OPEN_STATUS.HIDDEN) {
        thisCell.openCell();
        if (+thisCell.hiddenStatus === 0) return true;
        return false;
      }
      return false;
    });
    if (emptyArray.length > 0) {
      emptyArray.forEach(([currentI, currentJ]) => {this.emptyFieldClear(currentI, currentJ)});
    }
  }

  endGame(win = false) {
    if (win) this.audio.playWin();
    else this.audio.playLoose();
    this.game.gameEnd(win);
    this.statGame = 'end';
  }

  setMinesNumbers(i, j) {
    const cellsToTest = this.setCellToTestArray(i, j);
    cellsToTest.forEach(([currentI, currentJ]) => {
      const thisCell = this.fieldCells[currentI][currentJ];
      if (thisCell.hiddenStatus !== HIDDEN_STATUS.MINE) {
        thisCell.hiddenStatus += 1;
      }
    });
  }



  setField(currentI, currentJ) {
    this.game.gameBegins();
    this.setMines(currentI, currentJ);
    this.minesSet.forEach(([i, j]) => { this.setMinesNumbers(i, j) });
    this.notSet = false;
  }

  saveField() {
    const result = this.fieldCells.flat().map((cell) => `${cell.index.x }_${cell.index.y}_${cell.status}_${cell.hiddenStatus}`);
    return result.join('|');
  }


  loadFieldCells(loadFields) {
    const allCellsInfoString = loadFields.split('|');
    allCellsInfoString.forEach(data => {
      const [x,y,status,hiddenStatus] = data.split('_');
      if(!this.fieldCells[+x]) this.fieldCells[+x] =[];
      const cell = new OneCell(this, +x, +y);
      cell.setThisCell(status, hiddenStatus);
      this.fieldCells[+x][+y] = cell;
      this.element.append(cell.element);
    });
    this.notSet = false;
    this.game.gameBegins();
  }

  show() {
    document.body.append(this.element);
  }
}
