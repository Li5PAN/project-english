<template>
  <div>
    <a-card title="我的任务">
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="pending" tab="待完成">
          <a-list :data-source="pendingTasks" item-layout="horizontal">
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <a-button type="primary" @click="startTask(item)">开始</a-button>
                </template>
                <a-list-item-meta>
                  <template #title>
                    <span style="font-size: 16px; font-weight: bold;">{{ item.title }}</span>
                  </template>
                  <template #description>
                    <div>
                      <p>{{ item.description }}</p>
                      <p style="color: #999;">截止时间：{{ item.deadline }}</p>
                    </div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>
        
        <a-tab-pane key="completed" tab="已完成">
          <a-list :data-source="completedTasks" item-layout="horizontal">
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <a-tag color="success">已完成</a-tag>
                  <span>得分：{{ item.score }}</span>
                </template>
                <a-list-item-meta>
                  <template #title>
                    <span style="font-size: 16px;">{{ item.title }}</span>
                  </template>
                  <template #description>
                    <div>
                      <p>{{ item.description }}</p>
                      <p style="color: #999;">完成时间：{{ item.completedTime }}</p>
                    </div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'

const activeTab = ref('pending')

const pendingTasks = ref([
  {
    id: 1,
    title: '第三单元单词测试',
    description: '完成第三单元50个单词的测试',
    deadline: '2024-02-10',
  },
  {
    id: 2,
    title: '阅读理解练习',
    description: '完成3篇阅读理解文章',
    deadline: '2024-02-12',
  },
  {
    id: 3,
    title: '单词听写',
    description: '完成本周单词听写任务',
    deadline: '2024-02-15',
  },
])

const completedTasks = ref([
  {
    id: 4,
    title: '第二单元单词测试',
    description: '完成第二单元50个单词的测试',
    completedTime: '2024-02-05',
    score: 92,
  },
  {
    id: 5,
    title: '语法练习',
    description: '完成时态语法练习题',
    completedTime: '2024-02-03',
    score: 88,
  },
])

const startTask = (task) => {
  message.info(`开始任务：${task.title}`)
}
</script>
