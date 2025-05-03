fetch('filmtv_movies.csv')
    .then(res => res.text())
    .then( csv => {
        const rez = Papa.parse(csv, {
            header: true,
            skipEmptyLines: true
        });
        const filmovi = rez.data.map(film => ({
            title: film.title,
            year: Number(film.year),
            genre: film.genre,
            duration: Number(film.duration),
            country: film.country?.split(',').map(c => c.trim()) || [],
            total_votes: Number(film.total_votes)
            }));
        const prvih20 = filmovi.slice(0, 150);
        prikaziTablicu(prvih20);
    });

function prikaziTablicu(filmovi) {
    const tbody = document.querySelector('#filmovi-tablica tbody');
    tbody.innerHTML = ''; // ocisti ako postoji
    for (const film of filmovi) {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${film.title}</td>
        <td>${film.year}</td>
        <td>${film.genre}</td>
        <td>${film.duration}</td>
        <td>${film.country.join(', ')}</td>
        <td>${film.total_votes}</td>
        `;
        tbody.appendChild(row);
        }
    }


    