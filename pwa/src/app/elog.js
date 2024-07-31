function elog(func, text, color) { // super tsuyotusyo command line logging tool!
  console.log('%c' + func + '%c%c' + text, 'font-size: 12px; border-radius: 3px 0 0 3px; color: black; font-weight: 1000; padding: 1px 4px; background: ' + color + '; border: solid ' + color + ' 1px;', '', 'font-size: 12px; border-radius: 0 3px 3px 0; color: white; font-weight: 1000; padding: 1px 4px; background: black; border: solid ' + color + ' 1px;')
}
