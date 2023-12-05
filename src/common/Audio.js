import './Audio.scss';
import { CreateElement } from './Utils';

export default class AudioLibrary {
  
  explodeLink = './assets/sounds/explode.wav';

  clickLink = './assets/sounds/click.wav';
  
  clearLink = './assets/sounds/clear.wav';

  winLink = './assets/sounds/win.wav';

  markLink =  './assets/sounds/mark.wav';

  looseLink =  './assets/sounds/loose.wav';

  explode = new Audio(this.explodeLink);

  click = new Audio(this.clickLink);
  
  clear = new Audio(this.clearLink);
  
  win = new Audio(this.winLink);

  mark = new Audio(this.markLink);

  loose = new Audio(this.looseLink);

  playNow;

  playOn = window.localStorage.getItem('audio') || true;

  playButton = CreateElement('button', 'audio-button');

  constructor() {
    this.playOn = !((this.playOn === 'false' || !this.playOn));
    this.playButton.classList.add(`audio_${this.playOn}`);
    this.playButton.addEventListener('click', () => {
      if (this.playNow) {this.playNow.pause();}
      this.playButton.classList.remove(`audio_${this.playOn}`);
      this.playOn = !(this.playOn);
      window.localStorage.setItem('audio', this.playOn);
      this.playButton.classList.add(`audio_${this.playOn}`);
    });
  }

  playClick() {
    this.simplePlay(this.click);
  }

  playExplode() {
    this.simplePlay(this.explode);
  }

  playClear() {
    this.simplePlay(this.clear);
  }

  playWin() {
    this.simplePlay(this.win);
  }

  playLoose() {
    this.simplePlay(this.loose);
  }

  playMark() {
    this.simplePlay(this.mark);
  }


  simplePlay(audio) {
    if (this.playOn) {
    if (this.playNow) {this.playNow.pause();}
    // eslint-disable-next-line no-param-reassign
    audio.currentTime = 0;
    audio.play();
    audio.addEventListener('play', ()=>{this.playNow = audio;});
    audio.addEventListener('pause', ()=>{this.playNow = null;});
    audio.addEventListener('ended', ()=>{this.playNow = null;});
   }
  } 

} 