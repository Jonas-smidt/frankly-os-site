# Frankly Site Data Feeds

These local JSON files are HTTP-preview feeds for Frankly OS site surfaces.

Do not edit them by hand unless a one-off local experiment requires it. Regenerate them from the canonical system-intelligence artifacts with:

```bash
python3 os-visualization/scripts/sync-site-data-feeds.py
```

Canonical sources:

- `os-visualization/system-intelligence/activation-queue-data.json`
- `os-visualization/system-intelligence/surface-gate-registry.json`
- `os-visualization/system-intelligence/mission-control-queue.json`
- `os-visualization/system-intelligence/run-registry.json`

Current generated feeds:

- `activation-queue-data.json`
- `surface-gate-registry.json` - currently includes twelve local surfaces, including Agent Brief Builder, Mission Control Queue, Progress Map, Studio, Control Cockpit and Observatory.
- `mission-control-queue.json` - currently includes ten local mission batches with forty mission rows.
- `flight-recorder.json` - generated from Run Registry for Observatory's Flight Recorder replay rail and Studio's recent machine memory, currently led by Claude Run-to-Packet Launcher v0.1.

The site pages keep inline fallback data, so they still work when opened directly from the filesystem.
