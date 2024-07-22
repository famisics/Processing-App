// ? 各種APIの{管理、呼び出し、キャッシュ}、エンドポイント、APIキーの管理を行うクラス

class API {
  // キャッシュの有効期限(ミリ秒)
  int timeout = 120000; // 2分
  // それぞれのキャッシュの起点となる時間を記憶する変数
  int CASHTIME_weatherNow, CASHTIME_weatherForecast, CASHTIME_funbus, CASHTIME_fitbit, CASHTIME_fitbitSleep, CASHTIME_ipinfo = 0;
  // APIレスポンスをキャッシュしておくHashMap
  HashMap<String, String> weatherNow = new HashMap<String, String>();
  HashMap<Integer, HashMap<String, String>> weatherForecast = new HashMap<Integer, HashMap<String, String>>();
  HashMap<String, String> funbus = new HashMap<String, String>();
  HashMap<Integer, Integer> fitbit = new HashMap<Integer, Integer>();
  HashMap<Integer, HashMap<String, String>> fitbit_sleep = new HashMap<Integer, HashMap<String, String>>();
  HashMap<String, String> ipinfo = new HashMap<String, String>();
  
  HashMap<String, String> apikeys = new HashMap<String, String>(); // API キーリスト
  HashMap<String, String> endpoints = new HashMap<String, String>(); // API エンドポイントリスト
  
  HashMap<String, String> getWeatherNow() { // Open Weather Map から天気情報を取得
    int timediff = millis() - CASHTIME_weatherNow;
    if ((weatherNow.size() > 0) && (timediff < timeout)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      println("[API] getWeatherNow: CASH... done with " + weatherNow.size() + " items at " + getTime() + ", 都市: " + weatherNow.get("city") + ", キャッシュ期限: " + (timeout - timediff) / 1000 + "秒");
      return weatherNow;
    }
    print("[API] getWeatherNow: FETCHING... ");
    JSONObject JSON_response = loadJSONObject(endpoints.get("openweathermap_weather") + apikeys.get("openweathermap"));
    
    weatherNow.put("weather", JSON_response.getJSONArray("weather").getJSONObject(0).getString("description")); // 天気
    weatherNow.put("icon", JSON_response.getJSONArray("weather").getJSONObject(0).getString("icon").substring(0, 2) + "d"); // 天気アイコン
    weatherNow.put("temp", String.valueOf(Math.round(10.0 * (JSON_response.getJSONObject("main").getFloat("temp") - 273.15)) / 10.0)); // 気温(四捨五入小数点以下1桁)
    weatherNow.put("pressure", String.valueOf(Math.round(JSON_response.getJSONObject("main").getFloat("pressure")))); // 気圧(四捨五入)
    weatherNow.put("city", JSON_response.getString("name")); // 都市名
    
    CASHTIME_weatherNow = millis();
    println("done with " + weatherNow.size() + " items at " + getTime() + ", 都市: " + weatherNow.get("city"));
    
    return weatherNow; // * 返す内容 現在の天気{天気、気温、気圧}
  }
  
  HashMap<Integer, HashMap<String, String>> getWeatherForecast() { // Open Weather Map から天気情報を取得
    int timediff = millis() - CASHTIME_weatherForecast;
    if ((weatherForecast.size() > 0) && (timediff < timeout)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      println("[API] getWeatherForecast: CASH... done with " + weatherForecast.size() + " items at " + getTime() + ", キャッシュ期限: " + (timeout - timediff) / 1000 + "秒");
      return weatherForecast;
    }
    JSONArray JSON_response = loadJSONObject(endpoints.get("openweathermap_forecast") + apikeys.get("openweathermap")).getJSONArray("list");
    print("[API] getWeatherForecast: FETCHING... ");
    
    for (int i = 0; i < JSON_response.size(); i++) { // データを加工して HashMap に格納
      JSONObject forecast = JSON_response.getJSONObject(i);
      int hour = i * 3 + 3; // 3, 6, 9, 12, 15 時間後
      
      if (hour >= 18) break; // 15時間後の天気まで取得する
      
      HashMap<String, String> forecastData = new HashMap<>(); // 一時データ
      forecastData.put("weather", forecast.getJSONArray("weather").getJSONObject(0).getString("description"));
      forecastData.put("temp", String.valueOf(Math.round(10.0 * (forecast.getJSONObject("main").getFloat("temp") - 273.15)) / 10.0));
      forecastData.put("icon", forecast.getJSONArray("weather").getJSONObject(0).getString("icon").substring(0, 2) + "d");
      forecastData.put("pressure", String.valueOf(Math.round(forecast.getJSONObject("main").getFloat("pressure"))));
      
      weatherForecast.put(hour, forecastData);
    }
    
    CASHTIME_weatherForecast = millis(); // キャッシュ時間を更新
    println("done with " + weatherForecast.size() + " items at " + getTime());
    return weatherForecast;
    //? 返す内容 予報天気{3,6,9,12,15時間後の天気、気温、気圧}
  }
  HashMap<String, String> getFunbus(String query) { // Google Spreadsheet から時刻表を取得
    //!バスのAPIは、最新のデータをすぐに取得する必要があるため、キャッシュを使わないことにした
    //int timediff = millis() - CASHTIME_funbus;
    //if ((funbus.size() > 0) && (timediff < timeout)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
    //println("[API] getFunbus: returning CASHED_DATA... done with " + funbus.size() + " items at " + getTime() + ", キャッシュ期限: " + (timeout - timediff) / 1000 + "秒");
    //return funbus;
    // }
    print("[API] getFunbus: FETCHING... ");
    JSONArray JSON_response = loadJSONArray(endpoints.get("gas_funbus") + query);
    
    int thisId = 0; // バスのID
    
    for (int i = 0; i < JSON_response.size(); i++) { // 次に出発するバスを探索
      thisId = i;
      JSONObject JSON_item = JSON_response.getJSONObject(i);
      String start = JSON_item.getString("start");
      if (start.equals("null")) {
        println("[API] getFunbus: クエリが不正です、データを取得できませんでした");
        break;
      }
      
      //このループのバスが次のバスであれば、ループを抜ける 
      int startHour = Integer.parseInt(start.substring(0, 2));
      int startMinute = Integer.parseInt(start.substring(3, 5));
      int startTime = startHour * 60 + startMinute;
      int currentTime = hour() * 60 + minute();
      if (startTime > currentTime) break;
      
      if (thisId >= JSON_response.size() - 1) { // 終バス後の処理
        funbus.put("this_code", "終バス済");
        funbus.put("this_start", "");
        funbus.put("this_end", "");
        funbus.put("this_destination", "");
        funbus.put("this_untilnext", "0");
        funbus.put("next_code", "");
        funbus.put("next_start", "");
        funbus.put("next_end", "");
        funbus.put("next_destination", "");
        println("done with " + funbus.size() + " items at " + getTime());
        return funbus;
      }
    }
    
    //次に出発するバスの情報
    funbus.put("this_code", JSON_response.getJSONObject(thisId).getString("code")); // 系統
    funbus.put("this_start", JSON_response.getJSONObject(thisId).getString("start")); // 出発時刻
    funbus.put("this_end", JSON_response.getJSONObject(thisId).getString("end")); // 到着時刻
    funbus.put("this_destination", busDestination(JSON_response.getJSONObject(thisId).getString("code"), query)); // 行き先
    funbus.put("this_untilnext", JSON_response.getJSONObject(thisId).getString("until_next")); // 次のバスまでの時間
    
    if (!(JSON_response.getJSONObject(thisId).getString("until_next").equals("last"))) { // 最終バスのとき、APIは0を返すため、そうでない場合「さらに次のバス」を取得する
      funbus.put("next_code", JSON_response.getJSONObject(thisId + 1).getString("code"));
      funbus.put("next_start", JSON_response.getJSONObject(thisId + 1).getString("start"));
      funbus.put("next_end", JSON_response.getJSONObject(thisId + 1).getString("end"));
      funbus.put("next_destination", busDestination(JSON_response.getJSONObject(thisId + 1).getString("code"), query));
    } else { // 次のバスが最終バスのとき、終バスの表記を返す
      funbus.put("next_code", "終バス");
      funbus.put("next_start", "00:00");
      funbus.put("next_end", "00:00");
      funbus.put("next_destination", "未知");
    }
    
    CASHTIME_funbus = millis();
    println("done with " + funbus.size() + " items at " + getTime());
    return funbus; // * 返す内容 this_{系統, 出発時刻, 到着時刻, 行き先(算出する), 次のバスまで(APIから取得)} next_{系統, 出発時刻, 到着時刻, 行き先(算出する)}
  }
  String busDestination(String code, String query) { // 行き先を算出
    
    if (query.equals("fromkmdtofun")) return "赤川";
    
    String result;
    switch(code) {
      case"55A" :
      result = "函館駅前";
      break;
      case"55B" :
      result = "函館駅前";
      break;
      case"55F" :
      result = "千代台";
      break;
      case"55G" :
      result = "昭和ターミナル";
      break;
      case"55H" :
      result = "亀田支所前";
      break;
      default :
      result = "<不明>";
      break;
    }
    return result;
  }
  
  HashMap<Integer, Integer> getFitbitSteps() { // Fitbit APIから歩数データを取得
    int timediff = millis() - CASHTIME_fitbit;
    if ((fitbit.size() > 0) && (timediff < timeout)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      println("[API] getFitbitSteps: returning CASHED_DATA... done with " + fitbit.size() + " items at " + getTime() + ", キャッシュ期限: " + (timeout - timediff) / 1000 + "秒");
      return fitbit;
    }
    print("[API] getFitbitSteps: FETCHING... ");
    JSONArray JSON_response = loadJSONArray(endpoints.get("gas_steps"));
    for (int i = 0; i < JSON_response.size(); i++) {
      JSONObject data = JSON_response.getJSONObject(i);
      fitbit.put((7 - i), int(data.getString("steps")));
    }
    CASHTIME_fitbit = millis();
    println("done with " + fitbit.size() + " items at " + getTime());
    
    return fitbit; // * 返す内容 7,6,5,4,3,2,1日前の歩数{日, 歩数}
  }
  
  HashMap<Integer, HashMap<String, String>> getFitbitSleeps() { // Fitbit APIから運動データを取得
    int timediff = millis() - CASHTIME_fitbitSleep;
    if ((fitbit_sleep.size() > 0) && (timediff < timeout)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      println("[API] getFitbitSleeps: returning CASHED_DATA... done with " + fitbit_sleep.size() + " items at " + getTime() + ", キャッシュ期限: " + (timeout - timediff) / 1000 + "秒");
      return fitbit_sleep;
    }
    print("[API] getFitbitSleeps: FETCHING... ");
    JSONArray JSON_response = loadJSONArray(endpoints.get("gas_sleeps"));
    for (int i = 0; i < JSON_response.size(); i++) {
      JSONObject data = JSON_response.getJSONObject(i);
      HashMap<String, String> _data = new HashMap<String, String>();
      _data.put("date", data.getString("date"));
      _data.put("duration", String.valueOf(data.getInt("duration")));
      _data.put("start", data.getString("start"));
      _data.put("end", data.getString("end"));
      fitbit_sleep.put((7 - i), _data);
    }
    CASHTIME_fitbitSleep = millis();
    println("done with " + fitbit_sleep.size() + " items at " + getTime());
    return fitbit_sleep; // * 返す内容 {日付, 睡眠データ{睡眠時間、睡眠開始、睡眠終了}}
  }
  
  HashMap<String, String> getIpinfo() { // ipinfoを用いて、ipアドレスから接続先のプロバイダを取得(未来大からアクセスしているか、それ以外からアクセスしているかを特定できる)
    //!バスのAPIに関連するAPIであり、最新のデータをすぐに取得する必要があるため、キャッシュ期限を独自(1秒)にしている→s5でAPIを2回呼ぶから、その時に1秒のキャッシュを読む(リクエスト数の削減)
    int timediff = millis() - CASHTIME_ipinfo;
    if ((ipinfo.size() > 0) && (timediff < 1000)) { // 既に取得済みの場合は、キャッシュされたデータを用いる(無駄なリクエストを防止する)
      println("[API] getIpinfo: returning CASHED_DATA... done with " + ipinfo.size() + " items at " + getTime() + ", キャッシュ期限: 1秒");
      return ipinfo;
    }
    print("[API] getIpinfo: FETCHING... ");
    JSONObject JSON_response = loadJSONObject(endpoints.get("ipinfo") + apikeys.get("ipinfo"));
    ipinfo.put("ip",JSON_response.getString("ip"));
    ipinfo.put("region", JSON_response.getString("city") + ", " + JSON_response.getString("region") + ", " + JSON_response.getString("country")); // 天気の取得にこのデータを使えそうだけど、VPN使ってたりするとずれるのでやめておく
    ipinfo.put("loc", JSON_response.getString("loc"));
    ipinfo.put("org", JSON_response.getString("org"));
    CASHTIME_ipinfo = millis();
    println("done with " + ipinfo.size() + " items at " + getTime());
    
    return ipinfo; // * 返す内容 IPアドレス、プロバイダ、地域、座標
  }
  boolean isFUN() { // 未来大からアクセスしているかを判定
    String org = getIpinfo().get("org");
    // ipinfo の org が "AS2907 Research Organization of Information and Systems, National Institute" である場合、未来大からのアクセスと判定 (VPNを使っている場合は判定できない)
    return org.contains("AS13335 C") || (org.contains("FLETS_no_org") && isFreeWifiContain) || org.contains("AS2907 R");

    // 一時的にCloudflareVPNで未来大かどうかを切り替えている(デモ用)
    // VPNのスイッチをON/OFFするだけで、未来大モードと亀田支所前モードを切り替えることができる

    //TODO : フレッツ光の場合のorgを入れる
  }
  void setApikeys(JSONObject json) {
    apikeys.put("openweathermap", json.getString("openweathermap"));
    apikeys.put("ipinfo", json.getString("ipinfo"));
  }
  void setEndpoints(JSONObject json) {
    endpoints.put("openweathermap_weather", json.getString("openweathermap_weather"));
    endpoints.put("openweathermap_forecast", json.getString("openweathermap_forecast"));
    endpoints.put("gas_funbus", json.getString("gas_funbus"));
    endpoints.put("gas_steps", json.getString("gas_steps"));
    endpoints.put("gas_sleeps", json.getString("gas_sleeps"));
    endpoints.put("ipinfo", json.getString("ipinfo"));
  }
  String getTime() {
    return nf(hour(), 2) + ":" + nf(minute(), 2) + ":" + nf(second(), 2);
  }
}
