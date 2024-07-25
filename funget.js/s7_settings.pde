// ? シーン5(接続状態)のクラス

class SettingsScene {
  
  // 初期化処理
  void boot() {
    addButton(300, 800, 500, 200, color(0, 75, 75), "ホームへ戻る", "cmode", "1");
  }
  
  // 更新処理
  void update() {
    CPT.header("設定");
    fill(0);
    textFont(FONT_noto, 20);
    textAlign(LEFT, CENTER);
    // ボタンの描画
    text("アプリの起動時に、バスを表示する", 110, 175);
    text("→朝バスの時間ぎりぎり使う人におすすめです", 110, 225);
    if (isFirstBus) {
      shape(SVG_on, 50, 150, 50, 50);
    } else {
      shape(SVG_off, 50, 150, 50, 50);
    }
    if (MANAGER_isMousePressed && MANAGER_mouseY > 150 && MANAGER_mouseY < 200 && MANAGER_mouseX > 50 && MANAGER_mouseX < 550) {
      changeFirstBus();
      MANAGER_isMousePressed = false;
    }
    text("フレッツ光(free-wifi)を未来大モードから除外する", 110, 375);
    text("→自宅がフレッツ光の人は有効にしてください", 110, 425);
    if (isFreeWifiContain) {
      shape(SVG_on, 50, 350, 50, 50);
    } else {
      shape(SVG_off, 50, 350, 50, 50);
    }
    if (MANAGER_isMousePressed && MANAGER_mouseY > 350 && MANAGER_mouseY < 400 && MANAGER_mouseX > 50 && MANAGER_mouseX < 550) {
      changeFreeWifiContain();
      MANAGER_isMousePressed = false;
    }
    String d = "自動";
    if (busMode.equals("fromfuntokmd")) d = "未来大モード";
    if (busMode.equals("fromkmdtofun")) d = "亀田支所前モード";
    text("バスモードを切り替える　現在: " + d, 110, 575);
    text("→位置情報を無視して特定のモードに固定します", 110, 625);
    shape(SVG_change, 50, 550, 50, 50);
    if (MANAGER_isMousePressed && MANAGER_mouseY > 550 && MANAGER_mouseY < 600 && MANAGER_mouseX > 50 && MANAGER_mouseX < 550) {
      changeBusMode();
      MANAGER_isMousePressed = false;
    }
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 30);
    text("2024 © famisics (https://uiro.dev)", 300, 1000);
  }
}
