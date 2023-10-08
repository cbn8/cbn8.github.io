// main.js

function loadScript(src, callback) {
  var script = document.createElement("script");
  script.src = src;
  script.onload = callback;
  document.head.appendChild(script);
}

// Load scripts one by one in sequence
loadScript("script/theme.js", function () {
  loadScript("script/papaparse.min.js", function () {
    loadScript("script/quiz.js", function () {});
  });
});
