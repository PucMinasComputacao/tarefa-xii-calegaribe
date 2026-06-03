const API_KEY = "901342cc40622b5296b2eb7d77092102";

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const movieList = document.getElementById("movie-list");
const message = document.getElementById("message");
const searchInput = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");

async function fetchMovies(query = "") {

    try {

        showMessage("Carregando filmes...");
        movieList.innerHTML = "";

        let url = "";

        if (query) {

            url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`;

        } else {

            url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`;

        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Erro ao buscar filmes");
        }

        const data = await response.json();

        renderMovies(data.results);

    } catch (error) {

        console.error(error);

        showMessage("Erro ao carregar os filmes.");

    }

}

function createMovieCard(movie) {

    const col = document.createElement("div");
    col.classList.add("col-md-4");

    const poster = movie.poster_path
        ? `${IMAGE_URL}${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=Sem+Imagem";

    const year = movie.release_date
        ? movie.release_date.split("-")[0]
        : "N/A";

    const overview = movie.overview
        ? movie.overview.substring(0, 120) + "..."
        : "Sem descrição disponível.";

    col.innerHTML = `
        <div class="card movie-card h-100 shadow-sm">

            <img 
                src="${poster}" 
                class="card-img-top"
                alt="${movie.title}"
            >

            <div class="card-body d-flex flex-column">

                <h5 class="card-title">
                    ${movie.title}
                </h5>

                <p class="text-muted mb-2">
                    Ano: ${year}
                </p>

                <p class="text-warning fw-bold">
                    ⭐ Nota: ${movie.vote_average.toFixed(1)}
                </p>

                <p class="card-text">
                    ${overview}
                </p>

            </div>

        </div>
    `;

    return col;
}

function renderMovies(movies) {

    movieList.innerHTML = "";

    if (movies.length === 0) {

        showMessage("Nenhum filme encontrado.");
        return;

    }

    showMessage("");

    movies.forEach(movie => {

        const card = createMovieCard(movie);

        movieList.appendChild(card);

    });

}

function showMessage(text) {

    message.textContent = text;

}

function init() {

    fetchMovies();

}

btnSearch.addEventListener("click", () => {

    const query = searchInput.value.trim();

    fetchMovies(query);

});

searchInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {

        const query = searchInput.value.trim();

        fetchMovies(query);

    }

});

init();
