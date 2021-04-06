// chrome.runtime.onMessage.addListener(gotMessage);
// function gotMessage(message, sender, sendResponse){}
    
document.addEventListener('click',onclick);

function onclick(){
  var x = document.activeElement.tagName;
  //console.log(document.hasFocus())
  // console.log('Active Element: ' +x);
  if(x == 'TEXTAREA'&& document.hasFocus()){
    // console.log('TEXTAREA active');
    // console.log(document.hasFocus())

    document.addEventListener('keyup',onKeySpacePress);
    function onKeySpacePress(e){
      if(e.keyCode == 32){
        document.querySelectorAll('textarea').forEach((input) => {
          //console.log(input.value)
          let wordlist = input.value
          //console.log('word list :'+wordlist)
          let words = wordlist.split(/(\s+)/).filter( e => e.trim().length > 0)
          //console.log(words)
          for(let i=0; i<words.length; i++){
            fetch('http://127.0.0.1:5000/api/spellchecking',{
              method:'POST',
              headers:{
                'Content-Type':'application/json'
              },
              body: JSON.stringify({
                "word": words[i].toString()
              })
            }).then(res => {
              return res.json()
            })
            .then(data => {
              if(data == false){
                console.log('this word is not found :'+words[i])
                document.querySelectorAll('textarea').forEach((word)=>{
                    //do something here....
                  
                })
              }
            })
            .catch(error => console.log('ERROR!!'))
            
            
  
          }
          
        })
        
      }
      
    }

    
   
  }
}








