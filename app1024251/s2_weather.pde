class WeatherScene {
  HashMap<String, String> weatherNow = new HashMap<String, String>();
  String NOW_weather, NOW_temp, NOW_pressure, NOW_wind = "";
  void boot() {
    this.weatherNow = API.getWeatherNow();
    this.NOW_weather = weatherNow.get("weather");
    this.NOW_temp = weatherNow.get("temp");
    this.NOW_pressure = weatherNow.get("pressure");
    this.NOW_wind = weatherNow.get("wind");
  }
  void update() {
    CPT.header("天気");
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 96);
    text(NOW_weather, 300, 200);
    shape(SVG_11d, 50, 160, 500, 500);
    text(NOW_temp + "℃", 300, 650);
    for (int i = 0; i < 5; i++) {
      drawWeather(i);
    }
  }
  void drawWeather(int i) {
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 24);
    text(str((i + 1) * 3) + "時間後", 600 * (2 * i + 1) / 10, 830);
    text("雷雨", 600 * (2 * i + 1) / 10, 900);
    shape(SVG_11d, 600 * (2 * i + 1) / 10 - 50, 910, 100, 100);
    text("22.3℃", 600 * (2 * i + 1) / 10, 1040);
    if (i < 4) {
      fill(255);
      rect(600 * (2 * i + 2) / 10 - 1, 800, 2, 280);
    }
  }
}
