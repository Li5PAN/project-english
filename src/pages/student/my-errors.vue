<template>
  <div>
    <a-card title="我的错题">
      <a-table :columns="columns" :data-source="errorWords" :pagination="{ pageSize: 10 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'word'">
            <span style="font-weight: bold; color: #1890ff;">{{ record.word }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="link" @click="reviewWord(record)">复习</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: '单词',
    dataIndex: 'word',
    key: 'word',
  },
  {
    title: '音标',
    dataIndex: 'phonetic',
    key: 'phonetic',
  },
  {
    title: '释义',
    dataIndex: 'meaning',
    key: 'meaning',
  },
  {
    title: '错误次数',
    dataIndex: 'errorCount',
    key: 'errorCount',
  },
  {
    title: '最后错误时间',
    dataIndex: 'lastErrorTime',
    key: 'lastErrorTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

const errorWords = ref([
  {
    key: '1',
    word: 'abandon',
    phonetic: '[əˈbændən]',
    meaning: 'v. 放弃；抛弃',
    errorCount: 3,
    lastErrorTime: '2024-02-06',
  },
  {
    key: '2',
    word: 'ability',
    phonetic: '[əˈbɪləti]',
    meaning: 'n. 能力；才能',
    errorCount: 2,
    lastErrorTime: '2024-02-05',
  },
  {
    key: '3',
    word: 'absent',
    phonetic: '[ˈæbsənt]',
    meaning: 'adj. 缺席的；缺少的',
    errorCount: 1,
    lastErrorTime: '2024-02-04',
  },
])

const reviewWord = (record) => {
  message.info(`开始复习单词：${record.word}`)
}
</script>
