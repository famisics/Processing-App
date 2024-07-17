ArrayList<Button> LIST_Button = new ArrayList<Button>();

class Button {
  boolean isShow = true;
  int x, y, w, h;
  String label;
  color bg;
  // ボタンのx, yはそこを中心として描画される
  Button(int x, int y, int w, int h, color bg, String label, String id) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
    this.bg = bg;
  }
  void update() {
    if (isShow) {
      fill(bg);
      rect(x - w/2, y - h/2, w, h);
      textFont(FONT_meiryo, 32);
      textAlign(CENTER, CENTER);
      fill(0);
      text(label, x, y);
    }
  }
  void show() {
    isShow = true;
  }
  void hide() {
    isShow = false;
  }
}
