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
                                              var num = 0
                                              // `element` is the element you want to wrap
                                              var parent = span.parentNode;
                                             
                                              var dropdown = document.createElement('div');
                                              dropdown.setAttribute("class", "dropdown")

                                              // set the wrapper as child (instead of the element)
                                              parent.replaceChild(dropdown, span);
                                             // console.log(parent)

                                              // set element as child of wrapper
                                              dropdown.appendChild(span);
                                              
                                             
                                              span.setAttribute("class", "dropbtn")

                                              //create dropdown div and add accesskey as that divs id
                                              var myDropdown = document.createElement('div')
                                              myDropdown.setAttribute("class", "dropdown-content")
                                              myDropdown.setAttribute("id",span.accessKey)

                                             

                                              for(var i=0; i<data.length;i++){
                                                var a = document.createElement('a')
                                                a.setAttribute('href','#')
                                                a.innerText = data[i]
                                                myDropdown.appendChild(a)
                                                
                                              
                                              }
                                              dropdown.appendChild(span)
                                              dropdown.appendChild(myDropdown)
                                              

                                              var links = document.querySelectorAll('a')
                                              links.forEach(link => {
                                                link.addEventListener('click', e =>{
                                                  // 
                                                  span.innerText = link.innerText
                                                  span.setAttribute("style", "color:black")
                                                  placeCaretAtEnd(document.getElementById('mydiv'))
                                                  
                                                })
                                              });

                                   
                                              //JS code
                                              
                                              
                                              document.getElementById(span.accessKey).classList.toggle("show");
                                              console.log(document.getElementById(span.accessKey))
                                              
                                    
                                              window.onclick = function(event) {
                                                if (!event.target.matches('.dropbtn')) {
                                                  var dropdowns = document.getElementsByClassName("dropdown-content");
                                                  var i;
                                                  for (i = 0; i < dropdowns.length; i++) {
                                                    var openDropdown = dropdowns[i];
                                                    if (openDropdown.classList.contains('show')) {
                                                      openDropdown.classList.remove('show');
                                                    }
                                                  }
                                                }
                                              }

                                              







                                              
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













