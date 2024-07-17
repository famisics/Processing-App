// 使い回すコンポーネントを定義

class Component {
  void header(String i) {
    fill(20, 50, 50);
    rect(0, 0, 600, 100);
    fill(255);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 48);
    text(i, 30, 50);
  }
  void footer() {
    fill(50, 50, 100);
    rect(0, 1100, 600, 100);
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 20);
    text("天気", 600 * 1 / 10, 1180);
    text("健康", 600 * 3 / 10, 1180);
    text("ホーム", 600 * 5 / 10, 1180);
    text("バス", 600 * 7 / 10, 1180);
    text("接続状態", 600 * 9 / 10, 1180);
    shape(SVG_weather, 600 * 1 / 10 - 25, 1110, 50, 50);
    shape(SVG_fit, 600 * 3 / 10 - 25, 1110, 50, 50);
    shape(SVG_home, 600 * 5 / 10 - 25, 1110, 50, 50);
    shape(SVG_funbus, 600 * 7 / 10 - 25, 1110, 50, 50);
    shape(SVG_ipinfo, 600 * 9 / 10 - 25, 1110, 50, 50);
    if (MANAGER_isMousePressed && MANAGER_mouseY > 1100) {
      if (MANAGER_mouseX < 600 * 1 / 5) {
        MANAGER_nextmotion = "cmode,2";
      } else if (MANAGER_mouseX < 600 * 2 / 5) {
        MANAGER_nextmotion = "cmode,3";
      } else if (MANAGER_mouseX < 600 * 3 / 5) {
        MANAGER_nextmotion = "cmode,1";
      } else if (MANAGER_mouseX < 600 * 4 / 5) {
        MANAGER_nextmotion = "cmode,4";
      } else {
        MANAGER_nextmotion = "cmode,5";
      }
      MANAGER_isMousePressed = false;
    }
  }
}
