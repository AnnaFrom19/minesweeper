import './Difficult.scss';
import { CreateElement } from '../common/Utils';
import { DIFFICULT_NAME, SIZES, MINES_QUANTITY_MIN, MINES_QUANTITY_MAX } from '../common/const';
import Info from './Info';

export default class Difficult {

  button = CreateElement('button', 'change-difficult__btn','Difficult');

  infoElement = CreateElement('span', 'difficult-info');

  range = 0;

  mines = 10;

  difficultScreen;

  difficultButtons = [CreateElement('button','choose-difficult__label'),CreateElement('button','choose-difficult__label'),CreateElement('button','choose-difficult__label')];

  saveDifficultButton = CreateElement('button', 'save-difficult-info');

  minesChoice =  CreateElement('input', 'mine-choice');

  constructor(game) {
    this.game = game;
    const range = window.localStorage.getItem('difficult') || 0;
    const mines = window.localStorage.getItem('mines') || 10;
    this.range = +range;
    this.currentChoice = this.range;
    this.mines = +mines;
    this.setDifficult();
    this.minesChoice.type = 'number';
    this.minesChoice.min = MINES_QUANTITY_MIN;
    this.minesChoice.max = MINES_QUANTITY_MAX;
    this.saveDifficultButton.textContent = 'Save';
    this.minesChoice.addEventListener('input', () => {
      const mineValue = +this.minesChoice.value;
      if (mineValue < 100 && mineValue > 9) {
        this.minesChoice.classList.remove('error');
      }
      else {
        this.minesChoice.classList.add('error');
      }
    })
  }

  setDifficult() {
    this.infoElement.textContent = `${DIFFICULT_NAME[this.range]  } ${  this.mines}`;
    const difficultChoice = CreateElement('div','choose-difficult__wrapper');
    const difficultListContainer = CreateElement('ul','choose-difficult__list');
    const difficultInfo = new Info(difficultChoice);
    this.saveDifficultButton.addEventListener('click', () =>{
      this.newDifficult();
      difficultInfo.close();
    });
    this.button.addEventListener('click', () => {
      difficultChoice.innerHTML = '';
      this.minesChoice.value = this.mines;
      this.redrawDifferent(difficultInfo, difficultListContainer);
      difficultChoice.append(difficultListContainer);
      difficultChoice.append(this.minesChoice);
      difficultChoice.append(this.saveDifficultButton);
      difficultInfo.open();
    });
  }

  redrawDifferent(difficultInfo, difficultListContainer) {
    DIFFICULT_NAME.forEach((name, index) => {
      const difficultOnePoint = CreateElement('li','choose-difficult__one');
      const difficultText  = `${name} (${SIZES[index]}x${SIZES[index]})`;
      this.difficultButtons[index].textContent = difficultText;
      difficultOnePoint.append(this.difficultButtons[index]);
      difficultListContainer.append(difficultOnePoint);
      if (this.currentChoice === index) {
        this.difficultButtons[index].classList.add('current');
      }
      else {
        this.difficultButtons[index].classList.remove('current');
      }
      this.difficultButtons[index].addEventListener('click', () => {
        if (index !== this.currentChoice) {
          this.currentChoice = index;
          this.redrawDifferent(difficultInfo, difficultListContainer);
        }
      })
    });
    
  }

  newDifficult() {
    const mines = +this.minesChoice.value;
    if (mines < 100 && mines > 9) {
    this.range = this.currentChoice;
    this.mines = +this.minesChoice.value;
    window.localStorage.setItem('difficult',this.range);
    window.localStorage.setItem('mines',this.mines);
    this.infoElement.textContent = `${DIFFICULT_NAME[this.range]  } ${  this.mines}`;
    this.game.newGameStart();
  }
  else {
    this.minesChoice.classList.add('error');
  }
  }
}
