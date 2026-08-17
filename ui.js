import {applyUserAccent, syncAccentFromAccount, hasUserAccent} from "./theme.js";
import {db, doc, getDoc} from "./firebase.js";

export const i18n = {
  fr: {
    "nav.home":"Accueil","nav.gallery":"Galerie","nav.about":"À propos","nav.news":"Actualités","nav.contact":"Contact","nav.profile":"Profil","nav.admin":"👑 Administration",
    "hero.gallery":"Découvrir mes dessins","hero.about":"En savoir plus",
    "hero.defaultTitle":"Bienvenue dans mon univers.","hero.defaultText":"Un espace pour découvrir mes dessins, mes croquis et mon évolution artistique.",
    "featured.title":"Créations mises en avant","common.seeAll":"Tout voir →","latest.title":"Dernières créations",
    "about.title":"Une artiste, un univers, beaucoup de choses à créer.","about.profileLink":"Voir mon profil →",
    "about.defaultText":"Je dessine pour explorer des idées, des créatures et des univers qui me plaisent. Ce site rassemble mes créations et mon évolution.",
    "stat.artworks":"Créations","stat.categories":"Catégories","stat.views":"Vues",
    "news.title":"Actualités","news.empty":"Aucune actualité.",
    "contact.title":"Une question ?","contact.text":"Tu peux me retrouver sur mes réseaux ou m'écrire directement.",
    "footer.credit":"Créé avec passion ✦",
    "gallery.title":"Galerie","gallery.search":"🔎 Rechercher un dessin, un tag…","gallery.allCategories":"Toutes les catégories","gallery.empty":"Aucun dessin ne correspond à ta recherche.",
    "art.untitled":"Sans titre","art.category":"Art","art.empty":"Aucune création mise en avant pour le moment.","art.emptyLatest":"Ajoute tes premières créations depuis l'administration.",
    "artwork.notFound":"Dessin introuvable.","artwork.prev":"← Précédent","artwork.next":"Suivant →","artwork.commentsTitle":"Commentaires","artwork.commentPlaceholder":"Écrire un commentaire…","artwork.publish":"Publier","artwork.step":"Étape",
    "comments.empty":"Aucun commentaire.","comments.loginNotice":"Connecte-toi pour commenter et participer à la communauté.","comments.login":"Se connecter","comments.defaultUser":"Utilisateur",
    "login.title":"Bienvenue","login.text":"Connecte-toi pour commenter, ajouter des favoris et personnaliser ton profil.","login.google":"Continuer avec Google","login.back":"← Retour au site",
    "profile.title":"Ton profil","profile.loginPrompt":"Connecte-toi pour accéder à ton profil.","profile.login":"Se connecter","profile.edit":"Personnaliser mon profil","profile.logout":"Se déconnecter",
    "profile.namePlaceholder":"Pseudo","profile.bioPlaceholder":"Bio","profile.save":"Enregistrer","profile.bioDefault":"Ajoute une petite bio à ton profil.","profile.defaultRole":"Utilisateur","profile.defaultName":"Artiste",
    "profile.themeTitle":"Mes couleurs","profile.themeText":"Choisis le thème et la couleur d'accent du site, juste pour toi. Ça reste enregistré sur ton compte.",
    "theme.mode":"Mode","theme.dark":"◐ Sombre","theme.light":"☀ Clair","theme.palette":"Palette","theme.custom":"Couleur libre","theme.reset":"Couleur par défaut",
  },
  en: {
    "nav.home":"Home","nav.gallery":"Gallery","nav.about":"About","nav.news":"News","nav.contact":"Contact","nav.profile":"Profile","nav.admin":"👑 Admin",
    "hero.gallery":"Discover my art","hero.about":"Learn more",
    "hero.defaultTitle":"Welcome to my universe.","hero.defaultText":"A space to discover my drawings, sketches and artistic journey.",
    "featured.title":"Featured creations","common.seeAll":"See all →","latest.title":"Latest creations",
    "about.title":"An artist, a universe, plenty more to create.","about.profileLink":"View my profile →",
    "about.defaultText":"I draw to explore ideas, creatures and worlds that I like. This site gathers my creations and my progress.",
    "stat.artworks":"Creations","stat.categories":"Categories","stat.views":"Views",
    "news.title":"News","news.empty":"No news yet.",
    "contact.title":"Got a question?","contact.text":"You can find me on social media or write to me directly.",
    "footer.credit":"Made with passion ✦",
    "gallery.title":"Gallery","gallery.search":"🔎 Search a drawing, a tag…","gallery.allCategories":"All categories","gallery.empty":"No drawing matches your search.",
    "art.untitled":"Untitled","art.category":"Art","art.empty":"No featured creation yet.","art.emptyLatest":"Add your first creations from the admin panel.",
    "artwork.notFound":"Drawing not found.","artwork.prev":"← Previous","artwork.next":"Next →","artwork.commentsTitle":"Comments","artwork.commentPlaceholder":"Write a comment…","artwork.publish":"Post","artwork.step":"Step",
    "comments.empty":"No comments yet.","comments.loginNotice":"Log in to comment and join the community.","comments.login":"Log in","comments.defaultUser":"User",
    "login.title":"Welcome","login.text":"Log in to comment, add favorites and customize your profile.","login.google":"Continue with Google","login.back":"← Back to site",
    "profile.title":"Your profile","profile.loginPrompt":"Log in to access your profile.","profile.login":"Log in","profile.edit":"Customize my profile","profile.logout":"Log out",
    "profile.namePlaceholder":"Username","profile.bioPlaceholder":"Bio","profile.save":"Save","profile.bioDefault":"Add a short bio to your profile.","profile.defaultRole":"User","profile.defaultName":"Artist",
    "profile.themeTitle":"My colors","profile.themeText":"Choose the site's theme and accent color, just for you. It stays saved to your account.",
    "theme.mode":"Mode","theme.dark":"◐ Dark","theme.light":"☀ Light","theme.palette":"Palette","theme.custom":"Custom color","theme.reset":"Default color",
  }
};

const $=s=>document.querySelector(s);

// Applique la couleur, le symbole et le favicon réglés dans l'admin, sur N'IMPORTE QUELLE page du site
async function applyGlobalBranding(){
  try{
    const snap = await getDoc(doc(db,"settings","site"));
    if(!snap.exists()) return;
    const s = snap.data();
    if(s.accent && !hasUserAccent()) document.documentElement.style.setProperty("--accent", s.accent);
    if(s.symbol) document.querySelectorAll("#brandSymbol").forEach(e=>e.textContent=s.symbol);
    if(s.animationsEnabled===false) document.documentElement.classList.add("no-animations");
    if(s.faviconUrl){
      let link = document.querySelector("link[rel='icon']");
      if(!link){ link=document.createElement("link"); link.rel="icon"; document.head.appendChild(link); }
      link.href = s.faviconUrl;
    }
  }catch(e){ /* pas grave si ça échoue, le site garde ses valeurs par défaut */ }
}

// Langue actuelle ("fr" par défaut)
export function currentLang(){ return localStorage.getItem("lang")==="en" ? "en" : "fr"; }

// Traduit une clé pour la langue actuelle (retombe sur le français, puis sur la clé elle-même)
export function t(key){
  const lang = currentLang();
  return (i18n[lang] && i18n[lang][key]) || i18n.fr[key] || key;
}

// Applique la traduction à tous les éléments [data-i18n] / [data-i18n-placeholder] de la page
export function applyI18n(){
  const lang = currentLang();
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el=>{ el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{ el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder)); });
  const langBtn = $("#langButton");
  if (langBtn) langBtn.textContent = lang.toUpperCase();
}

export function setupUI(){
 const th=localStorage.getItem("theme")||"dark"; document.documentElement.dataset.theme=th;
 $("#themeButton")?.addEventListener("click",()=>{const n=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=n;localStorage.setItem("theme",n);});
 $("#langButton")?.addEventListener("click",()=>{
   const n=currentLang()==="fr"?"en":"fr";
   localStorage.setItem("lang",n);
   applyI18n();
   document.dispatchEvent(new CustomEvent("langchange",{detail:n}));
 });
 $("#menuToggle")?.addEventListener("click",()=>$("#mainNav")?.classList.toggle("open"));
 document.querySelectorAll(".reveal").forEach(e=>e.classList.add("visible"));
 applyI18n();
 applyGlobalBranding(); // couleur/symbole/favicon du site, sur toutes les pages
 applyUserAccent(); // couleur personnalisée de la personne connectée, si elle en a choisi une (prioritaire)
 syncAccentFromAccount(); // récupère sa couleur si elle se connecte sur un nouvel appareil
}
export function applySettings(s){
 if(s.animationsEnabled===false) document.documentElement.classList.add("no-animations");
 applyUserAccent();
}
