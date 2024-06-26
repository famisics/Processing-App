function elog(func, text, color) {
  console.log('%c' + func + '%c%c' + text, 'font-size: 12px; border-radius: 3px 0 0 3px; color: black; font-weight: 1000; padding: 1px 4px; background: ' + color + '; border: solid ' + color + ' 1px;', '', 'font-size: 12px; border-radius: 0 3px 3px 0; color: white; font-weight: 1000; padding: 1px 4px; background: black; border: solid ' + color + ' 1px;')
} // super tsuyotusyo command line logging tool!

var DEV_MODE = 1
var ERROR_CODE = ''

var WS = 0
var WL = 0
var WT = 0

// function setup() {
//   let width = window.innerWidth;
//   let height = window.innerHeight-10;
//   createCanvas(width, height);
// }

// ボタン管理用クラス

var LIST_Button = []

// 動作に必要なモジュール
var API
var CPT

// シーン
var TitleScene
var HomeScene
var WeatherScene
var FitScene
var FunbusScene
var IpinfoScene
var SleepScene
var SettingsScene

var mode = 0 // モード0で初期化

// config

var isFirstBus = false
var isFreeWifiNotContain = true
var busMode = 'auto'
var isFirstLoad = true

// 素材

var FONT_meiryo
var FONT_jetbrains
var FONT_noto
var SVG_home
var SVG_weather
var SVG_fit
var SVG_funbus
var SVG_sleep
var SVG_check
var SVG_error
var SVG_on
var SVG_off
var SVG_change
var SVG_settings

var MANAGER_nextmotion = '' // 次に行う動作
var MANAGER_isMousePressed = false
var MANAGER_mouseX, MANAGER_mouseY
var isCmode = false
var cmodeCount = 0
var cmodeTarget = 0
var cmodeText = ''

var JSON_endpoints
var JSON_apikeys
var JSON_funbus

function preload() {
  // jsonのロード
  JSON_endpoints = loadJSON('./src/json/endpoints.json')
  JSON_apikeys = loadJSON('./src/json/apikeys.json')
  JSON_funbus = loadJSON('./src/json/funbus.json')

  // フォントの初期化
  FONT_meiryo = 'Meiryo UI'
  FONT_jetbrains = loadFont('./src/font/JetBrainsMono-Medium.ttf')
  FONT_noto = loadFont('./src/font/NotoSansJP-Medium.ttf')

  // モードアイコンの初期化
  SVG_home = loadImage('./src/svg/mode/home.png')
  SVG_weather = loadImage('./src/svg/mode/weather.png')
  SVG_fit = loadImage('./src/svg/mode/fit.png')
  SVG_funbus = loadImage('./src/svg/mode/bus.png')
  SVG_sleep = loadImage('./src/svg/mode/sleep.png')

  // ステータスアイコンの初期化
  SVG_check = loadImage('./src/svg/status/check.png')
  SVG_error = loadImage('./src/svg/status/error.png')
  SVG_on = loadImage('./src/svg/status/on.png')
  SVG_off = loadImage('./src/svg/status/off.png')
  SVG_change = loadImage('./src/svg/status/change.png')
  SVG_settings = loadImage('./src/svg/status/settings.png')
}

function setup() {
  background(0)
  calcWindowScale()
  noStroke()
  elog('boot', 'initializing... ', 'lime')
  // createCanvas(600, 1200) // Google Pixel 7 基準に指定
  createCanvas(600 * WS + WL, 1200 * WS + WT)
  // scaleX = (float) width / originalWidth;
  // scaleY = (float) height / originalHeight;
  boot() // コードを読みやすくするために、managerでシーンを初期化(boot)しています
  calcWindowScale() // 一応画面サイズを再適用
}

function windowResized() {
  calcWindowScale()
  resizeCanvas(600 * WS + WL, 1200 * WS + WT) // キャンバスサイズを再設定
}

function calcWindowScale() {
  // WS は 600*WS (600) に対しての倍率
  if (windowWidth * 2 - windowHeight > 0) {
    // 横長
    WT = 0
    WL = (windowWidth - windowHeight / 2) / 2
    WS = windowHeight / 1200
  } else {
    // 縦長
    WT = (windowHeight - windowWidth * 2) / 2
    WL = 0
    WS = windowWidth / 600
  }
  elog('calcWindowScale', 'WS: ' + WS + ' WL: ' + WL + ' WT: ' + WT, 'yellow')
}

function draw() {
  // pushMatrix();
  // scale(scaleX, scaleY);
  update() // コードを読みやすくするために、managerでシーンを描画(update)しています
  // popMatrix();
}

// ! デモ用のキー
function keyPressed() {
  // シーンを切り替える
  switch (key) {
    case '0': // スタート画面
      cmode(0)
      break
    case '1': // ホーム画面
      cmode(1)
      break
    case '2': // 天気画面
      cmode(2)
      break
    case '3': // バス画面
      cmode(4)
      break
    case '4': // 歩数画面
      cmode(3)
      break
    case '5': // 睡眠画面
      cmode(6)
      break
    case '6': // 接続情報画面
      cmode(5)
      break
    case '7': // 設定画面
      cmode(7)
      break
    case 'l': // デモ用、最終バス表示
      DEMO_isLast = !DEMO_isLast
      break
  }
}

// ? アプリの進行を管理するコード

// 初期化処理
function boot() {
  // クラスの初期化
  API = new API_class()
  CPT = new Component_class()
  // シーンの初期化
  TitleScene = new TitleScene_class()
  HomeScene = new HomeScene_class()
  WeatherScene = new WeatherScene_class()
  FitScene = new FitScene_class()
  FunbusScene = new FunbusScene_class()
  IpinfoScene = new IpinfoScene_class()
  SleepScene = new SleepScene_class()
  SettingsScene = new SettingsScene_class()

  // config.json
  elog('boot', 'settings loading...', 'lime')
  if (localStorage.getItem('settings/is_first_bus')) {
    if (localStorage.getItem('settings/is_first_bus') == 1) {
      isFirstBus = true
    } else {
      isFirstBus = false
    }
  } else {
    isFirstBus = false
    localStorage.setItem('settings/is_first_bus', isFirstBus ? 1 : 0)
  }
  if (localStorage.getItem('settings/is_free_wifi_contain')) {
    if (localStorage.getItem('settings/is_free_wifi_contain') == 1) {
      isFreeWifiNotContain = true
    } else {
      isFreeWifiNotContain = false
    }
  } else {
    isFreeWifiNotContain = false
    localStorage.setItem('settings/is_free_wifi_not_contain', isFreeWifiNotContain ? 1 : 0)
  }
  if (localStorage.getItem('settings/is_first_load') == 'done') {
    isFirstLoad = false
  } else {
    isFirstLoad = true
  }
  if (localStorage.getItem('settings/bus_mode')) {
    busMode = localStorage.getItem('settings/bus_mode')
  } else {
    busMode = 'auto'
    localStorage.setItem('settings/bus_mode', busMode)
  }

  // apikeys.json
  if (JSON_apikeys != null) {
    elog('boot', 'apikeys.json loading...', 'lime')
    API.setApikeys(JSON_apikeys)
  } else {
    elog('boot', 'apikeys.json not found', 'red')
  }

  // endpoints.json
  if (JSON_endpoints != null) {
    elog('boot', 'endpoints.json loading...', 'lime')
    API.setEndpoints(JSON_endpoints)
  } else {
    elog('boot', 'endpoints.json not found', 'red')
  }

  elog('boot', 'initializing... done', 'lime')
  // アプリの起動
  cmode(0)
}

// 更新処理
function update() {
  if (isCmode) {
    // モード切り替え中の場合、シーン切り替え処理
    if (cmodeCount < 2) {
      // if (!(cmodeText == '')) {
      //   // 切り替え中のメッセージ空ではない場合、読み込み中ウィンドウを表示
      //   fill(255, 255, 255, 150)
      //   rect(0, 0, 600, 1100)
      //   fill(0, 75, 75)
      //   rect(45, 495, 510, 210)
      //   fill(255)
      //   rect(50, 500, 500, 200)
      //   textAlign(CENTER, CENTER)
      //   fill(0)
      //   textFont(FONT_noto, 30)
      //   text(cmodeText, 300, 600)
      //   if (!(mode == 0)) {
      //     CPT.footer()
      //   }
      // }
      cmodeCount++
    } else {
      cmodeCount = 0
      isCmode = false
      cmodeAction(cmodeTarget)
    }
  } else {
    background(0)
    if (!(ERROR_CODE == 0)) {
      // エラー処理
      errorWindow()
    } else {
      // 初期化
      fill(255)
      rect(WL, WT, 600 * WS, 1200 * WS)
      // シーン描画処理
      switch (mode) {
        case 0: // タイトル
          TitleScene.update()
          break
        case 1: // ホーム
          HomeScene.update()
          break
        case 2: // 天気
          WeatherScene.update()
          break
        case 3: // Fit
          FitScene.update()
          break
        case 4: // Funbus
          FunbusScene.update()
          break
        case 5: // IP情報
          IpinfoScene.update()
          break
        case 6: // 睡眠
          SleepScene.update()
          break
        case 7: // 設定
          SettingsScene.update()
          break
      }
      if (LIST_Button != []) {
        for (let b of LIST_Button) {
          b.update()
        }
      }
    }
    if (!(mode == 0)) {
      CPT.footer()
    }
  }
  // つぎに行う動作がある場合、実行
  if (!MANAGER_nextmotion == '') {
    query = split(MANAGER_nextmotion, ',') // 動作を展開
    if (query[0] == 'cmode') {
      cmode(query[1]) // cmodeを実行
    }
    MANAGER_nextmotion = ''
  }
}

// シーン切り替え処理を開始する
function cmode(i) {
  LIST_Button = []
  isCmode = true
  cmodeTarget = i
  switch (
    i // メッセージを選択
  ) {
    case 0:
      cmodeText = ''
      break
    case 1:
      cmodeText = '読み込み中'
      break
    case 2:
      cmodeText = '天気情報を取得中\n\nby Open Weather Map'
      break
    case 3:
      cmodeText = '歩数情報を取得中\n\nby Fitbit API'
      break
    case 4:
      cmodeText = 'バス情報を取得中\n\nby Google Apps Script'
      break
    case 5:
      cmodeText = 'IPアドレスを取得中\n\nby IPinfo.io'
      break
    case 6:
      cmodeText = '睡眠情報を取得中\n\nby Fitbit API'
      break
    case 7:
      cmodeText = ''
      break
  }
}

// シーン切り替え処理を実行する
function cmodeAction(i) {
  i = Number(i)
  switch (i) {
    case 0:
      TitleScene.boot()
      break
    case 1:
      HomeScene.boot()
      break
    case 2:
      WeatherScene.boot()
      break
    case 3:
      FitScene.boot()
      break
    case 4:
      FunbusScene.boot()
      break
    case 5:
      IpinfoScene.boot()
      break
    case 6:
      SleepScene.boot()
      break
    case 7:
      SettingsScene.boot()
      break
  }
  mode = i
  elog('cmode', ' mode: ' + mode, 'violet')
}

// 読み込み画面(p5.js用)
function loading(i) {
  textAlign(CENTER, CENTER)
  fill(0)
  textFont(FONT_noto, 30 * WS)
  text(i, WL + 300 * WS, WT + 600 * WS)
  var processing = millis() % 600
  var rectx
  var _width = 0
  if (processing < 300) {
    rectx = 200
    _width = (processing * 4) / 6
  } else if (processing < 600) {
    rectx = 200 + ((processing - 300) * 4) / 6
    _width = 200 - ((processing - 300) * 4) / 6
  }
  rect(WL + rectx * WS, WT + 800 * WS, _width * WS, 20 * WS)
}

// エラー画面(p5.js用)
function errorWindow() {
  fill(255, 255, 0)
  rect(WL, WT, 600 * WS, 1200 * WS)
  textAlign(CENTER, CENTER)
  fill(0)
  textFont(FONT_noto, 48 * WS)
  text('エラーが発生しました', WL + 300 * WS, WT + 400 * WS)
  textFont(FONT_noto, 30 * WS)
  if (ERROR_CODE == 1) {
    text('Fitbit APIに接続できません', WL + 300 * WS, WT + 600 * WS)
    text('Fitbit APIのトークンが', WL + 300 * WS, WT + 700 * WS)
    text('正しく設定されていない可能性があります', WL + 300 * WS, WT + 750 * WS)
    text('タップしてトークン設定画面に移動します', WL + 300 * WS, WT + 850 * WS)
    if (MANAGER_isMousePressed && MANAGER_mouseY > WT && MANAGER_mouseY < WT + 1100 * WS) {
      ERROR_CODE = 0
      location.href = 'fitbit.html'
    } else if (MANAGER_isMousePressed && MANAGER_mouseY > WT + 1100 * WS && MANAGER_mouseY < WT + 1200 * WS) {
      ERROR_CODE = 0
    }
  } else if (ERROR_CODE == 2) {
    text('データの取得に失敗しました', WL + 300 * WS, WT + 600 * WS)
    text('タップしてホームに戻ります', WL + 300 * WS, WT + 900 * WS)
    if (MANAGER_isMousePressed && MANAGER_mouseY > WT && MANAGER_mouseY < WT + 1100 * WS) {
      ERROR_CODE = 0
      cmode(0)
      location.href = 'fitbit.html'
    } else if (MANAGER_isMousePressed && MANAGER_mouseY > WT + 1100 * WS && MANAGER_mouseY < WT + 1200 * WS) {
      ERROR_CODE = 0
    }
  }
  elog('error', ERROR_CODE, 'red')
}

// ボタンの追加
function addButton(x, y, w, h, bg, label, type, id) {
  elog('addButton', 'x: ' + x + ', y: ' + y + ', w: ' + w + ', h: ' + h + ', bg: ' + bg + ', label: ' + label + ', type: ' + type + ', id: ' + id, 'Tomato')
  LIST_Button.push(new Button_class(x, y, w, h, bg, label, type, id))
}

// バスをデフォルトの表示にするかどうかを変更
function changeFirstBus() {
  isFirstBus = !isFirstBus
  localStorage.setItem('settings/is_first_bus', isFirstBus ? 1 : 0)
  elog('json', '設定が保存されました isFirstBus: ' + isFirstBus, 'lime')
}

// フレッツ光を含むかどうかの設定を変更
function changeFreeWifiContain() {
  isFreeWifiNotContain = !isFreeWifiNotContain
  localStorage.setItem('settings/is_free_wifi_contain', isFreeWifiNotContain ? 1 : 0)
  elog('json', '設定が保存されました isFreeWifiNotContain: ' + isFreeWifiNotContain, 'lime')
}

// バスモードを変更
function changeBusMode() {
  if (busMode == 'fromkmdtofun') {
    busMode = 'fromfuntokmd'
  } else if (busMode == 'fromfuntokmd') {
    busMode = 'auto'
  } else {
    busMode = 'fromkmdtofun'
  }
  localStorage.setItem('settings/bus_mode', busMode)
  elog('json', '設定が保存されました busMode: ' + busMode, 'lime')
  cmode(mode)
}

// firstloadを解除
function changeFirstLoad() {
  isFirstLoad = false
  localStorage.setItem('settings/is_first_load', 'done')
  elog('json', '設定が保存されました isFirstLoad: ' + isFirstLoad, 'lime')
}

// マウスが押された場合に、そのことと座標を記録する(それぞれのボタンを描画している場所で、条件にあたるかどうかを判定する(ここでは判定しない))
function mousePressed() {
  MANAGER_isMousePressed = true
  MANAGER_mouseX = mouseX
  MANAGER_mouseY = mouseY
  for (let b of LIST_Button) {
    b.checkClick(mouseX, mouseY)
  }
}

// ? 各種APIの{管理、呼び出し、キャッシュ}、エンドポイント、APIキーの管理を行うクラス
// * このファイルは特に複雑なので、コメントをしっかり残しています

async function funfetch(query) {
  try {
    var response = await fetch(query.toString()) // URL 文字列に変換して fetch
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    elog('funfetch', '200 - funfetch done', 'MediumSpringGreen')
    const data = await response.json()
    return data
  } catch (error) {
    if (error.message == 'Failed to fetch') {
      if (mode == 3 || mode == 6) {
        ERROR_CODE = 1
      } else {
        ERROR_CODE = 2
      }
    }
    console.error('Error fetching data:', error)
    throw error // エラーを再スロー
  }
}

function decode(query) {
  elog('*', 'query solved', 'white')
  var decoded = atob(query)
  return decoded
}

async function lawReturn(i) {
  try {
    return i
  } catch (error) {}
}

class API_class {
  // ! ---------------- ローカル変数の定義 ----------------

  // キャッシュの有効期限(ミリ秒)
  timeout = 5 * 60 * 1000 // 5分

  // それぞれのキャッシュの起点となる時間を記憶する変数
  CASHTIME_weatherNow = 0
  CASHTIME_weatherForecast = 0
  CASHTIME_funbus = 0
  CASHTIME_fitbit = 0
  CASHTIME_fitbitSleep = 0
  CASHTIME_ipinfo = 0

  // APIレスポンスをキャッシュしておくHashMap→連想配列ということにしよう
  weatherNow = 0
  weatherForecast = 0
  funbus = 0
  fitbit = 0
  fitbit_sleep = 0
  ipinfo = 0

  // APIで用いるHashMap
  apikeys // API キーリスト
  endpoints // API エンドポイントリスト

  // ! ---------------- API ----------------

  // Open Weather Map から天気情報を取得
  async getWeatherNow() {
    var timediff = millis() - this.CASHTIME_weatherNow
    if (this.weatherNow != 0 && timediff < this.timeout) {
      // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      elog('API', 'getWeatherNow: CASH... done at ' + this.getTime() + ', キャッシュ期限: ' + Math.floor((this.timeout - timediff) / 1000) + '秒', 'LightSkyBlue')
      return Promise.resolve(this.weatherNow)
    }
    elog('API', 'getWeatherNow: FETCHING... ', 'LightSkyBlue')
    try {
      const data_1 = await funfetch(decode(localStorage.getItem('endpoints/openweathermap_weather')) + decode(localStorage.getItem('apikeys/openweathermap')))
      var res = { weather: '', icon: '', temp: '', pressure: '', city: '' }
      res.weather = data_1.weather[0].description
      res.icon = data_1.weather[0].icon.substring(0, 2) + 'd'
      if (this.isNight() && res.icon == '01d') res.icon = '01n'
      if (this.isNight() && res.icon == '02d') res.icon = '02n'
      if (this.isNight() && res.icon == '03d') res.icon = '03n'
      if (this.isNight() && res.icon == '04d') res.icon = '04n'
      res.temp = Math.round(10 * (data_1.main.temp - 273.15)) / 10
      res.pressure = Math.round(data_1.main.pressure)
      res.city = data_1.name
      this.weatherNow = res
      this.CASHTIME_weatherNow = millis()
      elog('API', 'getWeatherNow: FETCHING... done at ' + this.getTime(), 'LightSkyBlue')
      return this.weatherNow // * 返す内容 現在の天気{天気、気温、気圧}
    } catch (error) {
      // エラー処理
      console.error(error)
      return false
    }
  }

  // Open Weather Map から天気情報を取得
  async getWeatherForecast() {
    var timediff = millis() - this.CASHTIME_weatherForecast
    if (this.weatherForecast != 0 && timediff < this.timeout) {
      // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      elog('API', 'getWeatherForecast: CASH... done at ' + this.getTime() + ', キャッシュ期限: ' + Math.floor((this.timeout - timediff) / 1000) + '秒', 'LightSkyBlue')
      return Promise.resolve(this.weatherForecast)
    }
    elog('API', 'getWeatherForecast: FETCHING... ', 'LightSkyBlue')
    let query = decode(localStorage.getItem('endpoints/openweathermap_forecast')) + decode(localStorage.getItem('apikeys/openweathermap'))
    try {
      const data = await funfetch(query)
      // 取得した JSON データ (data) を処理
      var JSON_response = data.list

      this.weatherForecast = []

      let _unixtime = Math.round(new Date().getTime() / 1000)
      let _count = 0

      for (var i = 0; i < JSON_response.length; i++) {
        const forecast = JSON_response[i] // JSON_response は配列と仮定
        if (forecast.dt < _unixtime) continue // 現在時刻より前のデータは無視
        const hour = _count * 3 + 3
        _count++

        const forecastData = { hour: '', weather: '', temp: '', icon: '', pressure: '' }
        forecastData.hour = hour
        forecastData.weather = forecast.weather[0].description
        forecastData.temp = Math.round(10 * (forecast.main.temp - 273.15)) / 10
        forecastData.icon = forecast.weather[0].icon.substring(0, 2) + 'd'
        if (this.isNight() && forecastData.icon == '01d') forecastData.icon = '01n'
        if (this.isNight() && forecastData.icon == '02d') forecastData.icon = '02n'
        if (this.isNight() && forecastData.icon == '03d') forecastData.icon = '03n'
        if (this.isNight() && forecastData.icon == '04d') forecastData.icon = '04n'
        forecastData.pressure = Math.round(forecast.main.pressure)
        this.weatherForecast.push(forecastData)

        if (hour >= 15) break // 15時間後まで
      }

      this.CASHTIME_weatherForecast = millis() // キャッシュ時間を更新
      elog('API', 'getWeatherForecast: FETCHING... done at ' + this.getTime(), 'LightSkyBlue')
      return this.weatherForecast
    } catch (error) {
      // エラー処理
      console.error(error)
      return false
    }
  }

  // Google Spreadsheet からバスの時刻表を取得し、次のバスとさらに次のバスの情報を取得する
  getFunbus(query) {
    //!バスのAPIは、最新のデータをすぐに取得する必要があるため、キャッシュを使わないことにした
    //int timediff = millis() - this.CASHTIME_funbus;
    //if ((funbus.size() > 0) && (timediff < this.timeout)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
    //elog('API',getFunbus: returning CASHED_DATA... done with " + funbus.size() + " items at " + this.getTime() + ", キャッシュ期限: " + Math.floor((this.timeout - timediff) / 1000) + "秒", 'aqua');
    //return funbus;
    // }
    elog('API', 'getFunbus: FETCHING... ', 'OrangeRed')
    // 取得した JSON データ (data) を処理
    var data = JSON_funbus
    var date = new Date()
    var day = date.getDay()
    var table = null
    var res = { this_code: '', this_start: '', this_end: '', this_destination: '', this_untilnext: '', next_code: '', next_start: '', next_end: '', next_destination: '' }

    if (query == 'fromkmdtofun') {
      if (day > 0 && day < 6) {
        table = data.weekdayFromKMDtoFUN
      } else {
        table = data.weekendFromKMDtoFUN
      }
    } else if (query == 'fromfuntokmd') {
      if (day > 0 && day < 6) {
        table = data.weekdayFromFUNtoKMD
      } else {
        table = data.weekendFromFUNtoKMD
      }
    } else {
      elog('API', 'getFunbus: クエリが不正です、データを取得できませんでした クエリ:' + query, 'red')
    }

    var thisId = 0 // バスのID

    elog('API', 'getFunbus: ' + query, 'OrangeRed')
    for (var i = 0; i < table.length; i++) {
      // 次に出発するバスを探索
      thisId = i
      var JSON_item = table[i]
      var start = JSON_item.start
      if (start == 'null') {
        elog('API', 'getFunbus: クエリが不正です、データを取得できませんでした クエリ:' + query, 'red')
        break
      }

      //このループのバスが次のバスであれば、ループを抜ける

      var startHour = Number(start.slice(0, 2))
      var startMinute = Number(start.slice(3, 5))
      var startTime = startHour * 60 + startMinute
      var currentTime = hour() * 60 + minute()
      if (startTime > currentTime) break

      if (thisId >= table.length - 1) {
        // 終バス後の処理
        res.this_code = '終バス済'
        res.this_start = ''
        res.this_end = ''
        res.this_destination = ''
        res.this_untilnext = '0'
        res.next_code = ''
        res.next_start = ''
        res.next_end = ''
        res.next_destination = ''
        this.funbus = res
        elog('API', 'getFunbus: FETCHING... done at ' + this.getTime(), 'OrangeRed')
        return this.funbus
      }
    }

    //次に出発するバスの情報
    res.this_code = table[thisId].code
    res.this_start = table[thisId].start
    res.this_end = table[thisId].end
    res.this_destination = this.busDestination(table[thisId].code, query)
    res.this_untilnext = table[thisId].until_next

    if (!(res.this_untilnext == 'last')) {
      // 最終バスのとき、APIは0を返すため、そうでない場合「さらに次のバス」を取得する
      res.next_code = table[thisId + 1].code
      res.next_start = table[thisId + 1].start
      res.next_end = table[thisId + 1].end
      res.next_destination = this.busDestination(table[thisId + 1].code, query)
    } else {
      // 次のバスが最終バスのとき、終バスの表記を返す
      res.next_code = '終バス'
      res.next_start = '00:00'
      res.next_end = '00:00'
      res.next_destination = '新世界'
    }

    this.funbus = res
    this.CASHTIME_funbus = millis()
    elog('API', 'getFunbus: done at ' + this.getTime(), 'OrangeRed')
    return this.funbus // * 返す内容 this_{系統, 出発時刻, 到着時刻, 行き先(算出する), 次のバスまで(APIから取得)} next_{系統, 出発時刻, 到着時刻, 行き先(算出する)}
  }

  // Fitbit APIから歩数データを取得
  async getFitbitSteps() {
    var timediff = millis() - this.CASHTIME_fitbit
    if (this.fitbit != 0 && timediff < this.timeout) {
      // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      elog('API', 'getFitbitSteps: returning CASHED_DATA... done at ' + this.getTime() + ', キャッシュ期限: ' + Math.floor((this.timeout - timediff) / 1000) + '秒', 'aqua')
      return Promise.resolve(this.fitbit)
    }
    elog('API', 'getFitbitSteps: FETCHING... ', 'aqua')
    try {
      const data = await this.fetchFitbit('steps')
      var res = ['0', '0', '0', '0', '0', '0', '0']
      for (var i = 0; i < data.length; i++) {
        var _data = data[i]
        res[7 - i] = _data.steps
      }
      if (ERROR_CODE == 0) {
        this.fitbit = res
        this.CASHTIME_fitbit = millis()
        elog('API', 'getFitbitSteps: done at ' + this.getTime(), 'aqua')
        return this.fitbit // * 返す内容 7,6,5,4,3,2,1日前の歩数{日, 歩数}
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }

  // Fitbit APIから運動データを取得
  async getFitbitSleeps() {
    var timediff = millis() - this.CASHTIME_fitbitSleep
    if (this.fitbit_sleep != 0 && timediff < this.timeout) {
      // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      elog('API', 'getFitbitSleeps: returning CASHED_DATA... done at ' + this.getTime() + ', キャッシュ期限: ' + Math.floor((this.timeout - timediff) / 1000) + '秒', 'aqua')
      return Promise.resolve(this.fitbit_sleep)
    }
    elog('API', 'getFitbitSleeps: FETCHING... ', 'aqua')
    try {
      const data = await this.fetchFitbit('sleeps')
      var res = []
      for (var i = 0; i < data.length; i++) {
        var _data = data[i]
        var _res = { date: '', duration: '', start: '', end: '' }
        _res.date = _data.date
        _res.duration = _data.duration
        _res.start = _data.start
        _res.end = _data.end
        res.push(_res)
      }
      res = res.reverse()
      if (ERROR_CODE == 0) {
        this.fitbit_sleep = res
        this.CASHTIME_fitbitSleep = millis()
        elog('API', 'getFitbitSteps: FETCHING... done at ' + this.getTime(), 'aqua')
        return this.fitbit_sleep // * 返す内容 {日付, 睡眠データ{睡眠時間、睡眠開始、睡眠終了}}
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async fetchFitbit(query) {
    let url = decode(localStorage.getItem('endpoints/gas_fit'))
    let client_id = decode(localStorage.getItem('fitbit/client_id'))
    let client_secret = decode(localStorage.getItem('fitbit/client_secret'))
    let access_token = decode(localStorage.getItem('fitbit/access_token'))
    let refresh_token = decode(localStorage.getItem('fitbit/refresh_token'))
    let query_url = `${url}?query=${query}&client_id=${client_id}&client_secret=${client_secret}&access_token=${access_token}&refresh_token=${refresh_token}`
    try {
      const data = await funfetch(query_url)
      return data
    } catch (error) {
      console.error(error)
      return false
    }
  }

  // ipinfoを用いて、ipアドレスに関する情報を取得する
  // 接続先のプロバイダを取得して、未来大からアクセスしているか、それ以外からアクセスしているかを特定できる
  async getIpinfo() {
    //!バスのAPIに関連するAPIであり、最新のデータをすぐに取得する必要があるため、キャッシュ期限を独自(5秒)にしている→s5でAPIを2回呼ぶから、その時に5秒のキャッシュを読む(リクエスト数の削減)
    var timediff = millis() - this.CASHTIME_ipinfo
    if (this.ipinfo != 0 && timediff < 5000) {
      // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      elog('API', 'getIpinfo: returning CASHED_DATA... done at ' + this.getTime() + ', キャッシュ期限: ' + Math.floor((5000 - timediff) / 1000) + '秒', 'royalblue')
      return Promise.resolve(this.ipinfo)
    }
    elog('API', 'getIpinfo: FETCHING... ', 'royalblue')

    let query = decode(localStorage.getItem('endpoints/ipinfo')) + decode(localStorage.getItem('apikeys/ipinfo'))
    try {
      const data = await funfetch(query)
      // 取得した JSON データ (data) を処理
      var JSON_response = data

      let _arr = { ip: '', region: '', loc: '', org: '' }
      _arr.ip = JSON_response.ip
      _arr.region = JSON_response.city + ', ' + JSON_response.region + ', ' + JSON_response.country
      _arr.loc = JSON_response.loc
      _arr.org = JSON_response.org

      this.ipinfo = _arr

      this.CASHTIME_ipinfo = millis()
      elog('API', 'getIpinfo: done at ' + this.getTime(), 'royalblue')
      return this.ipinfo // * 返す内容 IPアドレス、プロバイダ、地域、座標
    } catch (error) {
      // エラー処理
      console.error(error)
      return false
    }
  }

  // 手動切替を考慮した、未来大モードかどうかの判定
  async solvedIsFUN() {
    elog('API', 'solvedIsFUN', 'Turquoise')
    if (busMode == 'auto') {
      const res = await this.isFUN()
      elog('API', 'solvedIsFUN: done with' + res, 'Turquoise')
      return res
    } else if (busMode == 'fromfuntokmd') {
      elog('API', 'solvedIsFUN: done with true', 'Turquoise')
      return Promise.resolve(true)
    } else {
      elog('API', 'solvedIsFUN: done with false', 'Turquoise')
      return Promise.resolve(false)
    }
  }

  async isRain() {
    elog('API', 'isRain', 'aqua')
    const res = await this.getWeatherForecast()
    // TODO: なんかおかしい気がする
    for (let i = 0; i <= 5; i++) {
      if (res[i] === '10d') {
        return true
      }
    }
    return false
  }

  // ! ---------------- JSONからAPIに関するデータを取得する関数 ----------------

  // TODO: atob()をしないと読めないよ！

  // APIキーをjsonファイルから取得するコード
  setApikeys(json) {
    elog('API', 'setApikeys', 'aqua')
    localStorage.setItem('apikeys/openweathermap', json.openweathermap)
    localStorage.setItem('apikeys/ipinfo', json.ipinfo)
  }

  // エンドポイントをjsonファイルから取得するコード
  setEndpoints(json) {
    elog('API', 'setEndpoints', 'aqua')
    localStorage.setItem('endpoints/openweathermap_weather', json.openweathermap_weather)
    localStorage.setItem('endpoints/openweathermap_forecast', json.openweathermap_forecast)
    localStorage.setItem('endpoints/gas_funbus', json.gas_funbus)
    localStorage.setItem('endpoints/gas_fit', json.gas_fit)
    localStorage.setItem('endpoints/ipinfo', json.ipinfo)
  }

  // ! ---------------- 内部で使っている関数 ----------------

  // 未来大からアクセスしているかを判定(APIのみの判定、solvedIsFUNでwrapする)
  async isFUN() {
    elog('API', 'isFUN', 'Turquoise')
    const res = await this.getIpinfo()
    var org = res.org
    // ipinfo の org が "AS2907 Research Organization of Information and Systems, National Institute" である場合、未来大からのアクセスと判定 (VPNを使っている場合は判定できない)
    let _is = org.indexOf('AS13335 C') !== -1 || (org.indexOf('AS4713 N') !== -1 && !isFreeWifiNotContain) || org.indexOf('AS2907 R') !== -1
    elog('API', 'isFUN: ' + _is, 'Turquoise')
    return _is

    // 一時的にCloudflareVPNで未来大かどうかを切り替えている(デモ用)
    // VPNのスイッチをON/OFFするだけで、未来大モードと亀田支所前モードを切り替えることができる
  }

  // バスの行き先を算出
  busDestination(code, query) {
    elog('API', 'busDestination', 'OrangeRed')
    if (query == 'fromkmdtofun') return '赤川'

    var result
    switch (code) {
      case '55A':
        result = '函館駅前'
        break
      case '55B':
        result = '函館駅前'
        break
      case '55F':
        result = '千代台'
        break
      case '55G':
        result = '昭和ターミナル'
        break
      case '55H':
        result = '亀田支所前'
        break
      default:
        result = '<不明>'
        break
    }
    return result
  }

  isNight() {
    return hour() >= 19 || hour() < 6
  }

  // 時間を取得するコード
  getTime() {
    return nf(hour(), 2) + ':' + nf(minute(), 2) + ':' + nf(second(), 2)
  }
}

class Component_class {
  // ヘッダー
  header(i) {
    // 表示部分
    fill(0, 75, 75)
    rect(WL + 0, WT + 0, 600 * WS, 100 * WS)
    fill(255)
    textAlign(LEFT, CENTER)
    textFont(FONT_noto, 48 * WS)
    text(i, WL + 30 * WS, WT + 40 * WS)
    image(SVG_settings, WL + 525 * WS, WT + 25 * WS, 50 * WS, 50 * WS)

    // ボタンの判定
    if (MANAGER_isMousePressed && MANAGER_mouseY < WT + 100 * WS && MANAGER_mouseX > WL + 500 * WS) {
      MANAGER_nextmotion = 'cmode,7'
      MANAGER_isMousePressed = false
    }
  }
  // フッターメニュー
  footer() {
    // 表示部分の枠
    fill(170, 255, 235)
    rect(WL + 0, WT + 1100 * WS, 600 * WS, 100 * WS)
    fill(0, 75, 75)
    rect(WL + 0, WT + 1095 * WS, 600 * WS, 5 * WS)
    circle(WL + 300 * WS, WT + 1150 * WS, 130 * WS)

    // 表示部分のボタン
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 20 * WS)
    fill(0)
    text('天気', WL + ((600 * 1) / 10) * WS, WT + 1180 * WS)
    text('バス', WL + ((600 * 3) / 10) * WS, WT + 1180 * WS)
    text('歩数', WL + ((600 * 7) / 10) * WS, WT + 1180 * WS)
    text('睡眠', WL + ((600 * 9) / 10) * WS, WT + 1180 * WS)
    image(SVG_weather, WL + ((600 * 1) / 10 - 25) * WS, WT + 1110 * WS, 50 * WS, 50 * WS)
    image(SVG_funbus, WL + ((600 * 3) / 10 - 25) * WS, WT + 1110 * WS, 50 * WS, 50 * WS)
    image(SVG_fit, WL + ((600 * 7) / 10 - 25) * WS, WT + 1110 * WS, 50 * WS, 50 * WS)
    image(SVG_sleep, WL + ((600 * 9) / 10 - 25) * WS, WT + 1110 * WS, 50 * WS, 50 * WS)
    fill(170, 255, 235)
    text('ホーム', WL + ((600 * 5) / 10) * WS, WT + 1180 * WS)
    image(SVG_home, WL + ((600 * 5) / 10 - 25) * WS, WT + 1110 * WS, 50 * WS, 50 * WS)

    // ボタンの判定
    if (MANAGER_isMousePressed && MANAGER_mouseY > WT + 1100 * WS && MANAGER_mouseY < WT + 1200 * WS) {
      if (MANAGER_mouseX < WL + ((600 * 1) / 5) * WS) {
        MANAGER_nextmotion = 'cmode,2'
      } else if (MANAGER_mouseX < WL + ((600 * 2) / 5) * WS) {
        MANAGER_nextmotion = 'cmode,4'
      } else if (MANAGER_mouseX < WL + ((600 * 3) / 5) * WS) {
        MANAGER_nextmotion = 'cmode,1'
      } else if (MANAGER_mouseX < WL + ((600 * 4) / 5) * WS) {
        MANAGER_nextmotion = 'cmode,3'
      } else {
        MANAGER_nextmotion = 'cmode,6'
      }
      MANAGER_isMousePressed = false
    }
  }
}

class TitleScene_class {
  loadingTime = 300 // TODO:時間を早めている、元は1800
  bg

  start = 0

  // 初期化処理
  boot() {
    this.start = millis() // 基準となる時間を更新
    this.bg = loadImage('./src/img/title.jpg')
  }

  // 更新処理
  update() {
    // UI描画
    background(0)
    tint(150)
    image(this.bg, WL + 0, WT + 0, 600 * WS, 1200 * WS)
    noTint()
    fill(255)
    textAlign(CENTER, CENTER)
    textFont(FONT_jetbrains, 120 * WS)
    text('funget', WL + 300 * WS, WT + 250 * WS)
    textFont(FONT_noto, 40 * WS)
    text('ようこそ ( > ω <)//', WL + 300 * WS, WT + 450 * WS)
    // 下部の読み込み表示バー
    var processing = (millis() - this.start) % 600
    var rectx
    var _width = 0
    if (processing < 300) {
      rectx = 100
      _width = (processing * 4) / 3
    } else if (processing < 600) {
      rectx = 100 + ((processing - 300) * 4) / 3
      _width = 400 - ((processing - 300) * 4) / 3
    }
    rect(WL + rectx * WS, WT + 800 * WS, _width * WS, 20 * WS)
    textFont(FONT_noto, 30 * WS)
    text('2024 © famisics (https://uiro.dev)', WL + 300 * WS, WT + 1125 * WS)
    // 指定時間経過後、ページ遷移
    if ((millis() > this.start + this.loadingTime && !isFirstLoad) || (millis() > this.start + this.loadingTime * 6 - 100 && isFirstLoad)) {
      changeFirstLoad()
      if (isFirstBus) {
        cmode(4)
      } else {
        cmode(DEV_MODE)
      }
    }
  }
}

// ? シーン1(ホーム)のクラス

class HomeScene_class {
  bg
  isRain = false

  // 初期化処理
  boot() {
    // 時間帯に応じた背景画像
    var time = API.getTime().substring(0, 2)
    if (time >= 19) {
      this.bg = loadImage('./src/img/home/night.jpg')
    } else if (time >= 15) {
      this.bg = loadImage('./src/img/home/sunset.jpg')
    } else if (time >= 6) {
      this.bg = loadImage('./src/img/home/noon.jpg')
    } else {
      this.bg = loadImage('./src/img/home/midnight.jpg')
    }

    // 雨が降るかどうか
    this.isRain = API.isRain()

    // ボタンの追加
    addButton(162.5, 512.5, 225, 225, color(0, 140, 180), '天気', 'cmode', '2')
    addButton(437.5, 512.5, 225, 225, color(190, 130, 70), '歩数', 'cmode', '3')
    addButton(162.5, 787.5, 225, 225, color(170, 50, 120), 'バス', 'cmode', '4')
    addButton(437.5, 787.5, 225, 225, color(30, 150, 50), '睡眠', 'cmode', '6')
    addButton(162.5, 1000, 225, 100, color(120, 10, 170), '接続状態', 'cmode', '5')
    addButton(437.5, 1000, 225, 100, color(50), '設定', 'cmode', '7')
  }

  // 更新処理
  update() {
    tint(255, 175)
    image(this.bg, WL + 0, WT + 0, 600 * WS, 1200 * WS)
    noTint()
    fill(0)
    textAlign(CENTER, CENTER)
    textFont(FONT_jetbrains, 96 * WS)
    text(API.getTime(), WL + 300 * WS, WT + 100 * WS)
    textFont(FONT_noto, 48 * WS)
    // 時間帯に応じたメッセージ
    var time = API.getTime().substring(0, 2)
    if (time >= 18) {
      text('こんばんは！', WL + 300 * WS, WT + 225 * WS)
    } else if (time >= 12) {
      text('こんにちは！', WL + 300 * WS, WT + 225 * WS)
    } else if (time >= 5) {
      text('おはようございます！', WL + 300 * WS, WT + 225 * WS)
    } else {
      text('寝てください', WL + 300 * WS, WT + 225 * WS)
    }
    textFont(FONT_noto, 30 * WS)
    // if (this.isRain) {
    //   text('今日は雨が降るかもしれません', WL + 300 * WS, WT + 325 * WS)
    // } else {
    //   text('今日は、雨は降らない予定です', WL + 300 * WS, WT + 325 * WS)
    // }
    text('注: バス情報などは更新されていません', WL + 300 * WS, WT + 325 * WS)
  }
}

// ? シーン2(天気)のクラス

class WeatherScene_class {
  isLoaded = false
  weatherNow
  weatherForecast
  NOW_weather = ''
  NOW_temp = ''
  NOW_pressure = ''
  NOW_wind = ''
  SVG_now = null
  SVG_forecast3 = null
  SVG_forecast6 = null
  SVG_forecast9 = null
  SVG_forecast12 = null
  SVG_forecast15 = null
  bg

  // 初期化処理
  boot() {
    // APIからデータを取得
    API.getWeatherNow().then(res => {
      this.weatherNow = res
      API.getWeatherForecast().then(res => {
        this.weatherForecast = res
        this.nowIcon(this.weatherNow.icon)
        this.nowBg(this.weatherNow.icon)
        this.forecastIcon(this.weatherForecast[0].icon, this.weatherForecast[1].icon, this.weatherForecast[2].icon, this.weatherForecast[3].icon, this.weatherForecast[4].icon)
        this.isLoaded = true
      })
    })
  }

  // 更新処理
  update() {
    if (!this.isLoaded) {
      loading('天気情報を取得中...')
      return
    }
    tint(255, 75)
    image(this.bg, WL + 0, WT + 0, 600 * WS, 1200 * WS)
    noTint()
    CPT.header('天気')

    // 現在の天気を描画
    fill(0)
    textAlign(LEFT, CENTER)
    textFont(FONT_noto, 40 * WS)
    text('現在の天気', WL + 25 * WS, WT + 160 * WS)
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 96 * WS)
    text(this.weatherNow.weather, WL + 300 * WS, WT + 270 * WS)
    textFont(FONT_noto, 60 * WS)
    image(this.SVG_now, WL + 150 * WS, WT + 350 * WS, 300 * WS, 300 * WS)
    text(this.weatherNow.temp + '℃', WL + 150 * WS, WT + 700 * WS)
    text(this.weatherNow.pressure + 'hPa', WL + 450 * WS, WT + 700 * WS)
    // 予報を描画
    for (var i = 0; i < 5; i++) {
      this.drawWeather((i + 1) * 3, this.weatherForecast[i].weather, this.weatherForecast[i].temp)
    }
  }

  // 現在の天気のアイコンを取得
  nowIcon(name) {
    this.bg = loadImage('./src/img/weather/' + name + '.jpg')
  }

  // 現在の天気のアイコンに合わせた背景画像を取得
  nowBg(name) {
    this.SVG_now = loadImage('./src/svg/weather/' + name + '.png')
  }

  // 予報の天気のアイコンを取得
  forecastIcon(name3, name6, name9, name12, name15) {
    this.SVG_forecast3 = loadImage('./src/svg/weather/' + name3 + '.png')
    this.SVG_forecast6 = loadImage('./src/svg/weather/' + name6 + '.png')
    this.SVG_forecast9 = loadImage('./src/svg/weather/' + name9 + '.png')
    this.SVG_forecast12 = loadImage('./src/svg/weather/' + name12 + '.png')
    this.SVG_forecast15 = loadImage('./src/svg/weather/' + name15 + '.png')
  }

  // 予報の天気を描画
  drawWeather(i, weather, temp) {
    fill(0)
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 24 * WS)
    var i2 = (600 * (2 * (i / 3 - 1) + 1)) / 10
    text(i + '時間後', WL + i2 * WS, WT + 830 * WS)
    text(weather, WL + i2 * WS, WT + 900 * WS)
    if (i == 3) image(this.SVG_forecast3, WL + (i2 - 40) * WS, WT + 930 * WS, 80 * WS, 80 * WS)
    if (i == 6) image(this.SVG_forecast6, WL + (i2 - 40) * WS, WT + 930 * WS, 80 * WS, 80 * WS)
    if (i == 9) image(this.SVG_forecast9, WL + (i2 - 40) * WS, WT + 930 * WS, 80 * WS, 80 * WS)
    if (i == 12) image(this.SVG_forecast12, WL + (i2 - 40) * WS, WT + 930 * WS, 80 * WS, 80 * WS)
    if (i == 15) image(this.SVG_forecast15, WL + (i2 - 40) * WS, WT + 930 * WS, 80 * WS, 80 * WS)
    text(temp + '℃', WL + i2 * WS, WT + 1040 * WS)
    if (i < 15) {
      fill(0)
      rect(WL + ((600 * (2 * (i / 3 - 1) + 2)) / 10) * WS, WT + 800 * WS, 2 * WS, 280 * WS)
    }
  }
}

// ? シーン3(歩数)のクラス

class FitScene_class {
  fitbit
  graphData = ['0', '0', '0', '0', '0', '0', '0']
  totalSteps = 0
  isMsg = true
  start = 0
  isLoaded = false

  // 初期化処理
  boot() {
    // APIからデータを取得
    this.isLoaded = false
    API.getFitbitSteps().then(res => {
      this.fitbit = res
      this.totalSteps = 0
      for (var i = 1; i < 8; i++) {
        var steps = this.fitbit[7 - i]
        this.graphData[i - 1] = steps
        this.totalSteps += Number(steps)
      }
      addButton(480, 1030, 180, 70, color(26, 140, 216), 'ツイート', 'tweet', '【funget歩数シェア】私は1週間で' + this.totalSteps + '歩、歩きました！すごいでしょ！！')
      this.start = millis()
      this.isMsg = true
      this.isLoaded = true
    })
  }

  // 更新処理
  update() {
    if (!this.isLoaded) {
      loading('Fitbit API に接続中…')
      return
    }
    CPT.header('歩数')
    fill(0)
    textAlign(LEFT, CENTER)
    textFont(FONT_noto, 40 * WS)
    text('今日の歩数', WL + 25 * WS, WT + 150 * WS)
    textAlign(CENTER, CENTER)
    textFont(FONT_jetbrains, 110 * WS)
    text(this.fitbit[0], WL + 300 * WS, WT + 250 * WS)
    textFont(FONT_noto, 48 * WS)
    text('歩', WL + 550 * WS, WT + 250 * WS)
    textAlign(LEFT, CENTER)
    textFont(FONT_noto, 40 * WS)
    text('週合計: ' + this.totalSteps + '歩', WL + 25 * WS, WT + 1030 * WS)
    for (var i = 1; i < 8; i++) {
      this.drawSteps(i, this.fitbit[7 - i])
    }
    this.drawGraph()

    // メッセージ
    if (millis() - this.start < 3000 && this.isMsg) {
      this.message()
    }
  }

  // メッセージを描画
  message() {
    var msg
    if (this.totalSteps > 50000) {
      msg = 'おめでとうございます！\n週間歩数50000歩を達成しました'
    } else {
      msg = '目標まであと' + str(50000 - this.totalSteps) + '歩です\nがんばりましょう！'
    }
    fill(25, 100, 100)
    rect(WL + 0, WT + 100 * WS, 600 * WS, 200 * WS)
    fill(255)
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 36 * WS)
    text(msg, WL + 300 * WS, WT + 200 * WS)
    if (MANAGER_isMousePressed && MANAGER_mouseY > WT + 100 * WS && MANAGER_mouseY < WT + 300 * WS) {
      this.isMsg = false
      MANAGER_isMousePressed = false
    }
  }

  //歩数を描画
  drawSteps(i, steps) {
    fill(0)
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 24 * WS)
    var _day = str(7 - i) + '日前'
    if (i == 7) {
      _day = '今日'
    }
    text(_day, WL + ((600 * (2 * i - 1)) / 14) * WS, WT + 750 * WS)
    if (steps > 7500) {
      image(SVG_check, WL + ((600 * (2 * i - 1)) / 14 - 30) * WS, WT + 790 * WS, 60 * WS, 60 * WS)
    } else {
      image(SVG_error, WL + ((600 * (2 * i - 1)) / 14 - 30) * WS, WT + 790 * WS, 60 * WS, 60 * WS)
    }
    text(steps, WL + ((600 * (2 * i - 1)) / 14) * WS, WT + 900 * WS)
    text('歩', WL + ((600 * (2 * i - 1)) / 14) * WS, WT + 930 * WS)
    if (i < 7) {
      fill(0)
      rect(WL + ((600 * (2 * i)) / 14) * WS, WT + 720 * WS, 2 * WS, 230 * WS)
    }
  }

  // グラフの描画
  drawGraph() {
    stroke(50, 200, 120)
    strokeWeight(5 * WS)
    var baseLineY = map(10000, 0, max(this.graphData), 800, 400)
    (line(WL + 0, WT + baseLineY * WS, WL + 600 * WS, WT + baseLineY * WS) * 5) / 6
    textAlign(RIGHT, TOP)
    textFont(FONT_noto, 24 * WS)
    noStroke()
    fill(50, 200, 120)
    text('10000歩', WL + 590 * WS, WT + (baseLineY + 10) * WS)
    textAlign(LEFT, BOTTOM)
    text('10000歩', WL + 10 * WS, WT + (baseLineY - 10) * WS)

    stroke(80)
    strokeWeight(5 * WS)

    noFill()
    beginShape()

    for (var i = 0; i < 7; i++) {
      this.graphShape(i)
    }

    endShape()
    noStroke()
  }

  // グラフの折れ線を描画
  graphShape(i) {
    var x = ((600 * (2 * i + 1)) / 14) * WS
    var y = (map(this.graphData[i], 0, max(this.graphData), 800, 400) * WS * 5) / 6
    vertex(WL + x, WT + y)

    fill(80)
    circle(WL + x, WT + y, 10 * WS)
    noFill()
  }
}
// ? シーン4(バス)のクラス

var DEMO_isLast = false

class FunbusScene_class {
  funbus
  query
  isLoaded = false
  isFUN = false

  // 初期化処理
  boot() {
    this.isLoaded = false
    // APIを元に起点となるバス停を算出し、その文字列をクエリとしてAPIからデータを取得
    this.query = 'fromkmdtofun'
    API.solvedIsFUN().then(res => {
      if (res) this.query = 'fromfuntokmd'
      this.funbus = API.getFunbus(this.query)
      this.isFUN = res
      this.isLoaded = true
    })
  }

  // 更新処理
  update() {
    if (!this.isLoaded) {
      loading('更新中…')
      return
    }
    CPT.header('バス')

    // メインUIの描画
    fill(0)
    textAlign(LEFT, CENTER)
    textFont(FONT_noto, 32 * WS)
    if (this.query == 'fromkmdtofun') {
      text('亀田支所前→未来大のバスを表示中', WL + 25 * WS, WT + 150 * WS)
    } else {
      text('未来大→亀田支所前のバスを表示中', WL + 25 * WS, WT + 150 * WS)
    }
    if (!(this.funbus.this_code == '終バス済')) {
      this.busCard(this.funbus.this_code, this.funbus.this_start, this.funbus.this_end, this.funbus.this_destination, this.remain(this.funbus.this_start), this.funbus.this_untilnext, 260)
      if (this.funbus.this_untilnext == 'last' || DEMO_isLast) {
        fill(200, 0, 0)
        rect(WL + 50 * WS, WT + 700 * WS, 500 * WS, 200 * WS)
        fill(255, 255, 0)
        rect(WL + 58 * WS, WT + 708 * WS, 484 * WS, 184 * WS)
        fill(200, 0, 0)
        textAlign(CENTER, CENTER)
        textFont(FONT_noto, 48 * WS)
        text('今日最後のバスです', WL + 300 * WS, WT + 800 * WS)
      } else {
        this.busCard(this.funbus.next_code, this.funbus.next_start, this.funbus.next_end, this.funbus.next_destination, this.remain(this.funbus.next_start), this.funbus.this_untilnext, 660)
      }
    } else {
      textAlign(CENTER, CENTER)
      textFont(FONT_noto, 42 * WS)
      text('本日の運行は終了しました', WL + 300 * WS, WT + 550 * WS)
    }

    // ボタンの描画
    fill(0)
    textAlign(LEFT, CENTER)
    textFont(FONT_noto, 20 * WS)
    var d = '自動'
    if (busMode == 'fromfuntokmd') d = '未来大モード'
    if (busMode == 'fromkmdtofun') d = '亀田支所前モード'
    text('バスモードを切り替える　現在: ' + d, WL + 110 * WS, WT + 1025 * WS)
    image(SVG_change, WL + 50 * WS, WT + 1000 * WS, 50 * WS, 50 * WS)
    if (MANAGER_isMousePressed && MANAGER_mouseY > WT + 1000 * WS && MANAGER_mouseY < WT + 1050 * WS && MANAGER_mouseX > WL + 50 * WS && MANAGER_mouseX < WL + 550 * WS) {
      changeBusMode()
      MANAGER_isMousePressed = false
    }
  }

  // バス情報を表示するカードを作成
  busCard(code, start, end, destination, remain, untilNext, yPoition) {
    if (yPoition == 260) {
      fill(240, 90, 90)
    } else {
      fill(90, 90, 255)
    }

    rect(WL + 50 * WS, WT + (yPoition - 50) * WS, 500 * WS, 350 * WS)
    if (MANAGER_isMousePressed && MANAGER_mouseY > WT + (yPoition - 50) * WS && MANAGER_mouseY < WT + (yPoition + 300) * WS && MANAGER_mouseX > WL + 50 * WS && MANAGER_mouseX < WL + 550 * WS) {
      if (this.isFUN) {
        location.href = 'https://hakobus.bus-navigation.jp/wgsys/wgs/bus.htm?tabName=searchTab&from=%E3%81%AF%E3%81%93%E3%81%A0%E3%81%A6%E6%9C%AA%E6%9D%A5%E5%A4%A7%E5%AD%A6&to=%E4%BA%80%E7%94%B0%E6%94%AF%E6%89%80%E5%89%8D&sortBy=3&locale=ja'
      } else {
        location.href = 'https://hakobus.bus-navigation.jp/wgsys/wgs/bus.htm?tabName=searchTab&from=%E4%BA%80%E7%94%B0%E6%94%AF%E6%89%80%E5%89%8D&to=%E3%81%AF%E3%81%93%E3%81%A0%E3%81%A6%E6%9C%AA%E6%9D%A5%E5%A4%A7%E5%AD%A6&sortBy=3&locale=ja'
      }
      MANAGER_isMousePressed = false
    }
    fill(255)
    textFont(FONT_noto, 30 * WS)
    textAlign(LEFT, CENTER)
    text(code + '系統　' + destination + '行き', WL + 75 * WS, WT + yPoition * WS)
    textFont(FONT_noto, 24 * WS)
    text('出発', WL + 105 * WS, WT + (yPoition + 90) * WS)
    text('到着', WL + 335 * WS, WT + (yPoition + 90) * WS)
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 64 * WS)
    text(start + '　' + end, WL + 300 * WS, WT + (yPoition + 140) * WS)
    textFont(FONT_noto, 40 * WS)
    textAlign(CENTER, CENTER)
    if (yPoition != 260 && !untilNext == '0') {
      text('さらに' + untilNext + '後に出発', WL + 300 * WS, WT + (yPoition + 250) * WS)
    } else {
      text(remain, WL + 300 * WS, WT + (yPoition + 250) * WS)
    }
  }

  // 残り時間を計算
  remain(this_start) {
    var nowSeconds = hour() * 3600 + minute() * 60 + second()
    var startSeconds = int(this_start.substring(0, 2)) * 3600 + int(this_start.substring(3, 5)) * 60
    var remainingSeconds = startSeconds - nowSeconds
    if (remainingSeconds < 0) {
      cmode(4)
      return ''
    }
    var remainHour = Math.floor(remainingSeconds / 3600)
    var remainMinute = Math.floor((remainingSeconds % 3600) / 60)
    var remainSecond = Math.floor(remainingSeconds % 60)
    var result = '出発まで'
    if (remainHour > 0) {
      result += remainHour + '時間'
    }
    if (remainMinute > 0 || remainHour > 0) {
      result += nf(remainMinute, 2) + '分'
    }
    result += nf(remainSecond, 2) + '秒'
    return result
  }
}

// ? シーン5(接続状態)のクラス

class IpinfoScene_class {
  pinfo
  isFUN = false
  isLoaded = false

  // 初期化処理
  boot() {
    // APIからデータを取得
    API.getIpinfo().then(res => {
      this.ipinfo = res
      API.solvedIsFUN().then(res => {
        this.isFUN = res
        this.isLoaded = true
      })
    })
    addButton(300, 900, 500, 100, color(0, 150, 75), 'ホームへ戻る', 'cmode', '1')
  }

  // 更新処理
  update() {
    if (!this.isLoaded) {
      loading('IPアドレスを取得中...')
      return
    }
    CPT.header('接続状態')
    // UIの描画
    fill(0)
    textAlign(LEFT, CENTER)
    textFont(FONT_noto, 24 * WS)
    text('IPアドレス', WL + 50 * WS, WT + 150 * WS)
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 64 * WS)
    text(this.ipinfo.ip, WL + 300 * WS, WT + 240 * WS)
    textAlign(LEFT, CENTER)
    textFont(FONT_noto, 24 * WS)
    text('地域：' + this.ipinfo.region, WL + 50 * WS, WT + 350 * WS)
    text('座標：' + this.ipinfo.loc, WL + 50 * WS, WT + 400 * WS)
    var org = this.ipinfo.org
    if (org.indexOf('AS2907 R') !== -1) org = 'AS2907 SINET6 by 国立情報学研究所'
    if (org.length > 32) {
      org = org.substring(0, 32) + '...'
    }
    text('組織：' + org, WL + 50 * WS, WT + 450 * WS)
    if (this.isFUN) {
      text('バスモード：未来大モード', WL + 50 * WS, WT + 500 * WS)
    } else {
      text('バスモード：亀田支所前モード', WL + 50 * WS, WT + 500 * WS)
    }
    text('バスの行き先が自動で変わります\n学内LAN, fun-wifi, free-wifi, eduroam\nに接続時、未来大モードが有効になります\n自宅の回線がフレッツ光の場合は、\n未来大として検出されます', WL + 50 * WS, WT + 700 * WS)
    // ボタンの描画
    fill(0)
    textAlign(LEFT, CENTER)
    textFont(FONT_noto, 20 * WS)
    text('フレッツ光(free-wifi)を未来大モードから除外する', WL + 110 * WS, WT + 1025 * WS)
    if (isFreeWifiNotContain) {
      image(SVG_on, WL + 50 * WS, WT + 1000 * WS, 50 * WS, 50 * WS)
    } else {
      image(SVG_off, WL + 50 * WS, WT + 1000 * WS, 50 * WS, 50 * WS)
    }
    if (MANAGER_isMousePressed && MANAGER_mouseY > WT + 1000 * WS && MANAGER_mouseY < WT + 1050 * WS && MANAGER_mouseX > WL + 50 * WS && MANAGER_mouseX < WL + 550 * WS) {
      changeFreeWifiContain()
      MANAGER_isMousePressed = false
    }
  }
}

// ? シーン6(睡眠)のクラス

class SleepScene_class {
  fitbit_sleep
  start = 0
  totalSleepMins = 0
  isMsg = true
  isLoaded = false

  // 初期化処理
  boot() {
    this.isLoaded = false
    API.getFitbitSleeps().then(res => {
      this.fitbit_sleep = res
      this.totalSleepMins = 0
      for (var i = 0; i < 8; i++) {
        this.totalSleepMins += Number(this.fitbit_sleep[i].duration)
      }
      this.start = millis()
      this.isMsg = true
      this.isLoaded = true
    })
  }

  // 更新処理
  update() {
    if (!this.isLoaded) {
      loading('Fitbit API に接続中…')
      return
    }

    CPT.header('睡眠')
    // 今日のデータ
    fill(0)
    textAlign(LEFT, CENTER)
    textFont(FONT_noto, 40 * WS)
    text('昨晩の睡眠時間（今日）', WL + 25 * WS, WT + 150 * WS)
    textAlign(CENTER, CENTER)
    var lastSleepTime = this.fitbit_sleep[0].duration
    if (lastSleepTime == 0) {
      textFont(FONT_noto, 60 * WS)
      text('データがありません', WL + 300 * WS, WT + 250 * WS)
    } else {
      textFont(FONT_noto, 90 * WS)
      text(this.minToTime(lastSleepTime, true), WL + 300 * WS, WT + 250 * WS)
    }
    // 背景を描画
    this.drawBg()
    // それぞれの列のデータを取得
    for (var i = 0; i < 8; i++) {
      var c = color(20, 120, 120)
      if (this.fitbit_sleep[i].duration < 420) {
        c = color(120, 20, 20)
      }
      this.drawSleep(i, this.fitbit_sleep[i], c)
      this.drawGraph(i, this.fitbit_sleep[i].start, this.fitbit_sleep[i].end, c)
    }

    // メッセージ
    if (millis() - this.start < 3000 && this.isMsg) {
      this.message()
    }
  }

  // メッセージを描画
  message() {
    var msg
    if (this.totalSleepMins > 2940) {
      msg = 'おめでとうございます！\n8日で7日*7時間睡眠を達成しました'
    } else {
      var remain = Math.round(float(2940 - this.totalSleepMins) / 6 / 7)
      msg = 'あと1日' + String(remain / 10) + '時間は眠ろう！\n健康のために！'
    }
    fill(25, 100, 100)
    rect(WL + 0, WT + 100 * WS, 600 * WS, 200 * WS)
    fill(255)
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 36 * WS)
    text(msg, WL + 300 * WS, WT + 200 * WS)
    if (MANAGER_isMousePressed && MANAGER_mouseY > WT + 100 * WS && MANAGER_mouseY < WT + 300 * WS) {
      this.isMsg = false
      MANAGER_isMousePressed = false
    }
  }

  // グラフを描画する
  drawGraph(i, start, end, c) {
    var startHour = this.isotimeToHour(start)
    if (startHour < 0) return
    startHour -= 21
    if (startHour < 0) startHour += 24
    var endHour = this.isotimeToHour(end)
    if (endHour < 0) return
    endHour -= 21
    if (endHour < 0) endHour += 24
    var i2 = 7 - i + 1
    var i3 = (600 * (2 * i2 + 1)) / 18
    this.drawRoundedLine(i3, 350 + startHour * 30, i3, 350 + endHour * 30, c)
  }

  //下部分のテキスト表示
  drawSleep(i, data, c) {
    fill(0)
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 18 * WS)
    var _day = i + '日前'
    if (i == 0) {
      _day = '今日'
    }
    var i2 = 7 - i + 1
    var i3 = (600 * (2 * i2 + 1)) / 18
    text(_day, WL + i3 * WS, WT + 950 * WS)
    if (data.duration == '0') {
      image(SVG_error, WL + (i3 - 25) * WS, WT + 970 * WS, 50 * WS, 50 * WS)
    } else {
      image(SVG_check, WL + (i3 - 25) * WS, WT + 970 * WS, 50 * WS, 50 * WS)
    }
    fill(c)
    text(this.minToTime(data.duration, false), WL + i3 * WS, WT + 1040 * WS)
    fill(0)
    rect(WL + ((600 * (2 * i2)) / 18) * WS, WT + 930 * WS, 2 * WS, 130 * WS)
  }

  // 端が丸い線を描画する
  drawRoundedLine(x1, y1, x2, y2, c) {
    stroke(c)
    strokeWeight(20 * WS)
    strokeCap(ROUND)
    line(WL + x1 * WS, WT + y1 * WS, WL + x2 * WS, WT + y2 * WS)
    strokeCap(SQUARE)
    noStroke()
  }

  // 背景を描画する
  drawBg() {
    // 背景の線
    fill(75)
    textFont(FONT_noto, 20 * WS)
    textAlign(RIGHT, CENTER)
    for (var i = 0; i < 19; i++) {
      stroke(75 * WS)
      strokeWeight(2 * WS)
      line(WL + 70 * WS, WT + (350 + i * 30) * WS, WL + 600 * WS, WT + (350 + i * 30) * WS)
      noStroke()
      text(this.minToClock(1260 + i * 60), WL + 60 * WS, WT + (340 + i * 30) * WS)
    }
  }

  // 分を ~ 時に変換する
  minToClock(min) {
    if (min > 1440) min -= 1440
    return str(int(min / 60)) + '時'
  }

  // 分を時刻表示に変換する
  minToTime(min, isJapanese) {
    if (min == 0) return '-'
    if (min > 1440) min -= 1440
    if (isJapanese) {
      return str(int(min / 60)) + '時間' + nf(min % 60, 2) + '分'
    } else {
      return str(int(min / 60)) + 'h' + nf(min % 60, 2) + 'm'
    }
  }

  // ISO8601形式の時刻を時刻に変換する(APIレスポンスを変換する)
  isotimeToHour(date) {
    if (date == '') return -1
    var tIndex = date.indexOf('T')
    var timePart = date.substring(tIndex + 1, tIndex + 9)

    var hour = int(timePart.substring(0, 2))
    var minute = int(timePart.substring(3, 5))
    var second = int(timePart.substring(6, 8))
    var hoursDecimal = hour + minute / 60.0 + second / 3600.0 // 時刻に変換
    return hoursDecimal
  }
}

// ? シーン5(接続状態)のクラス

class SettingsScene_class {
  // 初期化処理
  boot() {
    addButton(300, 750, 500, 100, color(0, 125, 175), 'Fitbit API トークン 設定', 'link', 'fitbit.html')
    addButton(300, 900, 500, 100, color(0, 150, 75), 'ホームへ戻る', 'cmode', '1')
  }

  // 更新処理
  update() {
    CPT.header('設定')
    fill(0)
    textFont(FONT_noto, 20 * WS)
    textAlign(LEFT, CENTER)
    // ボタンの描画
    text('アプリの起動時に、バスを表示する', WL + 110 * WS, WT + 175 * WS)
    text('→朝バスの時間ぎりぎり使う人におすすめです', WL + 110 * WS, WT + 225 * WS)
    if (isFirstBus) {
      image(SVG_on, WL + 50 * WS, WT + 150 * WS, 50 * WS, 50 * WS)
    } else {
      image(SVG_off, WL + 50 * WS, WT + 150 * WS, 50 * WS, 50 * WS)
    }
    if (MANAGER_isMousePressed && MANAGER_mouseY > WT + 150 * WS && MANAGER_mouseY < WT + 200 * WS && MANAGER_mouseX > WL + 50 * WS && MANAGER_mouseX < WL + 550 * WS) {
      changeFirstBus()
      MANAGER_isMousePressed = false
    }
    text('フレッツ光(free-wifi)を未来大モードから除外する', WL + 110 * WS, WT + 375 * WS)
    text('→自宅がフレッツ光の人は有効にしてください', WL + 110 * WS, WT + 425 * WS)
    if (isFreeWifiNotContain) {
      image(SVG_on, WL + 50 * WS, WT + 350 * WS, 50 * WS, 50 * WS)
    } else {
      image(SVG_off, WL + 50 * WS, WT + 350 * WS, 50 * WS, 50 * WS)
    }
    if (MANAGER_isMousePressed && MANAGER_mouseY > WT + 350 * WS && MANAGER_mouseY < WT + 400 * WS && MANAGER_mouseX > WL + 50 * WS && MANAGER_mouseX < WL + 550 * WS) {
      changeFreeWifiContain()
      MANAGER_isMousePressed = false
    }
    var d = '自動'
    if (busMode == 'fromfuntokmd') d = '未来大モード'
    if (busMode == 'fromkmdtofun') d = '亀田支所前モード'
    text('バスモードを切り替える　現在: ' + d, WL + 110 * WS, WT + 575 * WS)
    text('→位置情報を無視して特定のモードに固定します', WL + 110 * WS, WT + 625 * WS)
    image(SVG_change, WL + 50 * WS, WT + 550 * WS, 50 * WS, 50 * WS)
    if (MANAGER_isMousePressed && MANAGER_mouseY > WT + 550 * WS && MANAGER_mouseY < WT + 600 * WS && MANAGER_mouseX > WL + 50 * WS && MANAGER_mouseX < WL + 550 * WS) {
      changeBusMode()
      MANAGER_isMousePressed = false
    }
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 30 * WS)
    text('2024 © famisics (https://uiro.dev)', WL + 300 * WS, WT + 1025 * WS)
  }
}

// ? ボタンを管理するクラス

class Button_class {
  constructor(x, y, w, h, bg, label, type, id) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.bg = bg
    this.label = label
    this.type = type
    this.id = id
    this.isShow = true
  }

  update() {
    if (this.isShow) {
      fill(this.bg)
      rect(WL + (this.x - this.w / 2) * WS, WT + (this.y - this.h / 2) * WS, this.w * WS, this.h * WS)
      textFont(FONT_noto, 36 * WS)
      fill(255)
      textAlign(CENTER, CENTER)
      text(this.label, WL + this.x * WS, WT + this.y * WS - 5)
    }
  }

  checkClick(mouseX, mouseY) {
    if (this.isShow && mouseX > WL + (this.x - this.w / 2) * WS && mouseX < WL + (this.x + this.w / 2) * WS && mouseY > WT + (this.y - this.h / 2) * WS && mouseY < WT + (this.y + this.h / 2) * WS) {
      if (this.type === 'cmode') {
        MANAGER_nextmotion = this.type + ',' + this.id
        // モード切り替えの処理
      } else if (this.type === 'tweet') {
        location.href = 'https://x.com/intent/post?text=' + this.id
      } else if (this.type === 'link') {
        location.href = this.id
      }
      MANAGER_isMousePressed = false
    }
  }
}
