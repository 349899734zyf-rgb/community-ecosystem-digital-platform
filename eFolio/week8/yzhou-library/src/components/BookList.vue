<template>
  <div class="mt-4">
    <h2>Book List</h2>

    <!-- Query Controls for Task 8.2 (where, orderBy, limit) -->
    <div class="card p-3 mb-3 bg-light">
      <h5>Query Filter Controls</h5>
      <div class="d-flex gap-2 flex-wrap align-items-center">
        <button
          class="btn btn-sm"
          :class="activeFilter === 'where' ? 'btn-primary' : 'btn-outline-primary'"
          @click="fetchBooksWhere"
        >
          Filter 1: where(isbn > 1000)
        </button>

        <button
          class="btn btn-sm"
          :class="activeFilter === 'advanced' ? 'btn-success' : 'btn-outline-success'"
          @click="fetchBooksAdvanced"
        >
          Filter 2: where(isbn > 1000) + orderBy('isbn', 'asc') + limit(3)
        </button>

        <button
          class="btn btn-sm"
          :class="activeFilter === 'all' ? 'btn-secondary' : 'btn-outline-secondary'"
          @click="fetchAllBooks"
        >
          Show All Books
        </button>
      </div>
      <small class="text-muted mt-2 d-block">
        <strong>Active Query:</strong> {{ currentQueryDescription }}
      </small>
    </div>

    <!-- Books Display List -->
    <div v-if="loading" class="text-center my-3">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <ul v-else-if="books.length > 0" class="list-group">
      <li
        v-for="book in books"
        :key="book.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <strong>{{ book.name }}</strong>
          <span class="badge bg-info text-dark ms-2">ISBN: {{ book.isbn }}</span>
          <small class="text-muted ms-2">(ID: {{ book.id }})</small>
        </div>

        <!-- Update and Delete Buttons for Task 8.2 -->
        <div class="btn-group btn-group-sm">
          <button class="btn btn-warning" @click="promptUpdateBook(book)">
            Edit / Update
          </button>
          <button class="btn btn-danger" @click="deleteBook(book.id, book.name)">
            Delete
          </button>
        </div>
      </li>
    </ul>

    <div v-else class="alert alert-warning text-center">
      No books found matching the query.
    </div>

    <!-- Edit Book Modal / Inline Form -->
    <div v-if="editingBook" class="card mt-3 p-3 border-warning">
      <h5>Update Book: {{ editingBook.name }}</h5>
      <div class="input-group mb-2">
        <span class="input-group-text">New Book Name</span>
        <input type="text" class="form-control" v-model="editName" />
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-success btn-sm" @click="confirmUpdateBook">
          Save Update (updateDoc)
        </button>
        <button class="btn btn-secondary btn-sm" @click="cancelEdit">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import db from '../firebase/init'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

interface Book {
  id: string
  isbn: number
  name: string
}

const books = ref<Book[]>([])
const loading = ref(false)
const activeFilter = ref('where')
const currentQueryDescription = ref("query(collection(db, 'books'), where('isbn', '>', 1000))")

// For Updating
const editingBook = ref<Book | null>(null)
const editName = ref('')

// Query 1: Basic Where query (ISBN > 1000)
const fetchBooksWhere = async () => {
  loading.value = true
  activeFilter.value = 'where'
  currentQueryDescription.value = "query(collection(db, 'books'), where('isbn', '>', 1000))"
  try {
    const q = query(collection(db, 'books'), where('isbn', '>', 1000))
    const querySnapshot = await getDocs(q)
    const booksArray: Book[] = []
    querySnapshot.forEach((docSnap) => {
      booksArray.push({ id: docSnap.id, ...(docSnap.data() as { isbn: number; name: string }) })
    })
    books.value = booksArray
  } catch (error) {
    console.error('Error fetching books with where:', error)
  } finally {
    loading.value = false
  }
}

// Query 2: Advanced query with where, orderBy, and limit (Task 8.2 Requirement)
const fetchBooksAdvanced = async () => {
  loading.value = true
  activeFilter.value = 'advanced'
  currentQueryDescription.value =
    "query(collection(db, 'books'), where('isbn', '>', 1000), orderBy('isbn', 'asc'), limit(3))"
  try {
    const q = query(
      collection(db, 'books'),
      where('isbn', '>', 1000),
      orderBy('isbn', 'asc'),
      limit(3)
    )
    const querySnapshot = await getDocs(q)
    const booksArray: Book[] = []
    querySnapshot.forEach((docSnap) => {
      booksArray.push({ id: docSnap.id, ...(docSnap.data() as { isbn: number; name: string }) })
    })
    books.value = booksArray
  } catch (error) {
    console.error('Error fetching books with where+orderBy+limit:', error)
  } finally {
    loading.value = false
  }
}

// Fetch All Books
const fetchAllBooks = async () => {
  loading.value = true
  activeFilter.value = 'all'
  currentQueryDescription.value = "collection(db, 'books')"
  try {
    const querySnapshot = await getDocs(collection(db, 'books'))
    const booksArray: Book[] = []
    querySnapshot.forEach((docSnap) => {
      booksArray.push({ id: docSnap.id, ...(docSnap.data() as { isbn: number; name: string }) })
    })
    books.value = booksArray
  } catch (error) {
    console.error('Error fetching all books:', error)
  } finally {
    loading.value = false
  }
}

// Task 8.2 Requirement: Update Book (updateDoc)
const promptUpdateBook = (book: Book) => {
  editingBook.value = book
  editName.value = book.name
}

const cancelEdit = () => {
  editingBook.value = null
  editName.value = ''
}

const confirmUpdateBook = async () => {
  if (!editingBook.value || !editName.value.trim()) return
  try {
    const bookDocRef = doc(db, 'books', editingBook.value.id)
    await updateDoc(bookDocRef, {
      name: editName.value
    })
    console.log(`Book ${editingBook.value.id} updated successfully to:`, editName.value)
    alert(`Book updated successfully to "${editName.value}"!`)
    cancelEdit()
    // Refresh current query
    if (activeFilter.value === 'advanced') {
      await fetchBooksAdvanced()
    } else {
      await fetchBooksWhere()
    }
  } catch (error) {
    console.error('Error updating book:', error)
  }
}

// Task 8.2 Requirement: Delete Book (deleteDoc)
const deleteBook = async (bookId: string, bookTitle: string) => {
  if (!confirm(`Are you sure you want to delete "${bookTitle}"?`)) return
  try {
    const bookDocRef = doc(db, 'books', bookId)
    await deleteDoc(bookDocRef)
    console.log(`Book ${bookId} deleted successfully!`)
    alert(`Book "${bookTitle}" deleted successfully!`)
    // Refresh current query
    if (activeFilter.value === 'advanced') {
      await fetchBooksAdvanced()
    } else {
      await fetchBooksWhere()
    }
  } catch (error) {
    console.error('Error deleting book:', error)
  }
}

// Expose refresh function for parent component
defineExpose({
  fetchBooksWhere
})

onMounted(() => {
  fetchBooksWhere()
})
</script>

<style scoped>
.list-group-item {
  border-radius: 8px;
  margin-bottom: 6px;
}
</style>
