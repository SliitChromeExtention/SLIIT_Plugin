console.log("google docs");

//google document plugin starts from here ---------------------------------------------------------
console.log(window.getSelection());

let activeframe = document.getElementsByClassName("docs-texteventtarget-iframe docs-offscreen-z-index docs-texteventtarget-iframe-negative-top")[0]
let key = 1
activeframe.contentDocument.activeElement.addEventListener('keydown', e => {
  if (e.keyCode == 32) {
    let htmlCollection = document.getElementsByClassName('kix-wordhtmlgenerator-word-node')

    for (let i = 0; i < htmlCollection.length; i++) {
      wordList = htmlCollection[i].textContent.trim().replace(/^\s+|\s+$/g, '').replace(/[.,?\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s{2,}/g, " ").replace(/[0-9]/g, '').split(/\s+/);
      //console.log(wordList)
      wordList.forEach(word => {
        fetch('http://127.0.0.1:5000/api/spellchecking',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "word": word.toString()
            })
          }).then(res => {
            return res.json()
          })
          .then(data => {
            if (data == false) {
              console.log('this word is incorrect :' + word)
              //make words red that are not in the dictionary
              let originalHtml = htmlCollection[i].innerHTML
              let newHtml = originalHtml.replace(new RegExp(word, "g"), `<span style="color:red" accesskey=${key} >${word}</span>`);
              htmlCollection[i].innerHTML = newHtml
              key = key + 1

              //on click show similer words
              // let spanList = document.querySelectorAll(`span`)
              // spanList.forEach(span => {
              //   console.log(span)
              // });

            }
          }).catch(error => console.log('ERROR!!' + error))
      });
    }
  }
});