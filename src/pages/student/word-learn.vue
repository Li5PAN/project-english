<template>
  <div class="word-learn-container">
    <!-- 顶部搜索和模式切换区 -->
    <div class="header-section">
      <div class="search-area">
        <a-input-search
          v-model:value="searchKeyword"
          placeholder="输入单词 / 中文查询（回车确认）"
          size="large"
          :loading="searching"
          @search="handleSearch"
          allow-clear
          @clear="handleClear"
        >
          <template #enterButton>
            <a-button type="primary">查询</a-button>
          </template>
        </a-input-search>
      </div>
      
      <div class="mode-tabs">
        <a-radio-group 
          v-model:value="learningMode" 
          button-style="solid"
          :disabled="isSearchMode || loadingWords"
        >
          <a-radio-button value="recognize">单词认识</a-radio-button>
          <a-radio-button value="spell">看中文拼写英文</a-radio-button>
          <a-radio-button value="fill">单词填空</a-radio-button>
        </a-radio-group>
      </div>
    </div>

    <!-- 核心展示区 -->
    <div class="content-section">
      <!-- 加载状态 -->
      <div v-if="loadingWords" class="loading-container">
        <a-spin size="large">
          <template #indicator>
            <LoadingOutlined style="font-size: 48px" spin />
          </template>
        </a-spin>
        <p class="loading-text">
          正在加载单词... 
          <span v-if="loadingProgress.total > 0">
            ({{ loadingProgress.current }}/{{ loadingProgress.total }})
          </span>
        </p>
      </div>
      <!-- 搜索模式 -->
      <div v-if="isSearchMode" class="search-result">
        <a-spin :spinning="searching">
          <div v-if="searchResult" class="word-detail">
            <!-- 单词和发音 -->
            <div class="word-header">
              <h1 class="word-title">{{ searchResult.word }}</h1>
              <div class="phonetic-area">
                <span v-if="searchResult.ukPhonetic" class="phonetic">
                  英 [{{ searchResult.ukPhonetic }}]
                  <a-button 
                    type="link" 
                    size="small"
                    @click="playAudio(searchResult.ukSpeech)"
                  >
                    <SoundOutlined />
                  </a-button>
                </span>
                <span v-if="searchResult.usPhonetic" class="phonetic">
                  美 [{{ searchResult.usPhonetic }}]
                  <a-button 
                    type="link" 
                    size="small"
                    @click="playAudio(searchResult.usSpeech)"
                  >
                    <SoundOutlined />
                  </a-button>
                </span>
              </div>
              <a-button 
                type="text" 
                :icon="h(isFavorite ? StarFilled : StarOutlined)"
                @click="toggleFavorite"
                class="favorite-btn"
              >
                {{ isFavorite ? '已收藏' : '收藏' }}
              </a-button>
            </div>

            <!-- 释义 -->
            <div class="meanings-section">
              <h3>释义</h3>
              <div class="meanings-list">
                <p v-for="(meaning, index) in searchResult.meanings" :key="index">
                  {{ meaning }}
                </p>
              </div>
              
              <!-- 词形变化 -->
              <div v-if="searchResult.wordForms && searchResult.wordForms.length > 0" class="word-forms">
                <span v-for="(form, index) in searchResult.wordForms" :key="index" class="word-form">
                  {{ form }}
                </span>
              </div>
            </div>

            <!-- 例句 -->
            <div v-if="searchResult.examples.length > 0" class="examples-section">
              <h3>例句</h3>
              <div 
                v-for="(example, index) in searchResult.examples" 
                :key="index"
                class="example-item"
              >
                <p class="example-en">
                  {{ example.sentence }}
                  <a-button 
                    v-if="example.sentenceSpeech"
                    type="link" 
                    size="small"
                    @click="playAudio(example.sentenceSpeech)"
                  >
                    <SoundOutlined />
                  </a-button>
                </p>
                <p class="example-cn">{{ example.translation }}</p>
              </div>
            </div>

            <!-- 网络释义 -->
            <div v-if="searchResult.webMeanings.length > 0" class="web-meanings-section">
              <h3>网络释义</h3>
              <div 
                v-for="(item, index) in searchResult.webMeanings" 
                :key="index"
                class="web-meaning-item"
              >
                <span class="phrase">{{ item.phrase }}</span>
                <span class="meaning">{{ item.meaning }}</span>
              </div>
            </div>
          </div>
          
          <a-empty v-else-if="searchError" :description="searchError" />
        </a-spin>
      </div>

      <!-- 学习模式 -->
      <div v-else-if="!loadingWords && wordList.length > 0" class="learning-mode">
        <!-- 单词认识模式 -->
        <div v-if="learningMode === 'recognize'" class="recognize-mode">
          <div class="word-card">
            <h1 class="word-title">{{ currentWord.word }}</h1>
            <div class="phonetic-area">
              <span v-if="currentWord.ukPhonetic" class="phonetic">
                英 [{{ currentWord.ukPhonetic }}]
                <a-button 
                  type="link" 
                  size="small"
                  @click="playAudio(currentWord.ukSpeech)"
                >
                  <SoundOutlined />
                </a-button>
              </span>
              <span v-if="currentWord.usPhonetic" class="phonetic">
                美 [{{ currentWord.usPhonetic }}]
                <a-button 
                  type="link" 
                  size="small"
                  @click="playAudio(currentWord.usSpeech)"
                >
                  <SoundOutlined />
                </a-button>
              </span>
            </div>
            
            <div class="meanings-list">
              <p v-for="(meaning, index) in currentWord.meanings" :key="index">
                {{ meaning }}
              </p>
            </div>

            <!-- 例句 -->
            <div v-if="currentWord.examples && currentWord.examples.length > 0" class="examples-section">
              <h3>例句</h3>
              <div 
                v-for="(example, index) in currentWord.examples" 
                :key="index"
                class="example-item"
              >
                <p class="example-en">
                  {{ example.sentence }}
                  <a-button 
                    v-if="example.sentenceSpeech"
                    type="link" 
                    size="small"
                    @click="playAudio(example.sentenceSpeech)"
                  >
                    <SoundOutlined />
                  </a-button>
                </p>
                <p class="example-cn">{{ example.translation }}</p>
              </div>
            </div>

            <a-button 
              type="text" 
              :icon="h(isFavorite ? StarFilled : StarOutlined)"
              @click="toggleFavorite"
              class="favorite-btn"
            >
              {{ isFavorite ? '已收藏' : '收藏' }}
            </a-button>
          </div>

          <div class="progress-footer">
            <span class="progress-text">{{ currentIndex + 1 }} / {{ wordList.length }}</span>
            <a-button type="primary" size="large" @click="nextWord">
              下一个
            </a-button>
          </div>
        </div>

        <!-- 看中文拼写英文模式 -->
        <div v-else-if="learningMode === 'spell'" class="spell-mode">
          <div class="word-card">
            <h2>请根据中文释义拼写单词</h2>
            <div class="meanings-list">
              <p v-for="(meaning, index) in currentWord.meanings" :key="index">
                {{ meaning }}
              </p>
            </div>

            <a-input
              v-model:value="userInput"
              placeholder="请输入单词"
              size="large"
              @pressEnter="checkSpelling"
              class="input-field"
            />

            <div v-if="showResult" class="result-feedback">
              <a-alert
                :type="isCorrect ? 'success' : 'error'"
                :message="isCorrect ? '回答正确！' : '回答错误'"
                show-icon
              >
                <template #description>
                  <div v-if="!isCorrect">
                    <p>正确答案：{{ currentWord.word }}</p>
                    <p>你的答案：{{ userInput }}</p>
                  </div>
                </template>
              </a-alert>
            </div>

            <a-button 
              type="primary" 
              size="large" 
              @click="checkSpelling"
              :disabled="!userInput"
              class="submit-btn"
            >
              提交
            </a-button>
          </div>

          <div class="progress-footer">
            <span class="progress-text">{{ currentIndex + 1 }} / {{ wordList.length }}</span>
            <a-button type="primary" size="large" @click="nextWord">
              下一个
            </a-button>
          </div>
        </div>

        <!-- 单词填空模式 -->
        <div v-else-if="learningMode === 'fill'" class="fill-mode">
          <div class="word-card">
            <h2>请填写缺失的字母</h2>
            <div class="word-display">
              <span 
                v-for="(char, index) in displayWord" 
                :key="index"
                class="char-box"
                :class="{ blank: char === '_' }"
              >
                <a-input
                  v-if="char === '_'"
                  v-model:value="fillInputs[index]"
                  maxlength="1"
                  class="fill-input"
                  @input="handleFillInput(index)"
                />
                <span v-else>{{ char }}</span>
              </span>
            </div>

            <div class="meanings-list">
              <p v-for="(meaning, index) in currentWord.meanings" :key="index">
                {{ meaning }}
              </p>
            </div>

            <div v-if="showResult" class="result-feedback">
              <a-alert
                :type="isCorrect ? 'success' : 'error'"
                :message="isCorrect ? '回答正确！' : '回答错误'"
                show-icon
              >
                <template #description>
                  <div v-if="!isCorrect">
                    <p>正确答案：{{ currentWord.word }}</p>
                  </div>
                </template>
              </a-alert>
            </div>

            <a-button 
              type="primary" 
              size="large" 
              @click="checkFill"
              class="submit-btn"
            >
              提交
            </a-button>
          </div>

          <div class="progress-footer">
            <span class="progress-text">{{ currentIndex + 1 }} / {{ wordList.length }}</span>
            <a-button type="primary" size="large" @click="nextWord">
              下一个
            </a-button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!loadingWords && wordList.length === 0" class="empty-state">
        <a-empty description="暂无学习单词">
          <template #description>
            <p>暂无学习单词，请联系老师分配学习任务</p>
          </template>
          <a-button type="primary" @click="loadWords">重新加载</a-button>
        </a-empty>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { message } from 'ant-design-vue'
import { SoundOutlined, StarOutlined, StarFilled, LoadingOutlined } from '@ant-design/icons-vue'
import { searchWord, getStudentWordsWithDetails, addToFavorites, removeFromFavorites, recordProgress } from '../../services/wordService'

// 搜索相关
const searchKeyword = ref('')
const searching = ref(false)
const searchResult = ref(null)
const searchError = ref('')

// 学习模式
const learningMode = ref('recognize')
const isSearchMode = computed(() => !!searchResult.value)

// 单词列表加载状态
const loadingWords = ref(false)
const loadingProgress = ref({ current: 0, total: 0 })

// 单词列表（从服务动态加载）
const wordList = ref([])

const currentIndex = ref(0)
const currentWord = computed(() => wordList.value[currentIndex.value] || {})

// 收藏状态
const isFavorite = ref(false)

// 拼写模式
const userInput = ref('')
const showResult = ref(false)
const isCorrect = ref(false)

// 填空模式
const fillInputs = ref({})
const displayWord = computed(() => {
  if (!currentWord.value.word) return []
  const word = currentWord.value.word
  const result = []
  const blankCount = Math.ceil(word.length / 3)
  const blankPositions = new Set()
  
  while (blankPositions.size < blankCount) {
    blankPositions.add(Math.floor(Math.random() * word.length))
  }
  
  for (let i = 0; i < word.length; i++) {
    result.push(blankPositions.has(i) ? '_' : word[i])
  }
  
  return result
})

// 搜索单词
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    message.warning('请输入要查询的单词')
    return
  }

  searching.value = true
  searchError.value = ''
  searchResult.value = null

  const result = await searchWord(searchKeyword.value.trim())
  
  searching.value = false

  if (result.success) {
    searchResult.value = result.data
  } else {
    searchError.value = result.message || '查询失败，请稍后重试'
  }
}

// 清空搜索
const handleClear = () => {
  searchKeyword.value = ''
  searchResult.value = null
  searchError.value = ''
}

// 播放发音
const playAudio = (audioUrl) => {
  if (!audioUrl) {
    message.info('暂无发音')
    return
  }

  try {
    const audio = new Audio(audioUrl)
    
    audio.addEventListener('error', (e) => {
      console.error('音频加载失败:', audioUrl, e)
      message.error('发音加载失败，请检查网络或稍后重试')
    })
    
    audio.addEventListener('canplay', () => {
      audio.play().catch(err => {
        console.error('音频播放失败:', err)
        message.error('发音播放失败')
      })
    })
    
    // 设置超时，如果5秒内无法加载则提示错误
    setTimeout(() => {
      if (audio.readyState === 0) {
        message.warning('发音加载超时，请检查网络连接')
      }
    }, 5000)
    
  } catch (error) {
    console.error('创建音频对象失败:', error)
    message.error('发音功能异常')
  }
}

// 切换收藏
const toggleFavorite = async () => {
  const word = isSearchMode.value ? searchResult.value.word : currentWord.value.word
  
  try {
    if (isFavorite.value) {
      await removeFromFavorites(word)
      message.success('取消收藏')
    } else {
      await addToFavorites(word)
      message.success('收藏成功')
    }
    isFavorite.value = !isFavorite.value
  } catch (error) {
    message.error('操作失败，请稍后重试')
  }
}

// 下一个单词
const nextWord = async () => {
  // 记录当前单词的学习进度
  if (showResult.value) {
    await recordProgress({
      word: currentWord.value.word,
      mode: learningMode.value,
      correct: isCorrect.value
    })
  }

  if (currentIndex.value < wordList.value.length - 1) {
    currentIndex.value++
    resetLearningState()
  } else {
    message.success('已完成所有单词学习！')
    currentIndex.value = 0
    resetLearningState()
  }
}

// 重置学习状态
const resetLearningState = () => {
  userInput.value = ''
  showResult.value = false
  isCorrect.value = false
  fillInputs.value = {}
  isFavorite.value = false
}

// 检查拼写
const checkSpelling = () => {
  if (!userInput.value) return
  
  isCorrect.value = userInput.value.toLowerCase() === currentWord.value.word.toLowerCase()
  showResult.value = true
  
  if (isCorrect.value) {
    setTimeout(() => {
      nextWord()
    }, 1500)
  }
}

// 检查填空
const checkFill = () => {
  const userAnswer = displayWord.value.map((char, index) => {
    return char === '_' ? (fillInputs.value[index] || '') : char
  }).join('')
  
  isCorrect.value = userAnswer.toLowerCase() === currentWord.value.word.toLowerCase()
  showResult.value = true
  
  if (isCorrect.value) {
    setTimeout(() => {
      nextWord()
    }, 1500)
  }
}

// 处理填空输入
const handleFillInput = (index) => {
  // 自动跳转到下一个空格
  const nextBlank = displayWord.value.findIndex((char, i) => i > index && char === '_')
  if (nextBlank !== -1 && fillInputs.value[index]) {
    // 聚焦下一个输入框
    setTimeout(() => {
      const inputs = document.querySelectorAll('.fill-input input')
      const currentInputIndex = Array.from(inputs).findIndex(input => 
        input === document.activeElement
      )
      if (currentInputIndex !== -1 && inputs[currentInputIndex + 1]) {
        inputs[currentInputIndex + 1].focus()
      }
    }, 0)
  }
}

// 加载单词列表
const loadWords = async () => {
  loadingWords.value = true
  loadingProgress.value = { current: 0, total: 0 }
  
  try {
    // 获取学生的学习单词（带详细信息）
    const words = await getStudentWordsWithDetails(
      { limit: 10 }, // 可以根据需要调整数量
      (current, total) => {
        loadingProgress.value = { current, total }
      }
    )
    
    wordList.value = words
    
    if (words.length === 0) {
      message.warning('暂无学习单词，请联系老师分配学习任务')
    }
  } catch (error) {
    console.error('加载单词失败:', error)
    message.error('加载单词失败，请刷新页面重试')
  } finally {
    loadingWords.value = false
  }
}

onMounted(() => {
  // 加载单词列表
  loadWords()
})
</script>

<style scoped>
.word-learn-container {
  padding: 24px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 24px;
}

.search-area {
  flex: 1;
  max-width: 600px;
}

.mode-tabs {
  flex-shrink: 0;
}

.content-section {
  min-height: 500px;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 24px;
}

.loading-text {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* 空状态 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

/* 搜索结果样式 */
.search-result {
  max-width: 800px;
  margin: 0 auto;
}

.word-detail {
  background: #fff;
  padding: 32px;
  border-radius: 8px;
}

.word-header {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 24px;
  margin-bottom: 24px;
}

.word-title {
  font-size: 48px;
  color: #1890ff;
  margin: 0 0 16px 0;
}

.phonetic-area {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.phonetic {
  font-size: 16px;
  color: #666;
}

.favorite-btn {
  color: #faad14;
}

.meanings-section,
.examples-section,
.web-meanings-section {
  margin-bottom: 24px;
  text-align: left;
  width: 100%;
  max-width: 600px;
}

.meanings-section h3,
.examples-section h3,
.web-meanings-section h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 12px;
}

.meanings-list p {
  font-size: 16px;
  line-height: 2;
  margin: 0;
}

.word-forms {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.word-form {
  padding: 4px 12px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  font-size: 14px;
  color: #1890ff;
}

.example-item {
  margin-bottom: 16px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

.example-en {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.example-cn {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.web-meaning-item {
  display: flex;
  gap: 16px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.phrase {
  font-weight: 500;
  color: #1890ff;
  min-width: 150px;
}

.meaning {
  color: #666;
}

/* 学习模式样式 */
.learning-mode {
  max-width: 800px;
  margin: 0 auto;
}

.word-card {
  background: #fff;
  padding: 48px;
  border-radius: 8px;
  text-align: center;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.word-card h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 32px;
}

.input-field {
  width: 100%;
  max-width: 400px;
  margin: 24px 0;
}

.submit-btn {
  margin-top: 24px;
}

.result-feedback {
  width: 100%;
  max-width: 500px;
  margin: 24px 0;
}

.progress-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding: 16px 24px;
  background: #f5f5f5;
  border-radius: 8px;
}

.progress-text {
  font-size: 16px;
  color: #666;
}

/* 填空模式样式 */
.word-display {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 32px 0;
  flex-wrap: wrap;
}

.char-box {
  width: 40px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  border-bottom: 2px solid #d9d9d9;
}

.char-box.blank {
  border-bottom: 2px solid #1890ff;
}

.fill-input {
  width: 40px;
  text-align: center;
}

.fill-input :deep(input) {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  border: none;
  border-bottom: 2px solid #1890ff;
  border-radius: 0;
  padding: 0;
}
</style>
