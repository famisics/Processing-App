// function setup() {
//   let width = window.innerWidth;
//   let height = window.innerHeight-10;
//   createCanvas(width, height);
// }

function draw() {
  background(220)
  fill(199, 0, 0)
  rect(20, 20, 20, 20)
}

function setup() {
  background(0);
  noStroke();
  print("initializing... ");
  createCanvas(600,1200); // Google Pixel 7 基準に指定
  // scaleX = (float) width / originalWidth;
  // scaleY = (float) height / originalHeight;
  boot(); // コードを読みやすくするために、managerでシーンを初期化(boot)しています
}

function draw() {
  // pushMatrix();
  // scale(scaleX, scaleY);
  update(); // コードを読みやすくするために、managerでシーンを描画(update)しています
  // popMatrix();
}

// ! デモ用のキー
function keyPressed() { // シーンを切り替える
  switch(key) {
    case '0' : // スタート画面
      cmode(0);
      break;
    case '1' : // ホーム画面
      cmode(1);
      break;
    case '2' : // 天気画面
      cmode(2);
      break;
    case '3' : // バス画面
      cmode(4);
      break;
    case '4' : // 歩数画面
      cmode(3);
      break;
    case '5' : // 睡眠画面
      cmode(6);
      break;
    case '6' : // 接続情報画面
      cmode(5);
      break;
    case '7' : // 設定画面
      cmode(7);
      break;
    case 'l' : // デモ用、最終バス表示
      DEMO_isLast = !DEMO_isLast;
      break;
  }
}

// ? アプリの進行を管理するコード

// 動作に必要なモジュール
var API;
var CPT;

// シーン
var TitleScene;
var HomeScene;
var WeatherScene;
var FitScene;
var FunbusScene;
var IpinfoScene;
var SleepScene;
var SettingsScene;

var mode = 0; // モード0で初期化

// config

var isFirstBus = false;
var isFreeWifiContain = true;
var busMode = "auto";

// 素材

var FONT_meiryo, FONT_jetbrains, FONT_noto;
var SVG_home, SVG_weather, SVG_fit, SVG_funbus, SVG_sleep;
var SVG_check, SVG_error, SVG_on, SVG_off, SVG_change, SVG_settings;

var MANAGER_nextmotion = ""; // 次に行う動作
var MANAGER_isMousePressed = false;
var MANAGER_mouseX, MANAGER_mouseY;
var isCmode = false;
var cmodeCount, cmodeTarget = 0;
var cmodeText = "";

// 初期化処理
function boot() {
  // クラスの初期化
  API = new API_class();
  CPT = new Component_class();
  // シーンの初期化
  TitleScene = new TitleScene_class();
  HomeScene = new HomeScene_class();
  WeatherScene = new WeatherScene_class();
  FitScene = new FitScene_class();
  FunbusScene = new FunbusScene_class();
  IpinfoScene = new IpinfoScene_class();
  SleepScene = new SleepScene_class();
  SettingsScene = new SettingsScene_class();
  
  // フォントの初期化
  FONT_meiryo = textFont("Meiryo UI", 32);
  FONT_jetbrains = textFont("font/JetBrainsMono-Medium.ttf", 32);
  FONT_noto = textFont("font/NotoSansJP-Medium.ttf", 32);
  
  // モードアイコンの初期化
  // SVG_home = loadShape("svg/mode/home.svg");
  // SVG_weather = loadShape("svg/mode/weather.svg");
  // SVG_fit = loadShape("svg/mode/fit.svg");
  // SVG_funbus = loadShape("svg/mode/bus.svg");
  // SVG_sleep = loadShape("svg/mode/sleep.svg");
  
  // ステータスアイコンの初期化
  // SVG_check = loadShape("svg/status/check.svg");
  // SVG_error = loadShape("svg/status/error.svg");
  // SVG_on = loadShape("svg/status/on.svg");
  // SVG_off = loadShape("svg/status/off.svg");
  // SVG_change = loadShape("svg/status/change.svg");
  // SVG_settings = loadShape("svg/status/settings.svg");
  
  // apikeys.json
  var json = loadJSON("apikeys.json");
  if (json != null) {
    API.setApikeys(json);
  } else {
    println("apikeys.json not found");
  }
  
  // endpoints.json
  json = loadJSON("endpoints.json");
  if (json != null) {
    API.setEndpoints(json);
  } else {
    println("endpoints.json not found");
  }
  
  // config.json
  json = loadJSON("config.json");
  if (json != null) {
    if (json.getInt("is_first_bus") == 1) {
      isFirstBus = true;
    } else {
      isFirstBus = false;
    }
    if (json.getInt("is_free_wifi_contain") == 1) {
      isFreeWifiContain = true;
    } else {
      isFreeWifiContain = false;
    }
    busMode = json.getString("bus_mode");
  } else {
    println("config.json not found");
  }
  
  println("done");
  // アプリの起動
  cmode(0);
}

// 更新処理
function update() {
  if (isCmode) { // モード切り替え中の場合、シーン切り替え処理
    if (cmodeCount < 2) {
      if (!cmodeText.equals("")) {
        // 切り替え中のメッセージ空ではない場合、読み込み中ウィンドウを表示
        fill(255, 255, 255, 150);
        rect(0, 0, 600, 1100);
        fill(0, 75, 75);
        rect(45, 495, 510, 210);
        fill(255);
        rect(50, 500, 500, 200);
        textAlign(CENTER, CENTER);
        fill(0);
        textFont(FONT_noto, 30);
        text(cmodeText, 300, 600);
        if (!(mode == 0)) {
          CPT.footer();
        }
      }
      cmodeCount++;
    } else {
      cmodeCount = 0;
      isCmode = false;
      cmodeAction(cmodeTarget);
    }
  } else { // シーン描画処理
    background(255);
    switch(mode) {
      case 0 : // タイトル
        TitleScene.update();
        break;
      case 1 : // ホーム
        HomeScene.update();
        break;
      case 2 : // 天気
        WeatherScene.update();
        break;
      case 3 : // Fit
        FitScene.update();
        break;
      case 4 : // Funbus
        FunbusScene.update();
        break;
      case 5 : // IP情報
        IpinfoScene.update();
        break;
      case 6 : // 睡眠
        SleepScene.update();
        break;
      case 7 : // 設定
        SettingsScene.update();
        break;
    }
    if (!(mode == 0)) {
      CPT.footer();
    }
    LIST_Button.forEach(e => e.update());
  }
  // つぎに行う動作がある場合、実行
  if (!MANAGER_nextmotion.equals("")) {
    query = split(MANAGER_nextmotion, ","); // 動作を展開
    if (query[0].equals("cmode")) {
      cmode(Integer.parseInt(query[1])); // cmodeを実行
    }
    MANAGER_nextmotion = "";
  }
}

// シーン切り替え処理を開始する
function cmode(i) {
  LIST_Button.clear();
  isCmode = true;
  cmodeTarget = i;
  switch(i) { // メッセージを選択
    case 0:
      cmodeText = "";
      break;
    case 1:
      cmodeText = "読み込み中";
      break;
    case 2:
      cmodeText = "天気情報を取得中\n\nby Open Weather Map";
      break;
    case 3:
      cmodeText = "歩数情報を取得中\n\nby Fitbit API";
      break;
    case 4:
      cmodeText = "バス情報を取得中\n\nby Google Apps Script";
      break;
    case 5:
      cmodeText = "IPアドレスを取得中\n\nby IPinfo.io";
      break;
    case 6:
      cmodeText = "睡眠情報を取得中\n\nby Fitbit API";
      break;
    case 7:
      cmodeText = "";
      break;
  }
}

// シーン切り替え処理を実行する
function cmodeAction(i) {
  delay(20);
  switch(i) {
    case 0:
      TitleScene.boot();
      break;
    case 1:
      HomeScene.boot();
      break;
    case 2:
      WeatherScene.boot();
      break;
    case 3:
      FitScene.boot();
      break;
    case 4:
      FunbusScene.boot();
      break;
    case 5:
      IpinfoScene.boot();
      break;
    case 6:
      SleepScene.boot();
      break;
    case 7:
      SettingsScene.boot();
      break;
  }
  mode = i;
  println("[cmode] mode: " + mode);
}
// ボタンの追加
function addButton(x, y, w, h, bg, label, type, id) {
  LIST_Button.add(new Button_class(x, y, w, h, bg, label, type, id));
}

// バスをデフォルトの表示にするかどうかを変更
function changeFirstBus() {
  isFirstBus = !isFirstBus;
  var json;
  json.setInt("is_first_bus", isFirstBus ? 1 : 0);
  json.setInt("is_free_wifi_contain", isFreeWifiContain ? 1 : 0);
  json.setString("bus_mode", busMode);
  saveJSONObject(json, "data/config.json");
  println("[json] 設定が保存されました isFirstBus: " + isFirstBus);
}

// フレッツ光を含むかどうかの設定を変更
function changeFreeWifiContain() {
  isFreeWifiContain = !isFreeWifiContain;
  var json;
  json.setInt("is_first_bus", isFirstBus ? 1 : 0);
  json.setInt("is_free_wifi_contain", isFreeWifiContain ? 1 : 0);
  json.setString("bus_mode", busMode);
  saveJSONObject(json, "data/config.json");
  println("[json] 設定が保存されました isFreeWifiContain: " + isFreeWifiContain);
}

// バスモードを変更
function changeBusMode() {
  if (busMode.equals("fromkmdtofun")) {
    busMode = "fromfuntokmd";
  } else if (busMode.equals("fromfuntokmd")) {
    busMode = "auto";
  } else {
    busMode = "fromkmdtofun";
  }
  var json;
  json.setInt("is_first_bus", isFirstBus ? 1 : 0);
  json.setInt("is_free_wifi_contain", isFreeWifiContain ? 1 : 0);
  json.setString("bus_mode", busMode);
  saveJSONObject(json, "data/config.json");
  println("[json] 設定が保存されました busMode: " + busMode);
}

// マウスが押された場合に、そのことと座標を記録する(それぞれのボタンを描画している場所で、条件にあたるかどうかを判定する(ここでは判定しない))
function mousePressed() {
  MANAGER_isMousePressed = true;
  MANAGER_mouseX = mouseX;
  MANAGER_mouseY = mouseY;
}


// ? 各種APIの{管理、呼び出し、キャッシュ}、エンドポイント、APIキーの管理を行うクラス
// * このファイルは特に複雑なので、コメントをしっかり残しています

class API_class {
  
  // ! ---------------- ローカル変数の定義 ----------------
  
  // キャッシュの有効期限(ミリ秒)
  timeout = 120000; // 2分
  
  // それぞれのキャッシュの起点となる時間を記憶する変数
  CASHTIME_weatherNow = 0;
  CASHTIME_weatherForecast = 0;
  CASHTIME_funbus = 0;
  CASHTIME_fitbit = 0;
  CASHTIME_fitbitSleep = 0;
  CASHTIME_ipinfo = 0;
  
  // APIレスポンスをキャッシュしておくHashMap
  weatherNow;
  weatherForecast;
  funbus;
  fitbit;
  fitbit_sleep;
  ipinfo;
  
  // APIで用いるHashMap
  apikeys; // API キーリスト
  endpoints; // API エンドポイントリスト
  
  // ! ---------------- API ----------------
  
  // Open Weather Map から天気情報を取得
  getWeatherNow() { 
    var timediff = millis() - CASHTIME_weatherNow;
    if ((weatherNow.size() > 0) && (timediff < timeout)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      println("[API] getWeatherNow: CASH... done with " + weatherNow.size() + " items at " + getTime() + ", 都市: " + weatherNow.get("city") + ", キャッシュ期限: " + (timeout - timediff) / 1000 + "秒");
      return weatherNow;
    }
    print("[API] getWeatherNow: FETCHING... ");
    var JSON_response = loadJSON(endpoints.get("openweathermap_weather") + apikeys.get("openweathermap"));
    
    weatherNow.put("weather", JSON_response.getJSONArray("weather").getJSONObject(0).getString("description")); // 天気
    weatherNow.put("icon", JSON_response.getJSONArray("weather").getJSONObject(0).getString("icon").substring(0, 2) + "d"); // 天気アイコン
    weatherNow.put("temp", String.valueOf(Math.round(10.0 * (JSON_response.getJSONObject("main").getFloat("temp") - 273.15)) / 10.0)); // 気温(四捨五入小数点以下1桁)
    weatherNow.put("pressure", String.valueOf(Math.round(JSON_response.getJSONObject("main").getFloat("pressure")))); // 気圧(四捨五入)
    weatherNow.put("city", JSON_response.getString("name")); // 都市名
    
    CASHTIME_weatherNow = millis();
    println("done with " + weatherNow.size() + " items at " + getTime() + ", 都市: " + weatherNow.get("city"));
    
    return weatherNow; // * 返す内容 現在の天気{天気、気温、気圧}
  }
  
  // Open Weather Map から天気情報を取得
  getWeatherForecast() {
    var timediff = millis() - CASHTIME_weatherForecast;
    if ((weatherForecast.size() > 0) && (timediff < timeout)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      println("[API] getWeatherForecast: CASH... done with " + weatherForecast.size() + " items at " + getTime() + ", キャッシュ期限: " + (timeout - timediff) / 1000 + "秒");
      return weatherForecast;
    }
    var JSON_response = loadJSON(endpoints.get("openweathermap_forecast") + apikeys.get("openweathermap")).getJSONArray("list");
    print("[API] getWeatherForecast: FETCHING... ");
    
    for (i = 0; i < JSON_response.size(); i++) { // データを加工して HashMap に格納
      var forecast = JSON_response.getJSONObject(i);
      var hour = i * 3 + 3; // 3, 6, 9, 12, 15 時間後
      
      if (hour >= 18) break; // 15時間後の天気まで取得する
      
      var forecastData; // 一時データ
      forecastData.put("weather", forecast.getJSONArray("weather").getJSONObject(0).getString("description"));
      forecastData.put("temp", String.valueOf(Math.round(10.0 * (forecast.getJSONObject("main").getFloat("temp") - 273.15)) / 10.0));
      forecastData.put("icon", forecast.getJSONArray("weather").getJSONObject(0).getString("icon").substring(0, 2) + "d");
      forecastData.put("pressure", String.valueOf(Math.round(forecast.getJSONObject("main").getFloat("pressure"))));
      
      weatherForecast.put(hour, forecastData);
    }
    
    CASHTIME_weatherForecast = millis(); // キャッシュ時間を更新
    println("done with " + weatherForecast.size() + " items at " + getTime());
    return weatherForecast;
    //? 返す内容 予報天気{3,6,9,12,15時間後の天気、気温、気圧}
  }
  
  // Google Spreadsheet からバスの時刻表を取得し、次のバスとさらに次のバスの情報を取得する
  getFunbus(query) { 
    //!バスのAPIは、最新のデータをすぐに取得する必要があるため、キャッシュを使わないことにした
    //int timediff = millis() - CASHTIME_funbus;
    //if ((funbus.size() > 0) && (timediff < timeout)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
    //println("[API] getFunbus: returning CASHED_DATA... done with " + funbus.size() + " items at " + getTime() + ", キャッシュ期限: " + (timeout - timediff) / 1000 + "秒");
    //return funbus;
    // }
    print("[API] getFunbus: FETCHING... ");
    var JSON_response = loadJSONArray(endpoints.get("gas_funbus") + query);
    
    var thisId = 0; // バスのID
    
    for (i = 0; i < JSON_response.size(); i++) { // 次に出発するバスを探索
      thisId = i;
      var JSON_item = JSON_response.getJSONObject(i);
      var start = JSON_item.getString("start");
      if (start.equals("null")) {
        println("[API] getFunbus: クエリが不正です、データを取得できませんでした");
        break;
      }
      
      //このループのバスが次のバスであれば、ループを抜ける 
      var startHour = Integer.parseInt(start.substring(0, 2));
      var startMinute = Integer.parseInt(start.substring(3, 5));
      var startTime = startHour * 60 + startMinute;
      var currentTime = hour() * 60 + minute();
      if (startTime > currentTime) break;
      
      if (thisId >= JSON_response.size() - 1) { // 終バス後の処理
        funbus.put("this_code", "終バス済");
        funbus.put("this_start", "");
        funbus.put("this_end", "");
        funbus.put("this_destination", "");
        funbus.put("this_untilnext", "0");
        funbus.put("next_code", "");
        funbus.put("next_start", "");
        funbus.put("next_end", "");
        funbus.put("next_destination", "");
        println("done with " + funbus.size() + " items at " + getTime());
        return funbus;
      }
    }
    
    //次に出発するバスの情報
    funbus.put("this_code", JSON_response.getJSONObject(thisId).getString("code")); // 系統
    funbus.put("this_start", JSON_response.getJSONObject(thisId).getString("start")); // 出発時刻
    funbus.put("this_end", JSON_response.getJSONObject(thisId).getString("end")); // 到着時刻
    funbus.put("this_destination", busDestination(JSON_response.getJSONObject(thisId).getString("code"), query)); // 行き先
    funbus.put("this_untilnext", JSON_response.getJSONObject(thisId).getString("until_next")); // 次のバスまでの時間
    
    if (!(JSON_response.getJSONObject(thisId).getString("until_next").equals("last"))) { // 最終バスのとき、APIは0を返すため、そうでない場合「さらに次のバス」を取得する
      funbus.put("next_code", JSON_response.getJSONObject(thisId + 1).getString("code"));
      funbus.put("next_start", JSON_response.getJSONObject(thisId + 1).getString("start"));
      funbus.put("next_end", JSON_response.getJSONObject(thisId + 1).getString("end"));
      funbus.put("next_destination", busDestination(JSON_response.getJSONObject(thisId + 1).getString("code"), query));
    } else { // 次のバスが最終バスのとき、終バスの表記を返す
      funbus.put("next_code", "終バス");
      funbus.put("next_start", "00:00");
      funbus.put("next_end", "00:00");
      funbus.put("next_destination", "未知");
    }
    
    CASHTIME_funbus = millis();
    println("done with " + funbus.size() + " items at " + getTime());
    return funbus; // * 返す内容 this_{系統, 出発時刻, 到着時刻, 行き先(算出する), 次のバスまで(APIから取得)} next_{系統, 出発時刻, 到着時刻, 行き先(算出する)}
  }
  
  // Fitbit APIから歩数データを取得
  getFitbitSteps() {
    var timediff = millis() - CASHTIME_fitbit;
    if ((fitbit.size() > 0) && (timediff < timeout)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      println("[API] getFitbitSteps: returning CASHED_DATA... done with " + fitbit.size() + " items at " + getTime() + ", キャッシュ期限: " + (timeout - timediff) / 1000 + "秒");
      return fitbit;
    }
    print("[API] getFitbitSteps: FETCHING... ");
    var JSON_response = loadJSONArray(endpoints.get("gas_steps"));
    for (i = 0; i < JSON_response.size(); i++) {
      var data = JSON_response.getJSONObject(i);
      fitbit.put((7 - i), int(data.getString("steps")));
    }
    CASHTIME_fitbit = millis();
    println("done with " + fitbit.size() + " items at " + getTime());
    
    return fitbit; // * 返す内容 7,6,5,4,3,2,1日前の歩数{日, 歩数}
  }
  
  // Fitbit APIから運動データを取得
  getFitbitSleeps() {
    var timediff = millis() - CASHTIME_fitbitSleep;
    if ((fitbit_sleep.size() > 0) && (timediff < timeout)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      println("[API] getFitbitSleeps: returning CASHED_DATA... done with " + fitbit_sleep.size() + " items at " + getTime() + ", キャッシュ期限: " + (timeout - timediff) / 1000 + "秒");
      return fitbit_sleep;
    }
    print("[API] getFitbitSleeps: FETCHING... ");
    var JSON_response = loadJSONArray(endpoints.get("gas_sleeps"));
    for (i = 0; i < JSON_response.size(); i++) {
      var data = JSON_response.getJSONObject(i);
      var _data;
      _data.put("date", data.getString("date"));
      _data.put("duration", String.valueOf(data.getInt("duration")));
      _data.put("start", data.getString("start"));
      _data.put("end", data.getString("end"));
      fitbit_sleep.put((7 - i), _data);
    }
    CASHTIME_fitbitSleep = millis();
    println("done with " + fitbit_sleep.size() + " items at " + getTime());
    return fitbit_sleep; // * 返す内容 {日付, 睡眠データ{睡眠時間、睡眠開始、睡眠終了}}
  }
  
  // ipinfoを用いて、ipアドレスに関する情報を取得する
  // 接続先のプロバイダを取得して、未来大からアクセスしているか、それ以外からアクセスしているかを特定できる
  getIpinfo() {
    //!バスのAPIに関連するAPIであり、最新のデータをすぐに取得する必要があるため、キャッシュ期限を独自(1秒)にしている→s5でAPIを2回呼ぶから、その時に1秒のキャッシュを読む(リクエスト数の削減)
    var timediff = millis() - CASHTIME_ipinfo;
    if ((ipinfo.size() > 0) && (timediff < 1000)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      println("[API] getIpinfo: returning CASHED_DATA... done with " + ipinfo.size() + " items at " + getTime() + ", キャッシュ期限: 1秒");
      return ipinfo;
    }
    print("[API] getIpinfo: FETCHING... ");
    var JSON_response = loadJSON(endpoints.get("ipinfo") + apikeys.get("ipinfo"));
    ipinfo.put("ip",JSON_response.getString("ip"));
    ipinfo.put("region", JSON_response.getString("city") + ", " + JSON_response.getString("region") + ", " + JSON_response.getString("country")); // 天気の取得にこのデータを使えそうだけど、VPN使ってたりするとずれるのでやめておく
    ipinfo.put("loc", JSON_response.getString("loc"));
    ipinfo.put("org", JSON_response.getString("org"));
    CASHTIME_ipinfo = millis();
    println("done with " + ipinfo.size() + " items at " + getTime());
    
    return ipinfo; // * 返す内容 IPアドレス、プロバイダ、地域、座標
  }
  
  // 手動切替を考慮した、未来大モードかどうかの判定
  solvedIsFUN() {
    if (busMode.equals("auto")) {
      return isFUN();
    } else if (busMode.equals("fromfuntokmd")) {
      return true;
    } else {
      return false;
    }
  }
  
  isRain() {
    var list = getWeatherForecast();
    for (i = 3; i <= 15; i += 3) {
      var icon = list.get(i).get("icon");
      if (icon.equals("10d")) {
        return true;
      }
    }
    return false;
  }
  
  // ! ---------------- JSONからAPIに関するデータを取得する関数 ----------------
  
  // APIキーをjsonファイルから取得するコード
  setApikeys(json) {
    apikeys.put("openweathermap", atob(json.getString("openweathermap")));
    apikeys.put("ipinfo", atob(json.getString("ipinfo")));
  }
  
  // エンドポイントをjsonファイルから取得するコード
  setEndpoints(json) {
    endpoints.put("openweathermap_weather", atob(json.getString("openweathermap_weather")));
    endpoints.put("openweathermap_forecast", atob(json.getString("openweathermap_forecast")));
    endpoints.put("gas_funbus", atob(json.getString("gas_funbus")));
    endpoints.put("gas_steps", atob(json.getString("gas_steps")));
    endpoints.put("gas_sleeps", atob(json.getString("gas_sleeps")));
    endpoints.put("ipinfo", atob(json.getString("ipinfo")));
  }
  
  // ! ---------------- 内部で使っている関数 ----------------
  
  // 未来大からアクセスしているかを判定(APIのみの判定、solvedIsFUNでwrapする)
  isFUN() {
    var org = getIpinfo().get("org");
    // ipinfo の org が "AS2907 Research Organization of Information and Systems, National Institute" である場合、未来大からのアクセスと判定 (VPNを使っている場合は判定できない)
    return org.contains("AS13335 C") || (org.contains("AS4713 N") && !isFreeWifiContain) || org.contains("AS2907 R");
    
    // 一時的にCloudflareVPNで未来大かどうかを切り替えている(デモ用)
    // VPNのスイッチをON/OFFするだけで、未来大モードと亀田支所前モードを切り替えることができる
  }
  
  // バスの行き先を算出
  busDestination(code, query) { 
    
    if (query.equals("fromkmdtofun")) return "赤川";
    
    var result;
    switch(code) {
      case"55A" :
      result = "函館駅前";
      break;
      case"55B" :
      result = "函館駅前";
      break;
      case"55F" :
      result = "千代台";
      break;
      case"55G" :
      result = "昭和ターミナル";
      break;
      case"55H" :
      result = "亀田支所前";
      break;
      default :
      result = "<不明>";
      break;
    }
    return result;
  }
  
  // 時間を取得するコード
  getTime() {
    return nf(hour(), 2) + ":" + nf(minute(), 2) + ":" + nf(second(), 2);
  }
}

class Component_class {
  // ヘッダー
  header(i) {
    // 表示部分
    fill(0, 75, 75);
    rect(0, 0, 600, 100);
    fill(255);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 48);
    text(i, 30, 50);
    shape(SVG_settings, 525, 25, 50, 50);
    
    // ボタンの判定
    if (MANAGER_isMousePressed && MANAGER_mouseY < 100 && MANAGER_mouseX > 500) {
      MANAGER_nextmotion = "cmode,7";
      MANAGER_isMousePressed = false;
    }
  }
  // フッターメニュー
  footer() {
    // 表示部分の枠
    fill(170, 255, 235);
    rect(0, 1100, 600, 100);
    fill(0, 75, 75);
    rect(0, 1095, 600, 5);
    circle(300, 1150, 130);
    
    // 表示部分のボタン
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 20);
    fill(0);
    text("天気", 600 * 1 / 10, 1180);
    text("バス", 600 * 3 / 10, 1180);
    text("歩数", 600 * 7 / 10, 1180);
    text("睡眠", 600 * 9 / 10, 1180);
    shape(SVG_weather, 600 * 1 / 10 - 25, 1110, 50, 50);
    shape(SVG_funbus, 600 * 3 / 10 - 25, 1110, 50, 50);
    shape(SVG_fit, 600 * 7 / 10 - 25, 1110, 50, 50);
    shape(SVG_sleep, 600 * 9 / 10 - 25, 1110, 50, 50);
    fill(170, 255, 235);
    text("ホーム", 600 * 5 / 10, 1180);
    shape(SVG_home, 600 * 5 / 10 - 25, 1110, 50, 50);
    
    // ボタンの判定
    if (MANAGER_isMousePressed && MANAGER_mouseY > 1100) {
      if (MANAGER_mouseX < 600 * 1 / 5) {
        MANAGER_nextmotion = "cmode,2";
      } else if (MANAGER_mouseX < 600 * 2 / 5) {
        MANAGER_nextmotion = "cmode,4";
      } else if (MANAGER_mouseX < 600 * 3 / 5) {
        MANAGER_nextmotion = "cmode,1";
      } else if (MANAGER_mouseX < 600 * 4 / 5) {
        MANAGER_nextmotion = "cmode,3";
      } else {
        MANAGER_nextmotion = "cmode,6";
      }
      MANAGER_isMousePressed = false;
    }
  }
}

class TitleScene_class {
  loadingTime = 1800;
  bg;
  
  start = 0;
  
  // 初期化処理
  boot() {
    this.start = millis(); // 基準となる時間を更新
    this.bg = loadImage("img/title.jpg");
  }
  
  // 更新処理
  update() {
    // UI描画
    background(0);
    tint(150);
    image(bg, 0, 0, width, height);
    noTint();
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(FONT_jetbrains, 120);
    text("funget", 300, 250);
    textFont(FONT_noto, 40);
    text("ようこそ ( > ω <)//", 300, 450);
    // 下部の読み込み表示バー
    var processing = (millis() - start) / 2;
    var rectx, width = 0;
    if (processing < 300) {
      rectx = 100;
      width = processing * 4 / 3;
    } else if (processing < 600) {
      rectx = 100 + (processing - 300) * 4 / 3;
      width = 400 - (processing - 300) * 4 / 3;
    } else {
      rectx = 100;
      width = (processing - 600) * 4 / 3;
    }
    rect(rectx, 800, width, 20);
    textFont(FONT_noto, 30);
    text("2024 © famisics (https://uiro.dev)", 300, 1125);
    // 指定時間経過後、ページ遷移
    if (millis() > start + loadingTime - 100) {
      if (isFirstBus) {
        cmode(4);
      } else {
        cmode(1);
      }
    }
  }
}

// ? シーン1(ホーム)のクラス

class HomeScene_class {
  bg;
  isRain = false;
  
  // 初期化処理
  boot() {
    // 時間帯に応じた背景画像
    var time = Integer.parseInt(API.getTime().substring(0, 2));
    if (time >= 19) {
      bg = loadImage("img/home/night.jpg");
    } else if (time >= 15) {
      bg = loadImage("img/home/sunset.jpg");
    } else if (time >= 5) {
      bg = loadImage("img/home/noon.jpg");
    } else {
      bg = loadImage("img/home/midnight.jpg");
    }
    
    // 雨が降るかどうか
    isRain = API.isRain();
    
    // ボタンの追加
    addButton(162.5, 512.5, 225, 225, color(0, 140, 180), "天気", "cmode", "2");
    addButton(437.5, 512.5, 225, 225, color(190, 130, 70), "歩数", "cmode", "3");
    addButton(162.5, 787.5, 225, 225, color(170, 50, 120), "バス", "cmode", "4");
    addButton(437.5, 787.5, 225, 225, color(30, 150, 50), "睡眠", "cmode", "6");
    addButton(162.5, 1000, 225, 100, color(120, 10, 170), "接続状態", "cmode", "5");
    addButton(437.5, 1000, 225, 100, color(50), "設定", "cmode", "7");
  }
  
  // 更新処理
  update() {
    tint(255, 175);
    image(bg, 0, 0, width, height);
    noTint();
    fill(0);
    textAlign(CENTER, CENTER);
    textFont(FONT_jetbrains, 96);
    text(API.getTime(), 300, 100);
    textFont(FONT_noto, 48);
    // 時間帯に応じたメッセージ
    var time = Integer.parseInt(API.getTime().substring(0, 2));
    if (time >= 18) {
      text("こんばんは！", 300, 225);
    } else if (time >= 12) {
      text("こんにちは！", 300, 225);
    } else if (time >= 5) {
      text("おはようございます！", 300, 225);
    } else {
      text("寝てください", 300, 225);
    }
    textFont(FONT_noto, 30);
    if (isRain) {
      text("今日は雨が降るかもしれません", 300, 325);
    } else {
      text("今日は、雨は降らない予定です", 300, 325);
    }
  }
}

// ? シーン2(天気)のクラス

class WeatherScene_class {
  weatherNow;
  weatherForecast;
  NOW_weather = "";
  NOW_temp = "";
  NOW_pressure = "";
  NOW_wind = "";
  SVG_now = null;
  SVG_forecast3 = null;
  SVG_forecast6 = null;
  SVG_forecast9 = null;
  SVG_forecast12 = null;
  SVG_forecast15 = null;
  bg;
  
  // 初期化処理
  boot() {
    // APIからデータを取得
    this.weatherNow = API.getWeatherNow();
    this.weatherForecast = API.getWeatherForecast();
    nowIcon(weatherNow.get("icon"));
    nowBg(weatherNow.get("icon"));
    forecastIcon(weatherForecast.get(3).get("icon"), weatherForecast.get(6).get("icon"), weatherForecast.get(9).get("icon"), weatherForecast.get(12).get("icon"), weatherForecast.get(15).get("icon"));
  }
  
  // 更新処理
  update() {
    tint(255, 75);
    image(bg, 0, 0, width, height);
    noTint();
    CPT.header("天気");
    
    // 現在の天気を描画
    fill(0);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 40);
    text("現在の天気", 25, 160);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 96);
    text(weatherNow.get("weather"), 300, 270);
    textFont(FONT_noto, 60);
    shape(SVG_now, 50, 250, 500, 500);
    text(weatherNow.get("temp") + "℃", 150, 700);
    text(weatherNow.get("pressure") + "hPa", 450, 700);
    
    // 予報を描画
    for (i = 3; i <= 15; i += 3) {
      drawWeather(i, weatherForecast.get(i).get("weather"), weatherForecast.get(i).get("temp"));
    }
  }
  
  // 現在の天気のアイコンを取得
  nowIcon(name) {
    bg = loadImage("img/weather/" + name + ".jpg");
  }
  
  // 現在の天気のアイコンに合わせた背景画像を取得
  nowBg(name) {
    SVG_now = loadShape("svg/weather/" + name + ".svg");
  }
  
  // 予報の天気のアイコンを取得
  forecastIcon(name3, name6, name9, name12, name15) {
    SVG_forecast3 = loadShape("svg/weather/" + name3 + ".svg");
    SVG_forecast6 = loadShape("svg/weather/" + name6 + ".svg");
    SVG_forecast9 = loadShape("svg/weather/" + name9 + ".svg");
    SVG_forecast12 = loadShape("svg/weather/" + name12 + ".svg");
    SVG_forecast15 = loadShape("svg/weather/" + name15 + ".svg");
  }
  
  // 予報の天気を描画
  drawWeather(i, weather, temp) {
    fill(0);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 24);
    var i2 = 600 * (2 * (i / 3 - 1) + 1) / 10;
    text(i + "時間後", i2, 830);
    text(weather, i2, 900);
    if (i == 3) shape(SVG_forecast3, i2 - 60, 910, 120, 120);
    if (i == 6) shape(SVG_forecast6, i2 - 60, 910, 120, 120);
    if (i == 9) shape(SVG_forecast9, i2 - 60, 910, 120, 120);
    if (i == 12) shape(SVG_forecast12, i2 - 60, 910, 120, 120);
    if (i == 15) shape(SVG_forecast15, i2 - 60, 910, 120, 120);
    text(temp + "℃", i2, 1040);
    if (i < 15) {
      fill(0);
      rect(600 * (2 * (i / 3 - 1) + 2) / 10 - 1, 800, 2, 280);
    }
  }
}

// ? シーン3(歩数)のクラス

class FitScene_class {
  itbit;
  graphData;
  totalSteps = 0;
  isMsg = true;
  
  start = 0;
  
  // 初期化処理
  boot() {
    // APIからデータを取得
    this.fitbit = API.getFitbitSteps();
    totalSteps = 0;
    for (i = 1; i < 8; i++) {
      steps = fitbit.get(7 - i);
      graphData[i - 1] = steps;
      totalSteps += steps;
    }
    addButton(480, 1030, 180, 70, color(26, 140, 216), "ツイート", "tweet", "【funget歩数シェア】私は1週間で" + str(totalSteps) + "歩、歩きました！すごいでしょ！！");
    start = millis();
    isMsg = true;
  }
  
  // 更新処理
  update() {
    CPT.header("歩数");
    fill(0);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 40);
    text("今日の歩数", 25, 150);
    textAlign(CENTER, CENTER);
    textFont(FONT_jetbrains, 110);
    text(fitbit.get(0), 300, 250);
    textFont(FONT_noto, 48);
    text("歩", 550, 250);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 40);
    text("週合計: " + totalSteps + "歩", 25, 1030);
    for (i = 1; i < 8; i++) {
      drawSteps(i, fitbit.get(7 - i));
    }
    drawGraph();
    
    // メッセージ
    if ((millis() - start < 5000) && isMsg) {
      message();
    }
  }
  
  // メッセージを描画
  message() {
    msg;
    if (totalSteps > 50000) {
      msg = "おめでとうございます！\n週間歩数50000歩を達成しました";
    } else {
      msg = "目標まであと" + str(50000 - totalSteps) + "歩です\nがんばりましょう！";
    }
    fill(25, 100, 100);
    rect(0, 100, 600, 200);
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 36);
    text(msg, 300, 200);
    if (MANAGER_isMousePressed && MANAGER_mouseY > 100 && MANAGER_mouseY < 300) {
      isMsg = false;
      MANAGER_isMousePressed = false;
    }
  }
  
  //歩数を描画
  drawSteps(i, steps) {
    fill(0);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 24);
    var _day = str(7 - i) + "日前";
    if (i == 7) {
      _day = "今日";
    }
    text(_day, 600 * (2 * i - 1) / 14, 750);
    if (steps > 10000) {
      shape(SVG_check, 600 * (2 * i - 1) / 14 - 30, 790, 60, 60);
    } else {
      shape(SVG_error, 600 * (2 * i - 1) / 14 - 30, 790, 60, 60);
    }
    text(steps, 600 * (2 * i - 1) / 14, 900);
    text("歩", 600 * (2 * i - 1) / 14, 930);
    if (i < 7) {
      fill(0);
      rect(600 * (2 * i + 2) / 14 - 1, 720, 2, 230);
    }
  }
  
  // グラフの描画
  drawGraph() {
    stroke(50, 200, 120);
    strokeWeight(5);
    baseLineY = map(10000, 0, max(graphData), 800, 400);
    line(0, baseLineY, 600, baseLineY);
    textAlign(RIGHT, TOP);
    textFont(FONT_noto, 24);
    fill(50, 200, 120);
    text("10000歩", 590, baseLineY + 10);
    textAlign(LEFT, BOTTOM);
    text("10000歩", 10, baseLineY - 10);
    
    stroke(80);
    strokeWeight(5);
    
    noFill();
    beginShape();
    
    for (i = 0; i < 7; i++) {
      graphShape(i);
    }
    
    endShape();
    noStroke();
  }
  
  // グラフの折れ線を描画
  graphShape(i) {
    var x = 600 * (2 * i + 1) / 14;
    var y = map(graphData[i], 0, max(graphData), 800, 400);
    vertex(x, y);
    
    fill(80);
    circle(x, y, 10);
    noFill();
  }
}
// ? シーン4(バス)のクラス

var DEMO_isLast = false;

class FunbusScene_class {
  funbus;
  query;
  
  // 初期化処理
  boot() {
    // APIを元に起点となるバス停を算出し、その文字列をクエリとしてAPIからデータを取得
    query = "fromkmdtofun";
    if (API.solvedIsFUN()) query = "fromfuntokmd";
    funbus = API.getFunbus(query);
  }
  
  // 更新処理
  update() {
    CPT.header("バス");
    
    // メインUIの描画
    fill(0);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 32);
    if (query.equals("fromkmdtofun")) {
      text("亀田支所前→未来大のバスを表示中", 25, 150);
    } else {
      text("未来大→亀田支所前のバスを表示中", 25, 150);
    }
    if (!funbus.get("this_code").equals("終バス済")) {
      busCard(funbus.get("this_code"), funbus.get("this_start"), funbus.get("this_end"), funbus.get("this_destination"), remain(funbus.get("this_start")), funbus.get("this_untilnext"), 260);
      if (funbus.get("this_untilnext").equals("last") || DEMO_isLast) {
        fill(200, 0, 0);
        rect(50, 700, 500, 200);
        fill(255, 255, 0);
        rect(58, 708, 484, 184);
        fill(200, 0, 0);
        textAlign(CENTER, CENTER);
        textFont(FONT_noto, 48);
        text("今日最後のバスです", 300, 800);
      } else {
        busCard(funbus.get("next_code"), funbus.get("next_start"), funbus.get("next_end"), funbus.get("next_destination"), remain(funbus.get("next_start")), funbus.get("this_untilnext"), 660);
      }
    } else {
      textAlign(CENTER, CENTER);
      textFont(FONT_noto, 42);
      text("本日の運行は終了しました", 300, 550);
    }
    
    // ボタンの描画
    fill(0);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 20);
    var d = "自動";
    if (busMode.equals("fromfuntokmd")) d = "未来大モード"; 
    if (busMode.equals("fromkmdtofun")) d = "亀田支所前モード";
    text("バスモードを切り替える　現在: " + d, 110, 1025);
    shape(SVG_change, 50, 1000, 50, 50);
    if (MANAGER_isMousePressed && MANAGER_mouseY > 1000 && MANAGER_mouseY < 1050 && MANAGER_mouseX > 50 && MANAGER_mouseX < 550) {
      changeBusMode();
      MANAGER_isMousePressed = false;
    }
  }
  
  // バス情報を表示するカードを作成
  busCard(code, start, end, destination, remain, untilNext, yPoition) {
    if (yPoition == 260) {
      fill(240, 90, 90);
    } else {
      fill(90, 90, 255);
    }
    
    rect(50, yPoition - 50, 500, 350);
    fill(255);
    textFont(FONT_noto, 30);
    textAlign(LEFT, CENTER);
    text(code + "系統　" + destination + "行き", 75, yPoition);
    textFont(FONT_noto, 24);
    text("出発", 105, yPoition + 90);
    text("到着", 335, yPoition + 90);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 64);
    text(start + "　" + end, 300, yPoition + 140);
    textFont(FONT_noto, 40);
    textAlign(CENTER, CENTER);
    if (yPoition != 260 && !untilNext.equals("0")) {
      text("さらに" + untilNext + "後に出発", 300, yPoition + 250);
    } else {
      text(remain, 300, yPoition + 250);
    }
  }
  
  // 残り時間を計算
  remain(this_start) {
    var nowSeconds = hour() * 3600 + minute() * 60 + second();
    var startSeconds = int(this_start.substring(0, 2)) * 3600 + int(this_start.substring(3, 5)) * 60;
    var remainingSeconds = startSeconds - nowSeconds;
    if (remainingSeconds < 0) {
      cmode(4);
      return ""; 
    }
    var remainHour = remainingSeconds / 3600;
    var remainMinute = (remainingSeconds % 3600) / 60;
    var remainSecond = remainingSeconds % 60;
    var result = "出発まで";
    if (remainHour > 0) {
      result += remainHour + "時間";
    }
    if (remainMinute > 0 || remainHour > 0) {
      result += nf(remainMinute, 2) + "分";
    }
    result += nf(remainSecond, 2) + "秒";
    return result;
  }
}

// ? シーン5(接続状態)のクラス

class IpinfoScene_class {
  pinfo;
  isFUN = false;
  
  // 初期化処理
  boot() {
    // APIからデータを取得
    ipinfo = API.getIpinfo();
    isFUN = API.solvedIsFUN();
  }
  
  // 更新処理
  update() {
    CPT.header("接続状態");
    // UIの描画
    fill(0);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 24);
    text("IPアドレス", 50, 150);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 64);
    text(ipinfo.get("ip"), 300, 240);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 24);
    text("地域：" + ipinfo.get("region"), 50, 350);
    text("座標：" + ipinfo.get("loc"), 50, 400);
    var org = ipinfo.get("org");
    if (org.contains("AS2907 R")) org = "AS2907 SINET6 by 国立情報学研究所";
    if (org.length() > 32) {
      org = org.substring(0, 32) + "...";
    }
    text("組織：" + org, 50, 450);
    if (isFUN) {
      text("バスモード：未来大モード", 50, 500);
    } else {
      text("バスモード：亀田支所前モード", 50, 500);
    }
    text("バスの行き先が自動で変わります\n学内LAN, fun-wifi, free-wifi, eduroam\nに接続時、未来大モードが有効になります\n自宅の回線がフレッツ光の場合は、\n未来大として検出されます", 50, 700);
    // ボタンの描画
    fill(0);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 20);
    text("フレッツ光(free-wifi)を未来大モードから除外する", 110, 1025);
    if (isFreeWifiContain) {
      shape(SVG_on, 50, 1000, 50, 50);
    } else {
      shape(SVG_off, 50, 1000, 50, 50);
    }
    if (MANAGER_isMousePressed && MANAGER_mouseY > 1000 && MANAGER_mouseY < 1050 && MANAGER_mouseX > 50 && MANAGER_mouseX < 550) {
      changeFreeWifiContain();
      MANAGER_isMousePressed = false;
    }
  }
}


// ? シーン6(睡眠)のクラス

class SleepScene_class {
  fitbit_sleep;
  start = 0;
  totalSleepMins = 0;
  isMsg = true;
  
  // 初期化処理
  boot() {
    // APIからデータを取得
    fitbit_sleep = API.getFitbitSleeps();
    totalSleepMins = 0;
    for (i = 0; i < 8; i++) {
      totalSleepMins += Integer.parseInt(fitbit_sleep.get(i).get("duration"));
    }
    start = millis();
    isMsg = true;
  }
  
  // 更新処理
  update() {
    CPT.header("睡眠");
    // 今日のデータ
    fill(0);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 40);
    text("昨晩の睡眠時間（今日）", 25, 150);
    textAlign(CENTER, CENTER);
    var lastSleepTime = Integer.parseInt(fitbit_sleep.get(0).get("duration"));
    if (lastSleepTime == 0) {
      textFont(FONT_noto, 60);
      text("データがありません", 300, 250);
    } else {
      textFont(FONT_noto, 90);
      text(minToTime(lastSleepTime, true), 300, 250);
    }
    // 背景を描画
    drawBg();
    // それぞれの列のデータを取得
    for (i = 0; i < 8; i++) {
      var c = color(20, 120, 120);
      if (Integer.parseInt(fitbit_sleep.get(i).get("duration")) < 420) {
        c = color(120, 20, 20);
      }
      drawSleep(i, fitbit_sleep.get(i), c);
      drawGraph(i, fitbit_sleep.get(i).get("start"), fitbit_sleep.get(i).get("end"), c);
    }
    
    // メッセージ
    if ((millis() - start < 5000) && isMsg) {
      message();
    }
  }
  
  // メッセージを描画
  message() {
    var msg;
    if (totalSleepMins > 2940) {
      msg = "おめでとうございます！\n8日で7日*7時間睡眠を達成しました";
    } else {
      var remain = Math.round((float)(2940 - totalSleepMins) / 6);
      msg = "あと1日" + str(remain/10/7) + "時間は眠ろう！\n健康のために！";
    }
    fill(25, 100, 100);
    rect(0, 100, 600, 200);
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 36);
    text(msg, 300, 200);
    if (MANAGER_isMousePressed && MANAGER_mouseY > 100 && MANAGER_mouseY < 300) {
      isMsg = false;
      MANAGER_isMousePressed = false;
    }
  }
  
  // グラフを描画する
  drawGraph(i, start, end, c) {
    var startHour = isotimeToHour(start);
    if (startHour < 0) return;
    startHour -= 21;
    if (startHour < 0) startHour += 24;
    var endHour = isotimeToHour(end);
    if (endHour < 0) return;
    endHour -= 21;
    if (endHour < 0) endHour += 24;
    var i2 = 7 - i + 1;
    var i3 = 600 * (2 * i2 + 1) / 18;
    drawRoundedLine(i3, 350 + (startHour * 35), i3, 350 + (endHour * 35), c);
  }
  
  //下部分のテキスト表示
  drawSleep(i, data, c) {
    fill(0);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 18);
    var _day = String.valueOf(i) + "日前";
    if (i == 0) {
      _day = "今日";
    }
    var i2 = 7 - i + 1;
    var i3 = 600 * (2 * i2 + 1) / 18;
    text(_day, i3, 950);
    if (data.get("duration").equals("0")) {
      shape(SVG_error, i3 - 25, 970, 50, 50);
    } else {
      shape(SVG_check, i3 - 25, 970, 50, 50);
    }
    fill(c);
    text(minToTime(Integer.parseInt(data.get("duration")), false), i3, 1040);
    fill(0);
    rect(600 * (2 * i2) / 18 - 1, 930, 2, 130);
  }
  
  // 端が丸い線を描画する
  drawRoundedLine(x1, y1, x2, y2, c) {
    stroke(c);
    strokeWeight(20);
    strokeCap(ROUND);
    line(x1, y1, x2, y2);
    strokeCap(SQUARE);
    noStroke();
  }
  
  // 背景を描画する
  drawBg() { // 背景の線
    fill(75);
    stroke(2);
    stroke(75);
    strokeWeight(2);
    textFont(FONT_noto, 20);
    textAlign(RIGHT, CENTER);
    for (i = 0; i < 16; i++) {
      line(70, 350 + (i * 35), 600, 350 + (i * 35));
      text(minToClock(1260 + (i * 60)), 60, 350 + (i * 35));
    }
    noStroke();
  }
  
  // 分を ~ 時に変換する
  minToClock(min) {
    if (min > 1440) min -= 1440;
    
    return str(int(min / 60)) + "時";
  }
  
  // 分を時刻表示に変換する
  minToTime(min, isJapanese) {
    if (min == 0) return "-";
    if (min > 1440) min -= 1440;
    if (isJapanese) {
      return str(int(min / 60)) + "時間" + nf(min % 60, 2) + "分";
    } else {
      return str(int(min / 60)) + "h" + nf(min % 60, 2) + "m";
    }
  }
  
  // ISO8601形式の時刻を時刻に変換する(APIレスポンスを変換する)
  isotimeToHour(date) {
    if (date.matches("")) return - 1;
    var tIndex = date.indexOf('T');
    var timePart = date.substring(tIndex + 1, tIndex + 9);
    
    var hour = int(timePart.substring(0, 2));
    var minute = int(timePart.substring(3, 5));
    var second = int(timePart.substring(6, 8));
    var hoursDecimal = hour + minute / 60.0 + second / 3600.0; // 時刻に変換
    return hoursDecimal;
  }
}

// ? シーン5(接続状態)のクラス

class SettingsScene_class {
  
  // 初期化処理
  boot() {
    addButton(300, 800, 500, 200, color(0, 75, 75), "ホームへ戻る", "cmode", "1");
  }
  
  // 更新処理
  update() {
    CPT.header("設定");
    fill(0);
    textFont(FONT_noto, 20);
    textAlign(LEFT, CENTER);
    // ボタンの描画
    text("アプリの起動時に、バスを表示する", 110, 175);
    text("→朝バスの時間ぎりぎり使う人におすすめです", 110, 225);
    if (isFirstBus) {
      shape(SVG_on, 50, 150, 50, 50);
    } else {
      shape(SVG_off, 50, 150, 50, 50);
    }
    if (MANAGER_isMousePressed && MANAGER_mouseY > 150 && MANAGER_mouseY < 200 && MANAGER_mouseX > 50 && MANAGER_mouseX < 550) {
      changeFirstBus();
      MANAGER_isMousePressed = false;
    }
    text("フレッツ光(free-wifi)を未来大モードから除外する", 110, 375);
    text("→自宅がフレッツ光の人は有効にしてください", 110, 425);
    if (isFreeWifiContain) {
      shape(SVG_on, 50, 350, 50, 50);
    } else {
      shape(SVG_off, 50, 350, 50, 50);
    }
    if (MANAGER_isMousePressed && MANAGER_mouseY > 350 && MANAGER_mouseY < 400 && MANAGER_mouseX > 50 && MANAGER_mouseX < 550) {
      changeFreeWifiContain();
      MANAGER_isMousePressed = false;
    }
    var d = "自動";
    if (busMode.equals("fromfuntokmd")) d = "未来大モード";
    if (busMode.equals("fromkmdtofun")) d = "亀田支所前モード";
    text("バスモードを切り替える　現在: " + d, 110, 575);
    text("→位置情報を無視して特定のモードに固定します", 110, 625);
    shape(SVG_change, 50, 550, 50, 50);
    if (MANAGER_isMousePressed && MANAGER_mouseY > 550 && MANAGER_mouseY < 600 && MANAGER_mouseX > 50 && MANAGER_mouseX < 550) {
      changeBusMode();
      MANAGER_isMousePressed = false;
    }
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 30);
    text("2024 © famisics (https://uiro.dev)", 300, 1000);
  }
}

// ? ボタンを管理するクラス

var LIST_Button;

class Button_class {
  isShow = true;
  x;
  y;
  w;
  h;
  label;
  id;
  type;
  bg;
  
  // ボタンのx, yはそこを中心として描画される
  constructor(x, y, w, h, bg, label, type, id) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
    this.bg = bg;
    this.type = type;
    this.id = id;
  }
  
  // ボタンの更新
  update() {
    if (isShow) {
      fill(bg);
      rect(x - w / 2, y - h / 2, w, h);
      textFont(FONT_noto, 40);
      if (w ==  500) textFont(FONT_noto, 32);
      textAlign(CENTER, CENTER);
      fill(255);
      text(label, x, y);
      // それがモード切り替えボタンである場合、押された時にモード切り替えアクションを登録する
      if (type.equals("cmode") && MANAGER_isMousePressed && (MANAGER_mouseX > x - w / 2) && (MANAGER_mouseX < x + w / 2) && (MANAGER_mouseY > y - h / 2) && (MANAGER_mouseY < y + h / 2)) {
        MANAGER_nextmotion = type + "," + id;
        MANAGER_isMousePressed = false;
      }
      // それがツイートボタンである場合、押された時にツイート画面を表示する
      if (type.equals("tweet") && MANAGER_isMousePressed && (MANAGER_mouseX > x - w / 2) && (MANAGER_mouseX < x + w / 2) && (MANAGER_mouseY > y - h / 2) && (MANAGER_mouseY < y + h / 2)) {
        link("https://x.com/intent/post?text=" + id); // ツイート画面を表示
        MANAGER_isMousePressed = false;
      }
    }
  }
}
