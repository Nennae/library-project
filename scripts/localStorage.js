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
      throw error;
    }
  }
}
// Stores the books array in localStorage as searched_books
export function saveSearchedBooks(books) {
  localStorage.setItem("searched_books", JSON.stringify(books));
}
// Retrieves the books array from localStorage and parses search_books array or an empty array if it doesn't exist
export function getSearchedBooks() {
  return JSON.parse(localStorage.getItem("searched_books")) || [];
}
