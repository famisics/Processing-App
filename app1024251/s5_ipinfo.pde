// ? シーン5(接続状態)のクラス

class IpinfoScene {
  HashMap<String, String> ipinfo = new HashMap<String, String>();
  boolean isFUN = false;
  void boot() {
    ipinfo = API.getIpinfo();
    isFUN = API.isFUN();
  }
  void update() {
    CPT.header("接続状態");
    fill(0);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 24);
    text("IPアドレス", 50, 150);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 64);
    text(ipinfo.get("ip"), 300, 240);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 24);
    text("地域　　　　：　" + ipinfo.get("region"), 50, 350);
    text("座標　　　　：　" + ipinfo.get("loc"), 50, 400);
    text("組織　　　　：　", 50, 450);
    text(ipinfo.get("org"), 50, 500);
    if (isFUN) {
      text("バスモード　：　未来大モード", 50, 550);
    } else {
      text("バスモード　：　亀田支所前モード", 50, 550);
    }
    text("バスの行き先が自動で変わります\n学内LAN, fun-wifi, free-wifi, eduroam\nに接続時、未来大モードが有効になります\n自宅の回線がフレッツ光の場合は、\n未来大として検出されます\n\n(詳しい話：このアプリでは、IPアドレスの\norganizationから接続先を検出しています\nfree-wifiがフレッツ光回線であるため、\nご家庭のフレッツ光と区別できないのです)", 50, 775);
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
