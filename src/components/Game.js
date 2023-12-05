import './Game.scss';
import Info from "./Info";
import Field from "./Field";
import Timer from "./Timer";
import { CreateElement, clearStorage } from '../common/Utils';
import { GAME_STATUS } from '../common/const';
import Difficult from "./Difficult";
import ThemeChanger from "./themeChanger";
import Range from "./Range";
import AudioLibrary from '../common/Audio';

export default class Game {
  
  header = CreateElement('header', 'game-header');
  
  newGameButton = CreateElement('button', 'new-game__btn','New Game');
   
  clicksInfo = CreateElement('span', 'clicks-info');

  timer = new Timer();

  difficult = new Difficult(this);

  rangeScreen = new Range();

  themeChanger = new ThemeChanger();

  field;

  gameInfo;

  clicks;

  audio = new AudioLibrary();

  gameStat = GAME_STATUS.NOT_STARTED;
  
  constructor() {
    const clicks = window.localStorage.getItem('clicks') || 1;
    this.clicks = +clicks;
    this.clicksInfo.textContent = `Clicks: ${clicks}`;
    this.field = new Field(this, this.audio, this.difficult.range, this.difficult.mines);
    this.setHeader();
    this.setInfo();
    this.newGameButton.addEventListener('click', ()=>{this.newGameStart();});
  }

  saveInfo() {
    window.localStorage.setItem('difficult',this.difficult.range);
    window.localStorage.setItem('clicks',this.clicks);
    window.localStorage.setItem('time',this.timer.showTime());
    window.localStorage.setItem('field',this.field.saveField());
  }

  setInfo() {
    const infoElement = CreateElement('div','info-message-wrapper');
    this.infoMessage = CreateElement('div','info-message');
    const newGameButton = CreateElement('button', 'new-game__btn','New Game');
    newGameButton.addEventListener('click', () => {
      this.gameInfo.close();
      this.newGameStart();
    });
    infoElement.append(this.infoMessage);
    infoElement.append(newGameButton);
    this.gameInfo = new Info(infoElement);
  }

  addClick() {
this.clicks += 1;
this.clicksInfo.textContent =  `Clicks: ${this.clicks}`;
this.saveInfo();
}

resetClicks() {
  this.clicks = 0;
  this.clicksInfo.textContent = `Clicks: ${this.clicks}`; 
}

newGameStart() {
  clearStorage(['clicks', 'time', 'field']);
  this.timer.reset();
  this.resetClicks();
  this.field.element.remove();
  this.field = new Field(this, this.audio, this.difficult.range, this.difficult.mines);
  this.field.show();
  this.setUsefullInfo();
}

gameBegins() {
  this.gameStat = GAME_STATUS.STARTED;
  this.timer.startIt();
}

gameEnd(win=false) {
  this.timer.stopIt();
  if (win) {
    this.infoMessage.textContent = `Hooray! You found all mines in ${this.timer.showTime()} seconds and ${this.clicks} moves!`;
    this.rangeScreen.addResult(this.difficult.range, this.timer.showTime(), this.clicks);
  }
  else {
  this.infoMessage.textContent = `Game over. Try again!`;
  }
  this.gameInfo.open();
  clearStorage(['clicks', 'time', 'field']);
}

start() {
  document.body.append(this.header);
  this.field.show();
  this.setUsefullInfo();
}

  setHeader() {
    this.header.append(this.newGameButton);
    this.header.append(this.difficult.button);
    this.header.append(this.timer.element);
    this.header.append(this.clicksInfo);
    this.header.append(this.difficult.infoElement);
    this.header.append(this.rangeScreen.button);
    this.header.append(this.themeChanger.element);
    this.header.append(this.audio.playButton);
  }

  setUsefullInfo() {
    if (this.infoElement) {this.infoElement.remove()};
    const text = `<ol><li>Mark by right-click mouse button</li>
    <li>Game is autosaved after every move. There is no need save button</li></ol>
    `;
    this.infoElement = CreateElement('div','simple-info');
    this.infoElement.innerHTML = text;
    document.body.append(this.infoElement);
  }


}