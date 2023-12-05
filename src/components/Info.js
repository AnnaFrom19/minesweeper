import './Info.scss';
import { CreateElement } from "../common/Utils";

export default class Info {
  blackScreen = CreateElement('div','black-screen');

  constructor(innerElement) {
    this.blackScreen.append(innerElement);
    this.blackScreen.addEventListener('click', () => {this.close()});
    innerElement.addEventListener('click', (event) => {event.stopPropagation();});
  }

  open() {
    document.body.append(this.blackScreen);
  }

  close() {
    this.blackScreen.remove();
  }
}