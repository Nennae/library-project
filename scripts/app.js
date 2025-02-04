import { fetchSearchBooks } from "./data.js";
import { checkBooks, saveSearchedBooks } from "./localStorage.js";

// Takes books array as an argument and displays them in the selection section
export function displayBooks(books) {

  const selectionSection = document.getElementById("selection-section");

  // Clear previous content
  selectionSection.innerHTML = "";

  // Loop through the books array and create an article element for each book
  books.forEach((book) => {
    const bookContainer = document.createElement("article");
    bookContainer.classList.add("book");
    bookContainer.innerHTML = `
      <a href="bookView.html" class="book-link">
        <img class="book-cover" src="${book.coverUrl}" alt="${book.title}" />
      </a>
     
    `;
    selectionSection.appendChild(bookContainer);
  });
}

// Calls checkBooks function (from localStorage.js) and passes displayBooks as a callback function
checkBooks(displayBooks);

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const searchedBookContainer = document.getElementById(
  "searched-books-container"
);

// Initialize currentPage and lastQuery to manage pagination and search queries
let currentPage = 1;
let lastQuery = "";

// Asynchronous function that takes a query and an optional page number as arguments
async function handleSearch(query, page = 1) {
  lastQuery = query;
  currentPage = page;

  // Tries to fetch search results using fetchSearchBooks function (from data.js) with query and page as arguments
  try {
    const { books, numFound } = await fetchSearchBooks(query, page);
    // Saves the search results to localStorage
    saveSearchedBooks(books);
    // Displays the search results
    displaySearchedBooks(books, numFound);
  } catch (error) {
    throw error;
  }
}

// Function that takes an array of books and and the total number of search results
function displaySearchedBooks(books, totalResults) {
  //Check if books is an array and returns error if not
  if (!Array.isArray(books)) {
    return;
  }

  // Clears the previous content
  searchedBookContainer.innerHTML = "";

  // Iterates over books array and creates an article element for each book
  books.forEach((book) => {
    const bookArticle = document.createElement("article");
    bookArticle.classList.add("book-item");

    bookArticle.innerHTML = `
      <a href="bookView.html" class="book-link">
        <img src="${book.coverUrl}" alt="${book.title}" class="book-cover"/>
      </a>
      <div class="book-info">
      <h4>${book.title}</h4>
      <p>${book.author_name || "Okänd författare"}</p>
      <button class="add-favourite">Favorit</button>
      </div>
    `;
    searchedBookContainer.appendChild(bookArticle);
  });


  // Create pagination if there are more than 10 books
  if (totalResults > 10) {
    const paginationContainer = document.createElement("div");
    paginationContainer.id = "pagination";

    // Calculate total number of pages
    const totalPages = Math.ceil(totalResults / 10);

    // Create buttons for previous and next page if more than one page
    if (currentPage > 1) {
      const prevButton = document.createElement("button");
      prevButton.textContent = "Föregående";
      // Eventlistener for previous button
      prevButton.addEventListener("click", () =>
        handleSearch(lastQuery, currentPage - 1)
      );
      // Append previous button to paginationContainer
      paginationContainer.appendChild(prevButton);
    }

    // Create a next button if there are more pages
    if (currentPage < totalPages) {
      const nextButton = document.createElement("button");
      nextButton.textContent = "Nästa";
      // Eventlistener for next button to call handleSearch
      nextButton.addEventListener("click", () =>
        handleSearch(lastQuery, currentPage + 1)
      );
      paginationContainer.appendChild(nextButton);
    }

    searchedBookContainer.appendChild(paginationContainer);
  }
  // Scroll behaviour - to top of container
  searchedBookContainer.scrollIntoView({ behavior: "smooth" });
}

// Eventlistener for searching
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = input.value.trim();
  handleSearch(query);
});
