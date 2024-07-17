class IpinfoScene {
  void boot() {
  }
  void update() {
    CPT.header("接続状態");
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 64);
    text("192.168.255.255", 300, 200);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 24);
    text("地域　　　　　：　Hakodate, Hokkaido, JP", 50, 300);
    text("座標　　　　　：　41.8158, 140.7669", 50, 350);
    text("プロバイダー　：　AS2907 NII (SINET6)", 50, 400);
  }
}
