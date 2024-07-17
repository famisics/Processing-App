class HomeScene {
  void boot() {
    addButton(162.5, 662.5, 225, 225, color(255, 100, 100), "天気", "cmode", "2");
    addButton(437.5, 662.5, 225, 225, color(0, 255, 0), "健康", "cmode", "3");
    addButton(162.5, 937.5, 225, 225, color(125, 225, 255), "バス", "cmode", "4");
    addButton(437.5, 937.5, 225, 225, color(255, 255, 0), "接続状態", "cmode", "5");
  }
  void update() {
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(FONT_jetbrains, 96);
    text(clock(), 300, 100);
    textFont(FONT_noto, 48);
    text("今日も元気に！", 300, 250);
  }
  String clock() {
    return nf(hour(), 2) + ":" + nf(minute(), 2) + ":" + nf(second(), 2);
  }
}
