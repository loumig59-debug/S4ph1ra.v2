import { auth, onAuthStateChanged, currentUserProfile } from "./firebase.js";

const adminLink = document.querySelector("#adminLink");

if (adminLink) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      adminLink.style.display = "none";
      return;
    }

    try {
      const profile = await currentUserProfile(user);

      if (
        profile &&
        ["owner", "admin"].includes(profile.role)
      ) {
        adminLink.style.display = "inline-flex";
      } else {
        adminLink.style.display = "none";
      }
    } catch (error) {
      console.error("Impossible de récupérer le rôle :", error);
      adminLink.style.display = "none";
    }
  });
}
