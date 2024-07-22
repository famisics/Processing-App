// 使い回すコンポーネントを定義

class Component {
  void header(String i) {
    fill(100, 175, 175);
    rect(0, 0, 600, 100);
    fill(0);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 48);
    text(i, 30, 50);
  }
  void footer() {
    fill(200, 255, 255);
    rect(0, 1100, 600, 100);
    fill(0, 75, 75);
    rect(0, 1095, 600, 5);
    circle(300, 1150, 130);
    
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 20);
    fill(0);
    text("天気", 600 * 1 / 10, 1180);
    text("バス", 600 * 3 / 10, 1180);
    text("歩数", 600 * 7 / 10, 1180);
    text("睡眠", 600 * 9 / 10, 1180);
    shape(SVG_weather, 600 * 1 / 10 - 25, 1110, 50, 50);
    shape(SVG_funbus, 600 * 3 / 10 - 25, 1110, 50, 50);
    shape(SVG_fit, 600 * 7 / 10 - 25, 1110, 50, 50);
    shape(SVG_sleep, 600 * 9 / 10 - 25, 1110, 50, 50);
    fill(255);
    text("ホーム", 600 * 5 / 10, 1180);
    shape(SVG_home, 600 * 5 / 10 - 25, 1110, 50, 50);
    if (MANAGER_isMousePressed && MANAGER_mouseY > 1100) {
      if (MANAGER_mouseX < 600 * 1 / 5) {
        MANAGER_nextmotion = "cmode,2";
      } else if (MANAGER_mouseX < 600 * 2 / 5) {
        MANAGER_nextmotion = "cmode,4";
      } else if (MANAGER_mouseX < 600 * 3 / 5) {
        MANAGER_nextmotion = "cmode,1";
      } else if (MANAGER_mouseX < 600 * 4 / 5) {
        MANAGER_nextmotion = "cmode,3";
      } else {
        MANAGER_nextmotion = "cmode,6";
      }
      MANAGER_isMousePressed = false;
    }
  }
  void boldLine(int x1, int y1, int x2, int y2) {
    strokeCap(ROUND);
    stroke(0);
    strokeWeight(10);
    line(x1, y1, x2, y2);
    strokeWeight(1);
    strokeCap(SQUARE);
  }
}
