class SleepScene {
  HashMap<Integer, HashMap<String, String>> fitbit_sleep;
  void boot() {
    fitbit_sleep = API.getFitbitSleep();
    for(int i = 0; i < 8; i++) {
      String _day = i + "日前";
      if (i == 0) {
        _day = "今日";
      }
      // println(_day + "の睡眠データ");
      // println("日付: " + fitbit_sleep.get(i).get("date"));
      // println("睡眠時間: " + fitbit_sleep.get(i).get("duration"));
      // println("睡眠開始: " + fitbit_sleep.get(i).get("start"));
      // println("睡眠終了: " + fitbit_sleep.get(i).get("end"));
    }
  }
  void update() {
    CPT.header("睡眠");
    fill(0);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 48);
    text("昨晩の睡眠時間", 50, 150);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 100);
    text("5時間32分", 300, 250);
    drawBg();
    for (int i = 0; i < 6; i++) {
      drawSleep(i, Integer.parseInt(fitbit_sleep.get(i).get("duration")));
    }
  }
  void drawBg() {
    fill(0);
    stroke(2);
    strokeWeight(2);
    textFont(FONT_noto, 20);
    textAlign(RIGHT, CENTER);
    for (int i = 0; i < 8; i++) {
      line(0, 400 + (i * 50), 530, 400 + (i * 50));
      text(minToClock(1260 + (i * 60)), 590, 400 + (i * 50));
    }
    noStroke();
  }
  String minToClock(int min) {
    if (min > 1440) min -= 1440;
    return str(int(min / 60)) + "時";
  }
  String minToTime(int min) {
    if (min > 1440) min -= 1440;
    return nf(int(min / 60), 2) + "時間" + nf(min % 60, 2) + "分";
  }
  void drawSleep(int i, int duration) { // TODO:日付関係がごちゃごちゃ
    fill(0);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 14);
    String _day = str(6 - i) + "日前";
    if (i == 6) {
      _day = "今日";
    }
    text(_day, 600 * (2 * i + 1) / 14, 830);
    text("雷雨", 600 * (2 * i + 1) / 14, 900);
    shape(SVG_11d, 600 * (2 * i + 1) / 14 - 50, 910, 100, 100);
    text(minToTime(duration), 600 * (2 * i + 1) / 14, 1040);
    if (i < 6) {
      fill(0);
      rect(600 * (2 * i + 2) / 14 - 1, 800, 2, 280);
    }
  }
}
