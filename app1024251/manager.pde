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

int mode = 0; // モード0で初期化

// 素材

PFont FONT_meiryo, FONT_jetbrains, FONT_noto;
PShape SVG_home, SVG_weather, SVG_fit, SVG_funbus, SVG_ipinfo, SVG_sleep;
PShape SVG_01d, SVG_02d, SVG_03d, SVG_04d, SVG_09d, SVG_10d, SVG_11d, SVG_13d, SVG_50d;

// API
String APIKEY_openWeatherMap;
String APIKEY_ipinfo;

String MANAGER_nextmotion = ""; // 次に行う動作
boolean MANAGER_isMousePressed = false;
int MANAGER_mouseX, MANAGER_mouseY;

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
  
  // フォントの初期化
  FONT_meiryo = createFont("Meiryo UI", 32);
  FONT_jetbrains = createFont("font/JetBrainsMono-Medium.ttf", 32);
  FONT_noto = createFont("font/NotoSansJP-Medium.ttf", 32);

  // アイコンの初期化
  SVG_home = loadShape("svg/mode/home.svg");
  SVG_weather = loadShape("svg/mode/weather.svg");
  SVG_fit = loadShape("svg/mode/fit.svg");
  SVG_funbus = loadShape("svg/mode/bus.svg");
  SVG_ipinfo = loadShape("svg/mode/dns.svg");
  SVG_sleep = loadShape("svg/mode/sleep.svg");

  // 天気アイコンの初期化
  SVG_01d = loadShape("svg/weather/01d.svg");
  SVG_02d = loadShape("svg/weather/02d.svg");
  SVG_03d = loadShape("svg/weather/03d.svg");
  SVG_04d = loadShape("svg/weather/04d.svg");
  SVG_09d = loadShape("svg/weather/09d.svg");
  SVG_10d = loadShape("svg/weather/10d.svg");
  SVG_11d = loadShape("svg/weather/11d.svg");
  SVG_13d = loadShape("svg/weather/13d.svg");
  SVG_50d = loadShape("svg/weather/50d.svg");
  
  // config.json
  JSONObject json = loadJSONObject("config.json");
  if (json != null) {
    APIKEY_openWeatherMap = json.getString("openWeatherMapApiKey");
    APIKEY_ipinfo = json.getString("ipinfoApiKey");
  } else {
    println("config.json not found");
  }
  
  // 過去のデータ(userdata.json)
  json = loadJSONObject("userdata.json");
  if (json != null) {
    // TODO:something
  } else {
    println("userdata.json not found");
  }
  
  // アプリの起動
  cmode(0);
}
void update() {
  background(0);
  if (!(mode == 0)) {
    CPT.footer();
  }
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
  }
  for (Button e : LIST_Button) {
    e.update();
  }
  if (!MANAGER_nextmotion.equals("")) {
    String[] query = split(MANAGER_nextmotion, ",");
    if (query[0].equals("cmode")) {
      cmode(Integer.parseInt(query[1]));
    }
    MANAGER_nextmotion = "";
  }
}
void cmode(int i) {
  LIST_Button.clear();
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
  }
  mode = i;
}
void addButton(float x, float y, float w, float h, color bg, String label, String type, String id) {
  LIST_Button.add(new Button(x, y, w, h, bg, label, type, id));
}

// デバッグ用

void keyPressed() {
  if (key == '0') {
    cmode(0);
  } else if (key == '1') {
    cmode(1);
  } else if (key == '2') {
    cmode(2);
  } else if (key == '3') {
    cmode(3);
  } else if (key == '4') {
    cmode(4);
  } else if (key == '5') {
    cmode(5);
  } else if (key == '6') {
    cmode(6);
  }
}

void mousePressed() {
  MANAGER_isMousePressed = true;
  MANAGER_mouseX = mouseX;
  MANAGER_mouseY = mouseY;
}
