class TitleScene {
  void boot() {
    background(0);
    fill(255);
    textSize(32);
    textAlign(CENTER);
    text("ようこそ", 300, 600);
  }
  void update() {
    for (int i = 0; i < 100; ++i) {
      if (i > 95) {
        cmode(1);
      }
    }
  }
}
