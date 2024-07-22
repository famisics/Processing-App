// ? シーン3(歩数)のクラス

class FitScene {
  HashMap<Integer, Integer> fitbit = new HashMap<Integer, Integer>();
  float[] graphData = new float[7];
  void boot() {
    this.fitbit = API.getFitbitSteps();
  }
  void update() {
    CPT.header("健康");
    fill(0);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 40);
    text("今日", 25, 150);
    textAlign(CENTER, CENTER);
    textFont(FONT_jetbrains, 110);
    text(fitbit.get(0), 300, 250);
    textFont(FONT_noto, 48);
    text("歩", 550, 250);
    for (int i = 0; i < 7; i++) {
      drawSteps(i, fitbit.get(7 - i));
    }
    drawGraph();
  }
  void drawSteps(int i, int steps) {
    fill(0);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 24);
    String _day = str(7 - i) + "日前";
    text(_day, 600 * (2 * i + 1) / 14, 830);
    if (steps > 10000) {
      shape(SVG_check, 600 * (2 * i + 1) / 14 - 30, 870, 60, 60);
    } else {
      shape(SVG_error, 600 * (2 * i + 1) / 14 - 30, 870, 60, 60);
    }
    text(steps, 600 * (2 * i + 1) / 14, 980);
    text("歩", 600 * (2 * i + 1) / 14, 1010);
    if (i < 6) {
      fill(0);
      rect(600 * (2 * i + 2) / 14 - 1, 800, 2, 230);
    }
  }
  void drawGraph() { // グラフの描画
    for (int i = 0; i < 7; i++) {
      graphData[i] = fitbit.get(7 - i);
    }
    stroke(50, 200, 120);
    strokeWeight(5);
    float baseLineY = map(10000, 0, max(graphData), 950, 400);
    line(0, baseLineY, 600, baseLineY);
    textAlign(RIGHT, TOP);
    textFont(FONT_noto, 24);
    fill(50, 200, 120);
    text("10000歩", 590, baseLineY + 10);
    textAlign(LEFT, BOTTOM);
    text("10000歩", 10, baseLineY - 10);
    
    stroke(80);
    strokeWeight(5);
    
    noFill();
    beginShape();
    
    for (int i = 0; i < 7; i++) {
      float x = 600 * (2 * i + 1) / 14;
      float y = map(graphData[i], 0, max(graphData), 950, 400);
      vertex(x, y);
      
      fill(80);
      circle(x, y, 10);
      noFill();
    }
    
    endShape();
    noStroke();
  }
}
