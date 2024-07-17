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

int mode = 0; // モード0で初期化

// 素材

PFont FONT_meiryo, FONT_jetbrains, FONT_noto;
PShape SVG_home, SVG_weather, SVG_fit, SVG_funbus, SVG_ipinfo;

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
  
  // フォントの初期化
  FONT_meiryo = createFont("Meiryo UI", 32);
  FONT_jetbrains = createFont("src/font/JetBrainsMono-Medium.ttf", 32);
  FONT_noto = createFont("src/font/NotoSansJP-Medium.ttf", 32);

  // アイコンの初期化
  SVG_home = loadShape("src/svg/home.svg");
  SVG_weather = loadShape("src/svg/weather.svg");
  SVG_fit = loadShape("src/svg/fit.svg");
  SVG_funbus = loadShape("src/svg/bus.svg");
  SVG_ipinfo = loadShape("src/svg/dns.svg");
  
  // config.json
  JSONObject json = loadJSONObject("src/config.json");
  if (json != null) {
    APIKEY_openWeatherMap = json.getString("openWeatherMapApiKey");
    APIKEY_ipinfo = json.getString("ipinfoApiKey");
  } else {
    println("config.json not found");
  }
  
  // 過去のデータ(userdata.json)
  json = loadJSONObject("src/userdata.json");
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
  }
  mode = i;
}
void addButton(int x, int y, int w, int h, color bg, String label, String type, String id) {
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
  }
}

void mousePressed() {
  MANAGER_isMousePressed = true;
  MANAGER_mouseX = mouseX;
  MANAGER_mouseY = mouseY;
}
