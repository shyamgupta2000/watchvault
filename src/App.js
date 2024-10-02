import React, { useState, useEffect } from "react";
import './App.css';
import SearchIcon from './search.svg';
import MovieCard from "./MovieCard";

const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=48400c20';

const App = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const [totalResults, setTotalResults] = useState(0); // Total results from the API
    const [totalPages, setTotalPages] = useState(0); // Total pages calculated from totalResults

    // Perform search when the app loads (with a default search term)
    useEffect(() => {
        searchMovies("Batman", 1); // Default search on page 1
    }, []);

    // Perform search when the page changes or the search term changes
    useEffect(() => {
        if (searchTerm) {
            searchMovies(searchTerm, currentPage); // Trigger search when the page changes
        }
    }, [currentPage, searchTerm]); // Listen to both page and search term changes

    const searchMovies = async (search, page = 1) => {
        const response = await fetch(`${API_URL}&s=${search}&page=${page}`);
        const data = await response.json();

        if (data.Search) {
            setMovies(data.Search); // Update movies with the new results
            setTotalResults(parseInt(data.totalResults)); // Set total results
            setTotalPages(Math.ceil(data.totalResults / 10)); // Calculate total pages
        } else {
            setMovies([]); // No movies found
            setTotalResults(0);
            setTotalPages(0);
        }
    };

    return (
        <div className="app">
            <h1>WatchVault</h1>
            
            <div className="search">
                <input 
                    value={searchTerm} 
                    placeholder="Search for movies" 
                    onChange={(e) => setSearchTerm(e.target.value)}    
                />
                <img 
                    src={SearchIcon} 
                    alt="Search"
                    onClick={() => {
                        setCurrentPage(1); // Reset to page 1 when searching
                        searchMovies(searchTerm, 1);
                    }}
                />
            </div>

            {movies?.length > 0 ? (
                <div className="container">
                    {movies.map((movie) => (
                        <MovieCard key={movie.imdbID} movie={movie} />
                    ))}

                    {/* Pagination Controls */}
                    <div className="pagination">
                        <button 
                            onClick={() => {
                                if (currentPage > 1) {
                                    setCurrentPage(currentPage - 1); // Go to previous page
                                }
                            }} 
                            disabled={currentPage === 1} // Disable "Previous" on the first page
                        >
                            Previous
                        </button>

                        <span>Page {currentPage} of {totalPages}</span>

                        <button 
                            onClick={() => {
                                if (currentPage < totalPages) {
                                    setCurrentPage(currentPage + 1); // Go to next page
                                }
                            }} 
                            disabled={currentPage === totalPages} // Disable "Next" on the last page
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <div className="empty">
                    <h2>No Movies Found</h2>
                </div>
            )}
        </div>
    );
}

export default App;
