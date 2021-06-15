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
                                              
                                              num = Math.random()
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
                                              myDropdown.setAttribute("id",num)

                                             

                                              for(var i=0; i<data.length;i++){
                                                var a = document.createElement('a')
                                                a.setAttribute('href','#')
                                                a.setAttribute('class','w')
                                                a.innerText = data[i]
                                                myDropdown.appendChild(a)
                                                
                                              
                                              }

                                              //create add to dictionary link
                                              var add_to_local_dictionary = document.createElement('a')
                                              add_to_local_dictionary.setAttribute('href','#')
                                              add_to_local_dictionary.setAttribute('class','w')
                                              add_to_local_dictionary.setAttribute('id','dictionary')
                                              add_to_local_dictionary.innerText = 'Add to Dictionary'
                                              myDropdown.appendChild(add_to_local_dictionary)

                                              

                                              dropdown.appendChild(span)
                                              dropdown.appendChild(myDropdown)
                                              
                                              //add to local dictionary
                                              var links = document.querySelectorAll('.w')

                                              links.forEach(link => {
                                                if(link.id == 'dictionary'){
                                                  link.addEventListener('click', e=>{
                                                    console.log('add to local dictionary!!')
                                                    //add to local dictionary 
                                                    fetch('http://127.0.0.1:5000/api/add_to_local_dictionary',{
                                                      method:'POST',
                                                      headers:{
                                                        'Content-Type':'application/json'
                                                      },
                                                      body: JSON.stringify({
                                                        "word": span.textContent.toString()
                                                      })
                                                    })
                                                    .then(res => {
                                                    return res.json()
                                                  })
                                                    .then(data => {
                                                      if(data == true){
                                                        
                                                        span.setAttribute("style", "color:black")
                                                        placeCaretAtEnd(document.getElementById('mydiv'))
                                                      }
                                                      
                                          
                                                    }).catch(err => {console.log(err)
                                                    });
                                                  })
                                                }else{
                                                  //select close words and update the wrong word
                                                  link.addEventListener('click', e =>{
                                                    
                                                    span.innerText = link.innerText
                                                    span.setAttribute("style", "color:black")
                                                    placeCaretAtEnd(document.getElementById('mydiv'))
  
                                                })
                                                }
                                                  
                                                  
                                                
                                                
                                              });
                                              
                                              
                                              //JS code
                                              
                                              
                                              document.getElementById(num).classList.toggle("show");
                                             // console.log(document.getElementById(num))
                                              
                                    
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

  // fetch(chrome.runtime.getURL('/dropdown.html'))
  // .then(response => response.text())
  // .then(data => {
     

      
  // }).catch(err => {console.log(err)
  // });

// }

           //if add to dictionary link clicked send fetch request to add that word in to the dictionary

      //      if(link.innerText == 'Add to Dictionary'){
        //     fetch('http://127.0.0.1:5000/api/add_to_local_dictionary',{
        //     method:'POST',
        //     headers:{
        //       'Content-Type':'application/json'
        //     },
        //     body: JSON.stringify({
        //       "word": span.textContent.toString()
        //     })
        //   })
        //   .then(res => {
        //   return res.json()
        // })
        //   .then(data => {
        //     if(data == true){
        //       span.setAttribute("style", "color:black")
        //       placeCaretAtEnd(document.getElementById('mydiv'))
        //     }
            

        //   }).catch(err => {console.log(err)
        //   });


          
      // }











