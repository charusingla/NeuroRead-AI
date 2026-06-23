export const SYLLABLE_WORDS = [
  { word: "Butterfly", syllables: ["but", "ter", "fly"], clue: "A colorful flying insect with warm painted wings." },
  { word: "Adventure", syllables: ["ad", "ven", "ture"], clue: "An exciting or unusual journey of exploration." },
  { word: "Wonderful", syllables: ["won", "der", "ful"], clue: "Something beautiful, pleasant, or highly inspiring." },
  { word: "Chimpanzee", syllables: ["chim", "pan", "zee"], clue: "A highly intelligent, playful ape with dark fur." },
  { word: "Volcano", syllables: ["vol", "ca", "no"], clue: "A mountain that opens downward to a pool of molten rock." },
  { word: "Dinosaurs", syllables: ["di", "no", "saurs"], clue: "Ancient, giant reptiles that ruled the earth long ago." },
  { word: "Telescope", syllables: ["tel", "e", "scope"], clue: "A tube-shaped tool used to see distant stars and planets." },
  { word: "October", syllables: ["oc", "to", "ber"], clue: "The tenth month of the year, known for cool autumn days." },
  { word: "Labyrinth", syllables: ["lab", "y", "rinth"], clue: "A complicated, winding maze or path that is hard to find your way through." },
  { word: "Umbrella", syllables: ["um", "brel", "la"], clue: "A folding screen used to keep you dry when it rains." },
  { word: "Dandelion", syllables: ["dan", "de", "li", "on"], clue: "A bright yellow wild flower with fluffy seeds you can blow away." },
  { word: "Confident", syllables: ["con", "fi", "dent"], clue: "Feeling completely sure of your own skills or powers." },
  { word: "Whispering", syllables: ["whis", "per", "ing"], clue: "Speaking in a very soft, quiet voice so others can't hear." }
];

export const REVERSAL_QUESTIONS = [
  { word: "Dog", missing: "_og", choices: ["b", "d"], correct: "d", visual: "🐕", type: "bd", mnemonic: "d has a backpack behind! The round drum comes first, then the stick." },
  { word: "Butterfly", missing: "_utterfly", choices: ["b", "d"], correct: "b", visual: "🦋", type: "bd", mnemonic: "b has a big belly in front! The straight bat comes first, then the ball." },

  // 👑 NEW EXTENDED REVERSAL DATA QUESTIONS
  { word: "Dolphin", missing: "_olphin", choices: ["b", "d"], correct: "d", visual: "🐬", type: "bd", mnemonic: "d has a backpack behind! Look back at the dolphin's tail." },
  { word: "Bear", missing: "_ear", choices: ["b", "d"], correct: "b", visual: "🐻", type: "b", mnemonic: "b has a big belly in front! Just like a big, round bear snout." },
  { word: "Duck", missing: "_uck", choices: ["b", "d"], correct: "d", visual: "🦆", type: "bd", mnemonic: "d faces forward to the duck's beak, with its feathers sticking out behind." },
  { word: "Banana", missing: "_anana", choices: ["b", "d"], correct: "b", visual: "🍌", type: "bd", mnemonic: "b has a big belly in front! Think of a long banana curving outward." },
  
  // p vs. q reversals
  { word: "Penguin", missing: "_enguin", choices: ["p", "q"], correct: "p", visual: "🐧", type: "pq", mnemonic: "p has a round popping bubble at the top of the line!" },
  { word: "Queen", missing: "_ueen", choices: ["p", "q"], correct: "q", visual: "👑", type: "pq", mnemonic: "q points its circle backwards, curtsying to the rest of the word." },
  { word: "Panda", missing: "_anda", choices: ["p", "q"], correct: "p", visual: "🐼", type: "pq", mnemonic: "p has a proud panda head perched right on top of the stick." },
  
  // m vs. w inversions
  { word: "Monkey", missing: "_onkey", choices: ["m", "w"], correct: "m", visual: "🐒", type: "mw", mnemonic: "m points down like two mountain peaks resting on the ground." },
  { word: "Whale", missing: "_hale", choices: ["m", "w"], correct: "w", visual: "🐳", type: "mw", mnemonic: "w points up to the sky, splashing water high into the air!" },
  { word: "Mouse", missing: "_ouse", choices: ["m", "w"], correct: "m", visual: "🐭", type: "mw", mnemonic: "m has double round arches, like two little mouse ears side by side." }
];

export const TRACKING_WORDS = [
  { prompt: "Discover", distractors: ["Dicover", "Discovr", "Discover", "Decover"], correctIdx: 2 },
  { prompt: "Unique", distractors: ["Unique", "Uneqie", "Uniqu", "Unicque"], correctIdx: 0 },
  { prompt: "Journey", distractors: ["Jorney", "Journy", "Joerney", "Journey"], correctIdx: 3 },
  { prompt: "Brave", distractors: ["Barve", "Brave", "Brav", "Bravve"], correctIdx: 1 },
  { prompt: "Whisper", distractors: ["Wisper", "Whisper", "Whieper", "Whpsier"], correctIdx: 1 },
  { prompt: "Explore", distractors: ["Explore", "Explor", "Eplore", "Exsplore"], correctIdx: 0 },
  { prompt: "Treasure", distractors: ["Tresure", "Treasur", "Treasure", "Traesure"], correctIdx: 2 },
  { prompt: "Crystal", distractors: ["Cristal", "Crystal", "Crystel", "Crstal"], correctIdx: 1 },
  { prompt: "Wonder", distractors: ["Wondr", "Wunder", "Wonnder", "Wonder"], correctIdx: 3 },
  { prompt: "Silence", distractors: ["Silence", "Slience", "Silense", "Silemce"], correctIdx: 0 },
  { prompt: "Promise", distractors: ["Promiss", "Promis", "Promise", "Pormise"], correctIdx: 2 },
  { prompt: "Courage", distractors: ["Curage", "Courage", "Courege", "Courgae"], correctIdx: 1 }
];

export const BLENDER_WORDS = [
  { target: "Flourish", sounds: ["Fl-", "-ou-", "-r-", "-ish"], text: "A plant needs water and soil to flourish." },
  { target: "Glow", sounds: ["G-", "-l-", "-ow"], text: "Fireflies glow softly in the dark woods." },
  { target: "Bright", sounds: ["Br-", "-igh-", "-t"], text: "The morning sun is very bright today." },
  { target: "Crunch", sounds: ["Cr-", "-u-", "-n-", "-ch"], text: "Dry autumn leaves crunch under our boots." },
  { target: "Flight", sounds: ["Fl-", "-igh-", "-t"], text: "The young bird took its first flight from the nest." },
  { target: "Splash", sounds: ["Spl-", "-a-", "-sh"], text: "The stones make a loud splash in the deep pond." },
  { target: "Stream", sounds: ["Str-", "-ea-", "-m"], text: "Cool fresh water flows down the mountain stream." },
  { target: "Sketch", sounds: ["Sk-", "-e-", "-tch"], text: "Use your charcoal pencil to sketch a quick picture." },
  { target: "Spring", sounds: ["Spr-", "-i-", "-ng"], text: "Beautiful pink flowers bloom during early spring." },
  { target: "Breeze", sounds: ["Br-", "-ee-", "-ze"], text: "A cool ocean breeze blew across the sandy beach." },
  { target: "Twinkle", sounds: ["Tw-", "-i-", "-n-", "-kl-", "-e"], text: "The stars twinkle in the clear midnight sky." },
  { target: "Shadow", sounds: ["Sh-", "-a-", "-d-", "-ow"], text: "The tall oak tree casts a long shadow on the grass." }
];

export const sampleWords = [
  'Thistle', 'Phonics', 'Glow', 'Flourish', 'Whistle',
  'Unique', 'Discover', 'Island', 'Rhythm', 'Echo',
  'Butterfly', 'Adventure', 'Wonderful', 'Photosynthesis'
];