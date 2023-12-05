export const CreateElement = (nodeName, className, textContent) => {
  const element = document.createElement(nodeName);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element
}

export const randomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

export const randomPair = (min, max) => [randomNumber(min,max), randomNumber(min,max)];

export const clearStorage = (storagesToClear) => {
  if (Array.isArray(storagesToClear)) storagesToClear.forEach((storageName) => {
    window.localStorage.setItem(storageName,'');
  });
  else window.localStorage.setItem(storagesToClear,'');
}

export const changeStyle = (newTheme, oldTheme) => {
  if (newTheme) {
    document.body.classList.add(newTheme);  
  }
  if (oldTheme) {
    document.body.classList.remove(oldTheme);  
  }
}