<template>
  <div class="container mt-5">
    <div class="row">
      <!-- 整个表单卡片在页面中央居中：手机端全宽 col-12，电脑端占 8 列并右移 2 列 (col-md-8 offset-md-2) -->
      <div class="col-12 col-md-8 offset-md-2">
        <h1 class="text-center mb-4">User Information Form</h1>
        
        <form @submit.prevent="submitForm">
          
          <!-- 第 1 行：Username 和 Password 左右双列排版 (col-md-6 + col-md-6) -->
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="username" class="form-label">Username</label>
              <input 
                type="text" 
                class="form-control" 
                id="username" 
                v-model="formData.username" 
              />
            </div>
            <div class="col-md-6 col-sm-6">
              <label for="password" class="form-label">Password</label>
              <input 
                type="password" 
                class="form-control" 
                id="password" 
                v-model="formData.password" 
              />
            </div>
          </div>

          <!-- 第 2 行：Australian Resident 和 Gender 左右双列排版 (col-md-6 + col-md-6) -->
          <div class="row mb-3 align-items-center">
            <div class="col-md-6 col-sm-6">
              <div class="form-check mt-3">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  id="isAustralian" 
                  v-model="formData.isAustralian" 
                />
                <label class="form-check-label" for="isAustralian">Australian Resident?</label>
              </div>
            </div>
            <div class="col-md-6 col-sm-6">
              <label for="gender" class="form-label">Gender</label>
              <select class="form-select" id="gender" v-model="formData.gender">
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <!-- 第 3 行：Reason For Joining 单独单行排版 -->
          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea 
              class="form-control" 
              id="reason" 
              rows="3" 
              v-model="formData.reason"
            ></textarea>
          </div>

          <!-- 第 4 行：Submit 和 Clear 按钮组居中 -->
          <div class="text-center mb-4">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>

        </form>
      </div>
    </div>

    <!-- 底部已提交信息卡片：排成一排且居中对齐 (justify-content-center) -->
    <div class="row mt-5" v-if="submittedCards.length">
      <div class="d-flex flex-wrap justify-content-center">
        <div 
          v-for="(card, index) in submittedCards" 
          :key="index" 
          class="card m-2" 
          style="width: 18rem;"
        >
          <div class="card-header">
            User Information
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Username: {{ card.username }}</li>
            <li class="list-group-item">Password: {{ card.password }}</li>
            <li class="list-group-item">Australian Resident: {{ card.isAustralian ? 'Yes' : 'No' }}</li>
            <li class="list-group-item">Gender: {{ card.gender }}</li>
            <li class="list-group-item">Reason: {{ card.reason }}</li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  username: '',
  password: '',
  isAustralian: false,
  reason: '',
  gender: ''
})

const submittedCards = ref<Array<typeof formData.value>>([])

const submitForm = () => {
  submittedCards.value.push({
    ...formData.value
  })
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    isAustralian: false,
    reason: '',
    gender: ''
  }
}
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #4a6cf7;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
  font-weight: 500;
}

.list-group-item {
  padding: 10px;
}
</style>

<!-- <template>
  <div class="form">
    <h1>User Information Form / Credentials</h1>
    
    <form>
      <!-- 1. 用户名文本框 -->
      <!-- <label for="username">Username:</label><br>
      <input type="text" id="username" name="username"><br>
      
      <!-- 2. 密码框 -->
      <!-- <label for="password">Password:</label><br>
      <input type="password" id="password" name="password"><br>
      
      <!-- 3. 澳洲居民复选框 -->
      <!-- <label for="isAustralian">Australian Resident?</label><br> -->
      <!-- <input type="checkbox" id="isAustralian" name="isAustralian"><br> -->
      
      <!-- 4. 注册原因多行文本框 -->
      <!-- <label for="reason">Reason For Joining:</label><br>
      <textarea id="reason" name="reason" rows="3"></textarea><br> -->
      
      <!-- 5. 性别下拉选择框 -->
      <!-- <label for="gender">Gender</label><br>
      <select id="gender">
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="other">Other</option> -->
      <!-- </select>
    </form>
  </div>
</template> -->

<!-- <script setup lang="ts">
</script>

<style scoped>
</style> -->