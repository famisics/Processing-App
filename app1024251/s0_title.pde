class TitleScene {
  void boot() {
    fill(255);
    textSize(32);
    textAlign(CENTER);
    textFont(FONT_meiryo, 32);
    text("ようこそ", 300, 600);
    addButton(300, 600, 200, 200, color(255, 255, 0), "はじめる", "cmode", "1");
  }
  void update() {
  }
}
