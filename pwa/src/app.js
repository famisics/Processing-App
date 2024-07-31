function elog(func, text, color) {
  console.log('%c' + func + '%c%c' + text, 'font-size: 12px; border-radius: 3px 0 0 3px; color: black; font-weight: 1000; padding: 1px 4px; background: ' + color + '; border: solid ' + color + ' 1px;', '', 'font-size: 12px; border-radius: 0 3px 3px 0; color: white; font-weight: 1000; padding: 1px 4px; background: black; border: solid ' + color + ' 1px;')
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js')
    .then(res => {
      elog('PWA Service Worker', 'registered successfully ✨️', 'PaleTurquoise')
      console.log(res)
    })
    .catch(error => {
      console.error('PWA Service Worker registration failed:', error)
    })
}
