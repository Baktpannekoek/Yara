# Yara's wereld

Een rustige speel- en leerapp voor een peuter van anderhalf. Gemaakt om samen te gebruiken: jij zit erbij, benoemt wat ze ziet en herhaalt haar woorden. De app werkt op iPhone en iPad zonder App Store.

Link: https://baktpannekoek.github.io/Yara/

## Op de iPhone of iPad zetten

1. Open de link in Safari.
2. Tik op de knop Delen (het vierkant met de pijl omhoog).
3. Kies "Zet op beginscherm" en tik op Voeg toe.
4. Open de app één keer vanaf het beginscherm terwijl je internet hebt. Hij vult dan het hele scherm. Vanaf de tweede keer werkt hij ook zonder internet.

## Vergrendelen zodat ze de app niet kan verlaten

Gebruik "Begeleide toegang" van iOS.

1. Instellingen > Toegankelijkheid > Begeleide toegang: zet aan en stel een code in.
2. Open de app en druk drie keer snel op de zijknop (of de thuisknop).
3. Tik op Start. Vanaf nu werken de knoppen en het vegen naar het beginscherm niet meer.
4. Stoppen: weer drie keer drukken en je code invoeren.

## Wat erin zit

- **Speelwei**: dieren en voertuigen staan op de wei en bewegen zachtjes. Tik op een figuurtje: het springt of schudt en maakt zijn geluid, soms een gek geluidje. Bovenin kies je boerderij, wilde dieren of voertuigen.
- **Kiekeboe**: tik op het huisje, de deur gaat open en er komt een dier of voertuig tevoorschijn met zijn geluid en zijn naam. Tik op het dier voor nog een keer, tik ergens anders om de deur te sluiten. Met de knopjes onderin wissel je tussen boerderij, wilde dieren en garage.
- **Muziek**: zes klankstaven die altijd mooi samen klinken en negen instrumenten met hun naam. Met het knopje onderin ga je naar de liedjes: zes bekende kinderliedjes die jullie zelf inzingen in het oudermenu. Zonder opname klinkt de melodie van Kortjakje en Vader Jacob.
- **Doe mee**: een poppetje springt, klapt, stampt, zwaait, rent of draait, met het woord erbij. Zij doet het na.
- **Bellen**: zeepbellen die opstijgen. Een tik laat ze ploppen. Het tempo (rustig, gewoon, druk) stel je in het oudermenu in.
- **Stickers**: elke tik plakt een sticker op de wei. De strook onderin kiest welke, de doos ruimt op.
- **Prentenboek**: één groot voorwerp per bladzijde, in vier hoofdstukken. De naam wordt uitgesproken bij elke tik.
- **Mijn spullen**: een vijfde hoofdstuk in het prentenboek met foto's van haar eigen beer, bekertje of schoenen. Jij voegt ze toe in het oudermenu.
- **Gezichtje**: tik op neus, ogen, mond, oren, haar en wangen. Een tik naast de onderdelen geeft een ander gezichtje.
- **Zacht einde**: na 10 minuten (instelbaar) gaat de zon onder, zwaaien de dieren en klinkt een slaapliedje. Een tik op de maan begint opnieuw.

## Jullie eigen stem

Tik op het tandwieltje rechtsboven, houd de knop drie seconden ingedrukt en los de rekensom op. In het menu kun je elk woord en elk dierengeluid zelf inspreken. Een bekende stem houdt haar aandacht beter vast dan een computerstem. Zonder opname gebruikt de app de Nederlandse stem van iOS. Staat die er niet op? Instellingen > Toegankelijkheid > Gesproken materiaal > Stemmen > Nederlands.

## Opnames bewaren en overzetten

In het oudermenu staat "Opnames bewaren". Daarmee maak je één bestand met alle opnames, foto's en instellingen. Bewaar het in de Bestanden-app of in iCloud Drive, of deel het naar je andere apparaat. Op de iPad kies je in het oudermenu "Terugzetten uit bestand" en alles staat erop. Zo hoef je nooit opnieuw alles in te spreken.

## Haar eigen spullen

Peuters herkennen hun eigen beer sneller dan een getekende. In het oudermenu maak je een foto van iets van haar, typt de naam erbij en spreekt die eventueel in. De foto komt in het prentenboek, in het hoofdstuk met de camera. Bij elke tik hoort ze de naam. Foto's worden verkleind opgeslagen op het apparaat.

Opnames, foto's en instellingen blijven op het apparaat. Niets gaat naar internet.

Let op: de app op het beginscherm en Safari delen hun opslag niet. Spreek de woorden in en voeg foto's toe binnen de app op het beginscherm, niet in Safari. Dan blijven opnames, foto's en instellingen bewaard. Elke iPhone of iPad heeft zijn eigen opnames. Met "Opnames bewaren" in het oudermenu zet je ze over naar een ander apparaat.

## Geen geluid of traag geluid?

- **Belschakelaar op stil.** iOS dempt dan de speelgeluiden, maar niet de stem. De app omzeilt dat: na de eerste tik op de zon speelt een onhoorbaar bestand, waardoor iOS alle geluid doorlaat. Hoor je toch niets, zet de schakelaar dan op luid en tik nog eens op de zon.
- **De computerstem start traag.** Het eerste woord laat op iOS even op zich wachten. Eigen opnames klinken meteen, dus inspreken loont.
- **Volume.** In het oudermenu staat een schuif. Het volume van het apparaat zelf telt ook mee.
- **Nieuwe versie.** De app haalt updates vanzelf binnen. Sluit de app helemaal en open hem opnieuw als iets zich raar gedraagt.

## Waarom de app zo is gemaakt

- Alleen tikken. Slepen en vegen lukt nog niet op deze leeftijd.
- Elke tik geeft meteen beeld en geluid. Dat is hoe een peuter oorzaak en gevolg leert.
- Geen beloningen, geen sterren, geen "kom terug", geen tijdsdruk, geen autoplay. Daardoor is de app niet verslavend.
- Rustig tempo, zachte kleuren, zachte geluiden.
- Vragen op het scherm ("Wat zegt de koe?") zijn voor jou, om samen praten uit te lokken. Daar leert ze het meest van.

Kort en samen is het advies van het Nederlands Jeugdinstituut voor kinderen onder de twee: hooguit zo'n tien minuten per keer, met een ouder erbij.

## Geluiden

De dieren, voertuigen en gekke geluidjes zijn echte opnames van Wikimedia Commons, ingekort voor de app. De bronnen en licenties staan in [sounds/CREDITS.md](sounds/CREDITS.md). Jullie eigen opname gaat altijd voor, en als een geluid nog niet geladen is klinkt een getekende versie.

## Zelf aanpassen

Alles is gewone HTML, CSS en JavaScript zonder bouwstap. Woorden en dieren staan in `js/words.js`, de tekeningen in `js/art.js`, de geluiden in `js/audio.js`. Verhoog na een wijziging het versienummer bovenin `sw.js`, dan haalt de app de nieuwe bestanden op.

Lokaal testen:

```bash
python -m http.server 8080
```

Open daarna http://localhost:8080 op de computer, of het IP-adres van de computer op een telefoon in hetzelfde wifi-netwerk.
