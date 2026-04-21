//PER LO SCORRIMENTO DELLE CARDS
const tracks = document.querySelectorAll(".carosello");
const prevs = document.querySelectorAll(".prev");
const nexts = document.querySelectorAll(".next");

const widthImage = 180;

nexts.forEach((nextBtn, index) => {
  nextBtn.addEventListener("click", () => {
    tracks[index].scrollBy({ left: widthImage, behavior: "smooth" });
  });
});

prevs.forEach((prevBtn, index) => {
  prevBtn.addEventListener("click", () => {
    tracks[index].scrollBy({ left: -widthImage, behavior: "smooth" });
  });
});
tracks.forEach((scrollRow) => {
  scrollRow.addEventListener("wheel", (e) => {
    e.preventDefault();
    scrollRow.scrollBy({ left: e.deltaY * 2, behavior: "smooth" });
  });
});

const artisti = [
  "shakira",
  "eminem",
  "lucio dalla",
  "ramazzotti",
  "ana mena",
  "gigi d'alessio",
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

const linkArtist ="https://striveschool-api.herokuapp.com/api/deezer/artist/";
const searchLink ="https://striveschool-api.herokuapp.com/api/deezer/search?q=";

//CREO L'ARRAY CON LE INFO DEGLI ALBUM E LI SALVO NEL LOCAL STORAGE
const createArray = function (callback) {
  const albumInfo = [];
  const promises = artisti.map((artista) => {
    return fetch(searchLink + artista)
      .then((response) => response.json())
      .then((data) => {
        if (!data.data || data.data.length === 0) return;
        const artistaData = data.data[0].artist;
        return fetch(linkArtist + artistaData.id + "/albums")
          .then((response) => response.json())
          .then((data) => {
            if (!data || !data.data) return;
            data.data.forEach((album) => {
              albumInfo.push({
                id: album.id,
                titolo: album.title,
                cover_medium: album.cover_medium,
                cover_small: album.cover_small,
                data: album.release_date,
                ////////
                artista: artistaData.name || "",
                idArtista: artistaData.id,
                type: artistaData.type,
                imgArtista: artistaData.picture,
                imgArtistaSmall: artistaData.picture_small,
                imgArtistaMedium: artistaData.picture_medium,
              });
            });
          });
      })
      .catch((error) => console.log("errore", error));
  });

  Promise.allSettled(promises).then(() => {
    // console.log("array completo", albumInfo.length);
    callback(albumInfo);
  });
};

const albumSalvati = JSON.parse(localStorage.getItem("albumInfo"));

if (albumSalvati && albumSalvati.length > 0) {
  console.log("dati dal localStorage:", albumSalvati);
  // genera le card direttamente
} else {
  createArray((albumInfo) => {
    localStorage.setItem("albumInfo", JSON.stringify(albumInfo));
    console.log(albumInfo);
    // genera le card
  });
}
//TUTTI I WRAPPER DELLE CARDS
const smallCardsWrapper = document.getElementById("small-cards-wrapper");
const primoCarosello = document.getElementById("primo-carosello");
const secondoCarosello = document.getElementById("secondo-carosello");
const artistiWrapper = document.getElementById("artisti-scroll-row");

albumSalvati.forEach((album) => {});

const popolaCarosello = function (array, carosello) {
  array.forEach((album) => {
    if (carosello.querySelectorAll(".card").length > 16) return;
    carosello.innerHTML += `
    <a href="album-page.html?id=${album.id}" class="text-decoration-none text-light">
    <div class="card text-light flex-shrink-0 border-0 overflow-hidden rounded-3" style="width: 160px">
    <img src="${album.cover_medium}" class="card-img-top" alt="${album.titolo}" />
    <div class="card-body bg-gray">
    <h4 class="m-0 fs-6 text-truncate">${album.titolo}</h4>
    <p class="card-text small text-secondary text-truncate">${album.data}</p>
    </div>
    </div>
    </a>
    `;
  });
};

const popolaPiccoleCards = function (array, wrapper) {
  array.forEach((album) => {
    if (smallCardsWrapper.querySelectorAll(".col").length === 8) {
      return;
    }
    wrapper.innerHTML += `
          <div class="col">
          <a href="album-page.html?id=${album.id}" class="text-decoration-none">
          <div class="row g-0 rounded-2 overflow-hidden" style="background-color: #2a2a2a">
          <div class="col-3">
          <img src="${album.cover_small}" alt="playlist-cover" class="h-100 w-100 object-fit-cover" />
          </div>
          <div class="col-9 d-flex flex-column justify-content-center px-2">
          <span class="fw-bold text-truncate text-light">${album.titolo}</span>
          <span class="text-secondary small">${album.data}</span>
          </div>
          </div>
          </a>
          </div>
          `;
  });
};

const popolaArtisti = function (array, wrapper) {
  const artistiUsati = new Set();

  array.forEach((album) => {
    if (artistiWrapper.querySelectorAll(".card").length > 20) return;
    if (artistiUsati.has(album.idArtista)) return;
    artistiUsati.add(album.idArtista);

    wrapper.innerHTML += `
     <a href="artist-page.html?id=${album.idArtista}" class="card text-decoration-none text-light bg-black border-0 flex-shrink-0">
              <img src="${album.imgArtistaMedium}" class="rounded-circle object-fit-cover" style="width: 140px; height: 140px" />
              <div class="py-1">
                <h6 class="m-0">${album.artista}</h6>
                <p class="m-0 small text-secondary">${album.type}</p>
              </div>
            </a>
    `;
  });
};

let unTerzo = albumSalvati.length / 3;
const primoTerzo = albumSalvati.slice(0, unTerzo).sort(() => Math.random() - 0.5);
const secondoTerzo = albumSalvati.slice(unTerzo, unTerzo * 2).sort(() => Math.random() - 0.5);
const ultimoTerzo = albumSalvati.slice(unTerzo).sort(() => Math.random() - 0.5);
const arrayMischiato = albumSalvati.sort(() => Math.random() - 0.5);

popolaCarosello(primoTerzo, primoCarosello);
popolaCarosello(secondoTerzo, secondoCarosello);
popolaPiccoleCards(ultimoTerzo, smallCardsWrapper);
popolaArtisti(arrayMischiato, artistiWrapper);

//PER LA DATA NEL FOOTER
const currentYear = new Date().getFullYear();
document.getElementById("date").innerText = `@${currentYear} Spotify AB`;


//CUORE ROSSO PREFE
const favoriteIcon = document.getElementById("favorite-icon");

if (favoriteIcon) {
  favoriteIcon.style.cursor = "pointer";
  favoriteIcon.style.transition = "all 0.1s ease";
  favoriteIcon.style.color = "#b3b3b3";

  favoriteIcon.addEventListener("click", function () {
    const isLiked = this.classList.contains("bi-heart-fill");

    if (isLiked) {
      this.classList.replace("bi-heart-fill", "bi-heart");
      this.style.color = "#b3b3b3";
      this.style.transform = "scale(1)";
    } else {
      this.classList.replace("bi-heart", "bi-heart-fill");
      this.style.color = "#ff0000";
      this.style.transform = "scale(1.3)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 200);
    }
  });

  favoriteIcon.addEventListener("mouseenter", function () {
    if (!this.classList.contains("bi-heart-fill")) {
      this.style.color = "#ffffff";
    }
  });

  favoriteIcon.addEventListener("mouseleave", function () {
    if (!this.classList.contains("bi-heart-fill")) {
      this.style.color = "#b3b3b3";
    }
  });
}
