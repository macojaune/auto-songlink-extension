---
name: AutoSongLink
description: Popup utilitaire compacte.
colors:
  background: "#171a17"
  surface: "#20251f"
  line: "#3b4238"
  ink: "#f3f5ec"
  muted: "#afb8a7"
  accent: "#dbf878"
  error: "#ffb8a8"
  paste-background: "#323a2c"
  paste-hover: "#424d36"
  paste-active: "#566344"
  action-ink: "#1c2410"
  action-hover: "#e7ff9e"
  action-active: "#c9e66b"
  action-copied: "#c5e28a"
typography:
  brand: {fontFamily: "Manrope Variable, sans-serif", fontSize: "15px", fontWeight: 750}
  input: {fontFamily: "Manrope Variable, sans-serif", fontSize: "12px", lineHeight: "20px"}
  share-link: {fontFamily: "Manrope Variable, sans-serif", fontSize: "12px", lineHeight: 1.6}
  action: {fontFamily: "Manrope Variable, sans-serif", fontSize: "13px", fontWeight: 750}
rounded: {small: "6px", control: "9px"}
spacing: {gap: "8px", controls: "12px", padding: "16px"}
components:
  button-primary: {backgroundColor: "{colors.accent}", textColor: "{colors.action-ink}", typography: "{typography.action}"}
  button-paste: {backgroundColor: "{colors.paste-background}", rounded: "{rounded.small}"}
  button-tab: {textColor: "{colors.muted}"}
  field: {backgroundColor: "{colors.surface}", typography: "{typography.input}"}
  result: {textColor: "{colors.muted}", typography: "{typography.share-link}"}
---

# AutoSongLink

## Design direction

Extension utilitaire. À la demande de Marvin le 5 octobre 2026, les slogans, le titre promotionnel, la version, le décor d'état vide, la liste de plateformes et le pied de page sont retirés. Il reste la marque, le champ avec collage, le lien généré et l'action de copie.

## Colors

Olive sombre, textes clairs, citron pour l'action et le focus. Erreurs saumon. Les valeurs viennent du CSS. Aucun fond ni contour autour du résultat.

## Typography

Manrope Variable locale. Trois tailles : marque15px, action13px, saisie et lien12px. Le label du champ reste accessible sans être visible.

## Layout

Colonne360px limitée à la largeur disponible, padding16px. État vide174px de haut, résultat Spotify205px. Le résultat absent et le statut inactif ne réservent aucun espace. Les URL longues reviennent à la ligne. Vérifié aussi à320px sans débordement horizontal.

## Elevation & Depth

Aucune ombre. Fond et bordure1px du champ. Focus explicite. Résultat en simple ligne ouvrable.

## Shapes

Petits contrôles avec rayon6px, champ et action9px. Maillon et icônes géométriques SVG.

## Components

- Champ avec bouton de collage intégré et label accessible « Lien musical ».
- Action « Convertir et copier », puis « Copier le lien », puis « Copié » avec coche après succès.
- Résultat masqué sans lien. URL et action d'ouverture externe lorsqu'il existe.
- Bouton d'onglet compact dans l'en-tête uniquement si un onglet compatible est détecté. Tooltip et nom accessible décrivent l'action.
- Statut annoncé aux lecteurs d'écran. Seules les erreurs occupent une place visible. Succès confirmé uniquement dans le bouton.
- Contrôles désactivés pendant l'opération, `aria-busy`, attributs `hidden` explicites sur les SVG.
- Transitions150–160ms des contrôles, mouvement réduit respecté. Aucun décor animé.

## Do's and Don'ts

Garder le parcours lien → copie, le focus et les erreurs utiles. Ne pas réintroduire de slogans, explications répétées, décor d'état vide ou pied de page. Les formats compatibles et les détails restent dans README.md.
