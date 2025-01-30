const BOOKS_URL =
  "http://openlibrary.org/subjects/fiction.json?&limit=10&offset=20";

const fetchBooks = async () => {
  try {
    const response = await fetch(BOOKS_URL);
    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.statusText} (status: ${response.status})`
      );
    }
    const data = await response.json();
    const booksWithCovers = data.works.map((book) => {
      const coverUrl = book.cover_id
        ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
        : null;
      return { ...book, coverUrl };
    });
    console.log("Fetched books data with covers:", booksWithCovers);
    return booksWithCovers;
  } catch (error) {
    if (error.name === "TypeError") {
      console.error("There was a problem with the fetch operation:", error);
    } else {
      console.error("Failed to fetch books:", error);
    }
    throw error;
  }
};

const fetchSearchBooks = async (query) => {
  const SEARCH_URL = `https://openlibrary.org/search.json?q=${query}`;
  try {
    const response = await fetch(SEARCH_URL);
    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.statusText} (status: ${response.status})`
      );
    }
    const data = await response.json();
    const booksWithCovers = data.docs.map((book) => {
      const coverUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : null;
      return { ...book, coverUrl };
    });
    console.log("Fetched search books data with covers:", booksWithCovers);
    return booksWithCovers;
  } catch (error) {
    if (error.name === "TypeError") {
      console.error("There was a problem with the fetch operation:", error);
    } else {
      console.error("Failed to fetch search results:", error);
    }
    throw error;
  }
};

export { fetchBooks, fetchSearchBooks };

