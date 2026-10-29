# Datenspeicherung und Grenzen

Diese App speichert Trainingswerte, Verlauf und offene Entwürfe ausschließlich im Browser-Speicher des Geräts. Sie verwendet keine Anmeldung, keine Analytics, keine Heimserver-Synchronisierung und keine automatische Cloud-Sicherung. Alte Serveradressen in übernommenen Daten werden nicht für Verbindungen verwendet.

Der öffentliche GitHub-Code enthält den Trainingsplan und künstliche Testdaten. Persönliche Eingaben werden weder als GitHub-Dateien gespeichert noch an eine Daten-API geschickt. Die App-Dateien werden weiterhin vom Hosting-Anbieter abgerufen; dessen gewöhnliche Zugriffsprotokolle sind davon getrennt.

Eine Content Security Policy mit `connect-src 'none'` blockiert Verbindungen über Fetch, XMLHttpRequest, WebSocket und vergleichbare Schnittstellen. Sie ist zusätzliche Absicherung gegen versehentliche Datenverbindungen, kein Schutz gegen beliebige bösartige Änderungen am App-Code. Bestehende Inline-Ereignishandler benötigen weiterhin `script-src 'unsafe-inline'`. GitHub-Konto und Veröffentlichungszugang müssen daher geschützt bleiben.

Datei-Backups enthalten den Trainingsverlauf und offene Entwürfe als lesbares JSON. Die App verschlüsselt sie nicht zusätzlich. Backups sollten nur an einem privaten Speicherort abgelegt werden. Das Ablegen einer Datei auf iCloud Drive ist eine manuelle Handlung in Apples Dateien-App, keine automatische Synchronisierung dieser App.

Lokale Daten können durch das Löschen von Website-Daten, einen Wechsel der Webadresse, Browserumgebung oder des Geräts verloren gehen. Lokale Sicherheitskopien liegen im selben Browser-Speicher und ersetzen deshalb kein exportiertes Datei-Backup. Die App kann nicht bestätigen, ob eine gestartete Download-Datei vom Nutzer dauerhaft sicher abgelegt wurde.

Browser-Speicher ist nach Origin getrennt, nicht nach Projektordner. Andere Seiten und Skripte unter derselben Kombination aus Protokoll, Host und Port können auf denselben Speicher zugreifen. Unvertrauenswürdige Anwendungen sollten daher nicht unter derselben Origin veröffentlicht werden.

Der frühere Heimserver wurde wegen fehlender Erreichbarkeit nicht sicherheitsgeprüft oder freigegeben. Die lokale Fassung kontaktiert ihn nicht und verändert oder löscht dort keine Daten. Physische iPhone-/Safari-Prüfung und eine allgemeine Betriebssystem-Sicherheitsprüfung sind nicht durch die Browser-Emulation abgedeckt.
