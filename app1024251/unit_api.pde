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
  
  HashMap<String, String> getFunbus(String query) { // Google Spreadsheet から時刻表を取得
    //  !返す内容-------------------------------------
    //  次のバスの(ID、出発時刻、到着時刻、系統、＠＠行き(算出する))
    //  さらに次のバスまでの時間(BLANKの場合終バスとする)
    //  !--------------------------------------------
    int timediff = millis() - CASHTIME_funbus;
    if ((funbus.size() > 0) && (timediff < timeout)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      println("[API] getFunbus: returning CASHED_DATA... done with " + funbus.size() + " items at " + getTime() + ", キャッシュ期限: " + (timeout - timediff) / 1000 + "秒");
      return funbus;
    }
    print("[API] getFunbus: FETCHING... ");
    JSONArray JSON_response = loadJSONArray("https://script.google.com/macros/s/AKfycbxiZdc5U1ZC6rH3l1NnK89j9EIgf8M4VW48nU34dXAYfVpv3Z7QMv_nz9TcQRpMOmGmcg/exec?query=" + query);
    
    int thisId; // バスのID
    
    for (int i = 0; i < JSON_response.size(); i++) { // 次に出発するバスを探索
      JSONObject JSON_item = JSON_response.getJSONObject(i);
      String start = JSON_item.getString("start");
      if (Integer.parseInt(start.substring(0, 2)) >= hour() && Integer.parseInt(start.substring(3, 5)) >= minute()) { // 時間または分のどちらかが現在時刻よりも小さくなるまでの最後のバスを返す
        thisId = i; // このバスが次に出発するバス
      } else {
        break; // これ以降のバスは出発時刻が現在時刻よりも前なので、探索を打ち切る
      }
    }
    
    // 次に出発するバスの情報
    funbus.put("this_code", JSON_response.getJSONObject(thisId).getString("code")); // 系統
    funbus.put("this_start", JSON_response.getJSONObject(thisId).getString("start")); // 出発時刻
    funbus.put("this_end", JSON_response.getJSONObject(thisId).getString("end")); // 到着時刻
    funbus.put("this_destination", busDestination(JSON_response.getJSONObject(thisId).getString("code"))); // 行き先
    funbus.put("this_untilnext", JSON_response.getJSONObject(thisId).getString("until_next")); // 次のバスまでの時間
    
    if (!(JSON_response.getJSONObject(thisId).getString("until_next").equals("0"))) { // 最終バスのとき、APIは0を返すため、そうでない場合「さらに次のバス」を取得する
      funbus.put("next_code", JSON_response.getJSONObject(thisId + 1).getString("code"));
      funbus.put("next_start", JSON_response.getJSONObject(thisId + 1).getString("start"));
      funbus.put("next_end", JSON_response.getJSONObject(thisId + 1).getString("end"));
      funbus.put("next_destination", busDestination(JSON_response.getJSONObject(thisId + 1).getString("code")));
    } else { // 次のバスが最終バスのとき、終バスの表記を返す
      funbus.put("next_code", "終バス");
      funbus.put("next_start", "");
      funbus.put("next_end", "");
      funbus.put("next_destination", "");
      
    }
    
    CASHTIME_funbus = millis();
    println("done with " + funbus.size() + " items at " + getTime());
    
    return funbus; // ? 返す内容 this_{系統, 出発時刻, 到着時刻, 行き先(算出する), 次のバスまで(APIから取得)} next_{系統, 出発時刻, 到着時刻, 行き先(算出する)}
  }
  String busDestination(String code, String query) { // 行き先を算出
    if (query.equals("fromkmdtofun")) {
      return "赤川";
    }
    String result;
    switch() {
      case "55A" :
        result = "例外";
        break;
      case "55B" :
        result = "例外";
        break;
      case "55F" :
        result = "例外";
        break;
      case "55G" :
        result = "例外";
        break;
      case "55H" :
        result = "例外";
        break;
      default :
      result = "<不明>";
      break;	
    }
    return result;
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
