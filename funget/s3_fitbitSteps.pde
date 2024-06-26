// ? シーン3(歩数)のクラス

class FitScene {
  HashMap<Integer, Integer> fitbit = new HashMap<Integer, Integer>();
  float[] graphData = new float[7];
  int totalSteps = 0;
  boolean isMsg = true;
  
  int start = 0;
  
  // 初期化処理
  void boot() {
    // APIからデータを取得
    this.fitbit = API.getFitbitSteps();
    totalSteps = 0;
    for (int i = 1; i < 8; i++) {
      int steps = fitbit.get(7 - i);
      graphData[i - 1] = steps;
      totalSteps += steps;
    }
    addButton(480, 1030, 180, 70, color(26, 140, 216), "ツイート", "tweet", "【funget歩数シェア】私は1週間で" + str(totalSteps) + "歩、歩きました！すごいでしょ！！");
    start = millis();
    isMsg = true;
  }
  
  // 更新処理
  void update() {
    CPT.header("歩数");
    fill(0);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 40);
    text("今日の歩数", 25, 150);
    textAlign(CENTER, CENTER);
    textFont(FONT_jetbrains, 110);
    text(fitbit.get(0), 300, 250);
    textFont(FONT_noto, 48);
    text("歩", 550, 250);
    textAlign(LEFT, CENTER);
    textFont(FONT_noto, 40);
    text("週合計: " + totalSteps + "歩", 25, 1030);
    for (int i = 1; i < 8; i++) {
      drawSteps(i, fitbit.get(7 - i));
    }
    drawGraph();
    
    // メッセージ
    if ((millis() - start < 5000) && isMsg) {
      message();
    }
  }
  
  // メッセージを描画
  void message() {
    String msg;
    if (totalSteps > 50000) {
      msg = "おめでとうございます！\n週間歩数50000歩を達成しました";
    } else {
      msg = "目標まであと" + str(50000 - totalSteps) + "歩です\nがんばりましょう！";
    }
    fill(25, 100, 100);
    rect(0, 100, 600, 200);
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 36);
    text(msg, 300, 200);
    if (MANAGER_isMousePressed && MANAGER_mouseY > 100 && MANAGER_mouseY < 300) {
      isMsg = false;
      MANAGER_isMousePressed = false;
    }
  }
  
  //歩数を描画
  void drawSteps(int i, int steps) {
    fill(0);
    textAlign(CENTER, CENTER);
    textFont(FONT_noto, 24);
    String _day = str(7 - i) + "日前";
    if (i == 7) {
      _day = "今日";
    }
    text(_day, 600 * (2 * i - 1) / 14, 750);
    if (steps > 10000) {
      shape(SVG_check, 600 * (2 * i - 1) / 14 - 30, 790, 60, 60);
    } else {
      shape(SVG_error, 600 * (2 * i - 1) / 14 - 30, 790, 60, 60);
    }
    text(steps, 600 * (2 * i - 1) / 14, 900);
    text("歩", 600 * (2 * i - 1) / 14, 930);
    if (i < 7) {
      fill(0);
      rect(600 * (2 * i + 2) / 14 - 1, 720, 2, 230);
    }
  }
  
  // グラフの描画
  void drawGraph() {
    stroke(50, 200, 120);
    strokeWeight(5);
    float baseLineY = map(10000, 0, max(graphData), 800, 400) * 5 / 6;
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
      graphShape(i);
    }
    
    endShape();
    noStroke();
  }
  
  // グラフの折れ線を描画
  void graphShape(int i) {
    float x = 600 * (2 * i + 1) / 14;
    float y = map(graphData[i], 0, max(graphData), 800, 400) * 5 / 6;
    vertex(x, y);
    
    fill(80);
    circle(x, y, 10);
    noFill();
  }
}
