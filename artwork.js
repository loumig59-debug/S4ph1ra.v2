import {db,auth,onAuthStateChanged,collection,doc,getDoc,getDocs,query,where,orderBy,addDoc,updateDoc,increment,serverTimestamp,setDoc} from "./firebase.js";
import {setupUI,t} from "./ui.js";
setupUI(); document.querySelector("#year").textContent=new Date().getFullYear();
const $=s=>document.querySelector(s); const id=new URLSearchParams(location.search).get("id"); let art,user;
const esc=s=>(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
async function load(){
 if(!id){$("#artwork").innerHTML=`<div class='empty'>${t("artwork.notFound")}</div>`;return;}
 const s=await getDoc(doc(db,"artworks",id)); if(!s.exists()||s.data().deleted){ $("#artwork").innerHTML=`<div class='empty'>${t("artwork.notFound")}</div>`;return;}
 art={id:s.id,...s.data()}; await updateDoc(doc(db,"artworks",id),{views:increment(1)});
 $("#artwork").innerHTML=`<article class="artwork-detail"><div class="artwork-image"><img src="${art.imageUrl}" alt="${esc(art.title)}"></div><div class="artwork-info"><span class="eyebrow">${esc(art.categoryName||t("art.category"))}</span><h1>${esc(art.title)}</h1><p>${esc(art.description||"")}</p><div class="mini-tags">${(art.tags||[]).map(tag=>`<em>#${esc(tag)}</em>`).join("")}</div><div class="metrics">👁️ ${art.views||0} · <button id="likeBtn" class="metric-btn">♡ ${art.likesCount||0}</button></div><div class="steps">${(art.steps||[]).map((u,i)=>`<img src="${u}" alt="${t("artwork.step")} ${i+1}">`).join("")}</div></div></article>`;
 $("#likeBtn").onclick=like;
 await loadComments(); await navigation();
}
async function like(){
 if(!user){location.href="login.html?return="+encodeURIComponent(location.href);return;}
 const ref=doc(db,"artworks",id,"likes",user.uid); const s=await getDoc(ref);
 if(s.exists()){await import("./firebase.js").then(m=>m.deleteDoc(ref));await updateDoc(doc(db,"artworks",id),{likesCount:increment(-1)});}
 else{await setDoc(ref,{uid:user.uid,createdAt:serverTimestamp()});await updateDoc(doc(db,"artworks",id),{likesCount:increment(1)});}
 load();
}
async function loadComments(){
 const q=query(collection(db,"artworks",id,"comments"),orderBy("createdAt","desc")); const s=await getDocs(q);
 const lang=localStorage.getItem("lang")==="en"?"en-US":"fr-FR";
 $("#commentsList").innerHTML=s.docs.map(d=>{const c=d.data();return `<div class="comment"><div class="comment-head"><strong>${esc(c.displayName||t("comments.defaultUser"))}</strong><span>${c.createdAt?.toDate?.().toLocaleDateString?.(lang)||""}</span></div><p>${esc(c.text)}</p></div>`}).join("")||`<div class='empty'>${t("comments.empty")}</div>`;
 if(user){$("#commentForm").classList.remove("hidden");}else{$("#loginNotice").classList.remove("hidden");$("#loginNotice").innerHTML=`${t("comments.loginNotice")} <a href='login.html'>${t("comments.login")}</a>`;}
}
$("#sendComment").onclick=async()=>{const text=$("#commentInput").value.trim();if(!text||!user)return;await addDoc(collection(db,"artworks",id,"comments"),{uid:user.uid,displayName:user.displayName||t("comments.defaultUser"),text,createdAt:serverTimestamp()});$("#commentInput").value="";loadComments();};
async function navigation(){const s=await getDocs(query(collection(db,"artworks"),orderBy("createdAt","desc")));const ids=s.docs.filter(d=>!d.data().deleted).map(d=>d.id),i=ids.indexOf(id);$("#prevArt").onclick=()=>i>0&&(location.href=`artwork.html?id=${ids[i-1]}`);$("#nextArt").onclick=()=>i<ids.length-1&&(location.href=`artwork.html?id=${ids[i+1]}`);}
onAuthStateChanged(auth,u=>{user=u;loadComments();}); load();
document.addEventListener("langchange",load);
