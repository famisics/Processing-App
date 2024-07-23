// ? シーン2(天気)のクラス

class WeatherScene {
  HashMap<String, String> weatherNow = new HashMap<String, String>();
  HashMap<Integer, HashMap<String, String>> weatherForecast = new HashMap<Integer, HashMap<String, String>>();
  String NOW_weather, NOW_temp, NOW_pressure, NOW_wind = "";
  PShape SVG_now, SVG_forecast3, SVG_forecast6, SVG_forecast9, SVG_forecast12, SVG_forecast15 = null;
  PImage bg;
  
  // 初期化処理
  void boot() {
    // APIからデータを取得
    this.weatherNow = API.getWeatherNow();
    this.weatherForecast = API.getWeatherForecast();
    nowIcon(weatherNow.get("icon"));
    nowBg(weatherNow.get("icon"));
    forecastIcon(weatherForecast.get(3).get("icon"), weatherForecast.get(6).get("icon"), weatherForecast.get(9).get("icon"), weatherForecast.get(12).get("icon"), weatherForecast.get(15).get("icon"));
  }
  
  // 更新処理
  void update() {
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
    for (int i = 3; i <= 15; i += 3) {
      drawWeather(i, weatherForecast.get(i).get("weather"), weatherForecast.get(i).get("temp"));
    }
  }
  
  // 現在の天気のアイコンを取得
  void nowIcon(String name) {
    bg = loadImage("img/weather/" + name + ".jpg");
  }
  
  // 現在の天気のアイコンに合わせた背景画像を取得
  void nowBg(String name) {
    SVG_now = loadShape("svg/weather/" + name + ".svg");
  }
  
  // 予報の天気のアイコンを取得
  void forecastIcon(String name3, String name6, String name9, String name12, String name15) {
    SVG_forecast3 = loadShape("svg/weather/" + name3 + ".svg");
    SVG_forecast6 = loadShape("svg/weather/" + name6 + ".svg");
    SVG_forecast9 = loadShape("svg/weather/" + name9 + ".svg");
    SVG_forecast12 = loadShape("svg/weather/" + name12 + ".svg");
    SVG_forecast15 = loadShape("svg/weather/" + name15 + ".svg");
  }
  
  // 予報の天気を描画
  void drawWeather(int i, String weather, String temp) {
    fill(0);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 24);
    int i2 = 600 * (2 * (i / 3 - 1) + 1) / 10;
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
