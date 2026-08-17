import {db,collection,getDocs,query,orderBy} from "./firebase.js";
import {setupUI,t} from "./ui.js";
setupUI(); document.querySelector("#year").textContent=new Date().getFullYear();
const $=s=>document.querySelector(s); let artworks=[], categories=[];
const esc=s=>(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function render(){
 const search=$("#searchInput").value.trim().toLowerCase(), cat=$("#categoryFilter").value;
 const list=artworks.filter(a=>(!cat||a.categoryId===cat)&&(!search||[a.title,a.description,a.categoryName,...(a.tags||[])].join(" ").toLowerCase().includes(search)));
 $("#galleryGrid").innerHTML=list.length?list.map(a=>`<article class="art-card"><a href="artwork.html?id=${a.id}"><img loading="lazy" src="${a.imageUrl}" alt="${esc(a.title)}"><div class="art-meta"><span>${esc(a.categoryName||t("art.category"))}</span><h3>${esc(a.title||t("art.untitled"))}</h3><small>👁️ ${a.views||0} · ❤️ ${a.likesCount||0}</small><div class="mini-tags">${(a.tags||[]).slice(0,3).map(tag=>`<em>#${esc(tag)}</em>`).join("")}</div></div></a></article>`).join(""):`<div class='empty'>${t("gallery.empty")}</div>`;
}
async function boot(){
 const [a,c]=await Promise.all([getDocs(query(collection(db,"artworks"),orderBy("createdAt","desc"))),getDocs(collection(db,"categories"))]);
 artworks=a.docs.filter(d=>!d.data().deleted).map(d=>({id:d.id,...d.data()})); categories=c.docs.map(d=>({id:d.id,...d.data()}));
 const keepCat=$("#categoryFilter").value;
 $("#categoryFilter").innerHTML=`<option value="">${t("gallery.allCategories")}</option>`+categories.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("");
 $("#categoryFilter").value=keepCat;
 const tags=[...new Set(artworks.flatMap(a=>a.tags||[]))].slice(0,30);
 $("#tagCloud").innerHTML=tags.map(tag=>`<button class="tag" data-tag="${esc(tag)}">#${esc(tag)}</button>`).join("");
 document.querySelectorAll(".tag").forEach(b=>b.onclick=()=>{$("#searchInput").value=b.dataset.tag;render()});
 render();
}
$("#searchInput").oninput=render; $("#categoryFilter").onchange=render; boot();
document.addEventListener("langchange",boot);
