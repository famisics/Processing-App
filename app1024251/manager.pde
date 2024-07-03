Manager Manager;
TitleScene TitleScene;
PFont fontLg;

class Manager {
  int mode = 0; // モード0で初期化

  void boot() {
    fontLg = createFont("Meiryo UI", 32);
  }
  void update() {
    switch (mode) {
      case 0:
        TitleScene.update();
        break;
    }
  }
}
