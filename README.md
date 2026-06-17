# Frankly OS — live website

Dette repo lægger dine Frankly OS-sider live på dit eget domæne og holder dem
**automatisk i sync** med Drive-mappen **"Frankly OS"**. Du fortsætter med at
arbejde præcis som nu (lægge/rette HTML-filer i Drive) — siden opdaterer sig selv.

## Sådan virker det

```
Drive-mappen "Frankly OS"      GitHub (denne kode)            Dit domæne
  system-map.html        →   Action henter filerne   →   os.ditdomæne.dk
  ...-process-poster.html     hver time og bygger          (GitHub Pages)
  toolbox-map.html            et website
```

En GitHub Action kører **hver time** (og når du selv trykker på knappen). Den
henter alle HTML-sider fra Drive-mappen, bygger en forside der linker til dem,
og udgiver det hele på GitHub Pages. Lægger du en ny side i mappen, dukker den
automatisk op på forsiden.

---

## Engangsopsætning (ca. 15 min)

> Tip: Jeg kan også klikke det meste igennem for dig via Claude in Chrome — så
> logger du bare ind undervejs. Sig til, hvis du vil det i stedet for guiden.

### A. Læg koden på GitHub
1. Opret evt. en gratis konto på <https://github.com>.
2. Klik **New repository**. Navn fx `frankly-os-site`. Vælg **Public** (indholdet
   er alligevel offentligt). Opret.
3. På repo-siden: **Add file → Upload files**. Træk **hele indholdet** af denne
   mappe ind (eller upload `frankly-os-site.zip` udpakket). 
4. ⚠️ Tjek at mappen `.github/workflows/deploy.yml` kom med — den er afgørende.
   Skriv `deploy.yml` i repo-søgningen hvis du er i tvivl. **Commit changes**.

### B. Giv siden læse-adgang til Drive (service account)
Dette er det eneste lidt tekniske trin. Følg det roligt:
1. Gå til <https://console.cloud.google.com> og log ind som `js@franklyinsure.com`.
2. Opret et projekt (øverst, "Select a project" → **New project**), fx
   `frankly-os-site`. Vælg det bagefter.
3. Slå Drive-API til: søg **Google Drive API** øverst → **Enable**.
4. **APIs & Services → Credentials → Create credentials → Service account**.
   Navn fx `frankly-os-sync` → **Done** (spring roller over).
5. Klik på den nye service account → fanen **Keys → Add key → Create new key →
   JSON**. En `.json`-fil downloades. Gem den godt (kan ikke hentes igen).
6. Kopiér service-accountens **e-mail** (ligner
   `frankly-os-sync@frankly-os-site.iam.gserviceaccount.com`).
7. I Google Drive: højreklik på mappen **"Frankly OS" → Del/Share**, indsæt
   e-mailen, giv rollen **Læser (Viewer)**, send.
8. I GitHub: repoet → **Settings → Secrets and variables → Actions → New
   repository secret**. 
   - Name: `GCP_SA_KEY`
   - Secret: åbn `.json`-filen i en teksteditor, kopiér **alt**, indsæt. Save.

### C. Slå GitHub Pages til
1. Repoet → **Settings → Pages**.
2. Under **Build and deployment → Source**, vælg **GitHub Actions**.

Nu kører den. Tjek fanen **Actions** → "Deploy Frankly OS" → grønt flueben.
Din side er live på `https://<dit-brugernavn>.github.io/frankly-os-site/`
indtil domænet er sat på.

### D. Sæt domænet på (franklydesign.dk hos Simply.com)
Repoet er sat op til subdomænet **os.franklydesign.dk** (se filen `CNAME`), så
hoveddomænet franklydesign.dk er frit til andre test.

1. **GitHub:** repoet → **Settings → Pages → Custom domain** → skriv
   `os.franklydesign.dk` → **Save**. (Bekræfter blot det, `CNAME`-filen allerede siger.)
2. **Simply.com:** log ind → **Mine produkter** → vælg `franklydesign.dk` →
   **DNS / DNS-indstillinger** → tilføj en record:
   - Type: **CNAME** · Navn/host: **os** · Værdi/peger på: **DIT-GITHUB-BRUGERNAVN.github.io.**
   - (DIT-GITHUB-BRUGERNAVN er det navn, du oprettede repoet under.)
3. Vent til det slår igennem (typisk minutter, op til 24 t), og sæt flueben i
   **Enforce HTTPS** under Settings → Pages.

**Vil du hellere bruge hoveddomænet `franklydesign.dk`?** Ret `CNAME`-filen til
`franklydesign.dk`, sæt Custom domain = `franklydesign.dk` i GitHub, og opret hos
Simply fire **A**-records på host **@**:
`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
(valgfrit IPv6/AAAA: `2606:50c0:8000::153` til `…8003::153`).

---

## Daglig brug
- **Ret en side:** erstat HTML-filen i "Frankly OS"-mappen i Drive. Live inden for
  en time.
- **Vil du se ændringen nu?** GitHub → **Actions → Deploy Frankly OS → Run workflow**.
- **Ny side:** læg en ny `.html` i mappen — den dukker automatisk op på forsiden.

## Fejlfinding
- **Forsiden siger "Ingen sider fundet":** mappen er ikke delt med service-account-e-mailen (trin B7).
- **Action fejler med "GCP_SA_KEY mangler":** secret'en er ikke tilføjet rigtigt (trin B8).
- **Domænet virker ikke endnu:** DNS er ikke slået igennem, eller forkert record. Det github.io-link virker imens.

## Senere (valgfrit)
Lige nu **spejler** siden de færdige HTML-filer fra Drive. Vi kan opgradere
Action'en til selv at køre dine `build-map.py` / `render.py` og **regenerere**
siderne fra `brain`-data — så bygger den fra kilden i stedet for at kopiere.
