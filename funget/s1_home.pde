// ? シーン1(ホーム)のクラス

class HomeScene {
  PImage bg;
  boolean isRain = false;
  
  // 初期化処理
  void boot() {
    // 時間帯に応じた背景画像
    int time = Integer.parseInt(API.getTime().substring(0, 2));
    if (time >= 19) {
      bg = loadImage("img/home/night.jpg");
    } else if (time >= 15) {
      bg = loadImage("img/home/sunset.jpg");
    } else if (time >= 5) {
      bg = loadImage("img/home/noon.jpg");
    } else {
      bg = loadImage("img/home/midnight.jpg");
    }
    
    // 雨が降るかどうか
    isRain = API.isRain();
    
    // ボタンの追加
    addButton(162.5, 512.5, 225, 225, color(0, 140, 180), "天気", "cmode", "2");
    addButton(437.5, 512.5, 225, 225, color(190, 130, 70), "歩数", "cmode", "3");
    addButton(162.5, 787.5, 225, 225, color(170, 50, 120), "バス", "cmode", "4");
    addButton(437.5, 787.5, 225, 225, color(30, 150, 50), "睡眠", "cmode", "6");
    addButton(162.5, 1000, 225, 100, color(120, 10, 170), "接続状態", "cmode", "5");
    addButton(437.5, 1000, 225, 100, color(50), "設定", "cmode", "7");
  }
  
  // 更新処理
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
      text("こんばんは！", 300, 225);
    } else if (time >= 12) {
      text("こんにちは！", 300, 225);
    } else if (time >= 5) {
      text("おはようございます！", 300, 225);
    } else {
      text("寝てください", 300, 225);
    }
    textFont(FONT_noto, 30);
    if (isRain) {
      text("今日は雨が降るかもしれません", 300, 325);
    } else {
      text("今日は、雨は降らない予定です", 300, 325);
    }
  }
}
