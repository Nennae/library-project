// Checks if there is a cover id and returns the cover url, else it returns a placeholder image
function getCoverUrl(coverId) {
  return coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : "../Assets/images/book-cover-placeholder.jpg";
}

// Asychronous function that fetches books from Open Library API
const fetchBooks = async () => {
  // Generates a random offset between 0 - 99 to get different books each time
  const randomOffset = Math.floor(Math.random() * 100);
  // Constructs the URL with the random offset and limit of 8 books
  const BOOKS_URL = `http://openlibrary.org/subjects/fiction.json?limit=8&offset=${randomOffset}`;

  // Tries to fetch books from the API
  try {
    const response = await fetch(BOOKS_URL);
    // If the response is not ok, throws an error
    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.statusText} (status: ${response.status})`
      );
    }
    // Parses the response to JSON and stores it in data
    const data = await response.json();

    // Maps over the works array and adds a coverUrl property to each book object using the getCoverUrl function
    const booksWithCovers = data.works.map((book) => ({
      ...book,
      coverUrl: getCoverUrl(book.cover_id),
    }));
    // Returns the books with covers
    return booksWithCovers;
  } catch (error) {
    throw error;
  }
};

// Asynchronous function that fetches search results from Open Library API with a query and an optional page number
const fetchSearchBooks = async (query, page = 1) => {
  const limit = 24;
  // Constructs the URL with the query, page number and limit
  const SEARCH_URL = `https://openlibrary.org/search.json?q=${query}&page=${page}&limit=${limit}`;

  // Tries to fetch search results from the API
  try {
    const response = await fetch(SEARCH_URL);
    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.statusText} (status: ${response.status})`
      );
    }
    // Parses the response to JSON and stores it in data
    const data = await response.json();

    // Maps over the docs array and adds a coverUrl property to each book object using the getCoverUrl function
    const booksWithCovers = data.docs.map((book) => ({
      ...book,
      coverUrl: getCoverUrl(book.cover_i),
    }));
    return { books: booksWithCovers, numFound: data.numFound };
  } catch (error) {
    throw error;
  }
};

export { fetchBooks, fetchSearchBooks };
