# CHANGELOG

## Tegnforklaring

### ✨ - Ny funksjonalitet

### ⚡ - Forbedret funksjonalitet

### 🦟 - Fikset en bug

### 🎨 - Designendringer

---

## Neste versjon

## Versjon 1.1.1 (15.07.2021)

- ✨ **Nye studenter**. Laget en side for nye studenter i TIHLDE med info om fadderuka, FAQ, verv, idrett, samt en infoboks på forsiden.
- ⚡ **Google Analytics**. Lagt til flere "events" for å bedre kunne tilpasse siden etter hvordan brukerne benytter den.
- ⚡ **Nyheter**. Lagt til publiseringsdato i nyhets-kort.
- 🎨 **Profil**. Endret utseende på meny i profil på små skjermer.
- 🦟 **Stories**. Fikset bug der skygge ved stories i dark-mode på iOS hadde feil farge.

## Versjon 1.1.0 (10.07.2021)

- ✨ **Material-UI**. Oppdatert Material-UI til v5 som inneholder nye komponenter, ikoner, utseende og annen forbedret funksjonalitet. Her er det også gjort en stor jobb ved å oppdatere breaking changes som også gjør det enklere å oppdatere til v6 når det blir aktuelt.
- ✨ **Data**. Hvis du har oppe siden i flere faner så blir oppdatert data delt mellom fanene.
- ✨ **Banner**. Tekst i banner leser nå markdown og det er dermed mulig å bruke markdown i gruppe-admins beskrivelse.
- ✨ **Deling**. Hvis brukers enhet ikke støtter Web Share API, vises det nå en snackbar som sier at link er kopiert til utklippstavle ved klikk.
- ✨ **Stories**. Besøk i stories lagres i url slik at du kommer tilbake til riktig story ved navigering bakover i loggen.
- ✨ **Navigering**. Søk og filtrering i arrangementer og karriere lagres i url slik at det gjennopprettes ved navigering bakover i loggen.
- ✨ **Admin**. Det er nå mulig å gå direkte fra arrangement-/nyhet-/karriereadmin-sidene til det respektive innholdet ved hjelp av en ny knapp.
- ✨ **Github**. Lagt til link til oppretting av nytt issue på Github i Index sin side i pages.
- ✨ **Varsler**. Antall uleste varsler i profilen vises nå på mobil.
- ✨ **Varsler**. Linker kan klikkes på.
- ⚡ **Arrangementer**. Ved registrering av oppmøte står det nå navn på deltager i tilbakemeldingen. Siden er også blitt raskere og det er slutt på at samme QR-kode skannes flere ganger etter hverandre.
- ⚡ **Dependencies**. Oppdatert en drøss av avhengigheter til nyeste versjon.
- ⚡ **Cache**. Arrangements-kategorier og varsler fra admins blir nå cachet.
- ⚡ **Navigering**. Menyen lukkes nå i en overgang og ikke umiddelbart slik at siden flyter bedre. Gjennom denne forbedringen har det også blitt enklere å justere utseende på menyen individuelt per side.
- ⚡ **Varsler**. Hvis admins har sendt ut flere varsler samtidig vises nå alle i rekkefølge. Utseende er også oppdatert til å være lik andre deler av siden.
- ⚡ **Ytelse**. Lazy loader flere tyngre komponenter for å øke farten på siden.
- ⚡ **Ytelse**. Slettet 26 ubrukte filer slik at siden blir raskere.
- 🎨 **Utseende**. Fargene på siden har blitt justert for å øke synlighet og kontraster. Hjørner og diverse annet design er også blitt forbedret.
- 🎨 **Navigering**. Meny på mobil er flyttet til bunnen av skjermen slik at den blir enklere å bruke med en hånd, samt at man kan navigere mellom sidene raskere.
- 🎨 **Dato-velger**. Ny dato-velger som skal være enklere å bruke, samt at den også støttes i Safari.
- 🎨 **Switch**. Oppdatert utssende på switches som brukes på siden.
- 🎨 **QR-kode**. Endret utseende på QR-koder for å gjøre skanning raskere.
- 🎨 **Scrollbar**. Scrollbar har et nytt eget utseende i mørkt tema.
- 🎨 **Font**. Roboto-fonten er byttet ut med Inter-fonten.
- 🎨 **Banner**. Bølgen tar nå mindre plass.
- 🎨 **Tema**. Tema-velgeren er flyttet til til toppen av siden slik at den blir enklere å finne.
- 🦟 **Filopplastning**. Fikset bug der det ikke var mulig å laste opp nytt bilde i pages.
- 🦟 **Bruker**. Admin-brukere kan oppdatere sin egen profil igjen.
- 🦟 **Stories**. Fikset en bug der skyggen ved siden av stories på Safari ikke hadde riktige farger.
- 🦟 **Pages**. Fikset bug der man måtte trykke tilbake-knappen i pages i nettleseren to ganger for å gå tilbake.

## Versjon 1.0.10 (10.05.2021)

- ✨ **Filtrering**. Det er mulig å finne tidligere arrangementer og annonser ved å justere filtrering.
- ✨ **Pages**. Lagt til mulighet til å søke innad i pages.
- ✨ **Profil**. Pagination på arrangementer og badges, samt lagt til dine grupper.
- 🎨 **Nyheter**. Nyheter viser nå hvilket år de ble publisert
- 🦟 **Sidebar**. Lukker sidebar ved klikk til annen side innad i pages.

## Versjon 1.0.9 (05.05.2021)

- ⚡ **Grupper**. Lagt til pagination, og avatar på gruppe medlemmer.
- ✨ **Brukeradmin**. HS og Index kan nå redigere brukere i brukeradmin.
- ✨ **Filopplastning**. Admin kan nå laste opp filer i admin-tabben og motta en link de kan dele og bruke videre.
- ⚡ **Grupper**. Info om grupper kan nå inneholde linker.
- ⚡ **Cache**. All cache på siden blir nå oppdatert når bruker logger inn eller ut.
- ⚡ **Admin**. Oppdatert utseende på liste over admin-funksjonalitet.

## Versjon 1.0.8 (26.04.2021)

- ⚡ **Fjern bilde**. Det er nå mulig å fjerne et bilde som er lagt til arrangementer, nyheter, annonser og sider.
- ⚡ **Tilgangs-håndtering**. Endret håndtering av tilganger til nytt system hvor brukere får tilganger basert på medlemskap i grupper.
- ✨ **Gruppe-administrator**. Nå er det mulig for de ulike gruppe-lederne å legge til medlemmer i gruppen.

## Versjon 1.0.7 (09.04.2021)

- ✨ **Spørsmål ved påmelding**. Lagt til støtte for spørsmål ved påmelding til arrangementer, men ikke aktivert det ettersom støtte for svar ikke er klart.
- ✨ **Del**. Lagt til del-knapp på arrangementer, nyheter, annonser og pages.

## Versjon 1.0.6 (26.03.2021)

- 🎨 **Påske**. Lagt til påsketema

## Versjon 1.0.5 (21.03.2021)

- ✨ **Link-forkorter**. Medlemmer kan lage egne korte linker på s.tihlde.org/[navn].
- ✨ **Kalender**. Knapp for å legge til arrangement i kalenderen din.

## Versjon 1.0.4 (08.03.2021)

- ⚡ **Pagination i varsler**. Lagt til pagination i varsler, samt forbedret håndtering av "leste" varsler.
- 🦟 **Styling i tekst.** Fikset en bug der styling på elementer i tekst/markdown forsvant når man byttet tema.
- ⚡ **Refaktorert checkbox og switch**. Laget en egen komponent for checkboxes og switches som lettere kan brukes med react-hook-form
- 🎨 **Nytt design av QRcode.** Laget custom QRcode theme for mer helhetlig tema.
- 🎨 **Nytt design arrangement-deltagere**. Mindre bokser på deltagerliste med mer info ved trykk på boks.

## Versjon 1.0.3 (22.02.2021)

- ✨ **Spesial innhold i pages**. Lagt til mulighet for at man kan lage spesial-komponenter som kommer inne på pages-sider.
- ⚡ **Flyttet innhold til pages**. Flyttet "Om TIHLDE", "Kontakt oss", "Tjenester", "Ny student", "Lover og regler", "Personvern" og "Arrangementsregler" til pages slik at det blir dynamisk.
- ⚡ **404-side til Typescript**. Endret 404-siden til Typescript og oppdatert med nye linker.
- ✨ **Profilbilde**. Legge til funksjonalitet for visning og endring av profilbilde

## Versjon 1.0.2 (14.02.2021)

- ⚡ **Bedre brukeradmin**. Nytt utseende og bedre filtrering/søk.
- ⚡ **Avmelding på venteliste**. Personer på ventelisten kan nå melde seg av arrangementer også etter avmeldingsfristen.
- 🎨 **Avrundede ikoner**. Avrundet alle ikoner på siden for gjennomgående utseende.
- ⚡ **Oppdatert nyheter**. Bedre caching og nytt utseede i admin og inn på spesifikke nyheter.
- 🦟 **Bedre feilhåndtering**. Feilmeldinger som mottas fra backend håndteres bedre og mer sikkert.
- ✨ **Oppdatert kokeboka**. Endret til bruk av react query istedenfor selvlaget hook.
- ✨ **Oppdatert arrangementer**. Bedre caching med React Query og finere innlastning.
- 🎨 **Ny footer**. Footeren har fått en oppgradering.
- ✨ **Om Index**. Index har fått en egen side.
- ✨ **Oppdatert karrieresider**. Ingress og link er ikke lenger krevet. I tillegg kan man velge at en jobbannonse har løpende opptak.

## Versjon 1.0.1 (01.02.2021)

- ✨ **Lagt til pages**. Legg til pages, et eget CMS der man kan publisere sider med tilhørende undersider med relevant innhold
- 🎨 **Finere innlastning**. Finere innlastning av arrangementer, nyheter, jobbannonser og stories
- ⚡ **Bedre feilmeldinger i skjemaer**. Lettere å se feilmeldinger i skjemaer ved at feil vises under knapp
- ✨ **Nye muligheter i markdown**. Mulighet til å legge inn kort til arrangementer, nyheter og jobbannonser, samt utvidsbokser i markdown

## Versjon 1.0.0 (25.01.2021)
