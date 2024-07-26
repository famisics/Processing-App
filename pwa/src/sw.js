// キャッシュバージョン
const CACHE_VERSION = 1;
const CURRENT_CACHE = `cache-v${CACHE_VERSION}`;

// キャッシュするファイルリスト
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/images/logo.png'
];

// インストールイベント
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CURRENT_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching files...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Install completed.');
        self.skipWaiting(); // 新しいService Workerをすぐにアクティブ化
      })
  );
});

// アクティベートイベント
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CURRENT_CACHE)
          .map((cacheName) => {
            console.log(`Service Worker: Deleting old cache ${cacheName}`);
            return caches.delete(cacheName);
          })
      );
    })
    .then(() => {
      console.log('Service Worker: Activate completed.');
    })
  );
});

// フェッチイベント
self.addEventListener('fetch', (event) => {
  console.log(`Service Worker: Fetching ${event.request.url}`);
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log(`Service Worker: Returning cached response for ${event.request.url}`);
          return response;
        } else {
          console.log(`Service Worker: Fetching ${event.request.url} from network`);
          return fetch(event.request);
        }
      })
  );
});
