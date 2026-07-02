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

Current generated feeds:

- `activation-queue-data.json`
- `surface-gate-registry.json` - currently includes nine local surfaces, including Agent Brief Builder, Mission Control Queue and Progress Map.
- `mission-control-queue.json` - currently includes nine local mission batches with thirty-six mission rows.

The site pages keep inline fallback data, so they still work when opened directly from the filesystem.
