class FunbusScene {
  HashMap<String, String> funbus = new HashMap<String, String>();
  void boot() {
    String query = "fromkmdtofun";
    if (API.isFUN()) query = "fromfuntokmd";
    funbus = API.getFunbus(query);
  }
  void update() {
    CPT.header("バス");
    fill(0);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 80);
    if (!funbus.get("this_code").equals("終バス済")) {
      busCard(funbus.get("this_code"), funbus.get("this_start"), funbus.get("this_end"), funbus.get("this_destination"), remain(funbus.get("this_start")), 300);
      if (funbus.get("this_untilnext").equals("0")) {
        text("終バス", 500, 700);
      } else {
        text("次のバスは　" + funbus.get("this_untilnext") + "後", 500, 700);
        busCard(funbus.get("next_code"), funbus.get("next_start"), funbus.get("next_end"), funbus.get("next_destination"), remain(funbus.get("next_start")), 800);
      }
    } else {
      text("終バス済", 300, 500);
    }
  }
  void busCard(String code, String start, String end, String destination, String remain, int yPoition) {
    if (yPoition == 300) {
      fill(255, 120, 120);
    } else {
      fill(100, 100, 255);
    }
    
    rect(50, yPoition - 50, 500, 250);
    fill(255);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 30);
    text(code + " - " + destination + "行き", 100, yPoition);
    text(start + "出発 - " + end + "到着", 100, yPoition + 50);
    text(remain, 100, yPoition + 100);
  }
  String remain(String this_start) { // TODO:なんか不具合ある
    int now = hour() * 60 + minute();
    int start = int(this_start.substring(0, 2)) * 60 + int(this_start.substring(3, 5));
    int remainHour = (start - now) / 60;
    int remainMinute = ((start - now) % 60) - 1;
    if (start - now + 60 < 0) {
      cmode(4);
      return "";
    } else if (start - now < 60) {
      return "出発済みです\n" + (60 - (start - now)) + "秒後にリストを入れ替えます";
    }
    if (remainHour == 0) return "出発まで " + remainMinute + "分" + nf(59 - second(), 2) + "秒";
    return "出発まで " + remainHour + "時間" + nf(remainMinute, 2) + "分" + nf(59 - second(), 2) + "秒";
  }
}
