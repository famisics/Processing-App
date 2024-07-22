// ? シーン6(睡眠)のクラス

class SleepScene {
  HashMap<Integer, HashMap<String, String>> fitbit_sleep;
  void boot() {
    fitbit_sleep = API.getFitbitSleeps();
  }
  void update() {
    CPT.header("睡眠");
    fill(0);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 40);
    text("昨晩の睡眠時間（今日）", 25, 150);
    textAlign(CENTER, CENTER);
    int lastSleepTime = Integer.parseInt(fitbit_sleep.get(0).get("duration"));
    if (lastSleepTime == 0) {
      textFont(FONT_noto, 60);
      text("データがありません", 300, 250);
    } else {
      textFont(FONT_noto, 90);
      text(minToTime(lastSleepTime), 300, 250);
    }
    drawBg();
    for (int i = 0; i < 8; i++) {
      color c = color(20, 120, 120);
      if (Integer.parseInt(fitbit_sleep.get(i).get("duration"))<420) c = color(120, 20, 20);
      drawSleep(i, fitbit_sleep.get(i), c);
      drawGraph(i, fitbit_sleep.get(i).get("start"), fitbit_sleep.get(i).get("end"), c);
    }
  }
  void drawGraph(int i, String start, String end, color c) {
    float startHour = isotimeToHour(start);
    if (startHour < 0) return;
    startHour -= 21;
    if (startHour < 0) startHour += 24;
    float endHour = isotimeToHour(end);
    if (endHour < 0) return;
    endHour -= 21;
    if (endHour < 0) endHour += 24;
    int i2 = 7 - i + 1;
    int i3 = 600 * (2 * i2 + 1) / 18;
    drawRoundedLine(i3, 350 + (startHour * 35), i3, 350 + (endHour * 35), c);
  }
  void drawSleep(int i, HashMap<String, String> data, color c) { // 下部分の表示
    fill(0);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 18);
    String _day = String.valueOf(i) + "日前";
    if (i == 0) {
      _day = "今日";
    }
    int i2 = 7 - i + 1;
    int i3 = 600 * (2 * i2 + 1) / 18;
    text(_day, i3, 950);
    if (data.get("duration").equals("0")) {
      shape(SVG_error, i3 - 25, 970, 50, 50);
    } else {
      shape(SVG_check, i3 - 25, 970, 50, 50);
    }
    fill(c);
    text(minToTime(Integer.parseInt(data.get("duration"))), i3, 1040);
    fill(0);
    rect(600 * (2 * i2) / 18 - 1, 930, 2, 130);
  } 
  void drawRoundedLine(float x1, float y1, float x2, float y2, color c) {
    stroke(c);
    strokeWeight(20);
    strokeCap(ROUND);
    line(x1, y1, x2, y2);
    strokeCap(SQUARE);
    noStroke();
  }
  void drawBg() { // 背景の線
    fill(75);
    stroke(2);
    stroke(75);
    strokeWeight(2);
    textFont(FONT_noto, 20);
    textAlign(RIGHT, CENTER);
    for (int i = 0; i < 16; i++) {
      line(70, 350 + (i * 35), 600, 350 + (i * 35));
      text(minToClock(1260 + (i * 60)), 60, 350 + (i * 35));
    }
    noStroke();
  }
  String minToClock(int min) {
    if (min > 1440) min -= 1440;
    
    return str(int(min / 60)) + "時";
  }
  String minToTime(int min) {
    if (min == 0) return "-";
    if (min > 1440) min -= 1440;
    
    return String.valueOf(min / 60) + "h" + nf(min % 60, 2) + "m";
  }
  float isotimeToHour(String date) {
    if (date.matches("")) return - 1;
    int tIndex = date.indexOf('T');
    String timePart = date.substring(tIndex + 1, tIndex + 9);
    
    int hour = int(timePart.substring(0, 2));
    int minute = int(timePart.substring(3, 5));
    int second = int(timePart.substring(6, 8));
    
    float hoursDecimal = hour + minute / 60.0 + second / 3600.0;
    
    return hoursDecimal;
  }
}
