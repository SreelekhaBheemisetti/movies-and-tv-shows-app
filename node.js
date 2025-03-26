import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
function getMoviesFromFile() {
    try {
        const fileData = fs.readFileSync('movies.json', 'utf-8');
        return JSON.parse(fileData);
    } catch (error) {
        console.error("Error reading movies.json:", error);
        return [];
    }
}
app.get('/movies', (req, res) => {
    const movies = getMoviesFromFile();
    const searchQuery = req.query.title;

    if (searchQuery) {
        const filteredMovies = movies.filter(movie =>
            movie.Title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return res.json(filteredMovies);
    }

    res.json(movies);
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
