export {}

if (chrome) {
  var article = {}

  function notify(message) {
    const { target, article: _article } = message
    if (target === "background" && _article) {
      console.log(_article)
      article = _article
    }
  }

  function sendArticleToPopup(message) {
    const { target, payload } = message
    if (target === "background" && payload === "popup opened") {
      console.log(article)

      chrome.runtime.sendMessage({ target: "popup", article })
    }
  }
  chrome.runtime.onMessage.addListener(notify)
  chrome.runtime.onMessage.addListener(sendArticleToPopup.bind(this))
}
