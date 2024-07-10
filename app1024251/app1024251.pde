void setup() {
  background(0);
  size(540,1200); // Google Pixel 7 基準
  Manager = new Manager();
  Manager.boot();
}

void draw() {
  Manager.update();
}
