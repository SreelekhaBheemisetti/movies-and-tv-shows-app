// import express from 'express';
// import fs from 'fs';
// import cors from 'cors';

// const app = express();
// app.use(express.json());
// app.use(cors());
// function getMoviesFromFile() {
//     try {
//         const fileData = fs.readFileSync('movies.json', 'utf-8');
//         return JSON.parse(fileData);
//     } catch (error) {
//         console.error("Error reading movies.json:", error);
//         return [];
//     }
// }
// app.get('/movies', (req, res) => {
//     const movies = getMoviesFromFile();
//     const searchQuery = req.query.title;

//     if (searchQuery) {
//         const filteredMovies = movies.filter(movie =>
//             movie.Title.toLowerCase().includes(searchQuery.toLowerCase())
//         );

//         return res.json(filteredMovies);
//     }

//     res.json(movies);
// });
// app.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });


// import readline from "readline";

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// async function fetchMovies(keyword) {
//     let allMovies = []; // Store all movies

//     for (let page = 1; page <= 10; page++) { // Fetch 10 pages
//         const url = `http://www.omdbapi.com/?s=${keyword}&page=${page}&apikey=63a1b697`;

//         try {
//             const response = await fetch(url);
//             const data = await response.json();

//             if (data.Search) {
//                 allMovies.push(...data.Search); // Add movies to list
//             } else {
//                 console.log(`No more movies found on page ${page}`);
//                 break; // Stop if no more results
//             }
//         } catch (error) {
//             console.error("Error fetching movies:", error.message);
//         }
//     }

//     console.log(`Total Movies Fetched for "${keyword}": ${allMovies.length}`);
//     console.log(allMovies); // Log all movies
// }

// function getUserInput() {
//     rl.question("Enter a movie keyword (or type 'exit' to stop): ", async (keyword) => {
//         if (keyword.toLowerCase() === 'exit') {
//             console.log("Exiting...");
//             rl.close();
//             return;
//         }

//         await fetchMovies(keyword);
//         getUserInput(); // Ask for another input after fetching movies
//     });
// }

// getUserInput();


// import readline from "readline";
// import fs from "fs";

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// async function fetchMovies(keyword) {
//     let allMovies = []; // Store all movies

//     for (let page = 1; page <= 10; page++) { // Fetch 10 pages
//         const url = `http://www.omdbapi.com/?s=${keyword}&page=${page}&apikey=63a1b697`;

//         try {
//             const response = await fetch(url);
//             const data = await response.json();

//             if (data.Search) {
//                 allMovies.push(...data.Search); // Add movies to list
//             } else {
//                 console.log(`No more movies found on page ${page}`);
//                 break; // Stop if no more results
//             }
//         } catch (error) {
//             console.error("Error fetching movies:", error.message);
//         }
//     }

//     // Store the data in movies.json
//     fs.writeFileSync("movies.json", JSON.stringify(allMovies, null, 2));
//     console.log(`Total Movies Fetched for "${keyword}": ${allMovies.length}`);
//     console.log("Movies data has been saved to movies.json");
// }

// function getUserInput() {
//     rl.question("Enter a movie keyword (or type 'exit' to stop): ", async (keyword) => {
//         if (keyword.toLowerCase() === 'exit') {
//             console.log("Exiting...");
//             rl.close();
//             return;
//         }

//         await fetchMovies(keyword);
//         getUserInput(); // Ask for another input after fetching movies
//     });
// }

// getUserInput();

import readline from "readline";
import fs from "fs";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const moviesFile = "movies.json";

// Function to load existing movies from the file
function loadExistingMovies() {
    try {
        if (fs.existsSync(moviesFile)) {
            const data = fs.readFileSync(moviesFile, "utf8");
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("Error reading movies file:", error.message);
    }
    return [];
}

// Function to save movies back to the file
function saveMovies(movies) {
    fs.writeFileSync(moviesFile, JSON.stringify(movies, null, 2));
}

async function fetchMovies(keyword) {
    let existingMovies = loadExistingMovies();
    let existingTitles = new Set(existingMovies.map(movie => movie.Title));
    let newMovies = []; // Store only new movies

    for (let page = 1; page <= 10; page++) { // Fetch up to 10 pages
        const url = `http://www.omdbapi.com/?s=${keyword}&page=${page}&apikey=63a1b697`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.Search) {
                // Filter out movies that are already in the JSON file
                const filteredMovies = data.Search.filter(movie => !existingTitles.has(movie.Title));
                newMovies.push(...filteredMovies);
            } else {
                console.log(`No more movies found on page ${page}`);
                break;
            }
        } catch (error) {
            console.error("Error fetching movies:", error.message);
        }
    }

    if (newMovies.length > 0) {
        existingMovies.push(...newMovies);
        saveMovies(existingMovies);
        console.log(`Added ${newMovies.length} new movies for keyword: "${keyword}"`);
    } else {
        console.log(`No new movies found for "${keyword}".`);
    }
    console.log("Movies data has been updated in movies.json");
}

function getUserInput() {
    rl.question("Enter a movie keyword (or type 'exit' to stop): ", async (keyword) => {
        if (keyword.toLowerCase() === 'exit') {
            console.log("Exiting...");
            rl.close();
            return;
        }

        await fetchMovies(keyword);
        getUserInput(); // Ask for another input after fetching movies
    });
}

getUserInput();
