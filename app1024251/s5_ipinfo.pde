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
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 64);
    text(ipinfo.get("ip"), 300, 200);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 24);
    text("地域　　　　　：　" + ipinfo.get("region"), 50, 300);
    text("座標　　　　　：　" + ipinfo.get("loc"), 50, 350);
    text("プロバイダー　：　", 50, 400);
    text(ipinfo.get("org"), 50, 450);
    if (isFUN) {
      text("FUNモード", 50, 500);
    } else {
      text("KMDモード", 50, 500);
    }
  }
}
