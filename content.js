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
          
         
          for(let i=0; i< wordlist.length; i++){
            let words = wordlist.split(/(\s+)/).filter( e => e.trim().length > 0);
            console.log(words[i])
            
          }


        //  let wordlist = input.split(/(\s+)/).filter( e => e.trim().length > 0);
        //  console.log(wordlist);
          

        });
        
      }
      
    }

    
   
  }
}








