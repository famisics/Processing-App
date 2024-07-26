function elog(func, text, color) {
  // super tsuyotusyo command line logging tool!
  console.log('%c' + func + '%c%c' + text, 'font-size: 12px; border-radius: 3px 0 0 3px; color: black; font-weight: 1000; padding: 1px 4px; background: ' + color + '; border: solid ' + color + ' 1px;', '', 'font-size: 12px; border-radius: 0 3px 3px 0; color: white; font-weight: 1000; padding: 1px 4px; background: black; border: solid ' + color + ' 1px;')
}

var DEV_MODE = 1

// function setup() {
//   let width = window.innerWidth;
//   let height = window.innerHeight-10;
//   createCanvas(width, height);
// }

var master = { width: 600, height: 1200 }

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
  JSON_endpoints = loadJSON('json/endpoints.json')
  JSON_apikeys = loadJSON('json/apikeys.json')
  JSON_funbus = loadJSON('json/funbus.json')
  // モードアイコンの初期化
  SVG_home = loadImage('svg/mode/home.svg')
  SVG_weather = loadImage('svg/mode/weather.svg')
  SVG_fit = loadImage('svg/mode/fit.svg')
  SVG_funbus = loadImage('svg/mode/bus.svg')
  SVG_sleep = loadImage('svg/mode/sleep.svg')

  // ステータスアイコンの初期化
  SVG_check = loadImage('svg/status/check.svg')
  SVG_error = loadImage('svg/status/error.svg')
  SVG_on = loadImage('svg/status/on.svg')
  SVG_off = loadImage('svg/status/off.svg')
  SVG_change = loadImage('svg/status/change.svg')
  SVG_settings = loadImage('svg/status/settings.svg')
}

function setup() {
  background(0)
  noStroke()
  elog('boot', 'initializing... ', 'lime')
  createCanvas(600, 1200) // Google Pixel 7 基準に指定
  // scaleX = (float) width / originalWidth;
  // scaleY = (float) height / originalHeight;
  boot() // コードを読みやすくするために、managerでシーンを初期化(boot)しています
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

  // フォントの初期化
  FONT_meiryo = textFont('Meiryo UI', 32)
  FONT_jetbrains = textFont('font/JetBrainsMono-Medium.ttf', 32)
  FONT_noto = textFont('font/NotoSansJP-Medium.ttf', 32)

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
    isFreeWifiNotContain = true
    localStorage.setItem('settings/is_free_wifi_not_contain', isFreeWifiNotContain ? 1 : 0)
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
    // シーン描画処理
    background(255)
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
    if (!(mode == 0)) {
      CPT.footer()
    }
    if (LIST_Button != []) {
      for (let b of LIST_Button) {
        b.update()
      }
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
  textFont(FONT_noto, 30)
  text(i, 300, 600)
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
  elog('json', '設定が保存されました isFirstBus: ' + isFirstBus, 'white')
}

// フレッツ光を含むかどうかの設定を変更
function changeFreeWifiContain() {
  isFreeWifiNotContain = !isFreeWifiNotContain
  localStorage.setItem('settings/is_free_wifi_contain', isFreeWifiNotContain ? 1 : 0)
  elog('json', '設定が保存されました isFreeWifiNotContain: ' + isFreeWifiNotContain, 'white')
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
  elog('json', '設定が保存されました busMode: ' + busMode, 'white')
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
    const response = await fetch(query.toString()) // URL 文字列に変換して fetch
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    elog('funfetch', '200 - funfetch done', 'MediumSpringGreen')
    const data = await response.json()
    return data
  } catch (error) {
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
  timeout = 120000 // 2分

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
      console.log(this.weatherNow)
      return Promise.resolve(this.weatherNow)
    }
    elog('API', 'getWeatherNow: FETCHING... ', 'LightSkyBlue')
    try {
      const data_1 = await funfetch(decode(localStorage.getItem('endpoints/openweathermap_weather')) + decode(localStorage.getItem('apikeys/openweathermap')))
      var res = { weather: '', icon: '', temp: '', pressure: '', city: '' }
      res.weather = data_1.weather[0].description
      res.icon = data_1.weather[0].icon.substring(0, 2) + 'd'
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
    elog('API', 'getFunbus: FETCHING... ', 'lavender')
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

    elog('API', 'getFunbus: ' + query, 'lavender')
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
        elog('API', 'getFunbus: FETCHING... done at ' + this.getTime(), 'lavender')
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
    elog('API', 'getFunbus: done at ' + this.getTime(), 'lavender')
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
      this.fitbit = res
      this.CASHTIME_fitbit = millis()
      elog('API', 'getFitbitSteps: done at ' + this.getTime(), 'aqua')
      return this.fitbit // * 返す内容 7,6,5,4,3,2,1日前の歩数{日, 歩数}
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
      this.fitbit_sleep = res
      this.CASHTIME_fitbitSleep = millis()
      elog('API', 'getFitbitSteps: FETCHING... done at ' + this.getTime(), 'aqua')
      return this.fitbit_sleep // * 返す内容 {日付, 睡眠データ{睡眠時間、睡眠開始、睡眠終了}}
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async fetchFitbit(query) {
    let client_id = localStorage.getItem('fitbit/client_id')
    let client_secret = localStorage.getItem('fitbit/client_secret')
    let access_token = localStorage.getItem('fitbit/access_token')
    let refresh_token = localStorage.getItem('fitbit/refresh_token')
    let query_url = `https://script.google.com/macros/s/AKfycbwaVMxMfZHS7ZgLc9-HBUaur1YUDt0ZOsT5fcAqd7WqTN_ZFGgQat968b-DxQSsagcM/exec?query=${query}&client_id=${client_id}&client_secret=${client_secret}&access_token=${access_token}&refresh_token=${refresh_token}`
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
    //!バスのAPIに関連するAPIであり、最新のデータをすぐに取得する必要があるため、キャッシュ期限を独自(1秒)にしている→s5でAPIを2回呼ぶから、その時に1秒のキャッシュを読む(リクエスト数の削減)
    var timediff = millis() - this.CASHTIME_ipinfo
    if (this.ipinfo != 0 && timediff < 1000) {
      // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      elog('API', 'getIpinfo: returning CASHED_DATA... done at ' + this.getTime() + ', キャッシュ期限: 1秒', 'royalblue')
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
    elog('API', 'solvedIsFUN', 'firebrick')
    if (busMode == 'auto') {
      const res = await this.isFUN()
      elog('API', 'solvedIsFUN: done with' + res, 'firebrick')
      return res
    } else if (busMode == 'fromfuntokmd') {
      elog('API', 'solvedIsFUN: done with true', 'firebrick')
      return Promise.resolve(true)
    } else {
      elog('API', 'solvedIsFUN: done with false', 'firebrick')
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
    localStorage.setItem('endpoints/gas_steps', json.gas_steps)
    localStorage.setItem('endpoints/gas_sleeps', json.gas_sleeps)
    localStorage.setItem('endpoints/ipinfo', json.ipinfo)
  }

  // ! ---------------- 内部で使っている関数 ----------------

  // 未来大からアクセスしているかを判定(APIのみの判定、solvedIsFUNでwrapする)
  async isFUN() {
    elog('API', 'isFUN', 'firebrick')
    const res = await this.getIpinfo()
    var org = res.org
    // ipinfo の org が "AS2907 Research Organization of Information and Systems, National Institute" である場合、未来大からのアクセスと判定 (VPNを使っている場合は判定できない)
    let _is = org.indexOf('AS13335 C') !== -1 || (org.indexOf('AS4713 N') !== -1 && !isFreeWifiNotContain) || org.indexOf('AS2907 R') !== -1
    elog('API', 'isFUN: ' + _is, 'firebrick')
    return _is

    // 一時的にCloudflareVPNで未来大かどうかを切り替えている(デモ用)
    // VPNのスイッチをON/OFFするだけで、未来大モードと亀田支所前モードを切り替えることができる
  }

  // バスの行き先を算出
  busDestination(code, query) {
    elog('API', 'busDestination', 'lavender')
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
    rect(0, 0, 600, 100)
    fill(255)
    textAlign(LEFT, CENTER)
    textFont(FONT_noto, 48)
    text(i, 30, 50)
    image(SVG_settings, 525, 25, 50, 50)

    // ボタンの判定
    if (MANAGER_isMousePressed && MANAGER_mouseY < 100 && MANAGER_mouseX > 500) {
      MANAGER_nextmotion = 'cmode,7'
      MANAGER_isMousePressed = false
    }
  }
  // フッターメニュー
  footer() {
    // 表示部分の枠
    fill(170, 255, 235)
    rect(0, 1100, 600, 100)
    fill(0, 75, 75)
    rect(0, 1095, 600, 5)
    circle(300, 1150, 130)

    // 表示部分のボタン
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 20)
    fill(0)
    text('天気', (600 * 1) / 10, 1180)
    text('バス', (600 * 3) / 10, 1180)
    text('歩数', (600 * 7) / 10, 1180)
    text('睡眠', (600 * 9) / 10, 1180)
    image(SVG_weather, (600 * 1) / 10 - 25, 1110, 50, 50)
    image(SVG_funbus, (600 * 3) / 10 - 25, 1110, 50, 50)
    image(SVG_fit, (600 * 7) / 10 - 25, 1110, 50, 50)
    image(SVG_sleep, (600 * 9) / 10 - 25, 1110, 50, 50)
    fill(170, 255, 235)
    text('ホーム', (600 * 5) / 10, 1180)
    image(SVG_home, (600 * 5) / 10 - 25, 1110, 50, 50)

    // ボタンの判定
    if (MANAGER_isMousePressed && MANAGER_mouseY > 1100) {
      if (MANAGER_mouseX < (600 * 1) / 5) {
        MANAGER_nextmotion = 'cmode,2'
      } else if (MANAGER_mouseX < (600 * 2) / 5) {
        MANAGER_nextmotion = 'cmode,4'
      } else if (MANAGER_mouseX < (600 * 3) / 5) {
        MANAGER_nextmotion = 'cmode,1'
      } else if (MANAGER_mouseX < (600 * 4) / 5) {
        MANAGER_nextmotion = 'cmode,3'
      } else {
        MANAGER_nextmotion = 'cmode,6'
      }
      MANAGER_isMousePressed = false
    }
  }
}

class TitleScene_class {
  loadingTime = 180 // TODO:時間を早めている、元は1800
  bg

  start = 0

  // 初期化処理
  boot() {
    this.start = millis() // 基準となる時間を更新
    this.bg = loadImage('img/title.jpg')
  }

  // 更新処理
  update() {
    // UI描画
    background(0)
    tint(150)
    image(this.bg, 0, 0, master.width, master.height)
    noTint()
    fill(255)
    textAlign(CENTER, CENTER)
    textFont(FONT_jetbrains, 120)
    text('funget', 300, 250)
    textFont(FONT_noto, 40)
    text('ようこそ ( > ω <)//', 300, 450)
    // 下部の読み込み表示バー
    var processing = (millis() - this.start) / 2
    var rectx
    var _width = 0
    if (processing < 300) {
      rectx = 100
      _width = (processing * 4) / 3
    } else if (processing < 600) {
      rectx = 100 + ((processing - 300) * 4) / 3
      _width = 400 - ((processing - 300) * 4) / 3
    } else {
      rectx = 100
      _width = ((processing - 600) * 4) / 3
    }
    rect(rectx, 800, _width, 20)
    textFont(FONT_noto, 30)
    text('2024 © famisics (https://uiro.dev)', 300, 1125)
    // 指定時間経過後、ページ遷移
    if (millis() > this.start + this.loadingTime - 100) {
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
      this.bg = loadImage('img/home/night.jpg')
    } else if (time >= 15) {
      this.bg = loadImage('img/home/sunset.jpg')
    } else if (time >= 5) {
      this.bg = loadImage('img/home/noon.jpg')
    } else {
      this.bg = loadImage('img/home/midnight.jpg')
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
    image(this.bg, 0, 0, master.width, master.height)
    noTint()
    fill(0)
    textAlign(CENTER, CENTER)
    textFont(FONT_jetbrains, 96)
    text(API.getTime(), 300, 100)
    textFont(FONT_noto, 48)
    // 時間帯に応じたメッセージ
    var time = API.getTime().substring(0, 2)
    if (time >= 18) {
      text('こんばんは！', 300, 225)
    } else if (time >= 12) {
      text('こんにちは！', 300, 225)
    } else if (time >= 5) {
      text('おはようございます！', 300, 225)
    } else {
      text('寝てください', 300, 225)
    }
    textFont(FONT_noto, 30)
    if (this.isRain) {
      text('今日は雨が降るかもしれません', 300, 325)
    } else {
      text('今日は、雨は降らない予定です', 300, 325)
    }
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
    elog('check', ':D', 'coral')
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
    image(this.bg, 0, 0, master.width, master.height)
    noTint()
    CPT.header('天気')

    // 現在の天気を描画
    fill(0)
    textAlign(LEFT, CENTER)
    textFont(FONT_noto, 40)
    text('現在の天気', 25, 160)
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 96)
    text(this.weatherNow.weather, 300, 270)
    textFont(FONT_noto, 60)
    image(this.SVG_now, 50, 250, 500, 500)
    text(this.weatherNow.temp + '℃', 150, 700)
    text(this.weatherNow.pressure + 'hPa', 450, 700)
    // 予報を描画
    for (var i = 0; i < 5; i++) {
      this.drawWeather((i + 1) * 3, this.weatherForecast[i].weather, this.weatherForecast[i].temp)
    }
  }

  // 現在の天気のアイコンを取得
  nowIcon(name) {
    this.bg = loadImage('img/weather/' + name + '.jpg')
  }

  // 現在の天気のアイコンに合わせた背景画像を取得
  nowBg(name) {
    this.SVG_now = loadImage('svg/weather/' + name + '.svg')
  }

  // 予報の天気のアイコンを取得
  forecastIcon(name3, name6, name9, name12, name15) {
    this.SVG_forecast3 = loadImage('svg/weather/' + name3 + '.svg')
    this.SVG_forecast6 = loadImage('svg/weather/' + name6 + '.svg')
    this.SVG_forecast9 = loadImage('svg/weather/' + name9 + '.svg')
    this.SVG_forecast12 = loadImage('svg/weather/' + name12 + '.svg')
    this.SVG_forecast15 = loadImage('svg/weather/' + name15 + '.svg')
  }

  // 予報の天気を描画
  drawWeather(i, weather, temp) {
    fill(0)
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 24)
    var i2 = (600 * (2 * (i / 3 - 1) + 1)) / 10
    text(i + '時間後', i2, 830)
    text(weather, i2, 900)
    if (i == 3) image(this.SVG_forecast3, i2 - 60, 910, 120, 120)
    if (i == 6) image(this.SVG_forecast6, i2 - 60, 910, 120, 120)
    if (i == 9) image(this.SVG_forecast9, i2 - 60, 910, 120, 120)
    if (i == 12) image(this.SVG_forecast12, i2 - 60, 910, 120, 120)
    if (i == 15) image(this.SVG_forecast15, i2 - 60, 910, 120, 120)
    text(temp + '℃', i2, 1040)
    if (i < 15) {
      fill(0)
      rect((600 * (2 * (i / 3 - 1) + 2)) / 10 - 1, 800, 2, 280)
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
    textFont(FONT_noto, 40)
    text('今日の歩数', 25, 150)
    textAlign(CENTER, CENTER)
    textFont(FONT_jetbrains, 110)
    text(this.fitbit[0], 300, 250)
    textFont(FONT_noto, 48)
    text('歩', 550, 250)
    textAlign(LEFT, CENTER)
    textFont(FONT_noto, 40)
    text('週合計: ' + this.totalSteps + '歩', 25, 1030)
    for (var i = 1; i < 8; i++) {
      this.drawSteps(i, this.fitbit[7 - i])
    }
    this.drawGraph()

    // メッセージ
    if (millis() - this.start < 5000 && this.isMsg) {
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
    rect(0, 100, 600, 200)
    fill(255)
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 36)
    text(msg, 300, 200)
    if (MANAGER_isMousePressed && MANAGER_mouseY > 100 && MANAGER_mouseY < 300) {
      this.isMsg = false
      MANAGER_isMousePressed = false
    }
  }

  //歩数を描画
  drawSteps(i, steps) {
    fill(0)
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 24)
    var _day = str(7 - i) + '日前'
    if (i == 7) {
      _day = '今日'
    }
    text(_day, (600 * (2 * i - 1)) / 14, 750)
    if (steps > 10000) {
      image(SVG_check, (600 * (2 * i - 1)) / 14 - 30, 790, 60, 60)
    } else {
      image(SVG_error, (600 * (2 * i - 1)) / 14 - 30, 790, 60, 60)
    }
    text(steps, (600 * (2 * i - 1)) / 14, 900)
    text('歩', (600 * (2 * i - 1)) / 14, 930)
    if (i < 7) {
      fill(0)
      rect((600 * (2 * i)) / 14 - 1, 720, 2, 230)
    }
  }

  // グラフの描画
  drawGraph() {
    stroke(50, 200, 120)
    strokeWeight(5)
    var baseLineY = map(10000, 0, max(this.graphData), 800, 400)
    line(0, baseLineY, 600, baseLineY)
    textAlign(RIGHT, TOP)
    textFont(FONT_noto, 24)
    noStroke()
    fill(50, 200, 120)
    text('10000歩', 590, baseLineY + 10)
    textAlign(LEFT, BOTTOM)
    text('10000歩', 10, baseLineY - 10)

    stroke(80)
    strokeWeight(5)

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
    var x = (600 * (2 * i + 1)) / 14
    var y = map(this.graphData[i], 0, max(this.graphData), 800, 400)
    vertex(x, y)

    fill(80)
    circle(x, y, 10)
    noFill()
  }
}
// ? シーン4(バス)のクラス

var DEMO_isLast = false

class FunbusScene_class {
  funbus
  query
  isLoaded = false

  // 初期化処理
  boot() {
    this.isLoaded = false
    // APIを元に起点となるバス停を算出し、その文字列をクエリとしてAPIからデータを取得
    this.query = 'fromkmdtofun'
    API.solvedIsFUN().then(res => {
      if (res) this.query = 'fromfuntokmd'
      this.funbus = API.getFunbus(this.query)
      setTimeout(() => {
        this.isLoaded = true
      }, 300)
    })
  }

  // 更新処理
  update() {
    if (!this.isLoaded) {
      loading('更新中')
      return
    }
    CPT.header('バス')

    // メインUIの描画
    fill(0)
    textAlign(LEFT, CENTER)
    textFont(FONT_noto, 32)
    if (this.query == 'fromkmdtofun') {
      text('亀田支所前→未来大のバスを表示中', 25, 150)
    } else {
      text('未来大→亀田支所前のバスを表示中', 25, 150)
    }
    if (!(this.funbus.this_code == '終バス済')) {
      this.busCard(this.funbus.this_code, this.funbus.this_start, this.funbus.this_end, this.funbus.this_destination, this.remain(this.funbus.this_start), this.funbus.this_untilnext, 260)
      if (this.funbus.this_untilnext == 'last' || DEMO_isLast) {
        fill(200, 0, 0)
        rect(50, 700, 500, 200)
        fill(255, 255, 0)
        rect(58, 708, 484, 184)
        fill(200, 0, 0)
        textAlign(CENTER, CENTER)
        textFont(FONT_noto, 48)
        text('今日最後のバスです', 300, 800)
      } else {
        this.busCard(this.funbus.next_code, this.funbus.next_start, this.funbus.next_end, this.funbus.next_destination, this.remain(this.funbus.next_start), this.funbus.this_untilnext, 660)
      }
    } else {
      textAlign(CENTER, CENTER)
      textFont(FONT_noto, 42)
      text('本日の運行は終了しました', 300, 550)
    }

    // ボタンの描画
    fill(0)
    textAlign(LEFT, CENTER)
    textFont(FONT_noto, 20)
    var d = '自動'
    if (busMode == 'fromfuntokmd') d = '未来大モード'
    if (busMode == 'fromkmdtofun') d = '亀田支所前モード'
    text('バスモードを切り替える　現在: ' + d, 110, 1025)
    image(SVG_change, 50, 1000, 50, 50)
    if (MANAGER_isMousePressed && MANAGER_mouseY > 1000 && MANAGER_mouseY < 1050 && MANAGER_mouseX > 50 && MANAGER_mouseX < 550) {
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

    rect(50, yPoition - 50, 500, 350)
    fill(255)
    textFont(FONT_noto, 30)
    textAlign(LEFT, CENTER)
    text(code + '系統　' + destination + '行き', 75, yPoition)
    textFont(FONT_noto, 24)
    text('出発', 105, yPoition + 90)
    text('到着', 335, yPoition + 90)
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 64)
    text(start + '　' + end, 300, yPoition + 140)
    textFont(FONT_noto, 40)
    textAlign(CENTER, CENTER)
    if (yPoition != 260 && !untilNext == '0') {
      text('さらに' + untilNext + '後に出発', 300, yPoition + 250)
    } else {
      text(remain, 300, yPoition + 250)
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

  // 初期化処理
  boot() {
    // APIからデータを取得
    ipinfo = API.getIpinfo()
    isFUN = API.solvedIsFUN()
  }

  // 更新処理
  update() {
    CPT.header('接続状態')
    // UIの描画
    fill(0)
    textAlign(LEFT, CENTER)
    textFont(FONT_noto, 24)
    text('IPアドレス', 50, 150)
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 64)
    text(ipinfo.get('ip'), 300, 240)
    textAlign(LEFT, CENTER)
    textFont(FONT_noto, 24)
    text('地域：' + ipinfo.get('region'), 50, 350)
    text('座標：' + ipinfo.get('loc'), 50, 400)
    var org = ipinfo.get('org')
    if (org.contains('AS2907 R')) org = 'AS2907 SINET6 by 国立情報学研究所'
    if (org.length() > 32) {
      org = org.substring(0, 32) + '...'
    }
    text('組織：' + org, 50, 450)
    if (isFUN) {
      text('バスモード：未来大モード', 50, 500)
    } else {
      text('バスモード：亀田支所前モード', 50, 500)
    }
    text('バスの行き先が自動で変わります\n学内LAN, fun-wifi, free-wifi, eduroam\nに接続時、未来大モードが有効になります\n自宅の回線がフレッツ光の場合は、\n未来大として検出されます', 50, 700)
    // ボタンの描画
    fill(0)
    textAlign(LEFT, CENTER)
    textFont(FONT_noto, 20)
    text('フレッツ光(free-wifi)を未来大モードから除外する', 110, 1025)
    if (isFreeWifiNotContain) {
      image(SVG_on, 50, 1000, 50, 50)
    } else {
      image(SVG_off, 50, 1000, 50, 50)
    }
    if (MANAGER_isMousePressed && MANAGER_mouseY > 1000 && MANAGER_mouseY < 1050 && MANAGER_mouseX > 50 && MANAGER_mouseX < 550) {
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
    textFont(FONT_noto, 40)
    text('昨晩の睡眠時間（今日）', 25, 150)
    textAlign(CENTER, CENTER)
    var lastSleepTime = this.fitbit_sleep[0].duration
    if (lastSleepTime == 0) {
      textFont(FONT_noto, 60)
      text('データがありません', 300, 250)
    } else {
      textFont(FONT_noto, 90)
      text(minToTime(lastSleepTime, true), 300, 250)
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
    if (millis() - this.start < 5000 && this.isMsg) {
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
    rect(0, 100, 600, 200)
    fill(255)
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 36)
    text(msg, 300, 200)
    if (MANAGER_isMousePressed && MANAGER_mouseY > 100 && MANAGER_mouseY < 300) {
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
    this.drawRoundedLine(i3, 350 + startHour * 35, i3, 350 + endHour * 35, c)
  }

  //下部分のテキスト表示
  drawSleep(i, data, c) {
    fill(0)
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 18)
    var _day = i + '日前'
    if (i == 0) {
      _day = '今日'
    }
    var i2 = 7 - i + 1
    var i3 = (600 * (2 * i2 + 1)) / 18
    text(_day, i3, 950)
    if (data.duration == '0') {
      image(SVG_error, i3 - 25, 970, 50, 50)
    } else {
      image(SVG_check, i3 - 25, 970, 50, 50)
    }
    fill(c)
    text(this.minToTime(data.duration, false), i3, 1040)
    fill(0)
    rect((600 * (2 * i2)) / 18 - 1, 930, 2, 130)
  }

  // 端が丸い線を描画する
  drawRoundedLine(x1, y1, x2, y2, c) {
    stroke(c)
    strokeWeight(20)
    strokeCap(ROUND)
    line(x1, y1, x2, y2)
    strokeCap(SQUARE)
    noStroke()
  }

  // 背景を描画する
  drawBg() {
    // 背景の線
    fill(75)
    textFont(FONT_noto, 20)
    textAlign(RIGHT, CENTER)
    for (var i = 0; i < 16; i++) {
      stroke(75)
      strokeWeight(2)
      line(70, 350 + i * 35, 600, 350 + i * 35)
      noStroke()
      text(this.minToClock(1260 + i * 60), 60, 350 + i * 35)
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
    addButton(300, 800, 500, 200, color(0, 75, 75), 'ホームへ戻る', 'cmode', '1')
  }

  // 更新処理
  update() {
    CPT.header('設定')
    fill(0)
    textFont(FONT_noto, 20)
    textAlign(LEFT, CENTER)
    // ボタンの描画
    text('アプリの起動時に、バスを表示する', 110, 175)
    text('→朝バスの時間ぎりぎり使う人におすすめです', 110, 225)
    if (isFirstBus) {
      image(SVG_on, 50, 150, 50, 50)
    } else {
      image(SVG_off, 50, 150, 50, 50)
    }
    if (MANAGER_isMousePressed && MANAGER_mouseY > 150 && MANAGER_mouseY < 200 && MANAGER_mouseX > 50 && MANAGER_mouseX < 550) {
      changeFirstBus()
      MANAGER_isMousePressed = false
    }
    text('フレッツ光(free-wifi)を未来大モードから除外する', 110, 375)
    text('→自宅がフレッツ光の人は有効にしてください', 110, 425)
    if (isFreeWifiNotContain) {
      image(SVG_on, 50, 350, 50, 50)
    } else {
      image(SVG_off, 50, 350, 50, 50)
    }
    if (MANAGER_isMousePressed && MANAGER_mouseY > 350 && MANAGER_mouseY < 400 && MANAGER_mouseX > 50 && MANAGER_mouseX < 550) {
      changeFreeWifiContain()
      MANAGER_isMousePressed = false
    }
    var d = '自動'
    if (busMode == 'fromfuntokmd') d = '未来大モード'
    if (busMode == 'fromkmdtofun') d = '亀田支所前モード'
    text('バスモードを切り替える　現在: ' + d, 110, 575)
    text('→位置情報を無視して特定のモードに固定します', 110, 625)
    image(SVG_change, 50, 550, 50, 50)
    if (MANAGER_isMousePressed && MANAGER_mouseY > 550 && MANAGER_mouseY < 600 && MANAGER_mouseX > 50 && MANAGER_mouseX < 550) {
      changeBusMode()
      MANAGER_isMousePressed = false
    }
    textAlign(CENTER, CENTER)
    textFont(FONT_noto, 30)
    text('2024 © famisics (https://uiro.dev)', 300, 1000)
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
      rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h)
      textFont(FONT_noto, 36)
      fill(255)
      textAlign(CENTER, CENTER)
      text(this.label, this.x, this.y)
    }
  }

  checkClick(mouseX, mouseY) {
    if (this.isShow && mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 && mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2) {
      if (this.type === 'cmode') {
        MANAGER_nextmotion = this.type + ',' + this.id
        // モード切り替えの処理
      } else if (this.type === 'tweet') {
        window.open('https://x.com/intent/post?text=' + this.id)
      }
    }
  }
}
