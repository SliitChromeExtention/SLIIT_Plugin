document.addEventListener('keyup',onKeySpacePress);


function placeCaretAtEnd(el) {
  el.focus();
  if (typeof window.getSelection != "undefined"
          && typeof document.createRange != "undefined") {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
  } else if (typeof document.body.createTextRange != "undefined") {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
  }
  // console.log("[placeCaretAtEnd updated]");
}


function onKeySpacePress(e){

      var x = document.activeElement.tagName;
      

      if(x == 'DIV'&& document.hasFocus() && e.keyCode == 32){
       

          let nodeList = document.querySelectorAll('#mydiv')
          
          
          
          for(let i=0; i<nodeList.length; i++){
            
            
            nodeList[i].setAttribute('spellcheck', false)
            
            //trim both ends remove punctuations and numbers
            wordList = nodeList[i].innerText.trim().replace(/^\s+|\s+$/g,'').replace(/[.,?\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").replace(/[0-9]/g, '').split(/\s+/);
           
            var key = 1
            for(let j=0; j<wordList.length; j++){
              

             fetch('http://127.0.0.1:5000/api/misspelledword',{
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
                     
                   
                      if(data != false){
                        //replace misspelt words
                        var element = nodeList[i]
                        var originalHtml = element.innerHTML;
                        var newHtml = originalHtml.replace(new RegExp(wordList[j], "g"),data);
                        element.innerHTML = newHtml;

                        placeCaretAtEnd(document.getElementById('mydiv'))
                      }else{
                        
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
                                    
                                    //make words red that are not in the dictionary
                                    
                                    var element = nodeList[i]
                                    var originalHtml = element.innerHTML;
                                    var newHtml = originalHtml.replace(new RegExp(wordList[j], "g"),`<span style="color:red" accesskey=${key}>${wordList[j]}</span>`);
                                    element.innerHTML = newHtml;
                                    key = key +1
                                    
                                    //place caret at the end of the wrod
                                    placeCaretAtEnd(document.getElementById('mydiv'))

                                     //show similer words on click of the red word
                                     var spanlist = document.querySelectorAll('span')
                                      spanlist.forEach(span => {
                                        if(span.accessKey>=1){
                                          span.addEventListener('click',e =>{
                                            //console.log(span.textContent)
                                            

                                            fetch('http://127.0.0.1:5000/api/closewords',{
                                              method:'POST',
                                              headers:{
                                                'Content-Type':'application/json'
                                              },
                                              body: JSON.stringify({
                                                "word": span.textContent.toString()
                                              })
                                            }).then(res => {
                                              return res.json()
                                            })
                                            .then(data => {
                                              console.log(data)
                                              
                                              //create a div add attributes
                                              var drpContent = document.createElement('div')
                                              drpContent.setAttribute("class", "dropdown-content")

                                              //create links inside dropdown list
                                              for(var x=0; x<data.length;x++){
                                                var content = document.createElement('a')
                                                content.setAttribute("href","#")
                                                content.innerText = data[x]
                                                drpContent.appendChild(content)
                                              }
                                              //append dropdwon list to the span
                                              span.setAttribute("class", "word")
                                              span.appendChild(drpContent)

                                              var links = document.querySelectorAll('a')
                                              links.forEach(link => {
                                                link.addEventListener('click', e =>{
                                                  // 
                                                  span.innerText = link.innerText
                                                  span.setAttribute("style", "color:black")
                                                  console.log(link.innerText)
                                                })
                                                
                                                
                                              });





                                              
                                            })
                                            .catch(error => console.log('ERROR!!' +error))

                                          })
                                        }
                                        
                                      })
                               
                                  }

                                })
                                .catch(error => console.log('ERROR!!' +error))
                           
                      }
                      
                    //  }
                   })
                   .catch(error => console.log('ERROR!!' +error))


                   
   
            }

           
            
            
           
          }
           
   
           
         


      }


      
    }



// function renderList(list){

//   console.log(list)

//   fetch(chrome.runtime.getURL('/dropdown.html'))
//   .then(response => response.text())
//   .then(data => {
//      // document.getElementById('mydiv').innerHTML = data;
//      document.querySelectorAll('span')[0].insertAdjacentHTML('beforeend', data)
//       //document.body.insertAdjacentHTML('beforebegin', data);
      






//       // other code
//       // eg update injected elements,
//       // add event listeners or logic to connect to other parts of the app
//   }).catch(err => {
//       // handle error
//       console.log(err)
//   });

// }













