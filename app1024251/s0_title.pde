class TitleScene {
  int start = 0;
  void boot() {
    start = millis();
  }
  void update() {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 96);
    text("ようこそ\n( > ω <)//", 300, 500);
    rect(50, 800, 500 * (millis() - start) / 2000, 20);
    textFont(FONT_noto, 30);
    text("2024 © famisics (https://uiro.dev)", 300, 1150);
    if (millis() > start + 2000) {
      cmode(1);
    }
  }
}
