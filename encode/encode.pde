import java.util.Base64;
import processing.data.JSONObject;
import processing.data.JSONArray;

void setup() {
  // 読み込むJSONファイルのパス
  String inputFilePath = "endpoints.json";
  // 書き出すJSONファイルのパス
  String outputFilePath = "output.json";

  // JSONファイルを読み込む
  JSONObject json = loadJSONObject(inputFilePath);

  // JSONオブジェクトのすべての値をBASE64エンコード
  JSONObject encodedJson = encodeJSONObject(json);

  // エンコードされたJSONオブジェクトをファイルに保存
  saveJSONObject(encodedJson, outputFilePath);
  
  println("JSONファイルがエンコードされて保存されました。");
  exit();
}

JSONObject encodeJSONObject(JSONObject json) {
  JSONObject encodedJson = new JSONObject();
  for (Object keyObj : json.keys()) {
    String key = (String) keyObj;
    Object value = json.get(key);
    if (value instanceof String) {
      encodedJson.setString(key, encodeBase64((String) value));
    }
  }
  return encodedJson;
}

String encodeBase64(String text) {
  return Base64.getEncoder().encodeToString(text.getBytes());
}
