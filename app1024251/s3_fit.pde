class FitScene {
  HashMap<Integer, Integer> fitbit = new HashMap<Integer, Integer>();
  float[] graphData = new float[7];
  void boot() {
    this.fitbit = API.getFitbitSteps();
  }
  void update() {
    CPT.header("健康");
    fill(0);
    textAlign(CENTER, CENTER);
    textFont(FONT_jetbrains, 110);
    text(fitbit.get(0), 300, 200);
    textAlign(RIGHT, CENTER);
    textFont(FONT_noto, 48);
    text("歩", 500, 300);
    for (int i = 0; i < 7; i++) {
      drawSteps(i, fitbit.get(7 - i));
    }
    drawGraph();
  }
  void drawSteps(int i, int steps) {
    fill(0);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 20);
    String _day = str(7 - i) + "日前";
    text(_day, 600 * (2 * i + 1) / 14, 830);
    text("歩数", 600 * (2 * i + 1) / 14, 900);
    if (steps > 10000) {
      shape(SVG_check, 600 * (2 * i + 1) / 14 - 30, 940, 60, 60);
    } else {
      shape(SVG_error, 600 * (2 * i + 1) / 14 - 30, 940, 60, 60);
    }
    text(steps, 600 * (2 * i + 1) / 14, 1040);
    if (i < 6) {
      fill(0);
      rect(600 * (2 * i + 2) / 14 - 1, 800, 2, 280);
    }
  }
  void drawGraph() { // グラフの描画
    for (int i = 0; i < 7; i++) {
      graphData[i] = fitbit.get(7 - i);
    }
    stroke(50, 200, 120);
    strokeWeight(5);
    float baseLineY = map(10000, 0, max(graphData), 800, 500);
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
      float y = map(graphData[i], 0, max(graphData), 800, 500);
      vertex(x, y);
      
      fill(80);
      circle(x, y, 10);
      noFill();
    }
    
    endShape();
    noStroke();
  }
}
