// ? ボタンを管理するクラス

ArrayList<Button> LIST_Button = new ArrayList<Button>();

class Button {
  boolean isShow = true;
  float x, y, w, h;
  String label, id, type;
  color bg;
  
  // ボタンのx, yはそこを中心として描画される
  Button(float x, float y, float w, float h, color bg, String label, String type, String id) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
    this.bg = bg;
    this.type = type;
    this.id = id;
  }
  
  // ボタンの更新
  void update() {
    if (isShow) {
      fill(bg);
      rect(x - w / 2, y - h / 2, w, h);
      textFont(FONT_noto, 40);
      if (w ==  500) textFont(FONT_noto, 32);
      textAlign(CENTER, CENTER);
      fill(255);
      text(label, x, y);
      // それがモード切り替えボタンである場合、押された時にモード切り替えアクションを登録する
      if (type.equals("cmode") && MANAGER_isMousePressed && (MANAGER_mouseX > x - w / 2) && (MANAGER_mouseX < x + w / 2) && (MANAGER_mouseY > y - h / 2) && (MANAGER_mouseY < y + h / 2)) {
        MANAGER_nextmotion = type + "," + id;
        MANAGER_isMousePressed = false;
      }
      // それがツイートボタンである場合、押された時にツイート画面を表示する
      if (type.equals("tweet") && MANAGER_isMousePressed && (MANAGER_mouseX > x - w / 2) && (MANAGER_mouseX < x + w / 2) && (MANAGER_mouseY > y - h / 2) && (MANAGER_mouseY < y + h / 2)) {
        link("https://x.com/intent/post?text=" + id); // ツイート画面を表示
        MANAGER_isMousePressed = false;
      }
    }
  }
}
