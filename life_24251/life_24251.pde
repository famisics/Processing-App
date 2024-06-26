import processing.pdf.*;

String[] indexRow = {"曜日","自習時間","授業時間","睡眠時間","余暇","その他"};
String[] indexCol = {"日","月","火","水","木","金","土"};
int[][] colors = {
  {43, 166, 154} ,
  {255, 244, 85} ,
  {255, 199, 0} ,
  {248, 88, 88} ,
  {200, 200, 200}
};
int[][] graphData;
float[] totals;

void setup() {
  size(400, 600);
  noLoop();
}

void draw() {
  String[] a;
  a = loadStrings("life_24251.txt");
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
  textAlign(LEFT);
  for (int i = 0; i < totals.length; i++) {
    int[] c = colors[i];
    fill(c[0], c[1], c[2]);
    float start = radians(arcSlide / total * 360 - 90);
    float end = radians(totals[i] / total * 360 + arcSlide / total * 360 - 90);
    arc(300, 425, 200, 200, start, end);
    fill(0);
    line(300, 425, 300 + cos(start) * 110, 425 + sin(start) * 110);
    float x = (cos((start + end) / 2)) * 120;
    float y = (sin((start + end) / 2)) * 120;
    if (i == 4) textAlign(RIGHT);
    text(indexRow[i + 1] + "(" + Math.round(totals[i] * 100 / total) + "%)", 300 + (x * 1.15), 425 + (y * 1.15));
    arcSlide += totals[i];
  }
  textAlign(CENTER);
  for (int i = 1; i < indexRow.length; i++) {
    int[] c = colors[i - 1];
    fill(c[0], c[1], c[2]);
    text(indexRow[i], 155, 600 + i * 30);
  }
  fill(0);
  textAlign(LEFT, TOP);
  text("曜日ごとの時間 (時間)", 250, 30);
  text("円グラフ：時間の占める割合 (%)\n\n注: 四捨五入された値であるため、\n足して (24時間/100%) にならないことがあります", 220, 615);
  endRecord();
  exit();
}

void genBar(int i, int[] arr) {
  int x = 150;
  int y = 50 + i * 30;
  int slide = 0;
  textAlign(LEFT, CENTER);
  for (int j = 1; j < arr.length; ++j) {
    float t = arr[j];
    color c = color(colors[j - 1][0], colors[j - 1][1], colors[j - 1][2]);
    fill(c);
    rect(x + slide, y, t * 2, 20);
    color textColor = color(0, 0, 0);
    if (j - 1 == 0 || j - 1 == 3) textColor = color(255, 255, 255);
    fill(textColor);
    if (t > 5) {
      text(Math.round(t / 4),x + slide + 2, y + 9, t * 2);
    }
    slide += t * 2;
  }
}
