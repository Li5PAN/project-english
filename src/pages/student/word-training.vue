<template>
  <div>
    <a-card title="单词训练">
      <div v-if="!isTraining" class="training-start">
        <a-empty description="准备开始单词训练">
          <a-button type="primary" size="large" @click="startTraining">开始训练</a-button>
        </a-empty>
      </div>
      
      <div v-else class="training-content">
        <a-progress :percent="progress" />
        <div class="question-box">
          <h2>第 {{ currentIndex + 1 }} / {{ questions.length }} 题</h2>
          <h3 class="word">{{ currentQuestion.word }}</h3>
          <p class="phonetic">{{ currentQuestion.phonetic }}</p>
          <h4>请选择正确的释义：</h4>
          <a-radio-group v-model:value="selectedAnswer" style="width: 100%;">
            <a-radio 
              v-for="(option, index) in currentQuestion.options" 
              :key="index" 
              :value="index"
              style="display: block; margin: 12px 0; padding: 12px; border: 1px solid #d9d9d9; border-radius: 4px;"
            >
              {{ option }}
            </a-radio>
          </a-radio-group>
          <a-button 
            type="primary" 
            size="large" 
            @click="submitAnswer"
            :disabled="selectedAnswer === null"
            style="margin-top: 24px; width: 100%;"
          >
            提交答案
          </a-button>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'

const isTraining = ref(false)
const currentIndex = ref(0)
const selectedAnswer = ref(null)
const correctCount = ref(0)

const questions = [
  {
    word: 'apple',
    phonetic: '[ˈæpl]',
    answer: 0,
    options: ['苹果', '香蕉', '橙子', '梨']
  },
  {
    word: 'book',
    phonetic: '[bʊk]',
    answer: 1,
    options: ['笔记本', '书', '杂志', '报纸']
  },
  {
    word: 'computer',
    phonetic: '[kəmˈpjuːtə]',
    answer: 2,
    options: ['手机', '平板', '电脑', '电视']
  },
  {
    word: 'dog',
    phonetic: '[dɒɡ]',
    answer: 0,
    options: ['狗', '猫', '鸟', '鱼']
  },
  {
    word: 'English',
    phonetic: '[ˈɪŋɡlɪʃ]',
    answer: 1,
    options: ['中文', '英语', '日语', '法语']
  }
]

const currentQuestion = computed(() => questions[currentIndex.value])
const progress = computed(() => Math.round((currentIndex.value / questions.length) * 100))

const startTraining = () => {
  isTraining.value = true
  currentIndex.value = 0
  correctCount.value = 0
  selectedAnswer.value = null
}

const submitAnswer = () => {
  if (selectedAnswer.value === currentQuestion.value.answer) {
    message.success('回答正确！')
    correctCount.value++
  } else {
    message.error('回答错误，正确答案是：' + currentQuestion.value.options[currentQuestion.value.answer])
  }
  
  if (currentIndex.value < questions.length - 1) {
    setTimeout(() => {
      currentIndex.value++
      selectedAnswer.value = null
    }, 1500)
  } else {
    setTimeout(() => {
      message.success(`训练完成！正确率：${Math.round((correctCount.value / questions.length) * 100)}%`)
      isTraining.value = false
      selectedAnswer.value = null
    }, 1500)
  }
}
</script>

<style scoped>
.training-start {
  padding: 60px 0;
}

.training-content {
  padding: 20px;
}

.question-box {
  margin-top: 32px;
  text-align: center;
}

.word {
  font-size: 48px;
  color: #1890ff;
  margin: 24px 0 8px;
}

.phonetic {
  font-size: 20px;
  color: #666;
  margin-bottom: 32px;
}

.question-box h4 {
  text-align: left;
  margin-bottom: 16px;
  font-size: 16px;
}
</style>
