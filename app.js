import { fetchBooks, fetchSearchBooks } from "./data.js";

async function checkBooks() {
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

function displayBooks(books) {
      console.log("Displaying books:", books); 

      if (!Array.isArray(books)) {
        console.error("Expected an array of books, but got:", books);
        return;
      }

      const selectionSection = document.getElementById("selection-section");
      if (!selectionSection) {
        console.error("No element with id 'selection' found in the document.");
        return;
      }
      books.forEach((book) => {
            const bookContainer = document.createElement("article");
            bookContainer.classList.add("book");
            bookContainer.innerHTML = `
                  <img src="${book.coverUrl}" alt="${book.title}" />
                  <h2>${book.title}</h2>
                  <p>${book.authors[0].name}</p>
            `;
            selectionSection.appendChild(bookContainer);
      });
     
}
checkBooks();

function displaySearchedBooks() {
      fetchSearchBooks("Erin Morgenstern");
}
displaySearchedBooks();