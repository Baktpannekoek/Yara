# Plan: Yara's wereld naar een hoog niveau

Versie 15 is de basisversie. Dit plan beschrijft hoe we de app optillen naar het niveau van apps als Bimi Boo: figuurtjes die leven, werelden met diepte en een bibliotheek die we voor elk plekje opnieuw kunnen gebruiken.

## Wat Bimi Boo goed doet (en wij nog niet)

Gekeken naar de schermen die je stuurde en de Bimi Boo-apps:

1. **Figuurtjes zijn opgebouwd uit losse delen.** Hoofd, ogen, mond, armen, benen, oren, staart, wielen, schoorsteen. Elk deel beweegt apart: ogen knipperen, oren wiebelen, een staart zwaait, wielen draaien. Bij ons is een dier één plaatje met een lijf eronder geplakt.
2. **Alles ademt.** Niets staat helemaal stil: figuurtjes ademen, kijken rond, knipperen om de paar seconden, verschuiven hun gewicht. Daardoor voelt de wereld levend, ook zonder tik.
3. **Een tik geeft een eigen reactie per figuur.** De koe kauwt en loeit, de eend fladdert en kwaakt, de trein puft stoom en rijdt een stukje, de boot deint en toetert. Bij ons doet elk figuurtje dezelfde vier trucjes.
4. **Tekenstijl: dikke lijnen, grote ogen, ronde vormen, twee tinten per kleur** (een lichte en een schaduwtint). Onze tekeningen hebben dunne lijnen en één vlakke kleur, daardoor ogen ze als stickers.
5. **Werelden met lagen en logische plekken.** Lucht met wolken en vliegtuigen, verre heuvels, bomen, een vijver waar de eend en de boot in liggen, een weg waar auto's over rijden, gras vooraan met bloemen. Figuurtjes staan niet in een rij maar verspreid, groter vooraan, kleiner achteraan.
6. **Kleine extra's:** stoom, stof, sterretjes, hartjes, muzieknoten, spetters. Korte deeltjeseffecten bij een tik.
7. **Overgangen met veer:** een scherm schuift of stuitert binnen, een tegel wordt even ingedrukt. Niets verschijnt hard.
8. **Geluid en beeld altijd samen,** direct op de tik (niet pas bij loslaten). Onderzoek naar peuters bevestigt dat ze een trage reactie niet opmerken en dan dubbel tikken.

Wat we **niet** overnemen: beloningen, ontgrendelen, sterren, abonnementsschermen. Die maken Bimi Boo verslavingsgevoelig en dat was vanaf dag één niet de bedoeling.

## Wat er nu niet goed genoeg is

- Figuurtjes staan symmetrisch op een rij onderin. Een boot hoort in het water, een vliegtuig in de lucht, oma op het bankje.
- Dieren zijn een kop met een losse romp. Geen oren of staart die bewegen, geen ogen die knipperen.
- Reacties zijn generiek (springen, schudden). Geen stoom, geen rijdende auto, geen fladderende eend.
- Dunne lijnen, vlakke kleuren, weinig schaduw: het oogt plat.
- Elke scene bouwt zijn eigen tekeningen en animaties. Er is geen bibliotheek die we hergebruiken.

## Voorstel: een eigen figuur- en animatiebibliotheek

Een nieuwe laag `js/lib/` waar alle plekjes op gaan draaien.

### 1. Figuren als opbouwpakketten (`js/lib/figures/`)

Elk figuur is een klein gegevenspakket: welke delen, waar het draaipunt zit, in welke volgorde ze liggen, welke kleuren.

```
figuur "koe":
  delen: lijf, poot-lv, poot-rv, poot-la, poot-ra, staart, kop, oor-l, oor-r, oog-l, oog-r, snuit, hoorns
  draaipunten: oren bij de aanzet, staart bij de romp, kop bij de nek, poten bij de heup
  kleuren: wit met zwarte vlekken, roze snuit; schaduwtint per kleur
  idle: ademen, kauwen, staart zwaaien, oren wiebelen, knipperen
  reacties: loeien (kop omhoog, mond open, lijf iets uitrekken), springen, kijken naar de tik
```

Drie bouwfamilies met gedeelde onderdelen, zodat we snel veel figuren maken die toch verschillen:

- **Dieren**: lijfvorm per familie (viervoeter, vogel, kikker, krokodil, giraf), kop per soort, oren, staart, vacht of veren, eigen bijzonderheden (slurf, manen, kam, strepen, vlekken). Ogen en mond zijn altijd aparte delen.
- **Mensen**: hoofd, haar (zes kapsels), ogen, mond, romp, armen met handen, benen met schoenen, accessoires (bril, knotje, speen, hoed). Huid, haar en kleding als kleurkeuze. Mama, papa, opa, oma, baby, kindje, en later Yara zelf.
- **Voertuigen**: carrosserie, wielen (draaien), raampjes, schoorsteen (stoom), lampen (knipperen), propeller (draait), zeil of vlag (wappert).

Tekenstijl voor alles: lijndikte 3, twee tinten per kleur (vlak plus schaduw), grote ogen met lichtpuntje, dikke ronde vormen, zachte grondschaduw. De bestaande tekeningen worden in die stijl opnieuw gemaakt; de tegel-iconen en de boerderij, jungle en garage ook.

### 2. Animatiemotor (`js/lib/anim.js`)

Bouwstenen die op elk deel van elk figuur werken, via de Web Animations API (soepel op iPhone, geen bibliotheek van buiten):

- **Basisbewegingen**: draaien om een draaipunt, verschuiven, uitrekken en platdrukken (squash en stretch met behoud van volume), vervagen.
- **Loops**: ademen, knipperen op een onregelmatig ritme, rondkijken, gewicht verplaatsen, wiebelen, deinen op het water, draaiende wielen, wapperende vlag.
- **Reacties**: springen (aanzet, lucht, landing met platdrukken), schudden, kop omhoog en roepen, fladderen, stukje rijden en terug, draaien, zwaaien, klappen, stampen.
- **Tijdlijn**: reacties zijn reeksen stappen die achter elkaar lopen, met een rem tegen stapelen en altijd een nette terugkeer naar rust.
- **Kijken naar de tik**: ogen en kop draaien kort naar de plek waar ze tikte, dan terug.

### 3. Effecten (`js/lib/fx.js`)

Korte deeltjeseffecten: stoomwolkjes, stof bij een landing, sterretjes, hartjes, muzieknoten, spetters, veertjes. Altijd kort, zacht en bij de tik, nooit uit zichzelf.

### 4. Werelden (`js/lib/scene.js`)

Een wereld is een gegevenspakket met lagen en plekken:

- **Lagen**: lucht, wolken (drijven), verre heuvels, bomen (wuiven), vijver (rimpelt), weg, gras, bloemen (knikken). Lagen schuiven iets ten opzichte van elkaar als het toestel kantelt (diepte).
- **Plekken**: vaste, bewust asymmetrische posities met een zone (water, weg, lucht, gras, bankje) en een diepte. De boot krijgt een waterplek, het vliegtuig een luchtplek, oma het bankje, de kip bij het hek. Figuren schalen met de diepte.
- **Vier werelden**: boerderij, savanne, stadje met weg en haven, park met bankje en zandbak. Elke wereld heeft een rustige geluidslaag (wind, vogels, water) onder de achtergrondmuziek.

### 5. Tik en reactie (`js/lib/touch.js`)

Ruime tikzones per figuur (hele figuur plus marge), reactie op het neerzetten van de vinger, rem tegen dubbel tikken, beeld en geluid altijd samen. Elke tik levert iets zichtbaars op, ook een tik naast een figuur (bloem knikt, gras ruist).

## Wat dit per plekje betekent

| Plekje | Nu | Straks |
|---|---|---|
| Speelwei | Rij figuurtjes met vier trucjes | Vier werelden met verspreide, levende figuren die elk hun eigen ding doen |
| Kiekeboe | Deur open, kop erachter | Hetzelfde ritme, maar het dier erachter leeft: kauwt, knippert, fladdert, roept |
| Doe mee | Eén poppetje, zes bewegingen | Poppetje uit de bibliotheek, uitdrukking in het gezicht, stof en sterretjes bij springen en klappen |
| Muziek | Instrument en toetsen | Instrumenten met beweging (trommelstok slaat, snaren trillen, fluit wiebelt), poppetje speelt echt mee |
| Startscherm en wereld | Zon, overvliegers, tegels | Levende wereld: tegels met een figuurtje dat beweegt, overgangen met veer |
| Prentenboek en gezichtje | Statische tekeningen | Zelfde bibliotheek: het voorwerp reageert (bal stuitert echt, auto rijdt), gezichtje knippert en kijkt |

## Fasen

1. **Fundament (eerst)**: `anim.js`, `fx.js`, `scene.js`, `touch.js`, nieuwe tekenstijl. Drie voorbeeldfiguren volledig af: koe, eend, trein. De speelwei boerderij opnieuw gebouwd als vitrine. Jij test: klopt het gevoel?
2. **Alle figuren**: de rest van boerderij, wilde dieren, voertuigen en mensen in de bibliotheek, elk met eigen idle en reactie.
3. **Werelden**: savanne, stadje met haven, park. Verspreide plekken, diepte, geluidslagen.
4. **De andere plekjes** op de bibliotheek: kiekeboe, doe mee, muziek, prentenboek, gezichtje, startscherm en wereld.
5. **Afwerking**: overgangen, deeltjes, tempo-afstelling op de iPhone, batterij en prestaties (hoogstens twaalf bewegende figuren tegelijk, animaties pauzeren buiten beeld).

Per fase een versie op GitHub Pages, zodat je tussendoor met haar kunt testen.

## Keuzes die ik aan jou voorleg

1. **Zelf getekend of gekocht?** Zelf getekend in code (zoals nu) houdt alles in eigen hand en de app klein en offline. Het haalt niet de pure tekenkwaliteit van een professionele illustrator. Een alternatief is een gekocht of vrij beschikbaar tekenpakket met figuren in losse delen (bijvoorbeeld van een illustratiewinkel, kosten rond enkele tientallen euro's). Mijn advies: zelf getekend, maar in de nieuwe dikke stijl, en als je later een illustrator inschakelt past dat in dezelfde opbouwpakketten.
2. **Hoeveel beweging?** Bimi Boo zet alles tegelijk in beweging. Onderzoek bij peuters laat zien dat te veel beweging het moeilijker maakt om te zien wat je tik deed. Mijn advies: rustige idle-bewegingen, duidelijke reactie op de tik, deeltjes alleen bij de tik.
3. **Achtergrondmuziek**: alleen zacht en per wereld, met de schakelaar in het oudermenu. Dat houden we.

## Wat niet verandert

Alleen tikken, geen beloningen, geen tijdsdruk, zacht einde, eigen stem van papa en mama gaat altijd voor, alles offline en op het apparaat.

## Omvang

Dit is het grootste stuk werk tot nu toe: ruwweg zo groot als alles wat er al staat. Fase 1 is ongeveer een derde daarvan en levert meteen een voelbaar verschil op in de speelwei.
