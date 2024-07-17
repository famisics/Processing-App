class TitleScene {
  void boot() {
    background(0);
    fill(255);
    textSize(32);
    textAlign(CENTER);
    textFont(FONT_meiryo, 32);
    text("ようこそ", 300, 600);
  }
  void update() {
    if (mousePressed) {
      Manager.cmode(1);
    }
  }
}
