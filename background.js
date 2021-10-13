chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message == "spellchecker") {
		openSpellchecker();
	} else if (message == "transliterate") {
		openTransliteration();
	}
});

function openSpellchecker() {
	let spellcheck = window.open("http://sinhalagrammarly-env.eba-myktnhiv.us-east-2.elasticbeanstalk.com/html/index.html");
}

function openTransliteration() {
	let transliterate = window.open("./transliterate.html");
}
