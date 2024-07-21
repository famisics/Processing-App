void setup() {
  background(255);
  stroke(150, 200, 200);
  print("initializing... ");
  size(600,1200); // Google Pixel 7 基準に指定
  boot();
}
void draw() {
  update();
}

// デバッグ用のキー
void keyPressed() {
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
    case '6' : 
      cmode(6);
      break;
    case ' ':
      println(API.isFUN());
      break;
  }
}
