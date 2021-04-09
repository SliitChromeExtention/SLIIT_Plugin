// chrome.runtime.onMessage.addListener(gotMessage);
// function gotMessage(message, sender, sendResponse){}
    
window.addEventListener('click',onclick);

function onclick(){
  var x = document.activeElement.tagName;
  
  //console.log(document.hasFocus())
   console.log('Active Element: ' +x);
    if(x == 'DIV'&& document.hasFocus()){
    // console.log('TEXTAREA active');
    // console.log(document.hasFocus())

    document.addEventListener('keyup',onKeySpacePress);
    function onKeySpacePress(e){
      if(e.keyCode == 32){

       let nodeList = document.querySelectorAll('#mydiv')
       for(let i=0; i<nodeList.length; i++){
         console.log(nodeList.length)
         console.log(nodeList)
        
         //console.log(nodeList[i].innerText)
         wordList = nodeList[i].innerText.trim().replace(/^\s+|\s+$/g,'').split(/\s+/);
         
         for(let j=0; j<wordList.length; j++){
          fetch('http://127.0.0.1:5000/api/spellchecking',{
                  method:'POST',
                  headers:{
                    'Content-Type':'application/json'
                  },
                  body: JSON.stringify({
                    "word": wordList[j].toString()
                  })
                }).then(res => {
                  return res.json()
                })
                .then(data => {
                  if(data == false){
                    console.log('this word is incorrect :'+wordList[j])
                    //console.log(document.querySelector('textarea').style)
                    // document.querySelector('textarea').style.textDecoration = "line-through"
                    // var txtArea = document.querySelector('div');
                    // txtArea.value = txtArea.value.replace(words[i], words[i].fontcolor('red'));
                    nodeList[i].innerText.replace(wordList[j], wordList[j].css.style.fontcolor('red'))//this line is not correct yet
                   
                  }
                })
                .catch(error => console.log('ERROR!!' +error))

         }

         
         
        
       }
        
        // document.querySelectorAll('mydiv').forEach((input) => {
        //   //console.log(input.value)
        //   let wordlist = input.value
        //   //console.log('word list :'+wordlist)
        //   let words = wordlist.split(/(\s+)/).filter( e => e.trim().length > 0)
        //   //console.log(words)
        //   for(let i=0; i<words.length; i++){
        //     fetch('http://127.0.0.1:5000/api/spellchecking',{
        //       method:'POST',
        //       headers:{
        //         'Content-Type':'application/json'
        //       },
        //       body: JSON.stringify({
        //         "word": words[i].toString()
        //       })
        //     }).then(res => {
        //       return res.json()
        //     })
        //     .then(data => {
        //       if(data == false){
        //         console.log('this word is incorrect :'+words[i])
        //         //console.log(document.querySelector('textarea').style)
        //         // document.querySelector('textarea').style.textDecoration = "line-through"
        //         var txtArea = document.querySelector('div');
        //         txtArea.value = txtArea.value.replace(words[i], words[i].fontcolor('red'));
               
        //       }
        //     })
        //     .catch(error => console.log('ERROR!!'))
            
            
  
        //   }
          
        // })
        
      }
      
    }

    
   
  }
}








