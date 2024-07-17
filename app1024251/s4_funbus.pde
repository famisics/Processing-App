class FunbusScene {
  void boot() {
  }
  void update() {
    CPT.header("バス");
    fill(255);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 30);
    text("未来大 → 亀田支所前", 100, 300);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 96);
    text("22時間30", 300, 500);
    textAlign(RIGHT, CENTER);
    textFont(FONT_noto, 30);
    text("分後に出発", 500, 600);
    textFont(FONT_noto, 24);
    text("次のバスは　+1時間22分後", 500, 700);
  }
}
