// ? シーン0(タイトル)のクラス

class TitleScene {
  int loadingTime = 1800;
  PImage bg;
  
  int start = 0;
  
  // 初期化処理
  void boot() {
    this.start = millis(); // 基準となる時間を更新
    this.bg = loadImage("img/title.jpg");
  }
  
  // 更新処理
  void update() {
    // UI描画
    background(0);
    tint(150);
    image(bg, 0, 0, width, height);
    noTint();
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(FONT_jetbrains, 120);
    text("funget", 300, 250);
    textFont(FONT_noto, 40);
    text("ようこそ ( > ω <)//", 300, 450);
    // 下部の読み込み表示バー
    int processing = (millis() - start) / 2;
    int rectx, width = 0;
    if (processing < 300) {
      rectx = 100;
      width = processing * 4 / 3;
    } else if (processing < 600) {
      rectx = 100 + (processing - 300) * 4 / 3;
      width = 400 - (processing - 300) * 4 / 3;
    } else {
      rectx = 100;
      width = (processing - 600) * 4 / 3;
    }
    rect(rectx, 800, width, 20);
    textFont(FONT_noto, 30);
    text("2024 © famisics (https://uiro.dev)", 300, 1125);
    // 指定時間経過後、ページ遷移
    if (millis() > start + loadingTime - 100) {
      if (isFirstBus) {
        cmode(4);
      } else {
        cmode(1);
      }
    }
  }
}
