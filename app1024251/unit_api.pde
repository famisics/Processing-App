class API {
  int CASHTIME_weather, CASHTIME_funbus, CASHTIME_fitbit, CASHTIME_ipinfo = 0;
  HashMap<String, String> weather = new HashMap<String, String>();
  HashMap<String, String> funbus = new HashMap<String, String>();
  HashMap<String, String> fitbit = new HashMap<String, String>();
  HashMap<String, String> ipinfo = new HashMap<String, String>();
  void getWeather() { // Open Weather Map から天気情報を取得
    if (weather.size() > 0) {
      println("[API] getWeather: return cashed data... done with " + weather.size() + " items");
      // return weather; // 既に取得済みの場合は再取得しない
    }
    JSONObject JSON_response = loadJSONObject("https://api.openweathermap.org/data/2.5/forecast?id=2130188&lang=ja&appid=" + APIKEY_openweathermap);
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
    //  !返す内容-------------------------------------
    //  現在の天気
    //  !--------------------------------------------
  }
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
  HashMap<String, String> getFitbit() { // Fitbit APIから運動データを取得
    int timediff = millis() - CASHTIME_fitbit;
    if ((fitbit.size() > 0) && (timediff < 60000)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する、キャッシュは1分間有効)
      println("[API] getFitbit: returning CASHED_DATA... done with " + fitbit.size() + " items at " + getTime());
      return fitbit;
    }
    print("[API] getFitbit: fetching... ");
    JSONArray JSON_response = loadJSONArray("https://script.google.com/macros/s/AKfycbyZRiRYwY4UgfxXFZMPgo8pkGdMFj13NRoBSxOSt8IKNzzeGTOM_asz2qGPNbG5LpQt/exec");
    for (int i = 0; i < JSON_response.size(); i++) {
      JSONObject data = JSON_response.getJSONObject(i);
      fitbit.put(str(7-i), data.getString("steps"));
    }
    CASHTIME_fitbit = millis();
    println("done with " + fitbit.size() + " items at " + getTime());
    return fitbit; // ? 返す内容 現在の天気{天気、気温}、予報天気{3,6,9,12,15時間後}、プロバイダ
  }
  HashMap<String, String> getIpinfo() { // ipinfoを用いて、ipアドレスから接続先のプロバイダを取得(未来大からアクセスしているか、それ以外からアクセスしているかを特定できる)
    int timediff = millis() - CASHTIME_ipinfo;
    if ((ipinfo.size() > 0) && (timediff < 60000)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する、キャッシュは1分間有効)
      println("[API] getIpinfo: returning CASHED_DATA... done with " + ipinfo.size() + " items at " + getTime());
      return ipinfo;
    }
    print("[API] getIpinfo: fetching... ");
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
    return hour() + ":" + minute() + ":" + second();
  }
}
