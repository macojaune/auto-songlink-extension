# AutoSongLink pour Chrome

Une petite fenêtre pour partager un morceau ou un album avec un lien Songlink. Interface française, TypeScript strict, Manifest V3, police et icônes embarquées.

## Utilisation

1. Ouvre l'extension sur une page musicale compatible : le lien de l'onglet est proposé automatiquement.
2. Tu peux aussi coller un lien dans le champ ou cliquer sur l'icône du presse-papier.
3. Clique sur **Copier le lien**. Le bouton confirme la copie et le résultat reste visible.

Si le champ est vide, **Convertir et copier** lit le presse-papier, convertit son lien et copie le résultat en une seule action. La touche Entrée déclenche la même action depuis le champ. Le lien du résultat ouvre la page Songlink dans un nouvel onglet.

Le presse-papier n'est ni surveillé ni lu à l'ouverture. Son contenu reste intact tant que la copie du lien n'a pas réussi. Aucun historique n'est conservé.

## Sources compatibles

| Source | Formats |
| --- | --- |
| Spotify | Morceaux, albums, liens `intl-xx`, URI `spotify:track:` et `spotify:album:` |
| Apple Music | Morceaux, albums, morceaux sélectionnés dans un album avec `?i=` |
| YouTube et YouTube Music | Vidéos `watch`, `youtu.be`, `shorts` et `embed` |
| Songlink et Albumlink | Liens publics déjà universels, recopiés sans conversion |

Les playlists, profils d'artistes, liens courts `spotify.link` et sources non listées sont refusés avec un message explicite. Un lien inclus dans une phrase est accepté. Les paramètres de suivi sont retirés, tout en préservant l'identifiant de morceau Apple Music.

## Pourquoi il n'y a plus d'appel API

L'[API publique Odesli](https://linktree.notion.site/API-d0ebe08a5e304a55928405eb682f6741) est retirée. Le 5 octobre 2026, l'ancien endpoint renvoyait `401 PUBLIC_API_ACCESS_DEPRECATED`. Les pages publiques restent accessibles.

Cette version construit directement les URL publiques `song.link/s/<id>`, `song.link/i/<id>`, `song.link/y/<id>` et les équivalents `album.link`. La conversion est locale, sans clé, compte, serveur ou requête réseau. Songlink recherche les correspondances quand le destinataire ouvre le lien. La génération ne garantit ni l'existence d'un identifiant ni la disponibilité du morceau sur toutes les plateformes. La page publique a besoin d'Internet et certaines vidéos YouTube n'ont pas de correspondance musicale.

## Installer dans Chrome

Le dossier à charger est **`dist`**, pas le dossier contenant les sources TypeScript.

```sh
cd chrome-extension
bun install --frozen-lockfile
bun run build
```

1. Ouvre `chrome://extensions`.
2. Active le mode développeur.
3. Choisis **Charger l'extension non empaquetée** et sélectionne `chrome-extension/dist`.
4. Épingle AutoSongLink dans la barre d'outils.

Pour remplacer une ancienne installation chargée depuis `chrome-extension`, retire cette ancienne entrée puis charge `dist`. Le changement du dossier d'installation peut créer un autre identifiant local. Lors des mises à jour suivantes, reconstruis puis clique sur **Actualiser** dans Chrome.

Chrome 120 minimum. Les trois permissions sont `activeTab` pour le lien de l'onglet invoqué, `clipboardRead` et `clipboardWrite` pour les actions demandées. Pas de content script, de worker permanent ou de télémétrie. La politique de sécurité interdit les connexions réseau du popup et les scripts externes.

## Développement et livraison locale

Bun 1.4.2 utilisé pour la validation. Vite demande Node `^20.19.0 || >=22.12.0` lorsqu'il s'exécute avec Node. Les versions sont verrouillées dans `bun.lock`.

```sh
bun run dev       # aperçu HTTP : http://localhost:5173/popup.html
bun run check     # types, lint, tests et build
bun run package   # artifacts/autosonglink-chrome-1.0.0.zip
```

L'aperçu HTTP utilise le vrai presse-papier du navigateur après un clic. La détection de l'onglet n'y est pas disponible : elle utilise l'API Chrome de l'extension installée. Pour tester la politique de sécurité et les permissions natives, charge le paquet dans Chrome.

Les tests de conversion et de presse-papier sont dans `tests`. Les doubles de l'adaptateur de plateforme y sont réservés aux tests. La police Manrope est livrée avec sa licence OFL. La source vectorielle des icônes est dans `public/icons/mark.svg`.

Cette refonte porte sur Chrome. L'extension Raycast dans le dossier voisin conserve son propre code et ses dépendances.
