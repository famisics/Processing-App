// ? シーン1(ホーム)のクラス

class HomeScene {
  PImage bg;
  void boot() {
    // 時間帯に応じた背景画像
    int time = Integer.parseInt(API.getTime().substring(0, 2));
    if (time >= 19) {
      bg = loadImage("img/bg/night.jpg");
    } else if (time >= 15) {
      bg = loadImage("img/bg/sunset.jpg");
    } else if (time >= 5) {
      bg = loadImage("img/bg/noon.jpg");
    } else {
      bg = loadImage("img/bg/midnight.jpg");
    }
    
    // ボタンの追加
    addButton(162.5, 512.5, 225, 225, color(3, 171, 106), "天気", "cmode", "2");
    addButton(437.5, 512.5, 225, 225, color(28, 130, 173), "歩数", "cmode", "3");
    addButton(162.5, 787.5, 225, 225, color(0, 51, 124), "バス", "cmode", "4");
    addButton(437.5, 787.5, 225, 225, color(70, 30, 80), "睡眠", "cmode", "6");
    addButton(300, 1000, 500, 100, color(50), "接続状態", "cmode", "5");
  }
  void update() {
    tint(255, 175);
    image(bg, 0, 0, width, height);
    noTint();
    fill(0);
    textAlign(CENTER, CENTER);
    textFont(FONT_jetbrains, 96);
    text(API.getTime(), 300, 100);
    textFont(FONT_noto, 48);
    // 時間帯に応じたメッセージ
    int time = Integer.parseInt(API.getTime().substring(0, 2));
    if (time >= 18) {
      text("こんばんは！", 300, 250);
    } else if (time >= 12) {
      text("こんにちは！", 300, 250);
    } else if (time >= 5) {
      text("おはようございます！", 300, 250);
    } else {
      text("寝てください", 300, 250);
    }
  }
}
