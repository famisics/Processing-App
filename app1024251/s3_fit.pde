class FitScene {
  void boot() {
  }
  void update() {
    CPT.header("健康");
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(FONT_jetbrains, 110);
    text("26810", 300, 200);
    textAlign(RIGHT, CENTER);
    textFont(FONT_noto, 48);
    text("歩", 500, 300);
    for (int i = 0; i < 7; i++) {
      drawSteps(i);
    }
  }
  void drawSteps(int i) {
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 20);
    String _day = str(6-i) + "日前";
    if(i == 6){
      _day = "今日";
    }
    text(_day, 600 * (2 * i + 1) / 14, 830);
    text("雷雨", 600 * (2 * i + 1) / 14, 900);
    shape(SVG_11d, 600 * (2 * i + 1) / 14 - 50, 910, 100, 100);
    text("22.3℃", 600 * (2 * i + 1) / 14, 1040);
    if (i < 6) {
      fill(255);
      rect(600 * (2 * i + 2) / 14 - 1, 800, 2, 280);
    }
  }
}
