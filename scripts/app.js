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
  // Clear previous content
  selectionSection.innerHTML = "";

  books.forEach((book) => {
    const bookContainer = document.createElement("article");
    bookContainer.classList.add("book");
    bookContainer.innerHTML = `
    <a href="bookView.html" class="book-link">
                  <img src="${book.coverUrl}" alt="${book.title}" />
              </a>
                  <h3>${book.title}</h3>
                  <p>${book.authors[0].name}</p>
            `;
    selectionSection.appendChild(bookContainer);
  });
}

// Call checkBooks to fetch and display books
checkBooks(displayBooks);

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const searchedBookContainer = document.getElementById("searched-books-container");

// Eventlistener on the forms submit event
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = input.value.trim();
  console.log("Searching for:", query);

  try {
    const books = await fetchSearchBooks(query);
    displaySearchedBooks(books); 
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
});

function displaySearchedBooks(books) {
  if (!Array.isArray(books)) {
    console.error("Expected an array but got:", books);
    return;
  }

  searchedBookContainer.innerHTML = "";

  books.forEach((book) => {
    const bookArticle = document.createElement("article");
    bookArticle.classList.add("book-item");

    const bookUrl = `https://openlibrary.org${book.key}`;

    bookArticle.innerHTML = `
            <a href="${bookUrl}" target="_blank">
                <img src="${book.coverUrl}" alt="${book.title}">
            </a>
            <h3>${book.title}</h3>
            <p>${book.author_name}</p>
            <button id="add-favourite">Favorit</button>
        `;

    searchedBookContainer.appendChild(bookArticle);
  });
}

