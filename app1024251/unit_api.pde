class API {
  void getWeather() { // Open Weather Map から天気情報を取得
    println("Fetching weather data...");
    JSONObject JSON_response = loadJSONObject("https://api.openweathermap.org/data/2.5/forecast?id=2130188&lang=ja&appid=" + APIKEY_openWeatherMap);
    JSONArray JSON_array = JSON_response.getJSONArray("list");
    println("Fetching weather data: Success");
    for (int i = 0; i < JSON_array.size(); i++) {
      JSONObject JSON_item = JSON_array.getJSONObject(i);
      String date = JSON_item.getString("dt_txt");
      JSONObject JSON_main = JSON_item.getJSONObject("main");
      float temp = Math.round(10.0 * (JSON_main.getFloat("temp") - 273.15)) / 10.0;
      JSONObject JSON_weather = JSON_item.getJSONArray("weather").getJSONObject(0);
      String weather = JSON_weather.getString("description");
      println(date + " 天気:" + weather + " 気温:" + temp);
    }
    // TODO: 配列に収めて返す
    // return JSON_response;
  }
  void getFunbus(String query) { // Google Spreadsheet から時刻表を取得
    JSONArray JSON_response = loadJSONArray("https://script.google.com/macros/s/AKfycbzPPgVR4BJUqDBR8y_rjYMIGvnoHTwA6yCPkHiTZkQ1Ificv62GSwsUYM2dBcNujpqVag/exec/" + query);
    println(JSON_response);
    for(int i = 0; i < JSON_response.size(); i++) {
      JSONObject JSON_item = JSON_response.getJSONObject(i);
      String id = JSON_item.getString("id");
      String code = JSON_item.getString("code");
      String start = JSON_item.getString("start");
      String end = JSON_item.getString("end");
      println(id + " [" + code + "] " + start + " -> " + end);
    }
    // return JSON_response;
  }
  void getFitbit() { // Fitbit APIから運動データを取得
    
  }
  void getIP() { // IPアドレスから接続先のプロバイダを取得

  }
}
