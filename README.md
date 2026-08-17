# S4ph1ra — Portfolio artistique

## Ce que contient cette première version

- Accueil sombre/moderne, responsive téléphone/tablette/ordinateur
- Galerie Firebase avec catégories, recherche et tags
- Pages individuelles pour les dessins
- Vues, favoris et commentaires avec compte Google
- Profils personnalisables
- Rôles `user`, `moderator`, `admin`, `owner`
- Panneau admin clair et responsive
- Ajout de dessins et d'étapes dans Firebase Storage
- Catégories, actualités, objectifs
- Apparence configurable depuis l'admin
- Thème sombre/clair
- Couleur principale configurable
- Symbole du site configurable
- Annonce globale et mode maintenance prévus
- Structure pensée pour ajouter d'autres fonctions plus tard

## Important : Firebase

Le projet est conçu pour fonctionner depuis une tablette, sans serveur personnel et sans Python obligatoire.

1. Crée un projet Firebase.
2. Active Authentication > Google.
3. Crée Firestore Database.
4. Crée Storage.
5. Ajoute une application Web Firebase.
6. Copie sa configuration dans `firebase-config.js`.
7. Publie les règles `firestore.rules` et `storage.rules`.
8. Ouvre une première fois le site et connecte-toi avec ton compte Google.
9. Dans Firestore, crée manuellement `users/<TON_UID>` avec au minimum :
   - `displayName`: `S4ph1ra`
   - `role`: `owner`
10. Recharge `admin.html`.

### Collections utilisées

`users`, `artworks`, `categories`, `news`, `goals`, `reports`, `settings`.

### Important pour les règles

La configuration Web Firebase peut être visible dans le navigateur. Elle ne doit pas être considérée comme un mot de passe. La protection réelle vient des règles Firestore/Storage.

## Hébergement

Tu peux utiliser Firebase Hosting, GitHub Pages (avec les limites liées aux fonctions Firebase) ou un autre hébergeur statique.

## Limites de cette base

Cette version pose l'architecture et les fonctions principales. Avant une mise en ligne publique, il faudra notamment finaliser :
- la traduction automatique (API ou traduction manuelle assistée)
- les notifications temps réel
- la vraie corbeille avec restauration
- le compteur de vues anti-abus
- l'optimisation automatique des images côté client
- le système complet de signalement/modération
- la maintenance qui bloque réellement les visiteurs
- la gestion complète des fichiers de profil
- les statistiques avancées et graphiques

Ces éléments sont volontairement préparés pour être ajoutés proprement sans refaire toute l'architecture.


## Version sans Firebase Storage
Cette version n'utilise pas Cloud Storage. Les images sont enregistrées dans Firestore sous forme d'URL. Dans le panneau admin, utilise l'URL directe de chaque image et une URL par ligne pour les étapes. N'active pas Firebase Storage.
