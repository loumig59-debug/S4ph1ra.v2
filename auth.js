import {auth,googleProvider,signInWithPopup} from "./firebase.js";
import {setupUI} from "./ui.js";
setupUI();
document.querySelector("#googleLogin").onclick=async()=>{try{await signInWithPopup(auth,googleProvider);location.href=new URLSearchParams(location.search).get("return")||"profile.html";}catch(e){document.querySelector("#loginError").textContent=e.message;}};
