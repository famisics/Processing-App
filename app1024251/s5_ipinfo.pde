class IpinfoScene {
  HashMap<String, String> ipinfo = new HashMap<String, String>();
  void boot() {
    ipinfo = API.getIpinfo();
  }
  void update() {
    CPT.header("接続状態");
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 64);
    text(ipinfo.get("ip"), 300, 200);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 24);
    text("地域　　　　　：　" + ipinfo.get("region"), 50, 300);
    text("座標　　　　　：　" + ipinfo.get("loc"), 50, 350);
    text("プロバイダー　：　" + ipinfo.get("org"), 50, 400);
  }
}
