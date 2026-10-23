/* De inhoud: dieren, woorden, lichaamsdelen. Sleutels worden ook gebruikt voor opnames. */

export const GREETING_KEY = 'begroeting';

export const ANIMALS = [
  { key: 'koe',     name: 'koe',     sound: 'boe',      question: 'Wat zegt de koe?' },
  { key: 'hond',    name: 'hond',    sound: 'woef',     question: 'Wat zegt de hond?' },
  { key: 'kat',     name: 'kat',     sound: 'miauw',    question: 'Wat zegt de poes?' },
  { key: 'eend',    name: 'eend',    sound: 'kwak',     question: 'Wat zegt de eend?' },
  { key: 'schaap',  name: 'schaap',  sound: 'bèèh',     question: 'Wat zegt het schaap?' },
  { key: 'paard',   name: 'paard',   sound: 'hihi',     question: 'Wat zegt het paard?' },
  { key: 'kip',     name: 'kip',     sound: 'tok tok',  question: 'Wat zegt de kip?' },
  { key: 'varken',  name: 'varken',  sound: 'knor',     question: 'Wat zegt het varken?' },
  { key: 'kikker',  name: 'kikker',  sound: 'kwaak',    question: 'Wat zegt de kikker?' },
  { key: 'vogel',   name: 'vogel',   sound: 'tjilp',    question: 'Wat zegt de vogel?' }
];

/* Wilde dieren en voertuigen: dezelfde kiekeboe als de boerderij, met een ander gebouw */
export const WILD = [
  { key: 'leeuw',    name: 'leeuw',    sound: 'rrroar',     question: 'Wat zegt de leeuw?' },
  { key: 'olifant',  name: 'olifant',  sound: 'toeoeoet',   question: 'Wat doet de olifant met zijn slurf?' },
  { key: 'aap',      name: 'aap',      sound: 'oe oe aa',   question: 'Wat zegt de aap?' },
  { key: 'giraf',    name: 'giraf',    sound: 'mmm',        question: 'Wat een lange nek! Waar is de nek?' },
  { key: 'zebra',    name: 'zebra',    sound: 'hihi',       question: 'Zie je de strepen van de zebra?' },
  { key: 'krokodil', name: 'krokodil', sound: 'klak klak',  question: 'Wat doet de krokodil met zijn bek?' }
];

export const VEHICLES = [
  { key: 'auto',          name: 'auto',          sound: 'toet toet',        question: 'Wat doet de auto?' },
  { key: 'vliegtuig',     name: 'vliegtuig',     sound: 'zoef',             question: 'Waar vliegt het vliegtuig heen?' },
  { key: 'trein',         name: 'trein',         sound: 'tsjoeke tsjoeke',  question: 'Wat zegt de trein?' },
  { key: 'bus',           name: 'bus',           sound: 'toeoet',           question: 'Wie zit er in de bus?' },
  { key: 'tractor',       name: 'tractor',       sound: 'put put put',      question: 'Wat doet de tractor?' },
  { key: 'boot',          name: 'boot',          sound: 'toeoeoet',         question: 'Waar vaart de boot?' },
  { key: 'brandweerauto', name: 'brandweerauto', sound: 'tatu tata',        question: 'Wat zegt de brandweerauto?' },
  { key: 'fiets',         name: 'fiets',         sound: 'tring tring',      question: 'Wat doet de bel van de fiets?' }
];

/* De drie kiekeboe-plekjes: gebouw, deuren en de dingen die erachter zitten */
export const SETS = {
  farm:     { key: 'farm',     title: 'Boerderij',    items: ANIMALS,  building: 'barn',   door: 'barnDoor',   hint: 'Wie zit er in de schuur? Tik maar!' },
  wild:     { key: 'wild',     title: 'Wilde dieren', items: WILD,     building: 'jungle', door: 'leafDoor',   hint: 'Wie zit er in de struiken? Tik maar!' },
  vehicles: { key: 'vehicles', title: 'Voertuigen',   items: VEHICLES, building: 'garage', door: 'garageDoor', hint: 'Wat staat er in de garage? Tik maar!' }
};

export const CHAPTERS = [
  {
    key: 'dieren', icon: 'hond',
    words: [
      { key: 'hond', name: 'hond', fx: 'hond' },
      { key: 'kat', name: 'kat', fx: 'kat' },
      { key: 'koe', name: 'koe', fx: 'koe' },
      { key: 'eend', name: 'eend', fx: 'eend' },
      { key: 'vogel', name: 'vogel', fx: 'vogel' }
    ]
  },
  {
    key: 'eten', icon: 'appel',
    words: [
      { key: 'appel', name: 'appel', fx: 'crunch' },
      { key: 'banaan', name: 'banaan', fx: 'boing' },
      { key: 'brood', name: 'brood', fx: 'crunch' },
      { key: 'melk', name: 'melk', fx: 'splash' },
      { key: 'koekje', name: 'koekje', fx: 'crunch' }
    ]
  },
  {
    key: 'thuis', icon: 'bal',
    words: [
      { key: 'bal', name: 'bal', fx: 'boing' },
      { key: 'auto', name: 'auto', fx: 'honk' },
      { key: 'boek', name: 'boek', fx: 'rustle' },
      { key: 'schoen', name: 'schoen', fx: 'thud' },
      { key: 'beer', name: 'beer', fx: 'yawn' },
      { key: 'bad', name: 'bad', fx: 'splash' },
      { key: 'bed', name: 'bed', fx: 'yawn' }
    ]
  },
  {
    key: 'buiten', icon: 'zon',
    words: [
      { key: 'zon', name: 'zon', fx: 'sparkle' },
      { key: 'maan', name: 'maan', fx: 'chime' },
      { key: 'boom', name: 'boom', fx: 'rustle' },
      { key: 'bloem', name: 'bloem', fx: 'sparkle' },
      { key: 'vlinder', name: 'vlinder', fx: 'sparkle' }
    ]
  }
];

/* Muziek: instrumenten met naam, en liedjes die ouders zelf inzingen */
export const INSTRUMENTS = [
  { key: 'xylofoon',   name: 'xylofoon' },
  { key: 'trommel',    name: 'trommel' },
  { key: 'bel',        name: 'bel' },
  { key: 'gitaar',     name: 'gitaar' },
  { key: 'piano',      name: 'piano' },
  { key: 'trompet',    name: 'trompet' },
  { key: 'rammelaar',  name: 'rammelaar' },
  { key: 'fluit',      name: 'fluit' },
  { key: 'tamboerijn', name: 'tamboerijn' }
];

export const SONGS = [
  { key: 'lied-kortjakje',      title: 'Altijd is Kortjakje ziek',     icon: 'bed',         melody: 'kortjakje' },
  { key: 'lied-vaderjacob',     title: 'Vader Jacob',                  icon: 'bel',         melody: 'vaderjacob' },
  { key: 'lied-slaapkindje',    title: 'Slaap kindje slaap',           icon: 'maan' },
  { key: 'lied-maneschijn',     title: 'In de maneschijn',             icon: 'ster' },
  { key: 'lied-paddenstoel',    title: 'Op een grote paddenstoel',     icon: 'paddenstoel' },
  { key: 'lied-hoofdschouders', title: 'Hoofd, schouders, knie en teen', icon: 'gezicht' }
];

/* Doe mee: bewegingen om na te doen */
export const MOVES = [
  { key: 'springen', name: 'springen', say: 'Springen!', question: 'Spring jij ook?',               fx: 'boing',  anim: 'spring' },
  { key: 'klappen',  name: 'klappen',  say: 'Klappen!',  question: 'Klap jij ook in je handen?',    fx: 'klap',   anim: 'klap' },
  { key: 'stampen',  name: 'stampen',  say: 'Stampen!',  question: 'Stamp jij ook met je voeten?',  fx: 'stamp',  anim: 'stamp' },
  { key: 'zwaaien',  name: 'zwaaien',  say: 'Zwaaien!',  question: 'Zwaai jij ook? Dag dag!',       fx: 'zwaai',  anim: 'zwaai' },
  { key: 'rennen',   name: 'rennen',   say: 'Rennen!',   question: 'Ren jij ook?',                  fx: 'rennen', anim: 'ren' },
  { key: 'draaien',  name: 'draaien',  say: 'Draaien!',  question: 'Draai jij ook een rondje?',     fx: 'draai',  anim: 'draai' }
];

/* Stickers: namen van tekeningen die als sticker geplakt kunnen worden */
export const STICKERS = [
  { key: 'ster', name: 'ster' }, { key: 'hart', name: 'hart' }, { key: 'bloem', name: 'bloem' }, { key: 'vlinder', name: 'vlinder' },
  { key: 'zon', name: 'zon' }, { key: 'eend', name: 'eend' }, { key: 'kat', name: 'kat' }, { key: 'hond', name: 'hond' },
  { key: 'bal', name: 'bal' }, { key: 'appel', name: 'appel' }, { key: 'auto', name: 'auto' }, { key: 'kikker', name: 'kikker' }
];

export const FACE_PARTS = [
  { key: 'neus', name: 'neus', question: 'Waar is jouw neus?' },
  { key: 'oog', name: 'oog', question: 'Waar zijn jouw ogen?' },
  { key: 'mond', name: 'mond', question: 'Waar is jouw mond?' },
  { key: 'oor', name: 'oor', question: 'Waar zijn jouw oren?' },
  { key: 'haar', name: 'haar', question: 'Waar is jouw haar?' },
  { key: 'wang', name: 'wang', question: 'Waar zijn jouw wangen?' }
];

/* Alles wat een ouder kan inspreken, in groepen voor het oudermenu */
export function recordableItems(childName) {
  const seen = new Set();
  const groups = [];
  groups.push({ title: 'Begroeting', items: [{ key: GREETING_KEY, label: `"Hoi ${childName}!"`, text: `Hoi ${childName}!` }] });
  const addSet = (title, items) => {
    groups.push({ title: `${title} (naam)`, items: items.map((a) => ({ key: a.key, label: a.name, text: a.name })) });
    groups.push({ title: `${title} (geluid)`, items: items.map((a) => ({ key: 'geluid-' + a.key, label: `${a.name}: "${a.sound}"`, text: a.sound })) });
    items.forEach((a) => seen.add(a.key));
  };
  addSet('Boerderij', ANIMALS);
  addSet('Wilde dieren', WILD);
  addSet('Voertuigen', VEHICLES);
  const words = [];
  CHAPTERS.forEach((c) => c.words.forEach((w) => { if (!seen.has(w.key)) { seen.add(w.key); words.push({ key: w.key, label: w.name, text: w.name }); } }));
  groups.push({ title: 'Woorden', items: words });
  groups.push({ title: 'Gezichtje', items: FACE_PARTS.map((p) => ({ key: p.key, label: p.name, text: p.name })) });
  groups.push({ title: 'Instrumenten', items: INSTRUMENTS.map((i) => ({ key: i.key, label: i.name, text: i.name })) });
  groups.push({ title: 'Doe mee', items: MOVES.map((m) => ({ key: m.key, label: m.say, text: m.say })) });
  groups.push({ title: 'Stickers', items: STICKERS.filter((s) => !seen.has(s.key)).map((s) => ({ key: s.key, label: s.name, text: s.name })) });
  // Liedjes mogen langer: tot dertig seconden zingen
  groups.push({ title: 'Liedjes (zing het zelf in, tot 30 seconden)', items: SONGS.map((s) => ({ key: s.key, label: s.title, text: s.title, max: 30000 })) });
  return groups;
}

/* ---------- Mijn spullen: foto's die een ouder heeft toegevoegd ---------- */

export const PHOTO_CHAPTER = { key: 'spullen', icon: 'camera', title: 'Mijn spullen' };

/* De sleutel van de stemopname bij een foto is de naam zelf, zonder hoofdletters en losse spaties.
   Heet de foto "beer", dan deelt hij de opname met het woord beer uit het prentenboek. */
export function photoKey(name) {
  return String(name || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

/* Het vijfde hoofdstuk, opgebouwd uit de opgeslagen foto's. Elke foto heeft hier al een url. */
export function photoChapter(photos) {
  return {
    ...PHOTO_CHAPTER,
    words: photos.map((p) => ({ key: p.key || photoKey(p.name), name: p.name, fx: 'chime', photo: p }))
  };
}

/* Hoort een opnamesleutel bij een vast woord uit de app? Dan blijft de opname staan als een foto weggaat. */
export function isBuiltinKey(key) {
  return recordableItems('').some((g) => g.items.some((it) => it.key === key));
}
