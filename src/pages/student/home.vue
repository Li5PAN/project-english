<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card title="今日学习" :bordered="false">
          <p style="font-size: 32px; font-weight: bold; color: #1890ff;">25</p>
          <p>个单词</p>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card title="累计学习" :bordered="false">
          <p style="font-size: 32px; font-weight: bold; color: #52c41a;">368</p>
          <p>个单词</p>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card title="待完成任务" :bordered="false">
          <p style="font-size: 32px; font-weight: bold; color: #faad14;">3</p>
          <p>个任务</p>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card title="正确率" :bordered="false">
          <p style="font-size: 32px; font-weight: bold; color: #f5222d;">85%</p>
          <p>平均正确率</p>
        </a-card>
      </a-col>
    </a-row>
    
    <a-card title="学习进度" style="margin-top: 16px;">
      <p>本周学习情况良好，继续保持！</p>
    </a-card>
  </div>
</template>

<script setup>
</script>
