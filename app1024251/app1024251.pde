import java.util.Base64;

void setup() {
  background(0);
  noStroke();
  print("initializing... ");
  size(600,1200); // Google Pixel 7 基準に指定
  boot(); // コードを読みやすくするために、managerでシーンを初期化(boot)しています
}

void draw() {
  update(); // コードを読みやすくするために、managerでシーンを描画(update)しています
}

// ! デバッグ用のキー
void keyPressed() { // シーンを切り替える
  switch(key) {
    case '0':
      cmode(0);
      break;
    case '1':
      cmode(1);
      break;
    case '2':
      cmode(2);
      break;
    case '3':
      cmode(3);
      break;
    case '4':
      cmode(4);
      break;
    case '5':
      cmode(5);
      break;
    case '6':
      cmode(6);
      break;
    case '7':
      cmode(7);
      break;
    case 'x':
      API.isRain();
      break;
  }
}
