int[][] colors = {
  {183, 196, 244} ,
  {255, 244, 185} ,
  {255, 199, 0} ,
  {238, 178, 178} ,
  {200, 200, 200}
};

void genBar(int i, int[] arr) {
  int x = 150;
  int y = 50 + i * 30;
  int slide = 0;
  textAlign(LEFT, CENTER);
  for (int j = 1; j < arr.length; ++j) {
    int t = arr[j];
    int[] c = colors[j - 1];
    fill(c[0], c[1], c[2]);
    rect(x + slide, y, t * 2, 20);
    fill(255 - c[0], 255 - c[1], 255 - c[2]);
    if (t > 5) {
      text(t,x + slide + 2, y + 9, t * 2);
    }
    slide += t * 2;
  }
}
