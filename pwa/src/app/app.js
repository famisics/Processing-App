if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./src/app/sw.js')
    .then(res => {
      elog('Service Worker', 'registered successfully ✨️', 'CadetBlue')
    })
    .catch(error => {
      elog('Service Worker', 'registered failed', 'CadetBlue')
      console.error('Error:', error)
    })
}
