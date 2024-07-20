class API {
  // TODO:API読込中の画面を作る
  // キャッシュタイムアウト時間(2分)
  int timeout = 120000;
  // それぞれのキャッシュの起点となる時間を記憶する変数
  int CASHTIME_weatherNow, CASHTIME_weatherForecast, CASHTIME_funbus, CASHTIME_fitbit, CASHTIME_ipinfo = 0;
  // APIレスポンスをキャッシュしておくHashMap
  HashMap<String, String> weatherNow = new HashMap<String, String>();
  HashMap<String, String> weatherForecast = new HashMap<String, String>();
  HashMap<String, String> funbus = new HashMap<String, String>();
  HashMap<Integer, Integer> fitbit = new HashMap<Integer, Integer>();
  HashMap<String, String> ipinfo = new HashMap<String, String>();
  
  HashMap<String, String> getWeatherNow() { // Open Weather Map から天気情報を取得
    int timediff = millis() - CASHTIME_weatherNow;
    if ((weatherNow.size() > 0) && (timediff < timeout)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      println("[API] getWeatherNow: CASH... done with " + weatherNow.size() + " items at " + getTime() + ", 都市: " + weatherNow.get("city") + ", キャッシュ期限: " + (timeout - timediff) / 1000 + "秒");
      return weatherNow;
    }
    print("[API] getWeatherNow: FETCHING... ");
    JSONObject JSON_response = loadJSONObject("https://api.openweathermap.org/data/2.5/weather?id=2130188&lang=ja&appid=" + APIKEY_openweathermap);
    
    JSONArray JSON_weather = JSON_response.getJSONArray("weather");
    weatherNow.put("weather", JSON_weather.getJSONObject(0).getString("description")); // 天気
    
    JSONObject JSON_main = JSON_response.getJSONObject("main");
    weatherNow.put("temp", String.valueOf(Math.round(10.0 * (JSON_main.getFloat("temp") - 273.15)) / 10.0)); // 気温(四捨五入小数点以下1桁)
    weatherNow.put("pressure", String.valueOf(Math.round(JSON_main.getFloat("pressure")))); // 気圧(四捨五入)
    
    JSONObject JSON_wind = JSON_response.getJSONObject("wind");
    weatherNow.put("wind", String.valueOf(JSON_wind.getFloat("speed"))); // 風速
    
    weatherNow.put("city", JSON_response.getString("name")); // 都市名
    
    CASHTIME_weatherNow = millis();
    println("done with " + weatherNow.size() + " items at " + getTime() + ", 都市: " + weatherNow.get("city"));
    
    return weatherNow; // ? 返す内容 現在の天気{天気、気温、気圧、風速}
  }
  
  void getWeatherForecast() { // Open Weather Map から天気情報を取得
    int timediff = millis() - CASHTIME_weatherForecast;
    if ((weatherForecast.size() > 0) && (timediff < timeout)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      println("[API] getWeatherForecast: CASH... done with " + weatherForecast.size() + " items at " + getTime() + ", キャッシュ期限: " + (timeout - timediff) / 1000 + "秒");
      // return weatherForecast;
    }
    JSONObject JSON_response = loadJSONObject("https://api.openweathermap.org/data/2.5/forecast?id=2130188&lang=ja&appid=" + APIKEY_openweathermap);
    JSONArray JSON_array = JSON_response.getJSONArray("list");
    print("[API] getWeatherForecast: FETCHING... ");
    // for (int i = 0; i < JSON_array.size(); i++) {
    //   JSONObject JSON_item = JSON_array.getJSONObject(i);
    //   String date = JSON_item.getString("dt_txt");
    //   JSONObject JSON_main = JSON_item.getJSONObject("main");
    //   float temp = Math.round(10.0 * (JSON_main.getFloat("temp") - 273.15)) / 10.0;
    //   JSONObject JSON_weather = JSON_item.getJSONArray("weather").getJSONObject(0);
    //   String weather = JSON_weather.getString("description");
    //   println(date + " 天気:" + weather + " 気温:" + temp);
  }
  // ? 返す内容 現在の天気{天気、気温}、予報天気{3,6,9,12,15時間後の天気、気温}
  
  void getFunbus(String query) { // Google Spreadsheet から時刻表を取得
    JSONArray JSON_response = loadJSONArray("https://script.google.com/macros/s/AKfycbwkkpTBgcCNkB4b4CXHOAGrlfRX93_-xu5dNFiPcbUBupgirZLlKr3deSvVFsEIQZaF3A/exec?query=" + query);
    for (int i = 0; i < JSON_response.size(); i++) {
      JSONObject JSON_item = JSON_response.getJSONObject(i);
      String id = JSON_item.getString("id");
      String code = JSON_item.getString("code");
      String start = JSON_item.getString("start");
      String end = JSON_item.getString("end");
      println(id + " [" + code + "] " + start + " -> " + end);
    }
    // return JSON_response;
    //  !返す内容-------------------------------------
    //  次のバスの(ID、出発時刻、到着時刻、系統、＠＠行き(算出する))
    //  さらに次のバスまでの時間(BLANKの場合終バスとする)
    //  !--------------------------------------------
  }
  
  HashMap<Integer, Integer> getFitbit() { // Fitbit APIから運動データを取得
    int timediff = millis() - CASHTIME_fitbit;
    if ((fitbit.size() > 0) && (timediff < timeout)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      println("[API] getFitbit: returning CASHED_DATA... done with " + fitbit.size() + " items at " + getTime() + ", キャッシュ期限: " + (timeout - timediff) / 1000 + "秒");
      return fitbit;
    }
    print("[API] getFitbit: FETCHING... ");
    JSONArray JSON_response = loadJSONArray("https://script.google.com/macros/s/AKfycbwmGXmFjdVWGIXNF4x9wzYjA45KbolpM8tL-HKSzi2R9PRV4eESEF7k5pBl8fonICt9/exec");
    for (int i = 0; i < JSON_response.size(); i++) {
      JSONObject data = JSON_response.getJSONObject(i);
      fitbit.put((7 - i), int(data.getString("steps")));
    }
    CASHTIME_fitbit = millis();
    println("done with " + fitbit.size() + " items at " + getTime());
    
    return fitbit; // ? 返す内容 7,6,5,4,3,2,1日前の歩数{日, 歩数}
  }
  
  HashMap<String, String> getIpinfo() { // ipinfoを用いて、ipアドレスから接続先のプロバイダを取得(未来大からアクセスしているか、それ以外からアクセスしているかを特定できる)
    int timediff = millis() - CASHTIME_ipinfo;
    if ((ipinfo.size() > 0) && (timediff < timeout)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      println("[API] getIpinfo: returning CASHED_DATA... done with " + ipinfo.size() + " items at " + getTime() + ", キャッシュ期限: " + (timeout - timediff) / 1000 + "秒");
      return ipinfo;
    }
    print("[API] getIpinfo: FETCHING... ");
    JSONObject JSON_response = loadJSONObject("https://ipinfo.io/?token=" + APIKEY_ipinfo);
    ipinfo.put("ip", JSON_response.getString("ip"));
    ipinfo.put("region", JSON_response.getString("city") + ", " + JSON_response.getString("region") + ", " + JSON_response.getString("country")); // 天気の取得にこのデータを使えそうだけど、VPN使ってたりするとずれるのでやめておく
    ipinfo.put("loc", JSON_response.getString("loc"));
    ipinfo.put("org", JSON_response.getString("org"));
    CASHTIME_ipinfo = millis();
    println("done with " + ipinfo.size() + " items at " + getTime());
    
    return ipinfo; // ? 返す内容 IPアドレス、プロバイダ、地域、座標
  }
  String getTime() {
    return nf(hour(), 2) + ":" + nf(minute(), 2) + ":" + nf(second(), 2);
  }
}
