# Trainings-Tracker

Persönliche, installierbare Web-App für vier flexible Trainingseinheiten. Kein Build und keine Laufzeitabhängigkeiten.

## Nutzen

- Oberkörper A → Unterkörper A → Oberkörper B → Unterkörper B, ohne feste Wochentage.
- Plan für ca. 60 Minuten Krafttraining plus 20 Minuten zügiges Gehen. Die tatsächliche Dauer hängt von Pausen, Gerätebelegung und Aufwärmen ab.
- Gewicht mit Komma oder Punkt, Wiederholungen, ausdrücklicher Übungsabschluss und Pausentimer.
- Eingaben bleiben beim Tippen im Feld. Zurück/Weiter/Fertig in einer eigenen Eingabeleiste.
- Verlauf einschließlich früherer Übungen; getrennte Kennungen für beidbeinige und frühere einbeinige Beinpresse.
- Lokales Speichern, JSON-Backup und bestehende optionale Heimserver-Synchronisierung.
- Systemabhängiges helles/dunkles Erscheinungsbild und Offline-App-Shell.

## Auf dem iPhone installieren

Die veröffentlichte HTTPS-Adresse in Safari öffnen. Über Teilen → „Zu Home-Bildschirm hinzufügen“ installieren, gegebenenfalls „Als Web-App öffnen“ aktivieren. Danach das neue Symbol nutzen. Eine native App-Store-App ist dafür nicht erforderlich.

Vor einem Wechsel der Webadresse, des Geräts oder der Installation unter Einstellungen ein JSON-Backup herunterladen. Lokale Browserdaten sind an die jeweilige Webadresse und Browserumgebung gebunden. Die bestehende App nicht löschen, bevor die Daten gesichert sind.

## Entwicklung und Auslieferung

Die Dateien index.html, styles.css, app.js, sw.js, manifest.webmanifest und die drei PNG-Icons müssen gemeinsam unter derselben Adresse bereitgestellt werden. Für Service Worker ist HTTPS erforderlich; localhost ist für Entwicklung zugelassen. Bei Änderungen am App-Shell die Cacheversion in sw.js erhöhen. Eine vorhandene Installation bietet die neue Version zur bewussten Aktivierung an, nachdem Eingaben gesichert wurden.

Der Sync nutzt das bestehende `/api/health`- und `/api/state`-Protokoll. Die optionale HTTPS-Serveradresse wird unter Einstellungen auf dem Gerät gespeichert. Eine zuvor im lokalen Datensatz gespeicherte Adresse wird weiterverwendet; neue Geräte brauchen die Adresse oder ein passendes Backup. Private Hostnamen stehen nicht im öffentlichen Quellcode. Der Heimserver selbst ist nicht Teil dieses Repositorys. Lokale Eingaben werden sofort gespeichert; Serverkommunikation erfolgt verzögert. Vor einer Datenersetzung werden bis zu fünf lokale Sicherheitskopien behalten. Bei gleichzeitigen lokalen Änderungen bleibt der lokale Entwurf erhalten; ein abweichender Serverstand wird vor einem Upload lokal gesichert. Eine konfliktfreie Zusammenführung einzelner Sätze zwischen mehreren gleichzeitig bearbeiteten Geräten ist nicht implementiert.

## Tests

Mit Node.js 22 oder neuer:

```text
node --check app.js
node --check sw.js
node tests/sync.mjs
node tests/chart.mjs
node tests/browser.mjs
```

Der Browser-Test benötigt die vorhandene Omowright-Skill-Laufzeit und einen installierten Chromium-Browser. Mit `OMOWRIGHT_SKILL` den Pfad zur Browser-Skill setzen; `TEST_BROWSER` setzt den Browserpfad. Die Windows-Voreinstellung ist Microsoft Edge. Der Test erstellt einen separaten temporären Browser, lokale Beispieldaten und einen lokalen HTTP-Testserver; der echte Heimserver wird nicht verwendet. Bildschirmnachweise liegen im benachbarten `qa`-Ordner.

`node tests/browser.mjs --baseline` führt den Eingabe-Regressionsfall gegen Commit 27b8020 aus und muss mit dem alten Fehler scheitern. Die unveränderte Eingabesequenz im aktuellen Stand muss bestehen.

## Grenzen der bisherigen Prüfung

Geprüft wurden echtes Microsoft Edge mit mobiler Emulation, beide Farbschemata, schmale und breite Ansichten, lokale Speicherung, Backup, Serverantwort-Rennen mit Testdaten und Offline-Neuladen. Eine reale iPhone-/Safari-Tastatur, die Installation auf einem physischen iPhone und die Verbindung zum echten Heimserver wurden nicht getestet. Ein Lighthouse-Score wird nicht behauptet; die Audit-Laufzeit ist hier nicht installiert.
