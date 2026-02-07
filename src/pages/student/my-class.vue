<template>
  <div>
    <a-card title="我的班级">
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="班级名称">高一（3）班</a-descriptions-item>
        <a-descriptions-item label="班主任">张老师</a-descriptions-item>
        <a-descriptions-item label="班级人数">45人</a-descriptions-item>
        <a-descriptions-item label="我的排名">第8名</a-descriptions-item>
        <a-descriptions-item label="班级平均分">82分</a-descriptions-item>
        <a-descriptions-item label="我的平均分">85分</a-descriptions-item>
      </a-descriptions>
      
      <a-divider>班级排行榜</a-divider>
      
      <a-table :columns="rankColumns" :data-source="rankData" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'rank'">
            <a-tag v-if="record.rank === 1" color="gold">🥇 {{ record.rank }}</a-tag>
            <a-tag v-else-if="record.rank === 2" color="silver">🥈 {{ record.rank }}</a-tag>
            <a-tag v-else-if="record.rank === 3" color="bronze">🥉 {{ record.rank }}</a-tag>
            <span v-else>{{ record.rank }}</span>
          </template>
          <template v-if="column.key === 'name'">
            <span :style="{ fontWeight: record.isMe ? 'bold' : 'normal', color: record.isMe ? '#1890ff' : '' }">
              {{ record.name }} {{ record.isMe ? '(我)' : '' }}
            </span>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const rankColumns = [
  {
    title: '排名',
    dataIndex: 'rank',
    key: 'rank',
    width: 100,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '学习单词数',
    dataIndex: 'wordCount',
    key: 'wordCount',
  },
  {
    title: '平均分',
    dataIndex: 'avgScore',
    key: 'avgScore',
  },
]

const rankData = ref([
  { key: '1', rank: 1, name: '李明', wordCount: 520, avgScore: 92, isMe: false },
  { key: '2', rank: 2, name: '王芳', wordCount: 498, avgScore: 90, isMe: false },
  { key: '3', rank: 3, name: '张伟', wordCount: 476, avgScore: 88, isMe: false },
  { key: '4', rank: 4, name: '刘洋', wordCount: 455, avgScore: 87, isMe: false },
  { key: '5', rank: 5, name: '陈静', wordCount: 442, avgScore: 86, isMe: false },
  { key: '6', rank: 6, name: '赵强', wordCount: 428, avgScore: 86, isMe: false },
  { key: '7', rank: 7, name: '孙丽', wordCount: 415, avgScore: 85, isMe: false },
  { key: '8', rank: 8, name: '我', wordCount: 398, avgScore: 85, isMe: true },
  { key: '9', rank: 9, name: '周杰', wordCount: 385, avgScore: 84, isMe: false },
  { key: '10', rank: 10, name: '吴娜', wordCount: 372, avgScore: 83, isMe: false },
])
</script>
