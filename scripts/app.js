import {fetchSearchBooks } from "./data.js";
import { checkBooks } from "./localStorage.js";

export function displayBooks(books) {
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

// Call checkBooks to fetch and display books
checkBooks(displayBooks);

function displaySearchedBooks() {
      fetchSearchBooks("Erin Morgenstern");
}
displaySearchedBooks();