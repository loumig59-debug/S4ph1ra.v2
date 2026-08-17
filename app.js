import {db,auth,onAuthStateChanged,collection,getDocs,query,where,orderBy,limit,doc,getDoc} from "./firebase.js";
import {applySettings, setupUI, t} from "./ui.js";

const $=s=>document.querySelector(s);
setupUI();
$("#year").textContent=new Date().getFullYear();

async function loadSettings(){
  const s=await getDoc(doc(db,"settings","site"));
  const data=s.exists()?s.data():{};
  applySettings(data);
  $("#heroTitle").textContent=data.heroTitle||t("hero.defaultTitle");
  $("#heroText").textContent=data.heroText||t("hero.defaultText");
  $("#aboutText").textContent=data.aboutText||t("about.defaultText");
  if(data.heroImage) $("#heroImage").src=data.heroImage;
  if(data.email){$("#emailLink").textContent=data.email;$("#emailLink").href=`mailto:${data.email}`;}
  $("#socialLinks").innerHTML=[["Instagram",data.instagram],["TikTok",data.tiktok],["YouTube",data.youtube]].filter(x=>x[1]).map(x=>`<a class="social" href="${x[1]}" target="_blank" rel="noopener">${x[0]}</a>`).join("");
  if(data.announcement) {$("#globalAnnouncement").textContent=data.announcement;$("#globalAnnouncement").classList.remove("hidden");}
}
function card(a){
 return `<article class="art-card reveal"><a href="artwork.html?id=${a.id}"><img src="${a.imageUrl}" alt="${escapeHtml(a.title||t("art.untitled"))}"><div class="art-meta"><span>${escapeHtml(a.categoryName||t("art.category"))}</span><h3>${escapeHtml(a.title||t("art.untitled"))}</h3><small>👁️ ${a.views||0} · ❤️ ${a.likesCount||0}</small></div></a></article>`;
}
function escapeHtml(s=""){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
async function loadArt(){
 let featured=[],latest=[];
 try{
  const f=await getDocs(query(collection(db,"artworks"),where("featured","==",true),orderBy("createdAt","desc"),limit(6)));
  featured=f.docs.filter(d=>!d.data().deleted).map(d=>({id:d.id,...d.data()}));
 }catch{}
 try{
  const l=await getDocs(query(collection(db,"artworks"),orderBy("createdAt","desc"),limit(8)));
  latest=l.docs.filter(d=>!d.data().deleted).map(d=>({id:d.id,...d.data()}));
 }catch{}
 $("#featuredGrid").innerHTML=featured.length?featured.map(card).join():`<div class='empty'>${t("art.empty")}</div>`;
 $("#latestGrid").innerHTML=latest.length?latest.map(card).join():`<div class='empty'>${t("art.emptyLatest")}</div>`;
 $("#statArtworks").textContent=latest.length;
 const cats=new Set(latest.map(a=>a.categoryId).filter(Boolean)); $("#statCategories").textContent=cats.size;
 $("#statViews").textContent=latest.reduce((n,a)=>n+(a.views||0),0);
}
async function loadNews(){
 try{
  const s=await getDocs(query(collection(db,"news"),orderBy("createdAt","desc"),limit(4)));
  const lang=localStorage.getItem("lang")==="en"?"en-US":"fr-FR";
  $("#newsList").innerHTML=s.docs.map(d=>{const n=d.data();return `<article class="news-item"><small>${n.createdAt?.toDate?.().toLocaleDateString?.(lang)||""}</small><h3>${escapeHtml(n.title)}</h3><p>${escapeHtml(n.text||"")}</p></article>`}).join()||`<div class='empty'>${t("news.empty")}</div>`;
 }catch{}
}
async function boot(){await Promise.all([loadSettings(),loadArt(),loadNews()]);document.body.classList.add("ready");$("#loader").classList.add("hidden");}
onAuthStateChanged(auth,()=>{}); boot();
document.addEventListener("langchange",boot);
