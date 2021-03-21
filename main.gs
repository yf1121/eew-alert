function doPost(e) {
  console.log(e.postData.getDataAsString())
  var params = JSON.parse(e.postData.getDataAsString().replace(/[\r\n]+/gi, '<br>'));
  var body = params.text.replace(/<br>/gi, '\n');
  // var body = "《緊急地震速報（気象庁発表）》\n宮城沖で地震　強い揺れに警戒\n〈強い揺れが予想される地域〉\n宮城　岩手　福島"

  if(body.match(/緊急地震速報（新形式）/)) {
    var m = body.match(/Ｍ[．０-９]+程度/m)[0].replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    }).replace(/．/, '.');
    console.log(parseFloat(m.replace(/M([.0-9]+)程度+/gi, '$1')))
    body = body.replace(/（新形式）/m, '（予報）');
    if(parseFloat(m.replace(/M([.0-9]+)程度+/gi, '$1')) < 5.0) {
      return;
    }
  } else if(body.match(/《緊急地震速報（気象庁発表）》/)) {
    body = body.replace(/〈強い揺れが予想される地域〉\n(.+)/m, '〈強い揺れが予想される地域〉\n*$1*');
  } else if(body.match(/《津波注意報》/)) {
    body = body.replace(/^.+?\n(.+)/m, '*$1*');
  } else {
    return;
  }

  var payload = {
      "username" : "EEW（緊急地震速報）", // ★★Botの名前
      "icon_url" : "https://drive.google.com/file/d/1UB4cLrgfUJbZp4pKDoGDJR9caYzIw1vB/view?usp=sharing", // ★★アイコン画像
      "text" : body, // ★★最初のテキスト表示
    }

  // ★★WebhookのURL
  var url = "https://hooks.slack.com/services/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";
  postSlack(payload, url);
}

// 訓練用
function test() {
  var payload = {
      "text" : "緊急地震速報（新形式）\n令和 ３年 ３月２１日０１時０４分０５秒 発表\n発生日時: ２１日０１時０３分４６秒頃\n種子島南東沖 Ｍ６．０程度\n北緯３０．３度 東経１３１．６度 深さ１０ｋｍ", // ★★最初のテキスト表示
    }

  // ★★WebhookのURL
  var url = "https://script.google.com/macros/s/AKfycbxLeFiBy--aZhUhF70C-G2WJWjHgaXnMzsS-sjehqZNUh0Hb9kp53w1HAjqv1JhFoZN/exec";
  postSlack(payload, url);
}

//slackへポストする（payloadを介して装飾なしで送る）
function postSlack(payload, url) {
  // POSTオプション
  var options = {
    "method" : "POST",
    "payload" : JSON.stringify(payload)
  }

  // POSTリクエスト
  var response = UrlFetchApp.fetch(url, options);
  console.log(options);
  // HTML結果を取得（引数のcharsetは設定したほうが良い）
  var content = response.getContentText("UTF-8");
  console.log("Post to Slack(%s): %s", url, content);
}
