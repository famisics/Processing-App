// ? シーン4(バス)のクラス

class FunbusScene {
  HashMap<String, String> funbus = new HashMap<String, String>();
  String query;
  void boot() {
    query = "fromkmdtofun";
    if (API.solvedIsFUN()) query = "fromfuntokmd";
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
      busCard(funbus.get("this_code"), funbus.get("this_start"), funbus.get("this_end"), funbus.get("this_destination"), remain(funbus.get("this_start")), funbus.get("this_untilnext"), 260);
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
        busCard(funbus.get("next_code"), funbus.get("next_start"), funbus.get("next_end"), funbus.get("next_destination"), remain(funbus.get("next_start")), funbus.get("this_untilnext"), 660);
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
  void busCard(String code, String start, String end, String destination, String remain, String untilNext, int yPoition) { // バスの表示カードを作成
    if (yPoition == 260) {
      fill(240, 90, 90);
    } else {
      fill(90, 90, 255);
    }
    
    rect(50, yPoition - 50, 500, 350);
    fill(255);
    textFont(FONT_noto, 30);
    textAlign(LEFT, CENTER);
    text(code + "系統　" + destination + "行き", 75, yPoition);
    textFont(FONT_noto, 24);
    text("出発", 105, yPoition + 90);
    text("到着", 335, yPoition + 90);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 64);
    text(start + "　" + end, 300, yPoition + 140);
    textFont(FONT_noto, 40);
    textAlign(CENTER, CENTER);
    if (yPoition != 260 && !untilNext.equals("0")) {
      text("さらに" + untilNext + "後に出発", 300, yPoition + 250);
    } else {
      text(remain, 300, yPoition + 250);
    }
  }
  String remain(String this_start) { // 残り時間を計算
    int nowSeconds = hour() * 3600 + minute() * 60 + second();
    int startSeconds = int(this_start.substring(0, 2)) * 3600 + 
      int(this_start.substring(3, 5)) * 60;
    int remainingSeconds = startSeconds - nowSeconds;
    if (remainingSeconds < 0) {
      cmode(4);
      return ""; 
    }
    int remainHour = remainingSeconds / 3600;
    int remainMinute = (remainingSeconds % 3600) / 60;
    int remainSecond = remainingSeconds % 60;
    String result = "出発まで";
    if (remainHour > 0) {
      result += remainHour + "時間";
    }
    if (remainMinute > 0 || remainHour > 0) {
      result += nf(remainMinute, 2) + "分";
    }
    result += nf(remainSecond, 2) + "秒";
    return result;
  }
}
