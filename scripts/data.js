function getCoverUrl(coverId) {
  return coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : "../Assets/images/book-cover-placeholder.jpg";
}

const fetchBooks = async () => {
  const randomOffset = Math.floor(Math.random() * 100);
  const BOOKS_URL = `http://openlibrary.org/subjects/fiction.json?limit=10&offset=${randomOffset}`;

  try {
    const response = await fetch(BOOKS_URL);
    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.statusText} (status: ${response.status})`
      );
    }
    const data = await response.json();
    const booksWithCovers = data.works.map((book) => ({
      ...book,
      coverUrl: getCoverUrl(book.cover_id),
    }));
    console.log("Fetched books data with covers:", booksWithCovers);
    return booksWithCovers;
  } catch (error) {
    console.error("Failed to fetch books:", error);
    throw error;
  }
};

const fetchSearchBooks = async (query, page = 1) => {
  const limit = 10;
  const SEARCH_URL = `https://openlibrary.org/search.json?q=${query}&page=${page}&limit=${limit}`;

  try {
    const response = await fetch(SEARCH_URL);
    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.statusText} (status: ${response.status})`
      );
    }
    const data = await response.json();
    const booksWithCovers = data.docs.map((book) => ({
      ...book,
      coverUrl: getCoverUrl(book.cover_i),
    }));
    console.log("Fetched search books data with covers:", booksWithCovers);
    return { books: booksWithCovers, numFound: data.numFound };
  } catch (error) {
    console.error("Failed to fetch search results:", error);
    throw error;
  }
};

export { fetchBooks, fetchSearchBooks };
