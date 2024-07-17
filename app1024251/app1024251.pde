void setup() {
  background(0);
  size(600,1200); // Google Pixel 7 基準に指定
  Manager = new Manager();
  Manager.boot();
}
void draw() {
  Manager.update();
}
