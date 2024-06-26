// ? シーン5(接続状態)のクラス

class IpinfoScene {
  HashMap<String, String> ipinfo = new HashMap<String, String>();
  boolean isFUN = false;
  
  // 初期化処理
  void boot() {
    // APIからデータを取得
    ipinfo = API.getIpinfo();
    isFUN = API.solvedIsFUN();
  }
  
  // 更新処理
  void update() {
    CPT.header("接続状態");
    // UIの描画
    fill(0);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 24);
    text("IPアドレス", 50, 150);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 64);
    text(ipinfo.get("ip"), 300, 240);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 24);
    text("地域：" + ipinfo.get("region"), 50, 350);
    text("座標：" + ipinfo.get("loc"), 50, 400);
    String org = ipinfo.get("org");
    if (org.contains("AS2907 R")) org = "AS2907 SINET6 by 国立情報学研究所";
    if (org.length() > 32) {
      org = org.substring(0, 32) + "...";
    }
    text("組織：" + org, 50, 450);
    if (isFUN) {
      text("バスモード：未来大モード", 50, 500);
    } else {
      text("バスモード：亀田支所前モード", 50, 500);
    }
    text("バスの行き先が自動で変わります\n学内LAN, fun-wifi, free-wifi, eduroam\nに接続時、未来大モードが有効になります\n自宅の回線がフレッツ光の場合は、\n未来大として検出されます", 50, 700);
    // ボタンの描画
    fill(0);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 20);
    text("フレッツ光(free-wifi)を未来大モードから除外する", 110, 1025);
    if (isFreeWifiContain) {
      shape(SVG_on, 50, 1000, 50, 50);
    } else {
      shape(SVG_off, 50, 1000, 50, 50);
    }
    if (MANAGER_isMousePressed && MANAGER_mouseY > 1000 && MANAGER_mouseY < 1050 && MANAGER_mouseX > 50 && MANAGER_mouseX < 550) {
      changeFreeWifiContain();
      MANAGER_isMousePressed = false;
    }
  }
}
