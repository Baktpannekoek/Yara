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
  groups.push({ title: 'Dieren (naam)', items: ANIMALS.map((a) => ({ key: a.key, label: a.name, text: a.name })) });
  groups.push({ title: 'Dieren (geluid)', items: ANIMALS.map((a) => ({ key: 'geluid-' + a.key, label: `${a.name}: "${a.sound}"`, text: a.sound })) });
  ANIMALS.forEach((a) => seen.add(a.key));
  const words = [];
  CHAPTERS.forEach((c) => c.words.forEach((w) => { if (!seen.has(w.key)) { seen.add(w.key); words.push({ key: w.key, label: w.name, text: w.name }); } }));
  groups.push({ title: 'Woorden', items: words });
  groups.push({ title: 'Gezichtje', items: FACE_PARTS.map((p) => ({ key: p.key, label: p.name, text: p.name })) });
  return groups;
}
