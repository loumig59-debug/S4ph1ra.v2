import {auth,db,onAuthStateChanged,doc,getDoc,setDoc,updateDoc,signOut} from "./firebase.js";
import {setupUI,t} from "./ui.js";
import {renderThemePicker} from "./theme.js";
setupUI(); document.querySelector("#year").textContent=new Date().getFullYear();
const $=s=>document.querySelector(s);
let unsub=null;
function render(){
if(unsub) unsub();
unsub=onAuthStateChanged(auth,async user=>{
 if(!user){$("#profilePage").innerHTML=`<div class="auth-card"><h1>${t("profile.title")}</h1><p>${t("profile.loginPrompt")}</p><a class="btn primary" href="login.html">${t("profile.login")}</a></div>`;return;}
 const ref=doc(db,"users",user.uid), snap=await getDoc(ref); const p=snap.exists()?snap.data():{displayName:user.displayName||t("profile.defaultName"),bio:"",avatarUrl:user.photoURL||"",bannerUrl:""};
 $("#profilePage").innerHTML=`<div class="profile-card"><div class="profile-banner" style="background-image:url('${p.bannerUrl||"assets/hero-placeholder.svg"}')"></div><div class="profile-body"><img class="avatar xl" src="${p.avatarUrl||user.photoURL||"assets/avatar.svg"}"><span class="role-badge">${p.role||t("profile.defaultRole")}</span><h1>${p.displayName||user.displayName}</h1><p>${p.bio||t("profile.bioDefault")}</p><button id="editProfile" class="btn primary">${t("profile.edit")}</button><button id="logout" class="btn ghost">${t("profile.logout")}</button><div id="editBox" class="panel hidden"><input id="pName" class="input" value="${p.displayName||""}" placeholder="${t("profile.namePlaceholder")}"><textarea id="pBio" class="input" placeholder="${t("profile.bioPlaceholder")}">${p.bio||""}</textarea><input id="pAvatar" type="file" accept="image/*"><button id="saveProfile" class="btn primary">${t("profile.save")}</button></div></div></div><div class="panel theme-panel"><h2>${t("profile.themeTitle")}</h2><p class="muted-text">${t("profile.themeText")}</p><div id="themePickerBox"></div></div>`;
 $("#editProfile").onclick=()=>$("#editBox").classList.toggle("hidden");
 $("#logout").onclick=()=>signOut(auth).then(()=>location.reload());
 $("#saveProfile").onclick=async()=>{await setDoc(ref,{displayName:$("#pName").value.trim(),bio:$("#pBio").value.trim(),email:user.email,updatedAt:new Date()},{merge:true});location.reload();};
 renderThemePicker($("#themePickerBox"));
});
}
render();
document.addEventListener("langchange",render);
