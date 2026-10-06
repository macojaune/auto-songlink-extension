# Validation de la version 1.0.0

Validation locale du 5 octobre 2026. La refonte porte uniquement sur Chrome dans le checkout `main`. Les changements Raycast préexistants sont préservés et exclus du commit.

## Contrôles exécutés

- `bun run check` : typage navigateur et outils, Biome sans avertissement, 48 tests réussis, build Vite réussi.
- ZIP produit par `bun run package`, puis intégrité vérifiée avec `unzip -t`.
- Manifest V3 relu : trois permissions, pas de permissions d'hôte, pas de worker, ressources référencées présentes, pas de script inline.
- Popup compilé servi sur `http://localhost:5174/popup.html` et contrôlé avec le navigateur collaboratif T3.
- Après distillation demandée par Marvin : largeur360px, hauteur174px vide et205px avec le résultat Spotify, contre595px auparavant. Vérification à320px également, sans débordement horizontal. Copie réelle, collage du résultat et erreur visible testés sur ce paquet simplifié.
- Conversion Spotify avec suppression de `si`, copie réelle par clic, puis relecture du résultat réel par le bouton de collage.
- Nouvelle saisie Apple Music : lien `song.link/i/...`, confirmation de copie réinitialisée.
- Domaine imitant Spotify refusé et champ signalé comme invalide.
- Refus de lecture et d'écriture injectés uniquement dans la page de test : erreurs affichées, lien valide conservé, aucune fausse confirmation de copie. Les injections sont supprimées en rechargeant la page.
- Tests unitaires de l'onglet actif : liens compatibles, onglets ignorés, permissions refusées, absence de lecture et d'écriture du presse-papier à la détection.
- Liens publics contrôlés en HTTP : morceau Spotify, morceau Apple Music, vidéo YouTube et album Spotify. La page Spotify a également été ouverte dans le navigateur : titre et plateformes visibles.
- Revue visuelle indépendante du premier design avant distillation : correction du basculement des icônes SVG copie/coche, puis verdict `ship` sur cette correction et cohérence du résultat copié aux deux largeurs. Détecteur CSS Impeccable : aucune alerte.

## Limites et vérification native restante

Le navigateur T3 sert le paquet compilé sur HTTP. Il ne charge pas les extensions Chrome natives. Cette session ne prouve donc pas l'installation, l'application de la CSP de Manifest V3 ni le comportement d'`activeTab` sous `chrome-extension://`.

Après avoir chargé `dist` dans Chrome :

1. Ouvrir le popup sur un morceau Spotify, puis sur un album et un morceau Apple Music. Vérifier la proposition de l'onglet et la copie.
2. Ouvrir le popup sur un site non musical. Vérifier le champ vide et convertir un lien du presse-papier.
3. Tester un texte sans lien, un presse-papier vide et une URL non compatible. Vérifier que le contenu du presse-papier reste intact.
4. Vérifier la navigation clavier, Entrée, les liens qui ouvrent Songlink et l'absence d'erreurs dans l'inspecteur du popup.

## Brouillon Chrome Web Store

Le 5 octobre 2026, le dashboard connecté dans Arc confirme la fiche existante `gndjompcjcpibmidddkjmnhimgepoodo`, éditeur `MarvinL.com` : version publiée `0.1.0`, nouveau package accepté en brouillon `1.0.0`. Le dashboard indique pour ce brouillon `clipboardRead`, `clipboardWrite`, `activeTab`, sans permission d'hôte.

Description et justifications des permissions mises à jour. Aucun code distant déclaré. URL de confidentialité demandée par Marvin : `https://marvinl.com/confidentialite`. Lors de la préparation du brouillon, cette URL renvoyait HTTP 404.

Après confirmation de Marvin, ancienne icône et ancienne capture supprimées du brouillon, puis remplacées par `public/icons/128.png` et `artifacts/store/screenshot-1280x800.png`. Le Store affiche les deux images importées et confirme « Élément enregistré ». La capture représente le popup compilé avec un lien Spotify, dans un cadre de présentation, en PNG RGB 1280 × 800.

Lors de cette préparation, le contrôle « Pourquoi ne puis-je pas envoyer cet élément ? » indiquait un seul blocage : « Impossible d'accéder au lien vers les règles de confidentialité. »

Marvin a ensuite confirmé avoir envoyé la mise à jour pour examen à Google. Ce statut vient de son retour, sans nouvelle consultation du dashboard. L'approbation et la publication de la version 1.0.0 ne sont pas vérifiées.
