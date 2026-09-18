<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-sm p-4">
          <h1 class="text-center mb-4">Add Book</h1>

          <!-- Form to add book to Firestore -->
          <form @submit.prevent="addBook">
            <div class="mb-3">
              <label for="isbn" class="form-label">ISBN (Must be a Number):</label>
              <input
                type="text"
                class="form-control"
                v-model="isbn"
                id="isbn"
                placeholder="e.g. 1234"
                required
              />
            </div>

            <div class="mb-3">
              <label for="name" class="form-label">Book Name:</label>
              <input
                type="text"
                class="form-control"
                v-model="name"
                id="name"
                placeholder="e.g. Clean Code"
                required
              />
            </div>

            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-primary">Add Book</button>
            </div>
          </form>

          <div v-if="message" class="alert alert-success mt-3 text-center">
            {{ message }}
          </div>
          <div v-if="errorMessage" class="alert alert-danger mt-3 text-center">
            {{ errorMessage }}
          </div>

          <hr class="my-4" />

          <!-- BookList Component for Query, Update, and Delete -->
          <BookList ref="bookListRef" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import db from '../firebase/init'
import { collection, addDoc } from 'firebase/firestore'
import BookList from '../components/BookList.vue'

const isbn = ref('')
const name = ref('')
const message = ref('')
const errorMessage = ref('')
const bookListRef = ref<InstanceType<typeof BookList> | null>(null)

const addBook = async () => {
  message.value = ''
  errorMessage.value = ''

  try {
    const isbnNumber = Number(isbn.value)
    if (isNaN(isbnNumber)) {
      errorMessage.value = 'Please enter a valid ISBN number.'
      alert('Please enter a valid ISBN number.')
      return
    }

    // Add new document to "books" collection
    const docRef = await addDoc(collection(db, 'books'), {
      isbn: isbnNumber,
      name: name.value
    })

    console.log('Book added with ID: ', docRef.id)
    message.value = `Book "${name.value}" (ISBN: ${isbnNumber}) added successfully!`
    alert('Book added successfully!')

    // Reset inputs
    isbn.value = ''
    name.value = ''

    // Refresh BookList component
    if (bookListRef.value) {
      bookListRef.value.fetchBooksWhere()
    }
  } catch (error: any) {
    console.error('Error adding book: ', error)
    errorMessage.value = `Error adding book: ${error.message || error}`
  }
}
</script>

<style scoped>
.card {
  border-radius: 12px;
}
</style>
