 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index 8b137891791fe96927ad78e64b0aad7bded08bdc..d524a8f1ac7f69eeca03c1934332a2b3f44d350f 100644
--- a/README.md
+++ b/README.md
@@ -1 +1,19 @@
+# Snake (klassieke versie)
 
+Een volledig opnieuw opgebouwde klassieke Snake-game in pure HTML/CSS/JavaScript.
+
+## Starten
+
+Open `index.html` in een browser.
+
+## Besturing
+
+- Pijltjestoetsen
+- WASD
+
+## Regels
+
+- Eet rood voedsel om te groeien en punten te krijgen.
+- Bots niet tegen muren.
+- Bots niet tegen je eigen lichaam.
+- Je highscore wordt lokaal opgeslagen.
 
EOF
)
