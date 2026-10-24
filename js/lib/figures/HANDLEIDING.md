# Figuren maken voor de bibliotheek

Elk figuur is een module in `js/lib/figures/<key>.js` die één object exporteert, bijvoorbeeld `export const hond = { key, svg, idle, react }`. Lees eerst `koe.js`, `eend.js` en `trein.js`: die zijn de maat.

## Tekening: `svg(opts)`

- Gebruik `svgWrap(inner)` uit `../style.js`: viewBox 0 0 120 120. De voeten staan op y 112, de grondschaduw op y 114 (`shadow(cx, 114, rx)`).
- Stijl: lijndikte 3 (`${L}`), dunne lijn 2 (`${L2}`), inkt `INK`. Elke kleur heeft een schaduwtint via `shade(kleur, -0.16)`: teken de vorm in de hoofdkleur, daaroverheen de onderste helft in de schaduwtint, daarna de omlijning nog eens zonder vulling. Kleuren uit `PAL`.
- Grote ogen met `eye('oog-l', cx, cy, r)`; dat maakt vanzelf `oog-l` (knipperen) en `oog-l-pupil` (kijken). Blosjes met `cheeks()`.
- Delen met `part(naam, draaipuntX, draaipuntY, inhoud)`. Het draaipunt is de plek waar het deel aan het lijf zit: oor bij de aanzet, staart bij de romp, kop bij de nek, poot bij de heup, wiel in het midden, vleugel bij de schouder.
- Vaste namen: `lijf`, `kop`, `mond`, `oog-l`, `oog-r` (of `oog`), `oor-l`, `oor-r`, `staart`, `poot-lv`, `poot-rv`, `poot-la`, `poot-ra`, `vleugel`, `snavel-onder`, `wiel-1..n`, `schoorsteen`, `lamp`. Extra delen mogen (bijvoorbeeld `slurf`, `manen`, `propeller`, `kam`).
- Volgorde in de DOM is de laagvolgorde: eerst wat achter zit (achterpoten, staart), dan lijf, dan voorpoten, dan kop.
- `opts.zone` zegt waar het figuur staat (`gras`, `water`, `lucht`, `spoor`, `weg`, `bank`). Een eend in het water heeft geen poten; een vogel in de lucht geen schaduw.

## Rust: `idle(fig)`

Rustig, niet alles tegelijk. Gebruik uit `../anim.js`:
- `A.breathe(fig, 'lijf', 0.02, 3000)` ademen
- `A.blinkLoop(fig, ['oog-l', 'oog-r'])` knipperen
- `A.sway(fig, 'staart', 10, 2200)` zwaaien
- `A.floatLoop(fig, fig.svg)` deinen (water), `A.bobLoop(fig, fig.svg, 2, 2800)` zweven (lucht)
- `A.spinLoop(fig, 'propeller', 600)` draaien
- `A.occasionally(fig, [4000, 9000], () => ...)` af en toe iets: `A.wiggle(fig, 'oor-l', 14, 2, 180)`, `A.chew(fig, 'mond', 4)`, `A.lookAt(fig, ['oog-l-pupil', 'oog-r-pupil'], dx, dy)`, `A.tilt(fig, 'kop', 8, 400, 500)`, `A.flap(fig, 'vleugel', 18, 2, 160)`.

## Tik: `async react(fig, ctx, tap, world)`

- Wissel af met `fig.reactCount` (zie koe.js): minstens twee verschillende reacties, passend bij het figuur. Elk dier zijn eigen ding: een hond kwispelt en blaft, een kat rekt zich uit en spint, een kip fladdert en legt een ei (sterretjes), een kikker springt ver, een leeuw brult met schuddende manen, een olifant tettert met zwaaiende slurf, een vliegtuig stijgt op, een auto toetert en rijdt, een boot deint diep met spetters, een fiets rinkelt en wiebelt.
- Geluid: `ctx.sound('geluid-' + key, fallback)`. Fallback voor boerderijdieren: `ctx.audio.animals[key]`; voor wilde dieren en voertuigen: `extraSounds[key]` uit `../../sounds-extra.js`. De echte opname speelt vanzelf als die er is.
- Naam zeggen na het geluid: `fig.later(() => ctx.say(key, naam), 900)`.
- Effecten uit `../fx.js` op een punt van het figuur: `const c = world.center(fig, 0.5, 0.95)` (x- en y-fractie), dan `fx.dust(c.x, c.y)`, `fx.sparkles`, `fx.hearts`, `fx.notes`, `fx.steam`, `fx.splash`, `fx.ripple`, `fx.feathers`.
- `tap` is `{ x, y }` tussen -0.5 en 0.5: waar in het figuur ze tikte. Kijk er even naar met `A.lookAt`.
- Bouwstenen: `A.hop`, `A.shake`, `A.wiggle`, `A.tilt`, `A.mouth`, `A.chew`, `A.flap`, `A.drive(fig, px, dur, ['wiel-1', ...])`, `A.tween(fig, el, keyframes, opts).finished`. Combineer met `A.par(() => ..., () => ...)` en `A.seq`. Reacties duren 0,6 tot 1,8 seconde en eindigen altijd in rust.

## Controle

Importeer de module in Node (dynamic import met file-URL), roep `svg()` aan, parse het resultaat met Python `xml.etree`, controleer dat alle `data-part`-namen die `idle` en `react` gebruiken ook in de tekening staan, en render de tekening in headless Chrome op 400 x 400 om te zien of het figuur herkenbaar is. Raak geen andere bestanden aan dan je eigen figuurbestanden.
