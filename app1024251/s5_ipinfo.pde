class IpinfoScene {
  String ip, region, loc, org = "";
  void boot() {
    HashMap<String, String> ipinfo = API.getIpinfo();
    ip = ipinfo.get("ip");
    region = ipinfo.get("region");
    loc = ipinfo.get("loc");
    org = ipinfo.get("org");
  }
  void update() {
    CPT.header("接続状態");
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 64);
    text(ip, 300, 200);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 24);
    text("地域　　　　　：　" + region, 50, 300);
    text("座標　　　　　：　" + loc, 50, 350);
    text("プロバイダー　：　" + org, 50, 400);
  }
}
