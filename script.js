document.addEventListener("DOMContentLoaded", async () => {
    const movieContainer = document.getElementById("movie-container");
    const loadMoreButton = document.getElementById("loadMore");
    const searchButton = document.getElementById("searchButton");
    const movieTitleInput = document.getElementById("movieTitle");
    let moviesData = [];
    let displayedMovies = 8; 
    async function fetchMovies() {
        try {
            const response = await fetch("http://localhost:3000/movies");
            moviesData = await response.json();
            displayMovies(moviesData.slice(0, displayedMovies), false); 

            if (moviesData.length > 8) {
                loadMoreButton.classList.remove("hidden"); 
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
            movieContainer.innerHTML = "<p>Failed to load movies.</p>";
        }
    }
    function displayMovies(movies, isFiltered) {
        if (movies.length === 0) {
            movieContainer.innerHTML = "<p>No movies found.</p>";
        } else {
            movieContainer.innerHTML = movies
                .map(
                    (movie) => `<div class="box1 ${isFiltered ? "small-card" : ""}">
                    <img src="${movie.Poster}" alt="${movie.Title}" class="img ${isFiltered ? "small-img" : ""}">
                    <h3>${movie.Title}</h3>
                    <span>${movie.Year}</span>
                    </div>`
                    )
                    .join("");
        }
    }
    searchButton.addEventListener("click", () => {
        const searchText = movieTitleInput.value.trim().toLowerCase();
        const filteredMovies = moviesData.filter((movie) =>
            movie.Title.toLowerCase().includes(searchText)
        );
        displayMovies(filteredMovies, true); 
        loadMoreButton.classList.add("hidden"); 
    });

    loadMoreButton.addEventListener("click", () => {
        displayMovies(moviesData, false); 
        loadMoreButton.classList.add("hidden"); 
    });
    fetchMovies();
});
