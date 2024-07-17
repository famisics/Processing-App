// マネージャー
Manager Manager;
// 動作に必要なモジュール
API API;
TitleScene TitleScene;
HomeScene HomeScene;
WeatherScene WeatherScene;
FitScene FitScene;
FunbusScene FunbusScene;
IpinfoScene IpinfoScene;

PFont FONT_meiryo, FONT_jetbrains;

String APIKEY_openWeatherMap;
String APIKEY_ipinfo;

class Manager {
  int mode = 0; // モード0で初期化
  
  void boot() {
    // クラスの初期化
    API = new API();
    TitleScene = new TitleScene();
    HomeScene = new HomeScene();
    WeatherScene = new WeatherScene();
    FitScene = new FitScene();
    FunbusScene = new FunbusScene();
    IpinfoScene = new IpinfoScene();
    
    // フォントの初期化
    FONT_meiryo = createFont("Meiryo UI", 32);
    FONT_jetbrains = createFont("src/data/JetBrainsMono-VariableFont_wght.ttf", 32);
    
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
  }
  void cmode(int i) {
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
}
