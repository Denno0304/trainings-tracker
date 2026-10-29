# Trainings-Tracker

Persönliche, installierbare Web-App für vier flexible Trainingseinheiten. Kein Build und keine Laufzeitabhängigkeiten.

## Nutzen

- Oberkörper A → Unterkörper A → Oberkörper B → Unterkörper B, ohne feste Wochentage.
- Plan für ca. 60 Minuten Krafttraining plus 20 Minuten zügiges Gehen. Die tatsächliche Dauer hängt von Pausen, Gerätebelegung und Aufwärmen ab.
- Gewicht mit Komma oder Punkt, Wiederholungen, ausdrücklicher Übungsabschluss und Pausentimer.
- Eingaben bleiben beim Tippen im Feld. Zurück/Weiter/Fertig in einer eigenen Eingabeleiste.
- Verlauf einschließlich früherer Übungen; getrennte Kennungen für beidbeinige und frühere einbeinige Beinpresse.
- Bewusster Trainingsstart mit leeren Feldern; letzte Leistungen bleiben als Vergleich sichtbar. Werte werden nur auf Wunsch in leere Felder übernommen.
- Unterbrochene Trainings bleiben als getrennte Entwürfe je Einheit erhalten, auch über einen Datumswechsel hinweg.
- Ausschließlich lokales Speichern und manuelle JSON-Datei-Backups mit Datei-Wiederherstellung. Keine Heimserver- oder Cloud-Synchronisierung.
- Systemabhängiges helles/dunkles Erscheinungsbild und Offline-App-Shell.

## Auf dem iPhone installieren

Die veröffentlichte HTTPS-Adresse in Safari öffnen. Über Teilen → „Zu Home-Bildschirm hinzufügen“ installieren, gegebenenfalls „Als Web-App öffnen“ aktivieren. Danach das neue Symbol nutzen. Eine native App-Store-App ist dafür nicht erforderlich.

Vor einem Wechsel der Webadresse, des Geräts oder der Installation unter Einstellungen ein JSON-Backup herunterladen. Lokale Browserdaten sind an die jeweilige Webadresse und Browserumgebung gebunden. Die bestehende App nicht löschen, bevor die Daten gesichert sind.

## Entwicklung und Auslieferung

Die Dateien index.html, styles.css, app.js, sw.js, manifest.webmanifest und die drei PNG-Icons müssen gemeinsam unter derselben Adresse bereitgestellt werden. Für Service Worker ist HTTPS erforderlich; localhost ist für Entwicklung zugelassen. Bei Änderungen am App-Shell die Cacheversion in sw.js erhöhen. Eine vorhandene Installation bietet die neue Version zur bewussten Aktivierung an, nachdem Eingaben gesichert wurden.

Diese Fassung verwendet keinen Heimserver. Auch alte gespeicherte Serveradressen lösen keine Verbindung aus. Eingaben bleiben in localStorage auf dem Gerät; unter Einstellungen lässt sich eine JSON-Datei mit Verlauf und offenen Entwürfen exportieren und später über die Dateiauswahl wiederherstellen. Alte Sync-Metadaten werden nicht in neue Datei-Backups übernommen.

„Neues Training starten“ öffnet leere Eingabefelder. „Letzte Werte übernehmen“ füllt nur leere Felder und setzt keine Erledigt-Markierungen. Erst „Einheit speichern & abschließen“ erzeugt einen eigenen Verlaufseintrag. Zwei bewusst gestartete Trainings am selben Tag bleiben auch bei identischen Werten getrennte Einträge. „Neu beginnen“ fragt vor dem Ersetzen eines offenen Entwurfs nach und erhält bereits abgeschlossene Trainings.

Vor einer Backup-Wiederherstellung oder dem Ersetzen eines Entwurfs wird eine lokale Sicherheitskopie angelegt. Bis zu fünf solche Kopien bleiben auf demselben Gerät; sie schützen nicht vor dem Löschen der Website-Daten oder Geräteverlust. Für diese Fälle muss eine Datei außerhalb der App aufbewahrt werden, zum Beispiel in „Dateien“ auf iCloud Drive. Das geschieht manuell und nicht durch automatische Cloud-Anbindung.

## Tests

Mit Node.js 22 oder neuer:

```text
node --check app.js
node --check sw.js
node tests/chart.mjs
node tests/browser.mjs
```

Der Browser-Test benötigt die vorhandene Omowright-Skill-Laufzeit und einen installierten Chromium-Browser. Mit `OMOWRIGHT_SKILL` den Pfad zur Browser-Skill setzen; `TEST_BROWSER` setzt den Browserpfad. Die Windows-Voreinstellung ist Microsoft Edge. Der Test erstellt einen separaten temporären Browser, lokale Beispieldaten und einen lokalen HTTP-Testserver; der echte Heimserver wird nicht verwendet. Bildschirmnachweise liegen im benachbarten `qa`-Ordner.

`node tests/browser.mjs --baseline` führt den Eingabe-Regressionsfall gegen Commit 27b8020 aus und muss mit dem alten Fehler scheitern. Die unveränderte Eingabesequenz im aktuellen Stand muss bestehen.

`node tests/browser.mjs --previous-version` prüft den bewussten Trainingsstart gegen die vorherige Entwurfsfassung a713af9 und muss dort scheitern, weil Eingaben ohne Trainingsstart bereits bearbeitbar waren.

## Grenzen der bisherigen Prüfung

Die Browserprüfung umfasst echtes Microsoft Edge mit mobiler Emulation, beide Farbschemata, schmale und breite Ansichten, Trainingsstart/Fortsetzung/Wertübernahme, Dateiwiederherstellung, lokalen Speicher, Netzwerkbeobachtung und Offline-Neuladen. Eine reale iPhone-/Safari-Tastatur und die Installation auf einem physischen iPhone wurden nicht geprüft. Der frühere Heimserver war offline und wurde nicht sicherheitsfreigegeben; diese Fassung verwendet ihn nicht. Ein Lighthouse-Score wird nicht behauptet.
