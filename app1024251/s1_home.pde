class HomeScene {
  void boot() {
    background(0);
    fill(255);
    textSize(32);
    text("Home", 10, 30);
    Manager.addButton(150, 300, 200, 200, color(255, 100, 100), "Weather", "weather");
    Manager.addButton(450, 300, 200, 200, color(0, 255, 0), "Fitbit", "fit");
    Manager.addButton(150, 900, 200, 200, color(150, 150, 255), "Funbus", "funbus");
    Manager.addButton(450, 900, 200, 200, color(255, 255, 0), "IPInfo", "ipinfo");
  }
  void update() {
    
  }
}
