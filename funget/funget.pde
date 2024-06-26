import java.util.Base64;

// int originalWidth = 800; // 元の描画領域の幅
// int originalHeight = 600; // 元の描画領域の高さ
// float scaleX = 0;
// float scaleY = 0;

void setup() {
  background(0);
  noStroke();
  print("initializing... ");
  size(600,1200); // Google Pixel 7 基準に指定
  // scaleX = (float) width / originalWidth;
  // scaleY = (float) height / originalHeight;
  boot(); // コードを読みやすくするために、managerでシーンを初期化(boot)しています
}

void draw() {
  // pushMatrix();
  // scale(scaleX, scaleY);
  update(); // コードを読みやすくするために、managerでシーンを描画(update)しています
  // popMatrix();
}

// ! デモ用のキー
void keyPressed() { // シーンを切り替える
  switch(key) {
    case '0' : // スタート画面
      cmode(0);
      break;
    case '1' : // ホーム画面
      cmode(1);
      break;
    case '2' : // 天気画面
      cmode(2);
      break;
    case '3' : // バス画面
      cmode(4);
      break;
    case '4' : // 歩数画面
      cmode(3);
      break;
    case '5' : // 睡眠画面
      cmode(6);
      break;
    case '6' : // 接続情報画面
      cmode(5);
      break;
    case '7' : // 設定画面
      cmode(7);
      break;
    case 'l' : // デモ用、最終バス表示
      DEMO_isLast = !DEMO_isLast;
      break;
  }
}
