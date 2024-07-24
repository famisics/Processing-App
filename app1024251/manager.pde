// ? アプリの進行を管理するコード

// 動作に必要なモジュール
API API;
Component CPT;

// シーン
TitleScene TitleScene;
HomeScene HomeScene;
WeatherScene WeatherScene;
FitScene FitScene;
FunbusScene FunbusScene;
IpinfoScene IpinfoScene;
SleepScene SleepScene;
SettingsScene SettingsScene;

int mode = 0; // モード0で初期化

// config

boolean isFirstBus = false;
boolean isFreeWifiContain = true;
String busMode = "auto";

// 素材

PFont FONT_meiryo, FONT_jetbrains, FONT_noto;
PShape SVG_home, SVG_weather, SVG_fit, SVG_funbus, SVG_sleep;
PShape SVG_check, SVG_error, SVG_on, SVG_off, SVG_change, SVG_settings;

String MANAGER_nextmotion = ""; // 次に行う動作
boolean MANAGER_isMousePressed = false;
int MANAGER_mouseX, MANAGER_mouseY;
boolean isCmode = false;
int cmodeCount, cmodeTarget = 0;
String cmodeText = "";

// 初期化処理
void boot() {
  // クラスの初期化
  API = new API();
  CPT = new Component();
  // シーンの初期化
  TitleScene = new TitleScene();
  HomeScene = new HomeScene();
  WeatherScene = new WeatherScene();
  FitScene = new FitScene();
  FunbusScene = new FunbusScene();
  IpinfoScene = new IpinfoScene();
  SleepScene = new SleepScene();
  SettingsScene = new SettingsScene();
  
  // フォントの初期化
  FONT_meiryo = createFont("Meiryo UI", 32);
  FONT_jetbrains = createFont("font/JetBrainsMono-Medium.ttf", 32);
  FONT_noto = createFont("font/NotoSansJP-Medium.ttf", 32);
  
  // モードアイコンの初期化
  SVG_home = loadShape("svg/mode/home.svg");
  SVG_weather = loadShape("svg/mode/weather.svg");
  SVG_fit = loadShape("svg/mode/fit.svg");
  SVG_funbus = loadShape("svg/mode/bus.svg");
  SVG_sleep = loadShape("svg/mode/sleep.svg");
  
  // ステータスアイコンの初期化
  SVG_check = loadShape("svg/status/check.svg");
  SVG_error = loadShape("svg/status/error.svg");
  SVG_on = loadShape("svg/status/on.svg");
  SVG_off = loadShape("svg/status/off.svg");
  SVG_change = loadShape("svg/status/change.svg");
  SVG_settings = loadShape("svg/status/settings.svg");
  
  // apikeys.json
  JSONObject json = loadJSONObject("apikeys.json");
  if (json != null) {
    API.setApikeys(json);
  } else {
    println("apikeys.json not found");
  }
  
  // endpoints.json
  json = loadJSONObject("endpoints.json");
  if (json != null) {
    API.setEndpoints(json);
  } else {
    println("endpoints.json not found");
  }
  
  // config.json
  json = loadJSONObject("config.json");
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
void update() {
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
    for (Button e : LIST_Button) {
      e.update();
    }
  }
  // つぎに行う動作がある場合、実行
  if (!MANAGER_nextmotion.equals("")) {
    String[] query = split(MANAGER_nextmotion, ","); // 動作を展開
    if (query[0].equals("cmode")) {
      cmode(Integer.parseInt(query[1])); // cmodeを実行
    }
    MANAGER_nextmotion = "";
  }
}

// シーン切り替え処理を開始する
void cmode(int i) {
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
void cmodeAction(int i) {
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
void addButton(float x, float y, float w, float h, color bg, String label, String type, String id) {
  LIST_Button.add(new Button(x, y, w, h, bg, label, type, id));
}

// バスをデフォルトの表示にするかどうかを変更
void changeFirstBus() {
  isFirstBus = !isFirstBus;
  JSONObject json = new JSONObject();
  json.setInt("is_first_bus", isFirstBus ? 1 : 0);
  json.setInt("is_free_wifi_contain", isFreeWifiContain ? 1 : 0);
  json.setString("bus_mode", busMode);
  saveJSONObject(json, "data/config.json");
  println("[json] 設定が保存されました isFirstBus: " + isFirstBus);
}

// フレッツ光を含むかどうかの設定を変更
void changeFreeWifiContain() {
  isFreeWifiContain = !isFreeWifiContain;
  JSONObject json = new JSONObject();
  json.setInt("is_first_bus", isFirstBus ? 1 : 0);
  json.setInt("is_free_wifi_contain", isFreeWifiContain ? 1 : 0);
  json.setString("bus_mode", busMode);
  saveJSONObject(json, "data/config.json");
  println("[json] 設定が保存されました isFreeWifiContain: " + isFreeWifiContain);
}

// バスモードを変更
void changeBusMode() {
  if (busMode.equals("fromkmdtofun")) {
    busMode = "fromfuntokmd";
  } else if (busMode.equals("fromfuntokmd")) {
    busMode = "auto";
  } else {
    busMode = "fromkmdtofun";
  }
  JSONObject json = new JSONObject();
  json.setInt("is_first_bus", isFirstBus ? 1 : 0);
  json.setInt("is_free_wifi_contain", isFreeWifiContain ? 1 : 0);
  json.setString("bus_mode", busMode);
  saveJSONObject(json, "data/config.json");
  println("[json] 設定が保存されました busMode: " + busMode);
}

// マウスが押された場合に、そのことと座標を記録する(それぞれのボタンを描画している場所で、条件にあたるかどうかを判定する(ここでは判定しない))
void mousePressed() {
  MANAGER_isMousePressed = true;
  MANAGER_mouseX = mouseX;
  MANAGER_mouseY = mouseY;
}
