let spellchecker = document.getElementById("spellchecker");
let transliterate = document.getElementById("transliterate");

function onClickHandler(e) {
    chrome.runtime.sendMessage(e.target.id);
}

spellchecker.addEventListener("click", e => onClickHandler(e) );
transliterate.addEventListener("click", e => onClickHandler(e) );
