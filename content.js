// chrome.runtime.onMessage.addListener(gotMessage);
// function gotMessage(message, sender, sendResponse){}
    
document.addEventListener('click',onclick);

function onclick(){
  var x = document.activeElement.tagName;
  //console.log(document.hasFocus())
  // console.log('Active Element: ' +x);
  if(x == 'TEXTAREA'&& document.hasFocus()){
    console.log('TEXTAREA active');
    console.log(document.hasFocus())

    document.addEventListener('keyup',onKeySpacePress);
    function onKeySpacePress(e){
      if(e.keyCode == 32){
        document.querySelectorAll('textarea').forEach((input) => {
          console.log(input.value);
        });
        
      }
      
    }

    
   
  }
}








