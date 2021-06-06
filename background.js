function isAmazon(url) {
  const regex = /^https:\/\/www\.amazon\./gs;
  return regex.exec(url) !== null;
}

function copyToClipboard() {
  function extractASIN(url) {
    const prefixes = ["dp", "product"];

    for (const prefix of prefixes) {
      const regex = new RegExp(`\\/${prefix}\\/(.*?)(\\/|\\?|$)`, "gs");
      const result = regex.exec(url);
      if (!result) continue;
      return result[1];
    }
  }

  function shortenURL(url) {
    const regexFQDN = /^https:\/\/(www\.amazon\..*?)\//gs;
    const FQDN = regexFQDN.exec(url)[1];

    const ASIN = extractASIN(url);

    if (!ASIN) return null;

    return `https://${FQDN}/dp/${ASIN}`;
  }

  const shortURL = shortenURL(document.URL);
  if (!shortURL) return;

  const dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = shortURL;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

function clickHandler(tab) {
  const url = tab.url

  console.log(url);

  if (!isAmazon(url)) return;

  chrome.scripting.executeScript(
      {
        target: {tabId: tab.id},
        function: copyToClipboard
      }
  );
}

chrome.action.onClicked.addListener(clickHandler);