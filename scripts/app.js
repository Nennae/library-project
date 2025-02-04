import { fetchSearchBooks } from "./data.js";
import { checkBooks, saveSearchedBooks } from "./localStorage.js";

export function displayBooks(books) {
  console.log("Displaying books:", books);

  if (!Array.isArray(books)) {
    console.error("Expected an array of books, but got:", books);
    return;
  }

  const selectionSection = document.getElementById("selection-section");
  if (!selectionSection) {
    console.error(
      "No element with id 'selection-section' found in the document."
    );
    return;
  }

  selectionSection.innerHTML = ""; // Clear previous content

  books.forEach((book) => {
    const bookContainer = document.createElement("article");
    bookContainer.classList.add("book");
    bookContainer.innerHTML = `
      <a href="bookView.html" class="book-link">
        <img src="${book.coverUrl}" alt="${book.title}" />
      </a>
      <h3>${book.title}</h3>
      <p>${book.authors?.[0]?.name || "Okänd författare"}</p>
    `;
    selectionSection.appendChild(bookContainer);
  });
}

// Call checkBooks to fetch and display books
checkBooks(displayBooks);

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const searchedBookContainer = document.getElementById(
  "searched-books-container"
);

let currentPage = 1;
let lastQuery = "";

async function handleSearch(query, page = 1) {
  lastQuery = query;
  currentPage = page;

  try {
    const { books, numFound } = await fetchSearchBooks(query, page);
    saveSearchedBooks(books);
    displaySearchedBooks(books, numFound);
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
}

function displaySearchedBooks(books, totalResults) {
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
      <p>${book.author_name || "Okänd författare"}</p>
      <button class="add-favourite">Favorit</button>
    `;

    searchedBookContainer.appendChild(bookArticle);
  });

  // Skapa pagineringskontroller om det finns mer än en sida
  if (totalResults > 10) {
    const paginationContainer = document.createElement("div");
    paginationContainer.id = "pagination";

    const totalPages = Math.ceil(totalResults / 10);

    if (currentPage > 1) {
      const prevButton = document.createElement("button");
      prevButton.textContent = "Föregående";
      prevButton.addEventListener("click", () =>
        handleSearch(lastQuery, currentPage - 1)
      );
      paginationContainer.appendChild(prevButton);
    }

    if (currentPage < totalPages) {
      const nextButton = document.createElement("button");
      nextButton.textContent = "Nästa";
      nextButton.addEventListener("click", () =>
        handleSearch(lastQuery, currentPage + 1)
      );
      paginationContainer.appendChild(nextButton);
    }

    searchedBookContainer.appendChild(paginationContainer);
  }
  // Skrolla upp till början av sökresultaten
  searchedBookContainer.scrollIntoView({ behavior: "smooth" });
}

// Eventlistener för sökning
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = input.value.trim();
  handleSearch(query);
});
