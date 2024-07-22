// ? シーン4(バス)のクラス

class FunbusScene {
  HashMap<String, String> funbus = new HashMap<String, String>();
  String query;
  void boot() {
    query = "fromkmdtofun";
    if (API.isFUN()) query = "fromfuntokmd";
    funbus = API.getFunbus(query);
  }
  void update() {
    CPT.header("バス");
    fill(0);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 32);
    if (query.equals("fromkmdtofun")) {
      text("亀田支所前→未来大のバスを表示中", 25, 150);
    } else {
      text("未来大→亀田支所前のバスを表示中", 25, 150);
    }
    if (!funbus.get("this_code").equals("終バス済")) {
      busCard(funbus.get("this_code"), funbus.get("this_start"), funbus.get("this_end"), funbus.get("this_destination"), remain(funbus.get("this_start")), 300);
      if (funbus.get("this_untilnext").equals("last")) {
        fill(200, 0, 0);
        rect(50, 700, 500, 200);
        fill(255, 255, 0);
        rect(55, 705, 490, 190);
        fill(200, 0, 0);
        textAlign(CENTER, CENTER);
        textFont(FONT_noto, 48);
        text("今日最後のバスです", 300, 800);
      } else {
        textFont(FONT_noto, 48);
        textAlign(RIGHT, CENTER);
        text("次のバスは　" + funbus.get("this_untilnext") + "後", 500, 700);
        busCard(funbus.get("next_code"), funbus.get("next_start"), funbus.get("next_end"), funbus.get("next_destination"), remain(funbus.get("next_start")), 750);
      }
    } else {
      textAlign(CENTER, CENTER);
      textFont(FONT_noto, 42);
      text("本日の運行は終了しました", 300, 550);
    }
    fill(0);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 20);
    text("アプリの起動時に、この画面（バス）を表示する", 110, 1025);
    if (isFirstBus) {
      shape(SVG_on, 50, 1000, 50, 50);
    } else {
      shape(SVG_off, 50, 1000, 50, 50);
    }
    if (MANAGER_isMousePressed && MANAGER_mouseY > 1000 && MANAGER_mouseY < 1050 && MANAGER_mouseX > 50 && MANAGER_mouseX < 550) {
      changeFirstBus();
      MANAGER_isMousePressed = false;
    }
  }
  void busCard(String code, String start, String end, String destination, String remain, int yPoition) {
    if (yPoition == 300) {
      fill(255, 90, 90);
    } else {
      fill(90, 90, 255);
    }
    
    rect(50, yPoition - 50, 500, 300);
    fill(255);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 30);
    text(code + "系統　" + destination + "行き", 100, yPoition);
    textFont(FONT_noto, 24);
    text("出発", 105, yPoition + 70);
    text("到着", 335, yPoition + 70);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 64);
    text(start + "　" + end, 300, yPoition + 120);
    textFont(FONT_noto, 30);
    textAlign(LEFT, CENTER);
    text(remain, 100, yPoition + 200);
  }
  String remain(String this_start) {
    //現在時刻を秒に変換
    int nowSeconds = hour() * 3600 + minute() * 60 + second();
    
    //開始時刻を秒に変換
    int startSeconds = int(this_start.substring(0, 2)) * 3600 + 
      int(this_start.substring(3, 5)) * 60;
    
    //残り時間を秒で計算
    int remainingSeconds = startSeconds - nowSeconds;
    
    //残り時間が負の場合は出発済み
    if (remainingSeconds < 0) {
      cmode(4); // 必要に応じてモード変更
      return ""; 
    }
    
    //残り時間を時間、分、秒に分割
    int remainHour = remainingSeconds / 3600;
    int remainMinute = (remainingSeconds % 3600) / 60;
    int remainSecond = remainingSeconds % 60;
    
    //出力文字列を生成
    String result = "出発まで ";
    if (remainHour > 0) {
      result += remainHour + "時間";
    }
    if (remainMinute > 0) {
      result += nf(remainMinute, 2) + "分";
    }
    result += nf(remainSecond, 2) + "秒";
    return result;
  }
}
