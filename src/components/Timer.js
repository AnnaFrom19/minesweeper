import './Timer.scss';
import { CreateElement } from "../common/Utils";

export default class Timer {

  element = CreateElement('div', 'timer-field');
  
  currentTime = 0;
  
  timer;

  constructor() {
    this.currentTime = window.localStorage.getItem('time') || 0;
    this.currentTime = +this.currentTime;
    this.draw();
  }

  startIt() {
    this.timer = window.setInterval(()=>{
      this.currentTime += 1;
      this.draw();
    }, 1000)
  }

  reset() {
    this.stopIt();
    this.currentTime = 0;
    this.draw();
  }
  
  stopIt() {
    if (this.timer) {
      window.clearInterval(this.timer);
    }
  }

  showTime() {
    return this.currentTime;
  }

  draw() {
    this.element.textContent = `Time: ${this.showTime()}s`;
  }
}