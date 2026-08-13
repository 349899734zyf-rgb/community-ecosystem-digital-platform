<template>
  <main>
    <!-- 注释掉上周的组件 -->
    <!-- <JSONLab /> -->

    <!-- 挂载本周的新表单组件 -->
    <LibraryRegistrationForm />
  </main>
</template>

<script setup lang="ts">
// 引入新组件
import LibraryRegistrationForm from './components/LibraryRegistrationForm.vue'
// 注释掉上周的 JSONLab 引入
// import JSONLab from './components/JSON.vue'
</script>

<style scoped>
</style>

    <!-- <script setup lang="ts">
    // 1. 引入我们写的 JSON.vue 组件
    import JSONLab from './components/JSON.vue'
    </script>

    <template>
      <div>
        <!-- 2. 在页面模板中使用组件 -->
        <!-- <JSONLab />
      </div>
    </template>

    <style scoped>
    </style> --> -->