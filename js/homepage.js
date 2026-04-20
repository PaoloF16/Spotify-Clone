const searchApiLink = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
const artistLink = "https://striveschool-api.herokuapp.com/api/deezer/artist/";

const artisti = [
  "shakira",
  "eminem",
  "lucio dalla",
  "ramazzotti",
  "ana mena",
  "gigi d'alessio",
  "snoop dog",
  "madonna",
  "lady gaga",
  "katy perry",
  "adriano celentano",
  "toto cotugno",
  "nino d'angelo",
  "romina power",
  "freddie mercury",
  "michael jackson",
  "beyonce",
  "rihanna",
  "drake",
  "taylor swift",
  "ed sheeran",
  "adele",
  "bruno mars",
  "the weeknd",
  "billie eilish",
  "ariana grande",
  "justin bieber",
  "coldplay",
  "u2",
  "queen",
  "david bowie",
  "elton john",
  "frank sinatra",
  "whitney houston",
  "mariah carey",
  "bob marley",
  "amy winehouse",
  "daft punk",
  "avicii",
  "calvin harris",
  "vasco rossi",
  "zucchero",
  "eros ramazzotti",
  "laura pausini",
  "tiziano ferro",
  "jovanotti",
  "ligabue",
  "claudio baglioni",
  "pino daniele",
  "fabrizio de andre",
  "mina",
  "ornella vanoni",
  "massimo ranieri",
  "al bano",
  "riccardo cocciante",
  "giorgio moroder",
  "ivan graziani",
  "fiorella mannoia",
  "giorgia",
  "elisa",
];
const artistiDisponibili = [...artisti];
let cardCreate = 0;
let fetchInCorso = 0; // conta le fetch attive
const wrapper = document.getElementById("small-cards-wrapper");

function fetchArtista() {
  if (cardCreate + fetchInCorso >= 6 || artistiDisponibili.length === 0) return;

  const randomIndex = Math.floor(Math.random() * artistiDisponibili.length);
  const artista = artistiDisponibili.splice(randomIndex, 1)[0];
  fetchInCorso++;

  fetch(searchApiLink + artista)
    .then((response) => {
      if (response.ok) return response.json();
      else throw new Error("caricamento non riuscito");
    })
    .then((data) => {
      const randomTrack = Math.floor(Math.random() * data.data.length);
      const albumID = data.data[randomTrack].artist.id;
      return fetch(artistLink + albumID + "/albums");
    })
    .then((response) => response.json())
    .then((data) => {
      const randomAlbum = Math.floor(Math.random() * data.data.length);
      const album = data.data[randomAlbum];
      fetchInCorso--;
      cardCreate++;
      wrapper.innerHTML += `
        <div class="col">
    <a href="album.html?id=${album.id}" class="text-decoration-none">
      <div class="row g-0 rounded-2 overflow-hidden" style="background-color: #2a2a2a">
        <div class="col-3">
          <img src="${album.cover_medium}" class="h-100 w-100 object-fit-cover" alt="${album.title}" />
        </div>
        <div class="col-9 d-flex flex-column justify-content-center px-2">
          <span class="fw-bold text-truncate text-light">${album.title}</span>
          <span class="text-secondary small">${album.release_date}</span>
        </div>
      </div>
    </a>
  </div>
`;
    })
    .catch(() => {
      fetchInCorso--;
      fetchArtista();
    });
}

for (let i = 0; i < 6; i++) {
  fetchArtista();
}
