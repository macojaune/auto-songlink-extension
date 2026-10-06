# AutoSongLink

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product purpose

Transformer un lien de morceau ou d'album en lien musical partageable entre plateformes, depuis une extension Chrome. Marvin demande une nouvelle interface soignée, fonctionnelle et rapide, et la modernisation du code Chrome. Raycast est hors du périmètre de cette version.

## Operating context

Petite fenêtre ouverte depuis la barre d'outils Chrome. Le parcours existant lit le presse-papier après un clic et remplace le lien copié. L'utilisateur peut aussi fournir son lien directement. Les choix de conception et de stack sont délégués par Marvin.

## Capabilities and constraints

- Manifest V3. Pas de surveillance permanente du presse-papier.
- Pas de compte, de clé API, de serveur ou de télémétrie requis.
- Spotify et Apple Music sont les sources d'origine. Les autres sources ne sont proposées que si leur format Songlink est vérifié.
- L'API publique Odesli répond actuellement 401 PUBLIC_API_ACCESS_DEPRECATED. Les pages publiques et les liens directs restent disponibles.
- Générer un lien ne prouve pas que le morceau existe ni qu'il est disponible sur chaque plateforme. Songlink résout les correspondances à l'ouverture.

## Brand commitments

Nom existant : AutoSongLink. Interface française. Marvin demande une popup utilitaire compacte, sans texte promotionnel : champ, résultat conditionnel et copie.

## Evidence on hand

Code initial dans popup.html, popup.js, background.js et manifest.json. Validation HTTP des liens publics effectuée le 5 octobre 2026. Les modifications Raycast préexistantes doivent être préservées.
