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
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
                v-model="formData.username" 
              />
              <!-- Vue 3 动态响应式错误提示 -->
              <div v-if="errors.username" class="text-danger mt-1 small">
                {{ errors.username }}
              </div>
            </div>

            <div class="col-md-6 col-sm-6">
              <label for="password" class="form-label">Password</label>
              <input 
                type="password" 
                class="form-control" 
                id="password" 
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
                v-model="formData.password" 
              />
              <!-- Vue 3 动态响应式错误提示 -->
              <div v-if="errors.password" class="text-danger mt-1 small">
                {{ errors.password }}
              </div>
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
                  @change="() => validateResident(true)"
                  v-model="formData.isAustralian" 
                />
                <label class="form-check-label" for="isAustralian">Australian Resident?</label>
              </div>
              <!-- Vue 3 动态响应式错误提示 -->
              <div v-if="errors.resident" class="text-danger mt-1 small">
                {{ errors.resident }}
              </div>
            </div>

            <div class="col-md-6 col-sm-6">
              <label for="gender" class="form-label">Gender</label>
              <select 
                class="form-select" 
                id="gender" 
                @blur="() => validateGender(true)"
                @change="() => validateGender(true)"
                v-model="formData.gender"
              >
                <option value="">Select Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
              <!-- Vue 3 动态响应式错误提示 -->
              <div v-if="errors.gender" class="text-danger mt-1 small">
                {{ errors.gender }}
              </div>
            </div>
          </div>

          <!-- 第 3 行：Reason For Joining 单独单行排版 -->
          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea 
              class="form-control" 
              id="reason" 
              rows="3" 
              @blur="() => validateReason(true)"
              @input="() => validateReason(false)"
              v-model="formData.reason"
            ></textarea>
            <!-- Vue 3 动态响应式错误提示 -->
            <div v-if="errors.reason" class="text-danger mt-1 small">
              {{ errors.reason }}
            </div>
          </div>

          <!-- 第 4 行：Submit 和 Clear 按钮组居中 -->
          <div class="text-center mb-4">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>

        </form>
      </div>
    </div>

    <!-- 底部 PrimeVue DataTable：高效渲染用户提交信息 -->
    <div class="row mt-5" v-if="submittedCards.length">
      <div class="col-12">
        <h2 class="text-center mb-3">Submitted User Information</h2>
        <DataTable :value="submittedCards" responsiveLayout="scroll" class="p-datatable-striped">
          <Column field="username" header="Username" sortable></Column>
          <Column field="password" header="Password"></Column>
          <Column field="isAustralian" header="Australian Resident">
            <template #body="slotProps">
              {{ slotProps.data.isAustralian ? 'Yes' : 'No' }}
            </template>
          </Column>
          <Column field="gender" header="Gender" sortable></Column>
          <Column field="reason" header="Reason"></Column>
        </DataTable>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { ref } from 'vue'

const formData = ref({
  username: '',
  password: '',
  isAustralian: false,
  reason: '',
  gender: ''
})

// 响应式错误追踪对象 (Errors Object)
const errors = ref({
  username: null as string | null,
  password: null as string | null,
  resident: null as string | null,
  gender: null as string | null,
  reason: null as string | null
})

const submittedCards = ref<Array<typeof formData.value>>([])

// 1. Username 校验函数 (至少 3 个字符)
const validateName = (blur: boolean) => {
  if (formData.value.username.length < 3) {
    if (blur) {
      errors.value.username = 'Name must be at least 3 characters'
    }
  } else {
    errors.value.username = null
  }
}

// 2. Password 校验函数 (正则表达式：长度 >= 8，大写，小写，数字，特殊字符)
const validatePassword = (blur: boolean) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) {
      errors.value.password = `Password must be at least ${minLength} characters long.`
    }
  } else if (!hasUppercase) {
    if (blur) {
      errors.value.password = 'Password must contain at least one uppercase letter.'
    }
  } else if (!hasLowercase) {
    if (blur) {
      errors.value.password = 'Password must contain at least one lowercase letter.'
    }
  } else if (!hasNumber) {
    if (blur) {
      errors.value.password = 'Password must contain at least one number.'
    }
  } else if (!hasSpecialChar) {
    if (blur) {
      errors.value.password = 'Password must contain at least one special character.'
    }
  } else {
    errors.value.password = null
  }
}

// 3. Residency 校验函数 (必须勾选为澳洲居民)
const validateResident = (blur: boolean) => {
  if (!formData.value.isAustralian) {
    if (blur) {
      errors.value.resident = 'You must confirm Australian residency.'
    }
  } else {
    errors.value.resident = null
  }
}

// 4. Gender 校验函数 (必须选择性别)
const validateGender = (blur: boolean) => {
  if (!formData.value.gender) {
    if (blur) {
      errors.value.gender = 'Please select your gender.'
    }
  } else {
    errors.value.gender = null
  }
}

// 5. Reason 校验函数 (描述至少需要 10 个字符)
const validateReason = (blur: boolean) => {
  if (formData.value.reason.length < 10) {
    if (blur) {
      errors.value.reason = 'Reason must be at least 10 characters.'
    }
  } else {
    errors.value.reason = null
  }
}

// 提交表单：强行触发所有 5 项校验，仅在完全无错时允许提交
const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateResident(true)
  validateGender(true)
  validateReason(true)

  if (
    !errors.value.username &&
    !errors.value.password &&
    !errors.value.resident &&
    !errors.value.gender &&
    !errors.value.reason
  ) {
    submittedCards.value.push({
      ...formData.value
    })
    clearForm()
  }
}

// 清空表单与错误提示
const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    isAustralian: false,
    reason: '',
    gender: ''
  }
  errors.value = {
    username: null,
    password: null,
    resident: null,
    gender: null,
    reason: null
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