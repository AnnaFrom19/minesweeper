import './Range.scss';
import Info from "./Info";
import { CreateElement } from "../common/Utils";
import { DIFFICULT_NAME } from "../common/const";


export default class Range {

  button = CreateElement('button', 'range-button', 'Best');

  results = [];

  resultTable = CreateElement('div', 'result-wrapper');

  infoScreen = new Info(this.resultTable);

  constructor() {
    const allResults = window.localStorage.getItem('results') || '';
    if (allResults) {
      this.results = allResults.split('||').map((oneData) => {
        const [difficult, time, clicks] = oneData.split('|');
        return { difficult, time, clicks };
      });
    }
    this.button.addEventListener('click', () => {
      this.infoScreen.open();
    });
    this.getResultsTable();
  }

  addResult(difficult, time, clicks) {
    const difficultName = DIFFICULT_NAME[difficult];
    this.results.unshift({difficult: difficultName, time, clicks});
    if (this.results.length > 10) this.results.pop();
    this.getResultsTable();
    this.saveResult();
  }

  saveResult() {
    const localString = this.results.map(data => Object.values(data).join('|')).join('||');
    window.localStorage.setItem('results', localString);
  }

  getResultsTable() {
    this.resultTable.innerHTML = '';
    if (this.results.length > 0) {
      const header = {
        difficult: 'Difficult',
        time: 'Time',
        clicks: 'Clicks'
      };
      this.addData(header, true);
      this.resultTable.classList.add('table-wrapper');
      this.results.forEach((data) => {
        this.addData(data);
      })
    }
    else {
      const emptyElement = CreateElement('span', 'empty-wrapper', 'No Results');
      this.resultTable.append(emptyElement);
    }
  }

  addData(data, header = false) {
    const headerStyle = header ? ' header' : '';
    const [difficult, time, clicks] = [CreateElement('span', `difficult-wrapper${ headerStyle }`, data.difficult),
        CreateElement('span', `time-wrapper${ headerStyle}`, data.time),
        CreateElement('span', `clicks-wrapper${ headerStyle}`, data.clicks),
      ];

        this.resultTable.append(difficult);
        this.resultTable.append(time);
        this.resultTable.append(clicks);
  }
}