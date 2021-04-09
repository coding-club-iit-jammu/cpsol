window.onload=function(){
    //check if logged in
    console.log('checking auth')
    firebase.auth().onAuthStateChanged(function(user){
                            if(user){
                                    firebase.auth().currentUser.getIdToken()
                                    .then((res) => {
                                        console.log(res)
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
    window.open('index.html',"_self")
}