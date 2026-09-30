import { useState } from "react";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBooks = async (event) => {
    event.preventDefault();

    if (!searchTerm.trim()) {
      setError("Please enter a book title or author.");
      setBooks([]);
      return;
    }

    setLoading(true);
    setError("");
    setBooks([]);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          searchTerm
        )}&limit=12`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch books.");
      }

      const data = await response.json();

      if (data.docs.length === 0) {
        setError("No books found. Try another search.");
      } else {
        setBooks(data.docs);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📚 Book Finder</h1>
        <p>Discover books using the Open Library API</p>
      </header>

      <main className="container">
        <form className="search-form" onSubmit={searchBooks}>
          <input
            type="text"
            placeholder="Search by book title or author..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <button type="submit">Search</button>
        </form>

        {loading && <p className="message">Searching for books...</p>}

        {error && <p className="error">{error}</p>}

        {!loading && !error && books.length === 0 && (
          <p className="message">
            Search for a book or author to get started.
          </p>
        )}

        <div className="book-grid">
          {books.map((book, index) => {
            const coverUrl = book.cover_i
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
              : null;

            return (
              <div className="book-card" key={`${book.key}-${index}`}>
                <div className="cover-container">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={`Cover of ${book.title}`}
                    />
                  ) : (
                    <div className="no-cover">No Cover</div>
                  )}
                </div>

                <div className="book-details">
                  <h2>{book.title}</h2>

                  <p>
                    <strong>Author:</strong>{" "}
                    {book.author_name
                      ? book.author_name.slice(0, 2).join(", ")
                      : "Unknown"}
                  </p>

                  <p>
                    <strong>First Published:</strong>{" "}
                    {book.first_publish_year || "Unknown"}
                  </p>

                  {book.edition_count && (
                    <p>
                      <strong>Editions:</strong> {book.edition_count}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="footer">
        <p>Built with React &amp; Open Library API.{" "}
          <a href="https://openlibrary.org/" target="_blank" rel="noopener noreferrer">Data provided by Open Library</a>
        </p>
      </footer>
    </div>
  );
}

export default App;