class FitScene {
  HashMap<Integer, Integer> fitbit = new HashMap<Integer, Integer>();
  void boot() {
    fitbit = API.getFitbit();
  }
  void update() {
    CPT.header("健康");
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(FONT_jetbrains, 110);
    text(fitbit.get(0), 300, 200);
    textAlign(RIGHT, CENTER);
    textFont(FONT_noto, 48);
    text("歩", 500, 300);
    for (int i = 0; i < 7; i++) {
      drawSteps(i, fitbit.get(7-i));
    }
  }
  void drawSteps(int i, int steps) {
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 20);
    String _day = str(7-i) + "日前";
    text(_day, 600 * (2 * i + 1) / 14, 830);
    text("歩数", 600 * (2 * i + 1) / 14, 900);
    shape(SVG_fit, 600 * (2 * i + 1) / 14 - 50, 910, 70, 70);
    text(steps, 600 * (2 * i + 1) / 14, 1040);
    if (i < 6) {
      fill(255);
      rect(600 * (2 * i + 2) / 14 - 1, 800, 2, 280);
    }
  }
}
