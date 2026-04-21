//PER LO SCORRIMENTO DELLE CARDS
const tracks = document.querySelectorAll(".carosello")
const prevs = document.querySelectorAll(".prev")
const nexts = document.querySelectorAll(".next")

const widthImage = 180

nexts.forEach((nextBtn, index) => {
  nextBtn.addEventListener("click", () => {
    tracks[index].scrollBy({ left: widthImage, behavior: "smooth" })
  })
})

prevs.forEach((prevBtn, index) => {
  prevBtn.addEventListener("click", () => {
    tracks[index].scrollBy({ left: -widthImage, behavior: "smooth" })
  })
})
tracks.forEach((scrollRow) => {
  scrollRow.addEventListener("wheel", (e) => {
    e.preventDefault()
    scrollRow.scrollBy({ left: e.deltaY * 2, behavior: "smooth" })
  })
})
const searchApiLink =
  "https://striveschool-api.herokuapp.com/api/deezer/search?q="
const artistLink = "https://striveschool-api.herokuapp.com/api/deezer/artist/"

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
]

const linkArtist = "https://striveschool-api.herokuapp.com/api/deezer/artist/"
const searchLink = "https://striveschool-api.herokuapp.com/api/deezer/search?q="

const albumGiaUsati = new Set()

// primo carosello - primi 20 artisti random
const artistiSceltiPrimo = [...artisti]
  .sort(() => Math.random() - 0.5)
  .slice(0, 20)

// secondo carosello - altri 20 artisti random (diversi dal primo)
const artistiRimanenti = artisti.filter((a) => !artistiSceltiPrimo.includes(a))
const artistiSceltiSecondo = [...artistiRimanenti]
  .sort(() => Math.random() - 0.5)
  .slice(0, 20)

const primoCarosello = document.getElementById("primo-carosello")
const secondoCarosello = document.getElementById("secondo-carosello")
const smallCardsWrapper = document.getElementById("small-cards-wrapper")

function popolaCarosello(listaArtisti, carosello) {
  listaArtisti.forEach((artista) => {
    fetch(searchLink + artista)
      .then((response) => response.json())
      .then((data) => {
        if (!data.data || data.data.length === 0) return
        const artistaID = data.data[0].artist.id
        return fetch(linkArtist + artistaID + "/albums")
      })
      .then((response) => response.json())
      .then((data) => {
        if (!data.data || data.data.length === 0) return
        const albumFiltrati = data.data.filter(
          (album) => album.cover_medium && !albumGiaUsati.has(album.id),
        )
        if (albumFiltrati.length === 0) return
        const album =
          albumFiltrati[Math.floor(Math.random() * albumFiltrati.length)]
        albumGiaUsati.add(album.id)
        carosello.innerHTML += `
          <a href="album.html?id=${album.id}" class="text-decoration-none text-light">
            <div class="card text-light flex-shrink-0 border-0 overflow-hidden rounded-3" style="width: 160px">
              <img src="${album.cover_medium}" class="card-img-top" alt="${album.title}" />
              <div class="card-body bg-gray">
                <h4 class="m-0 fs-6 text-truncate">${album.title}</h4>
                <p class="card-text small text-secondary text-truncate">${album.release_date}</p>
              </div>
            </div>
          </a>
        `
        popolaPiccoleCards(album, smallCardsWrapper)
      })
      .catch((err) => console.log("errore", err))
  })
}

const popolaPiccoleCards = function (album, wrapper) {
  if (document.querySelectorAll("#small-cards-wrapper .col").length === 20) {
    return
  }
  wrapper.innerHTML += `
          <div class="col">
          <a href="album.html?id=75621062" class="text-decoration-none">
          <div class="row g-0 rounded-2 overflow-hidden" style="background-color: #2a2a2a">
          <div class="col-3">
          <img src="${album.cover_small}" alt="playlist-cover" class="h-100 w-100 object-fit-cover" />
          </div>
          <div class="col-9 d-flex flex-column justify-content-center px-2">
          <span class="fw-bold text-truncate text-light">${album.title}</span>
          <span class="text-secondary small">${album.release_date}</span>
          </div>
          </div>
          </a>
          </div>
          `
}

popolaCarosello(artistiSceltiPrimo, primoCarosello)
popolaCarosello(artistiSceltiSecondo, secondoCarosello)
