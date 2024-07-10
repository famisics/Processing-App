Manager Manager;
TitleScene TitleScene;
API API;

PFont fontLg;
JSONObject json;

String APIKEY_openWeatherMap;

class Manager {
  int mode = 0; // モード0で初期化
  
  void boot() {
    TitleScene = new TitleScene();
    API = new API();
    
    fontLg = createFont("Meiryo UI", 32);
    
    // config.json
    json = loadJSONObject("src/config.json");
    if (json != null) {
      APIKEY_openWeatherMap = json.getString("openWeatherMapApiKey");
    } else {
      println("config.json not found");
    }
    
    // 過去のデータ(userdata.json)
    json = loadJSONObject("src/userdata.json");
    if (json != null) {
      APIKEY_openWeatherMap = json.getString("openWeatherMapApiKey");
    } else {
      println("config.json not found");
    }
  }
  void update() {
    switch(mode) {
      case 0:
        TitleScene.update();
        break;
      case 1:
        TitleScene.update();
        break;
      case 2:
        TitleScene.update();
        break;
      case 3:
        TitleScene.update();
        break;
      case 4:
        TitleScene.update();
        break;
    }
  }
}
