<template>
  <div>
    <a-card title="单词查询">
      <a-input-search
        v-model:value="searchWord"
        placeholder="请输入要查询的单词"
        enter-button="查询"
        size="large"
        @search="handleSearch"
        style="margin-bottom: 24px;"
      />
      
      <div v-if="wordInfo" class="word-result">
        <h2>{{ wordInfo.word }}</h2>
        <p class="phonetic">{{ wordInfo.phonetic }}</p>
        <a-divider />
        <h3>释义：</h3>
        <p>{{ wordInfo.meaning }}</p>
        <h3>例句：</h3>
        <p>{{ wordInfo.example }}</p>
      </div>
      
      <a-empty v-else description="请输入单词进行查询" />
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'

const searchWord = ref('')
const wordInfo = ref(null)

const mockWords = {
  hello: {
    word: 'hello',
    phonetic: '[həˈləʊ]',
    meaning: 'int. 喂；你好 n. 表示问候，惊奇或唤起注意时的用语',
    example: 'Hello, how are you? 你好，你好吗？'
  },
  world: {
    word: 'world',
    phonetic: '[wɜːld]',
    meaning: 'n. 世界；领域；世俗；全人类；物质生活',
    example: 'The world is beautiful. 世界是美丽的。'
  },
  study: {
    word: 'study',
    phonetic: '[ˈstʌdi]',
    meaning: 'n. 学习，研究；课题；书房；学问 vt. 学习；考虑；攻读；细察',
    example: 'I study English every day. 我每天学习英语。'
  }
}

const handleSearch = () => {
  if (!searchWord.value) {
    message.warning('请输入要查询的单词')
    return
  }
  
  const word = searchWord.value.toLowerCase()
  if (mockWords[word]) {
    wordInfo.value = mockWords[word]
  } else {
    message.error('未找到该单词，请尝试其他单词（示例：hello, world, study）')
    wordInfo.value = null
  }
}
</script>

<style scoped>
.word-result {
  padding: 20px;
}

.word-result h2 {
  color: #1890ff;
  font-size: 32px;
  margin-bottom: 8px;
}

.phonetic {
  color: #666;
  font-size: 18px;
  margin-bottom: 16px;
}

.word-result h3 {
  margin-top: 16px;
  color: #333;
}

.word-result p {
  font-size: 16px;
  line-height: 1.8;
}
</style>
