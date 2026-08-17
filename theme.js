import { auth, db, doc, getDoc, setDoc, serverTimestamp, onAuthStateChanged } from "./firebase.js";
import { t } from "./ui.js";

// Palettes proposées aux visiteurs pour personnaliser LEUR affichage du site
export const PRESET_THEMES = [
  { name: "Violet (défaut)", accent: "#9b7cff", accent2: "#67d5ff" },
  { name: "Corail",          accent: "#ff7a7a", accent2: "#ffb26b" },
  { name: "Émeraude",        accent: "#4fd1a5", accent2: "#67e8f9" },
  { name: "Rose",            accent: "#ff6fb0", accent2: "#c084fc" },
  { name: "Or",               accent: "#f2b84b", accent2: "#ff8a65" },
  { name: "Océan",            accent: "#4fa6ff", accent2: "#67d5ff" },
];

const ACCENT_KEY = "userAccent"; // stocké en local sous la forme {accent, accent2}

function readAccent(){ try { return JSON.parse(localStorage.getItem(ACCENT_KEY) || "null"); } catch { return null; } }
function writeAccent(a){ localStorage.setItem(ACCENT_KEY, JSON.stringify(a)); }

// À appeler sur chaque page (déjà fait depuis ui.js) : applique la couleur perso si elle existe
export function applyUserAccent(){
  const a = readAccent();
  if (!a) return;
  if (a.accent)  document.documentElement.style.setProperty("--accent", a.accent);
  if (a.accent2) document.documentElement.style.setProperty("--accent2", a.accent2);
}

export function resetAccent(){
  localStorage.removeItem(ACCENT_KEY);
  document.documentElement.style.removeProperty("--accent");
  document.documentElement.style.removeProperty("--accent2");
}

// Utilisé par ui.js pour ne pas écraser la couleur perso de la personne avec la couleur globale du site
export function hasUserAccent(){ return !!readAccent(); }

async function saveAccent(accent, accent2){
  const value = { accent, accent2: accent2 || accent };
  writeAccent(value);
  applyUserAccent();
  const user = auth.currentUser;
  if (user) {
    await setDoc(doc(db, "users", user.uid), { accentTheme: value, updatedAt: serverTimestamp() }, { merge: true });
  }
}

// Si la personne se connecte sur un nouvel appareil sans préférence locale déjà enregistrée,
// on va chercher la couleur déjà sauvegardée sur son compte.
export function syncAccentFromAccount(){
  onAuthStateChanged(auth, async (user) => {
    if (!user || readAccent()) return;
    const snap = await getDoc(doc(db, "users", user.uid));
    const saved = snap.exists() ? snap.data().accentTheme : null;
    if (saved) { writeAccent(saved); applyUserAccent(); }
  });
}

// Construit le sélecteur (mode clair/sombre + palettes + couleur libre) dans le conteneur donné
export function renderThemePicker(container){
  const current = readAccent();
  const mode = document.documentElement.dataset.theme || "dark";
  container.innerHTML = `
    <div class="theme-picker">
      <div class="theme-row">
        <span>${t("theme.mode")}</span>
        <div class="theme-modes">
          <button type="button" class="btn ghost mode-btn${mode==="dark"?" active":""}" data-mode="dark">${t("theme.dark")}</button>
          <button type="button" class="btn ghost mode-btn${mode==="light"?" active":""}" data-mode="light">${t("theme.light")}</button>
        </div>
      </div>
      <div class="theme-row">
        <span>${t("theme.palette")}</span>
        <div class="theme-swatches">
          ${PRESET_THEMES.map(p=>`<button type="button" class="swatch${current && current.accent===p.accent?" active":""}" data-accent="${p.accent}" data-accent2="${p.accent2}" style="background:${p.accent}" title="${p.name}"></button>`).join("")}
        </div>
      </div>
      <label class="theme-custom">${t("theme.custom")} <input type="color" id="customAccent" value="${current?.accent || "#9b7cff"}"></label>
      <button type="button" class="btn ghost" id="resetTheme">${t("theme.reset")}</button>
    </div>`;

  container.querySelectorAll(".mode-btn").forEach(b=>{
    b.onclick=()=>{
      document.documentElement.dataset.theme=b.dataset.mode;
      localStorage.setItem("theme", b.dataset.mode);
      container.querySelectorAll(".mode-btn").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
    };
  });
  container.querySelectorAll(".swatch").forEach(b=>{
    b.onclick=()=>{
      saveAccent(b.dataset.accent, b.dataset.accent2);
      container.querySelectorAll(".swatch").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
    };
  });
  container.querySelector("#customAccent").oninput=(e)=>saveAccent(e.target.value, e.target.value);
  container.querySelector("#resetTheme").onclick=()=>{ resetAccent(); renderThemePicker(container); };
}
