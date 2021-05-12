const md = window.markdownit()
setInterval(() => {
    const  problem_md = document.getElementById('problem_md').value
    const rendered_md = md.render(problem_md)
    document.getElementById('problem_render').innerHTML = rendered_md
},
1000)

setInterval(() => {
    const  writeup_md = document.getElementById('writeup_md').value
    const rendered_md = md.render(writeup_md)
    document.getElementById('writeup_render').innerHTML = rendered_md
},
1000)


var id_token_field = document.getElementById("id-token")
window.onload=function(){
    //check if logged in
    console.log('checking auth')
    firebase.auth().onAuthStateChanged(function(user){
                            if(user){
                                    firebase.auth().currentUser.getIdToken()
                                    .then((res) => {
                                        id_token_field.value = res
                                    })
                                    console.log('Authenticated')                                              
                            }
                            else{
                                    console.log('No Auth')
                                    let current_location = window.location.href
                                    if (current_location.split('/').pop() != 'login.html'){
                                        proceedToSignIn()  
                                    }
                                                                                
                            }
                    })

        
}
var sign_in_with_google=function(){
    var gauth=new firebase.auth.GoogleAuthProvider
    firebase.auth().signInWithPopup(gauth)
                    .then( function(data){
                            var idToken=data.credential.idToken
                            localStorage.setItem('firebase_idToken',idToken)
                            proceedToIndex()
                            
                    })
                    .catch( function(error){
                            console.log(error)
                    })
}

var sign_out=function(){
    firebase.auth().signOut()
	proceedToSignIn()
}

var proceedToSignIn=function(){
    window.open('login.html',"_self")
}
var proceedToIndex=function(){
    window.open('index',"_self")
}