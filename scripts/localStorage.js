import { fetchBooks } from "./data.js";
import { displayBooks } from "./app.js";

export async function checkBooks() {
  // check if there are books in localStorage
  let selection_books = JSON.parse(localStorage.getItem("selection_books"));
  if (selection_books) {
    // if there are, display them
    displayBooks(selection_books);
  } else {
    // else, fetch books and display them
    try {
      const fetchedBooks = await fetchBooks();
      localStorage.setItem("selection_books", JSON.stringify(fetchedBooks));
      selection_books = fetchedBooks;
      displayBooks(selection_books);
    } catch (error) {
      console.error("Failed to fetch and display books:", error);
    }
  }
}

export function saveSearchedBooks(books) {
  localStorage.setItem("searched_books", JSON.stringify(books));
}

export function getSearchedBooks() {
  return JSON.parse(localStorage.getItem("searched_books")) || [];
}
// localStorage.clear();