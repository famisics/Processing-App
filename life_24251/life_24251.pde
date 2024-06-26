import processing.pdf.*;

int[][] graphData;
String[] indexRow = {"曜日","自習時間","授業時間","睡眠時間","余暇","その他"};
String[] indexCol = {"日","月","火","水","木","金","土"};
float[] totals;

void setup() {
  size(400, 600);
  noLoop();
}
void draw() {
  String[] a;
  a = loadStrings("life_24251.csv");
  graphData = new int[a.length - 1][];
  totals = new float[5];
  for (int i = 0; i < a.length - 1; i++) {
    graphData[i] = int(a[i + 1].split(","));
  }
  for (int i = 0; i < graphData.length; i++) {
    for (int j = 1; j < graphData[i].length; j++) {
      totals[j - 1] += graphData[i][j];
    }
  }
  beginRecord(PDF, "life_24251.pdf");
  
  fill(0);
  textFont(createFont("游ゴシック Bold",16));
  text("1024251 山﨑拓己", 20, 30);
  text("生活時間の分析", 20, 60);
  scale(0.5);
  translate(100, 150);
  fill(255);
  rect(0, 0, 600, 820);
  for (int i = 0; i < graphData.length; i++) {
    int x = 100;
    int y = 50 + i * 30;
    genBar(i, graphData[i]);
    int y2 = y + 10;
    fill(0);
    text(indexCol[i], x + 5, y2);
  }
  float total = 0;
  for (int i = 0; i < totals.length; i++) {
    total += totals[i];
  }
  float arcSlide = 0;
  for (int i = 0; i < totals.length; i++) {
    int[] c = colors[i];
    fill(c[0], c[1], c[2]);
    arc(300, 450, 200, 200, radians(arcSlide / total * 360 - 90), radians(totals[i] / total * 360 + arcSlide / total * 360 - 90));
    arcSlide += totals[i];
  }
  fill(100);
  rect(50, 600, 100, 170);
  textAlign(CENTER);
  for (int i = 1; i < indexRow.length; i++) {
    int[] c = colors[i-1];
    fill(c[0], c[1], c[2]);
    text(indexRow[i], 100, 600 + i * 30);
  }
  endRecord();
  exit();
}
