// 模拟有道词典 API 数据
const mockData = {
  hello: {
    errorCode: '0',
    query: 'hello',
    basic: {
      phonetic: 'həˈləʊ',
      'uk-phonetic': 'həˈləʊ',
      'us-phonetic': 'həˈloʊ',
      'uk-speech': 'https://dict.youdao.com/dictvoice?audio=hello&type=1',
      'us-speech': 'https://dict.youdao.com/dictvoice?audio=hello&type=2',
      explains: [
        'int. 喂；你好',
        'n. 表示问候，惊奇或唤起注意时的用语',
        'vi. 喊"喂"'
      ]
    },
    web: [
      { key: 'Hello', value: ['你好', '您好', '哈啰'] },
      { key: 'Hello Kitty', value: ['凯蒂猫', '昵称', '吉蒂猫'] }
    ],
    sentence: [
      {
        sentence: 'Hello, how are you?',
        translation: '你好，你好吗？'
      },
      {
        sentence: 'Say hello to your family for me.',
        translation: '代我向你的家人问好。'
      }
    ]
  },
  world: {
    errorCode: '0',
    query: 'world',
    basic: {
      phonetic: 'wɜːld',
      'uk-phonetic': 'wɜːld',
      'us-phonetic': 'wɜːrld',
      'uk-speech': 'https://dict.youdao.com/dictvoice?audio=world&type=1',
      'us-speech': 'https://dict.youdao.com/dictvoice?audio=world&type=2',
      explains: [
        'n. 世界；领域；世俗；全人类；物质生活'
      ]
    },
    web: [
      { key: 'World', value: ['世界', '天下', '世'] }
    ],
    sentence: [
      {
        sentence: 'The world is beautiful.',
        translation: '世界是美丽的。'
      }
    ]
  },
  study: {
    errorCode: '0',
    query: 'study',
    basic: {
      phonetic: 'ˈstʌdi',
      'uk-phonetic': 'ˈstʌdi',
      'us-phonetic': 'ˈstʌdi',
      'uk-speech': 'https://dict.youdao.com/dictvoice?audio=study&type=1',
      'us-speech': 'https://dict.youdao.com/dictvoice?audio=study&type=2',
      explains: [
        'n. 学习，研究；课题；书房；学问',
        'vt. 学习；考虑；攻读；细察',
        'vi. 研究；用功'
      ]
    },
    web: [
      { key: 'study', value: ['学习', '研究', '书房'] }
    ],
    sentence: [
      {
        sentence: 'I study English every day.',
        translation: '我每天学习英语。'
      }
    ]
  },
  apple: {
    errorCode: '0',
    query: 'apple',
    basic: {
      phonetic: 'ˈæpl',
      'uk-phonetic': 'ˈæpl',
      'us-phonetic': 'ˈæpl',
      'uk-speech': 'https://dict.youdao.com/dictvoice?audio=apple&type=1',
      'us-speech': 'https://dict.youdao.com/dictvoice?audio=apple&type=2',
      explains: [
        'n. 苹果；珍宝；家伙',
        'n. (Apple) 苹果公司'
      ]
    },
    web: [
      { key: 'Apple', value: ['苹果', '苹果公司', '苹果电脑'] }
    ],
    sentence: [
      {
        sentence: 'An apple a day keeps the doctor away.',
        translation: '一天一苹果，医生远离我。'
      }
    ]
  },
  computer: {
    errorCode: '0',
    query: 'computer',
    basic: {
      phonetic: 'kəmˈpjuːtə',
      'uk-phonetic': 'kəmˈpjuːtə',
      'us-phonetic': 'kəmˈpjuːtər',
      'uk-speech': 'https://dict.youdao.com/dictvoice?audio=computer&type=1',
      'us-speech': 'https://dict.youdao.com/dictvoice?audio=computer&type=2',
      explains: [
        'n. 计算机；电脑；电子计算机'
      ]
    },
    web: [
      { key: 'Computer', value: ['计算机', '电脑', '电子计算机'] }
    ],
    sentence: [
      {
        sentence: 'I use my computer every day.',
        translation: '我每天使用电脑。'
      }
    ]
  },
  book: {
    errorCode: '0',
    query: 'book',
    basic: {
      phonetic: 'bʊk',
      'uk-phonetic': 'bʊk',
      'us-phonetic': 'bʊk',
      'uk-speech': 'https://dict.youdao.com/dictvoice?audio=book&type=1',
      'us-speech': 'https://dict.youdao.com/dictvoice?audio=book&type=2',
      explains: [
        'n. 书籍；卷；账簿；名册',
        'vt. 预订；登记',
        'vi. 预订'
      ]
    },
    web: [
      { key: 'Book', value: ['书', '书籍', '图书'] }
    ],
    sentence: [
      {
        sentence: 'I love reading books.',
        translation: '我喜欢读书。'
      }
    ]
  },
  '你好': {
    errorCode: '0',
    query: '你好',
    basic: {
      explains: ['hello', 'hi', 'how do you do']
    },
    web: [
      { key: '你好', value: ['Hello', 'Hi', 'How do you do'] }
    ],
    sentence: [
      {
        sentence: '你好，很高兴见到你。',
        translation: 'Hello, nice to meet you.'
      }
    ]
  },
  '世界': {
    errorCode: '0',
    query: '世界',
    basic: {
      explains: ['world', 'earth', 'globe']
    },
    web: [
      { key: '世界', value: ['World', 'Earth'] }
    ],
    sentence: [
      {
        sentence: '世界是美丽的。',
        translation: 'The world is beautiful.'
      }
    ]
  },
  '学习': {
    errorCode: '0',
    query: '学习',
    basic: {
      explains: ['study', 'learn', 'emulate']
    },
    web: [
      { key: '学习', value: ['Study', 'Learn', 'Learning'] }
    ],
    sentence: [
      {
        sentence: '我每天学习英语。',
        translation: 'I study English every day.'
      }
    ]
  },
  '苹果': {
    errorCode: '0',
    query: '苹果',
    basic: {
      explains: ['apple']
    },
    web: [
      { key: '苹果', value: ['Apple'] }
    ],
    sentence: [
      {
        sentence: '我喜欢吃苹果。',
        translation: 'I like eating apples.'
      }
    ]
  },
  '电脑': {
    errorCode: '0',
    query: '电脑',
    basic: {
      explains: ['computer', 'PC']
    },
    web: [
      { key: '电脑', value: ['Computer', 'PC'] }
    ],
    sentence: [
      {
        sentence: '我每天使用电脑。',
        translation: 'I use my computer every day.'
      }
    ]
  }
}

/**
 * 模拟查询单词
 */
export async function queryWord(word) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerWord = word.toLowerCase()
      const data = mockData[lowerWord] || mockData[word]
      
      if (data) {
        resolve({
          success: true,
          data: data
        })
      } else {
        resolve({
          success: false,
          message: `未找到"${word}"的释义，请尝试其他单词（支持：hello, world, study, apple, computer, book, 你好, 世界, 学习, 苹果, 电脑）`
        })
      }
    }, 500) // 模拟网络延迟
  })
}

/**
 * 格式化查询结果
 */
export function formatWordData(data) {
  const result = {
    word: data.query || '',
    phonetic: '',
    ukPhonetic: '',
    usPhonetic: '',
    ukSpeech: '',
    usSpeech: '',
    meanings: [],
    webMeanings: [],
    examples: []
  }

  // 基本释义
  if (data.basic) {
    result.phonetic = data.basic.phonetic || ''
    result.ukPhonetic = data.basic['uk-phonetic'] || ''
    result.usPhonetic = data.basic['us-phonetic'] || ''
    result.ukSpeech = data.basic['uk-speech'] || ''
    result.usSpeech = data.basic['us-speech'] || ''
    result.meanings = data.basic.explains || []
  }

  // 网络释义
  if (data.web && data.web.length > 0) {
    result.webMeanings = data.web.map(item => ({
      phrase: item.key || '',
      meaning: item.value ? item.value.join('；') : ''
    }))
  }

  // 例句（添加发音URL）
  if (data.sentence && data.sentence.length > 0) {
    result.examples = data.sentence.map(item => ({
      sentence: item.sentence || '',
      translation: item.translation || '',
      // 注意：有道dictvoice API主要用于单词发音，不支持长句子
      // 如果需要例句发音，需要使用TTS服务
      sentenceSpeech: '' // 暂时禁用例句发音，避免加载错误
    }))
  }

  return result
}
