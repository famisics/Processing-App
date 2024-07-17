class HomeScene {
  void boot() {
    addButton(150, 600, 200, 200, color(255, 100, 100), "Weather", "cmode", "2");
    addButton(450, 600, 200, 200, color(0, 255, 0), "Fitbit", "cmode", "3");
    addButton(150, 900, 200, 200, color(150, 150, 255), "Funbus", "cmode", "4");
    addButton(450, 900, 200, 200, color(255, 255, 0), "IPInfo", "cmode", "5");
  }
  void update() {
    CPT.header("ホーム");
  }
}
