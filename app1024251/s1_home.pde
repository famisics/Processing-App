class HomeScene {
  void boot() {
    addButton(162.5, 512.5, 225, 225, color(255, 100, 100), "天気", "cmode", "2");
    addButton(437.5, 512.5, 225, 225, color(0, 255, 0), "歩数", "cmode", "3");
    addButton(162.5, 787.5, 225, 225, color(125, 225, 255), "バス", "cmode", "4");
    addButton(437.5, 787.5, 225, 225, color(255, 255, 0), "睡眠", "cmode", "6");
    addButton(300, 1000, 500, 100, color(255, 100, 255), "接続状態", "cmode", "5");
  }
  void update() {
    fill(0);
    textAlign(CENTER, CENTER);
    textFont(FONT_jetbrains, 96);
    text(API.getTime(), 300, 100);
    textFont(FONT_noto, 48);
    // 時間帯に応じたメッセージ
    if (Integer.parseInt(API.getTime().substring(0, 2)) >= 18) {
      text("こんばんは！", 300, 250);
    } else if (Integer.parseInt(API.getTime().substring(0, 2)) >= 12) {
      text("こんにちは！", 300, 250);
    } else if (Integer.parseInt(API.getTime().substring(0, 2)) >= 6) {
      text("おはようございます！", 300, 250);
    } else {
      text("寝てください", 300, 250);
    }
  }
}
