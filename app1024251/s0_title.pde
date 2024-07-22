class TitleScene {
  int loadingTime = 500;
  // TODO:2000ぐらいにする
  
  int start = 0;
  void boot() {
    this.start = millis();
  }
  void update() {
    background(255);
    fill(0);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 80);
    text("ようこそ\n( > ω <)//", 300, 300);
    rect(50, 800, 500 * (millis() - start) / loadingTime, 20);
    textFont(FONT_noto, 30);
    text("2024 © famisics (https://uiro.dev)", 300, 1150);
    if (millis() > start + loadingTime) {
      if(isFirstBus) {
        cmode(4);
      } else {
        cmode(1);
      }
    }
  }
}
