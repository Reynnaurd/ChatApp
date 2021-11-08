import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth,signInWithPopup,GoogleAuthProvider,signOut,onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';
import {collection,addDoc,getFirestore,getDocs,setDoc,doc,updateDoc,arrayUnion} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
// https://firebase.google.com/docs/web/setup#available-libraries

//////////////////////////////////////////////////////////////////////
// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyABz6htvHMKTsCaWXQ7tXPVko2_XOhG2zw",
authDomain: "chat-app-97c74.firebaseapp.com",
projectId: "chat-app-97c74",
storageBucket: "chat-app-97c74.appspot.com",
messagingSenderId: "643368403483",
appId: "1:643368403483:web:6415aa99f129960e956ebe"
};


const firebaseApp = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
const auth = getAuth();
const onlineUser = auth.currentUser;
const db   = getFirestore(firebaseApp);


//////////////////////////////////////////////////////////////////////
// Giving an anonymous function for signing in because i don't know how to do it better
document.getElementById('signInBtn').addEventListener('click', function() {
  signInWithPopup(auth, provider)
.then((result) => {
  // This gives you a Google Access Token. You can use it to access the Google API.
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  // The signed-in user info.
  const user = result.user;
  // ...
}).catch((error) => {
  // Handle Errors here.
  const errorCode = error.code;
  const errorMessage = error.message;
  // The email of the user's account used.
  const email = error.email;
  // The AuthCredential type that was used.
  const credential = GoogleAuthProvider.credentialFromError(error);
  // ...
});
})
document.getElementById('linkSignIn').addEventListener('click', function() {
  signInWithPopup(auth, provider)
.then((result) => {
  // This gives you a Google Access Token. You can use it to access the Google API.
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  // The signed-in user info.
  const user = result.user;
  // ...
}).catch((error) => {
  // Handle Errors here.
  const errorCode = error.code;
  const errorMessage = error.message;
  // The email of the user's account used.
  const email = error.email;
  // The AuthCredential type that was used.
  const credential = GoogleAuthProvider.credentialFromError(error);
  // ...
});
})
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// Giving an anonymous function for signing out because i don't know how to do it better
signOutBtn = document.getElementById('signOutBtn').addEventListener('click', function() {
  signOut(auth).then(() => {
    // Sign-out successful.
    console.log('logged out!')
  }).catch((error) => {
    // An error happened.
  });
})
linkSignOut = document.getElementById('linkSignOut').addEventListener('click', function() {
  signOut(auth).then(() => {
    // Sign-out successful.
    console.log('logged out!')
  }).catch((error) => {
    // An error happened.
  });
})
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
let currentUserKey = "";
let chatKey = "";
window.startChat= async function startChat(friendKey, friendName, friendPhoto) {
  
  
  let friendList = {friendId: friendKey, userId: currentUserKey}
  
  const docRef = doc(collection(db, 'friend_list'))

  //friendList.friendId = friendKey;
  console.log(friendList)

  let flag = false;
  const querySnapshot = await getDocs(collection(db, 'friend_list'))
  querySnapshot.forEach(async (doc)=>{
    let data = doc.data();
    if ((data.friendId === friendList.friendId && data.userId === friendList.userId) || (data.friendId === friendList.userId && data.userId === friendList.friendId)){
      flag = true
      chatKey = doc.id;}})
    
      if (flag === false){
      chatKey = docRef.id;
      await setDoc(docRef, friendList)
      .then(()=> {
      console.log('friend added to databse!');})
      .catch((error)=>{
      console.log('An error occured, failed to add to database!: ' + error);});
                        }
    else {
      document.getElementById('chatPanel').removeAttribute('style');
      document.getElementById('divStart').setAttribute('style', 'display:none');
                                  
      hideChatList();
        }
    document.getElementById('chatPanel').removeAttribute('style');
    document.getElementById('divStart').setAttribute('style', 'display:none');
                                
    hideChatList();  
    //Display friend's name and photo
    document.getElementById('divChatName').innerHTML = friendName;
    document.getElementById('imgChat').src = friendPhoto;
  };

onAuthStateChanged(auth, async (user) => {
  if (user) {
    
    let userProfile = {email: '', name:'', photoURL:''};
    userProfile.email = user.email;
    userProfile.name = user.displayName;
    userProfile.photoURL = user.photoURL;

      
      const ref = collection(db, 'users');
      let flag = false;
      const querySnapshot = await getDocs(ref);
      querySnapshot.forEach( async(doc) => {
        // doc.data() is never undefined for query doc snapshots
        let data = doc.data();
        if (data.email === userProfile.email) {
          currentUserKey = doc.id;
          flag = true;}
        })
      if (flag === false) {
        await addDoc(ref, userProfile)
        .then(()=> {
          console.log('user added to databse!');
        })
        .catch((error)=>{
          console.log('An error occured, failed to add to database!: ' + error);
        });

        console.log('logged in!');
        document.getElementById('imgProfile').src = user.photoURL;
        document.getElementById('imgProfile').title = user.displayName;

        document.getElementById('linkSignIn').style = "display:none";
        document.getElementById('linkSignOut').style = "";
      } else {
        console.log('logged in again!\nUser was already in database!');
        document.getElementById('imgProfile').src = user.photoURL;
        document.getElementById('imgProfile').title = user.displayName;

        document.getElementById('linkSignIn').style = "display:none";
        document.getElementById('linkSignOut').style = "";
        }; 
        document.getElementById('linkNewChat').classList.remove('disabled')
  } else {
    console.log('No user')
    document.getElementById('imgProfile').src = "images/pp.png";
    document.getElementById('imgProfile').title = "";

    document.getElementById('linkSignIn').style = "";
    document.getElementById('linkSignOut').style = "display:none";

    document.getElementById('linkNewChat').classList.add('disabled')
  }
});

//this function pops up a new modal panel to see friendlist and all that
async function populateFriendList() {
  
  document.getElementById('listFriend').innerHTML = `<div class="text-center">
                                                      <span class="spinner-border text-primary mt-5" style="width:7rem;height:7rem;"></span>
                                                    </div>`;
  let ref = collection(db, 'users');
  const querySnapshot = await getDocs(ref);
  let list = "";
  if (querySnapshot) {//////////////////////////////////!!!!This should be fixed!!!!///////////////////////////////////
    list = `<li class="list-group-item" style="background-color: #f8f8f8;">
              <input type="text" placeholder="Search or new chat" class="form-control form-rounded">
            </li>`;
  }
  querySnapshot.forEach( async(friendDoc) => {
    let user = friendDoc.data();
    user = user;
    if (auth.currentUser.email !== user.email) {
    list += `<li id="listFriend" class="list-group-item list-group-item-action" data-dismiss="modal" onclick = "startChat('${friendDoc.id}', '${user.name}', '${user.photoURL}')">
              <div class="row">
                  <div class="col-md-2">
                      <img src="${user.photoURL}" class="rounded-circle friend-pic" >
                  </div>
                  <div class="col-md-10" style="cursor: pointer;">
                      <div class="name">${user.name}</div>
                  </div>
              </div>
            </li>`
            ;}        
  });
  document.getElementById('listFriend').innerHTML = list;                                                  
}
document.getElementById('linkNewChat').addEventListener('click', populateFriendList);

async function sendMessage() {
  let chatMessage = {msg: document.getElementById('txtMessage').value, dateTime: new Date().toLocaleString()};
  
  let docRef = doc(db, 'chatMessages', chatKey);
  if (docRef.exists!== true) {setDoc(docRef, chatMessage, { merge: true })}; 
  
  await updateDoc(docRef, {session: arrayUnion(chatMessage)})
  .then(()=>{let message = `<div class="row justify-content-end">
                  <div class="col-6 col-sm-6 col-md-6">
                      <p class="sent float-right">
                          ${document.getElementById('txtMessage').value}
                          <span class="time float right">1:28 PM</span>
                      </p>
                  </div>
                  <div class="col-2 col-sm-1 col-md-1">
                      <img src="${auth.currentUser.photoURL}" class="chat-pic rounded-circle" >
                  </div>
                 </div>`;

document.getElementById('messages').innerHTML += message;
document.getElementById('txtMessage').value = "";
document.getElementById('txtMessage').focus();

document.getElementById('messages').scrollTo(0, document.getElementById('messages').clientHeight);})
.catch(()=>{
  console.log("Message could not have been sent due to an error!")
})}


window.onKeyDown = function onKeyDown() {
  document.addEventListener('keydown', function (key) {
      if (key.which === 13) {
          sendMessage();
      }
  });
}