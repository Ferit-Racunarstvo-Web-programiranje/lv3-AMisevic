let sviFilmovi = [];
let kosarica = [];

fetch('filmtv_movies.csv')
    .then(res => res.text())
    .then( csv => {
        const rez = Papa.parse(csv, {
            header: true,
            skipEmptyLines: true
        });
        sviFilmovi = rez.data.map(film => ({
            title: film.title,
            year: Number(film.year),
            genre: film.genre,
            duration: Number(film.duration),
            country: film.country?.split(',').map(c => c.trim()) || [],
            avg_vote: Number(film.avg_vote),
            total_votes: Number(film.total_votes)
            }));

            prikaziPocetneFilmove(sviFilmovi.slice(0, 10));
            const rangeInput = document.getElementById('filter-rating');
            const ratingDisplay = document.getElementById('rating-value');
            rangeInput.addEventListener('input',()=>{
                ratingDisplay.textContent = rangeInput.value;
            });
            document.getElementById('primijeni-filtere').addEventListener('click', filtriraj);

            //prikaziFiltriraneFilmove(sviFilmovi.slice(0, 10));
            //document.getElementById('dodaj').addEventListener('click', dodajUKosaricu());

            document.getElementById('potvrdi-kosaricu').addEventListener('click',() =>{
                if (kosarica.length===0){
                    alert("Kosarica je prazna!");
                } else {
                    alert(`Uspjesno ste odabrali ${kosarica.length} filmova za gledanje!`);
                    kosarica=[];
                    osvjeziKosaricu();
                }
            });
        })
        .catch(err => {
            console.error('Greska pri dohvacanju CSV-a:', err);

        // dio za prikaz podataka za prvi zadatak
        //const prvih20 = filmovi.slice(0, 150);
        //prikaziTablicu(prvih20); 
    });

function prikaziPocetneFilmove(filmovi) {
    const tbody = document.querySelector('#filmovi-tablica tbody');
    tbody.innerHTML = '';
    for (const film of filmovi) {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${film.title}</td>
        <td>${film.year}</td>
        <td>${film.genre}</td>
        <td>${film.duration} min</td>
        <td>${film.country.join(', ')}</td>
        <td>${film.total_votes}</td>
        <td><button class="dodaj">Dodaj</button></td>
        `;
        tbody.appendChild(row);
        // moj dodatak kako bi na button koji sam gore dodao povezao listener koji ce onda odma imati poveznicu na objek filma o kojem se radi 
        const btn = row.querySelector('.dodaj');
        btn.addEventListener('click', () => dodajUKosaricu(film));
    }
}    

function prikaziFiltriraneFilmove(filmovi) {
    const tbody=document.querySelector('#filmovi-tablica tbody');
    tbody.innerHTML='';
    if(filmovi.length===0){
        tbody.innerHTML='<tr><td colspan="6">Nema filmova za odabrane filtre.</td></tr>';
        return;
    }
    for (const film of filmovi){
        const row = document.createElement('tr');
        row.innerHTML=`
        <td>${film.title}</td>
        <td>${film.year}</td>
        <td>${film.genre}</td>
        <td>${film.duration}min</td>
        <td>${film.country.join(', ')}</td>
        <td>${film.avg_vote}</td>
        <td><button class="dodaj">Dodaj</td>
        `;
        tbody.appendChild(row);
        const btn = row.querySelector('.dodaj');
        btn.addEventListener('click', () => dodajUKosaricu(film));
    }
}

function filtriraj() {
    const zanr = document.getElementById('filter-genre').
        value.trim().toLowerCase();
    const godinaOd = parseInt(document.getElementById('filter-year').value);
    const drzava = document.getElementById('filter-country').value.trim().toLowerCase();
    const ocjena = parseFloat(document.getElementById('filter-rating').value);
    const filtriraniFilmovi = sviFilmovi.filter(film => {
        const zanrMatch =! zanr || film.genre.toLowerCase().includes(zanr);
    const godinaOdMatch =! godinaOd || film.year >= godinaOd;
    const drzavaMatch =! drzava || film.country.some( c => c.toLowerCase().includes(drzava));
    const ocjenaMatch = film.avg_vote >= ocjena;
    return zanrMatch && godinaOdMatch && drzavaMatch && ocjenaMatch;
    });
    prikaziFiltriraneFilmove(filtriraniFilmovi);
}

function dodajUKosaricu(film) {
    if (!kosarica.includes(film)){
        kosarica.push(film);
        osvjeziKosaricu();
    } else {
        alert("Film je vec u kosarici!");
    }
}

function osvjeziKosaricu() {
    const lista=document.getElementById('lista-kosarice');
    lista.innerHTML='';
    kosarica.forEach((film,index)=>{
        const li=document.createElement('li');
        li.textContent= film.title;
        const ukloniBtn=document.createElement('button');
        ukloniBtn.textContent='Ukloni';
        ukloniBtn.addEventListener('click',()=>{
            ukloniIzKosarice(index);
        });
        li.appendChild(ukloniBtn);
        lista.appendChild(li);
    });
}

function ukloniIzKosarice(index) {
    kosarica.splice(index,1);
    osvjeziKosaricu();
}

    