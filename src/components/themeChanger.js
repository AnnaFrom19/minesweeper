import { CreateElement, changeStyle } from "../common/Utils";
import  { DARK_THEME_LABEL } from "../common/const";
import './themeChanger.scss';

export default class ThemeChanger {

  defaultColorSchema = window.matchMedia('(prefers-color-scheme: dark)');
  
  prefSchema = this.defaultColorSchema.matches ? DARK_THEME_LABEL : ''; 

  baseTheme = window.localStorage.getItem('theme') || this.prefSchema;

  checkboxElement = CreateElement('input', 'theme-checkbox');

  element = CreateElement('label', 'theme-label');

  constructor() {
    this.checkboxElement.type = 'checkbox';
    if (this.baseTheme === DARK_THEME_LABEL) {
      this.checkboxElement.checked = true;
      changeStyle(this.baseTheme);
    }
    this.defaultColorSchema.addEventListener('change', () => {
      this.changeDefaultSchema();
    });
    this.checkboxElement.addEventListener('change', () => {
      this.changeSchema(this.checkboxElement.checked);
    });
    this.element.append(this.checkboxElement);
  }

  changeDefaultSchema() {
    this.prefSchema = this.defaultColorSchema.matches ? DARK_THEME_LABEL : '';
    if (this.prefSchema !== this.baseTheme) {
      this.changeSchema(this.defaultColorSchema.matches);
    }
  }

  changeSchema(isDark = false) {
    this.baseTheme = isDark ? DARK_THEME_LABEL : '';
    window.localStorage.setItem('theme', this.baseTheme);
    const oldTheme = !isDark ? DARK_THEME_LABEL : '';
    changeStyle(this.baseTheme, oldTheme);
  }
}