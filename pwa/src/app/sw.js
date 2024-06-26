// キャッシュバージョン
const CURRENT_CACHE = 'cache-v3'

// キャッシュするファイルのリスト
const urlsToCache = [
  '../../fitbit.html',
  '../../index.html',
  '../../src/funget.js',
  '../../src/app/app.css',
  '../../src/app/app.js',
  '../../src/app/p5.min.js',
  '../../src/font/JetBrainsMono-Medium.ttf',
  '../../src/font/NotoSansJP-Medium.ttf',
  '../../src/img/title.jpg',
  '../../src/img/home/midnight.jpg',
  '../../src/img/home/night.jpg',
  '../../src/img/home/noon.jpg',
  '../../src/img/home/sunset.jpg',
  '../../src/img/weather/01d.jpg',
  '../../src/img/weather/01n.jpg',
  '../../src/img/weather/02d.jpg',
  '../../src/img/weather/02n.jpg',
  '../../src/img/weather/03d.jpg',
  '../../src/img/weather/03n.jpg',
  '../../src/img/weather/04d.jpg',
  '../../src/img/weather/04n.jpg',
  '../../src/img/weather/09d.jpg',
  '../../src/img/weather/10d.jpg',
  '../../src/img/weather/11d.jpg',
  '../../src/img/weather/13d.jpg',
  '../../src/img/weather/50d.jpg',
  '../../src/json/apikeys.json',
  '../../src/json/endpoints.json',
  '../../src/json/funbus.json',
  '../../src/pwa/icon.png',
  '../../src/pwa/icon128.png',
  '../../src/pwa/icon256.png',
  '../../src/pwa/icon32.png',
  '../../src/pwa/icon48.png',
  '../../src/pwa/icon64.png',
  '../../src/pwa/manifest.json',
  '../../src/svg/mode/bus.png',
  '../../src/svg/mode/bus.svg',
  '../../src/svg/mode/fit.png',
  '../../src/svg/mode/fit.svg',
  '../../src/svg/mode/home.png',
  '../../src/svg/mode/home.svg',
  '../../src/svg/mode/sleep.png',
  '../../src/svg/mode/sleep.svg',
  '../../src/svg/mode/weather.png',
  '../../src/svg/mode/weather.svg',
  '../../src/svg/status/change.png',
  '../../src/svg/status/change.svg',
  '../../src/svg/status/check.png',
  '../../src/svg/status/check.svg',
  '../../src/svg/status/error.png',
  '../../src/svg/status/error.svg',
  '../../src/svg/status/off.png',
  '../../src/svg/status/off.svg',
  '../../src/svg/status/on.png',
  '../../src/svg/status/on.svg',
  '../../src/svg/status/settings.png',
  '../../src/svg/status/settings.svg',
  '../../src/svg/weather/01d.png',
  '../../src/svg/weather/01d.svg',
  '../../src/svg/weather/01n.png',
  '../../src/svg/weather/02d.png',
  '../../src/svg/weather/02d.svg',
  '../../src/svg/weather/02n.png',
  '../../src/svg/weather/03d.png',
  '../../src/svg/weather/03d.svg',
  '../../src/svg/weather/03n.png',
  '../../src/svg/weather/04d.png',
  '../../src/svg/weather/04d.svg',
  '../../src/svg/weather/04n.png',
  '../../src/svg/weather/09d.png',
  '../../src/svg/weather/09d.svg',
  '../../src/svg/weather/10d.png',
  '../../src/svg/weather/10d.svg',
  '../../src/svg/weather/11d.png',
  '../../src/svg/weather/11d.svg',
  '../../src/svg/weather/13d.png',
  '../../src/svg/weather/13d.svg',
  '../../src/svg/weather/50d.png',
  '../../src/svg/weather/50d.svg',
]

// インストール
self.addEventListener('install', event => {
  console.log('Service Worker', 'Installing...', 'CadetBlue');
  event.waitUntil(
    caches.open(CURRENT_CACHE)
      .then(cache => {
        console.log('Service Worker', 'Caching files...', 'CadetBlue');
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.error('Service Worker', `Failed to cache ${url}:`, err);
            });
          })
        );
      })
      .then(() => {
        console.log('Service Worker', 'Install completed.', 'CadetBlue');
        self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker', 'Failed to open cache', error);
      })
  );
});

// アクティブ化
self.addEventListener('activate', event => {
  console.log('Service Worker', 'Activating...', 'CadetBlue');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          // 旧バージョンのキャッシュを削除
          cacheNames.filter(cacheName => cacheName !== CURRENT_CACHE)
            .map(cacheName => {
              console.log('Service Worker', `Deleting old cache ${cacheName}`, 'CadetBlue');
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('Service Worker', 'Activate completed.', 'CadetBlue');
      })
  );
});

// fetch
self.addEventListener('fetch', event => {
  console.log('Service Worker', `Fetching ${event.request.url}`, 'CadetBlue');
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log('Service Worker', `Returning cached response for ${event.request.url}`, 'CadetBlue');
        return response;
      } else {
        console.log('Service Worker', `Fetching ${event.request.url} from network`, 'CadetBlue');
        return fetch(event.request);
      }
    })
  );
});
