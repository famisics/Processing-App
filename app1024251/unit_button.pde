ArrayList<Button> LIST_Button = new ArrayList<Button>();

class Button {
  boolean isShow = true;
  int x, y, w, h;
  String label, id, type;
  color bg;
  // ボタンのx, yはそこを中心として描画される
  Button(int x, int y, int w, int h, color bg, String label, String type, String id) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
    this.bg = bg;
    this.type = type;
    this.id = id;
  }
  void update() {
    if (isShow) {
      fill(bg);
      rect(x - w / 2, y - h / 2, w, h);
      textFont(FONT_meiryo, 32);
      textAlign(CENTER, CENTER);
      fill(0);
      text(label, x, y);
      if (type.equals("cmode") && MANAGER_isMousePressed && (MANAGER_mouseX > x - w / 2) && (MANAGER_mouseX < x + w / 2) && (MANAGER_mouseY > y - h / 2) && (MANAGER_mouseY < y + h / 2)) {
        MANAGER_nextmotion = type + "," + id;
        MANAGER_isMousePressed = false;
      }
    }
  }
  void show() {
    isShow = true;
  }
  void hide() {
    isShow = false;
  }
}
