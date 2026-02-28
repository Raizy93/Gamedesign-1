 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index 8b137891791fe96927ad78e64b0aad7bded08bdc..da21152a5e3eb8a6522a1c3a97e77dc724a0b03d 100644
--- a/README.md
+++ b/README.md
@@ -1 +1,16 @@
+# Klassieke Snake
 
+Een eenvoudige browserversie van de klassieke Snake game, gebouwd met HTML, CSS en vanilla JavaScript.
+
+## Spelen
+
+1. Open `index.html` in je browser.
+2. Gebruik de pijltjestoetsen of `WASD` om de slang te besturen.
+3. Eet het eten om punten te scoren en je highscore te verbeteren.
+4. Raak geen muur of je eigen lichaam.
+
+## Features
+
+- Klassieke Snake gameplay op een 20x20 grid.
+- Score + highscore (opgeslagen via `localStorage`).
+- Herstartknop en duidelijke game-over melding.
 
EOF
)
