export interface DictionaryEntry {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  etymology?: string;
}

const DICTIONARY_DATABASE: Record<string, DictionaryEntry> = {
  sanctuary: {
    word: 'Sanctuary',
    phonetic: '/ˈsæŋktʃuɛri/',
    partOfSpeech: 'noun',
    definition: 'A place of safety, quiet solitude, or protection from external chaos.',
    example: 'In the quiet solitude of your own sanctuary, clarity naturally emerges.',
    etymology: 'From Latin sanctuarium, from sanctus (holy, sacred).'
  },
  stillness: {
    word: 'Stillness',
    phonetic: '/ˈstɪlnəs/',
    partOfSpeech: 'noun',
    definition: 'The state of being quiet, peaceful, or without motion.',
    example: 'Nothing is more urgent in a hyper-connected world than cultivating stillness.',
    etymology: 'From Old English stille (quiet, motionless).'
  },
  solitude: {
    word: 'Solitude',
    phonetic: '/ˈsɒlɪtjuːd/',
    partOfSpeech: 'noun',
    definition: 'The state of being alone without feeling lonely; reflective isolation.',
    example: 'Solitude is a conscious choice to inhabit your own mind fully.',
    etymology: 'From Latin solitudo, from solus (alone).'
  },
  stoicism: {
    word: 'Stoicism',
    phonetic: '/ˈstəʊɪsɪzəm/',
    partOfSpeech: 'noun',
    definition: 'An ancient Hellenistic philosophy emphasizing virtue, reason, and emotional resilience.',
    example: 'Marcus Aurelius practiced stoicism while leading Rome through turbulent times.',
    etymology: 'From Stoa Poikile (Painted Porch) in Athens where Zeno taught.'
  },
  ultradian: {
    word: 'Ultradian',
    phonetic: '/ʌlˈtreɪdiən/',
    partOfSpeech: 'adjective',
    definition: 'Recurrent biological cycles repeated throughout a 24-hour day (e.g. 90-minute focus cycles).',
    example: 'Human cognitive attention follows an ultradian cycle of roughly 90 minutes.',
    etymology: 'From Latin ultra (beyond) + dies (day).'
  },
  ephemeral: {
    word: 'Ephemeral',
    phonetic: '/ɪˈfɛmərəl/',
    partOfSpeech: 'adjective',
    definition: 'Lasting for a very short time; fleeting or temporary.',
    example: 'Digital software feeds are often ephemeral, whereas printed books endure.',
    etymology: 'From Greek ephēmeros, from epi (upon) + hēmera (day).'
  },
  neuroplasticity: {
    word: 'Neuroplasticity',
    phonetic: '/ˌnjʊərəʊplæˈstɪsɪti/',
    partOfSpeech: 'noun',
    definition: 'The ability of the brain to form and reorganize synaptic connections in response to learning.',
    example: 'Deep reading strengthens neural pathways associated with empathy and analogical reasoning.',
    etymology: 'From Greek neuron (nerve) + plastikos (molded).'
  },
  geometry: {
    word: 'Geometry',
    phonetic: '/dʒiˈɒmɪtri/',
    partOfSpeech: 'noun',
    definition: 'The branch of mathematics concerned with space, shapes, and structural proportion.',
    example: 'The subtle geometry of typography creates visual balance on the page.',
    etymology: 'From Greek geōmetria (earth measurement).'
  }
};

export function lookupWord(rawWord: string): DictionaryEntry | null {
  const cleaned = rawWord.toLowerCase().replace(/[^a-z]/g, '');
  if (!cleaned) return null;
  if (DICTIONARY_DATABASE[cleaned]) {
    return DICTIONARY_DATABASE[cleaned];
  }
  // Fallback dynamic generator for any unlisted word
  return {
    word: rawWord.charAt(0).toUpperCase() + rawWord.slice(1).toLowerCase(),
    phonetic: `/${cleaned}/`,
    partOfSpeech: 'term',
    definition: `Concept or vocabulary term observed in text. Offline library dictionary active.`,
    example: `"...${rawWord}..." in context.`,
    etymology: 'CalmReader Offline Dictionary Reference'
  };
}
