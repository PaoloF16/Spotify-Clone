const generiPage = document.getElementById("generi")
const browseViewContent = document.getElementById("browse-view-content")
const audioPlayer = document.getElementById("audio-player")
const mainContainer = document.getElementById("big-container")
const openBrowseBtn = document.getElementById("open-browse-btn")
const openPodcastBrowseBtn = document.getElementById("open-podcast-browse-btn")

const genreCards = [
  {
    nome: "Pop",
    colore: "#e1339b",
    querySeeds: ["Taylor Swift", "Dua Lipa", "Ariana Grande"],
  },
  {
    nome: "Rock",
    colore: "#1e3264",
    querySeeds: ["Queen", "Arctic Monkeys", "Linkin Park"],
  },
  {
    nome: "Hip Hop",
    colore: "#ba5d07",
    querySeeds: ["Drake", "Kendrick Lamar", "Travis Scott"],
  },
  {
    nome: "Jazz",
    colore: "#9b59b6",
    querySeeds: ["Miles Davis", "John Coltrane", "Nina Simone"],
  },
  {
    nome: "Latin",
    colore: "#2774db",
    querySeeds: ["Bad Bunny", "Karol G", "J Balvin"],
  },
  {
    nome: "Dance",
    colore: "#6c8a00",
    querySeeds: ["David Guetta", "Calvin Harris", "Avicii"],
  },
  {
    nome: "Reggae",
    colore: "#1f8f4c",
    querySeeds: ["Bob Marley", "Sean Paul", "Shaggy"],
  },
  {
    nome: "Indie",
    colore: "#555555",
    querySeeds: ["Tame Impala", "Phoebe Bridgers", "The Strokes"],
  },
  {
    nome: "K-Pop",
    colore: "#6f52ed",
    querySeeds: ["BTS", "BLACKPINK", "JENNIE"],
  },
  {
    nome: "Classica",
    colore: "#4d829d",
    querySeeds: ["Mozart", "Beethoven", "Vivaldi"],
  },
  {
    nome: "Metal",
    colore: "#2f2f2f",
    querySeeds: ["Metallica", "Iron Maiden", "Slipknot"],
  },
  {
    nome: "R&B",
    colore: "#e91429",
    querySeeds: ["SZA", "Rihanna", "The Weeknd"],
  },
]

const createBrowseGenreArtwork = async (genre) => {
  try {
    if (!window.fetchSearchResults) {
      return "https://via.placeholder.com/300x300?text=Music"
    }

    const seed = genre.querySeeds[0]
    const results = await window.fetchSearchResults(seed)

    if (results && results.length > 0) {
      return (
        results[0]?.album?.cover_medium ||
        results[0]?.album?.cover_big ||
        results[0]?.album?.cover ||
        "https://via.placeholder.com/300x300?text=Music"
      )
    }
  } catch (e) {
    console.warn("Artwork fallback:", e)
  }

  return "https://via.placeholder.com/300x300?text=Music"
}

const showBrowseView = () => {
  if (!generiPage || !mainContainer || !audioPlayer) return
  generiPage.classList.remove("d-none")
  mainContainer.classList.add("d-none")
  audioPlayer.classList.add("d-none")
}

const showHomeView = () => {
  if (!generiPage || !mainContainer || !audioPlayer) return
  generiPage.classList.add("d-none")
  mainContainer.classList.remove("d-none")
  audioPlayer.classList.remove("d-none")
}

const bindBackButtons = () => {
  document.querySelectorAll(".back-home-btn").forEach((btn) => {
    btn.addEventListener("click", showHomeView)
  })

  document.querySelectorAll(".back-genres-btn").forEach((btn) => {
    btn.addEventListener("click", renderGenreGrid)
  })

  document.querySelectorAll(".back-rankings-btn").forEach((btn) => {
    btn.addEventListener("click", renderRankingsHome)
  })
}

const formatDuration = (seconds = 0) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

const getUniqueTracks = (tracks = []) => {
  const seen = new Set()
  const unique = []

  tracks.forEach((track) => {
    if (!track?.id || seen.has(track.id)) return
    seen.add(track.id)
    unique.push(track)
  })

  return unique
}

const buildTrackListHtml = (tracks, title, backClass = "back-home-btn") => {
  return `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="text-white m-0">${title}</h1>
        <button class="btn btn-outline-light btn-sm rounded-pill ${backClass}">
          Torna indietro
        </button>
      </div>

      <div class="d-flex flex-column gap-2">
        ${tracks
          .map(
            (track, index) => `
            <a
              href="./album-page.html?albumId=${track.album?.id || ""}"
              class="text-decoration-none"
            >
              <div
                class="d-flex align-items-center justify-content-between rounded px-3 py-2"
                style="background-color: #181818;"
              >
                <div class="d-flex align-items-center gap-3 overflow-hidden">
                  <div class="text-secondary" style="width: 24px;">
                    ${index + 1}
                  </div>

                  <img
                    src="${track.album?.cover_small || track.album?.cover_medium || ""}"
                    alt="${track.title}"
                    class="rounded"
                    style="width: 48px; height: 48px; object-fit: cover;"
                  />

                  <div class="overflow-hidden">
                    <div class="text-white fw-bold text-truncate">${track.title}</div>
                    <div class="text-secondary small text-truncate">${track.artist?.name || ""}</div>
                  </div>
                </div>

                <div class="text-secondary small">
                  ${formatDuration(track.duration || 0)}
                </div>
              </div>
            </a>
          `,
          )
          .join("")}
      </div>
    </div>
  `
}

const renderGenreGrid = async () => {
  if (!browseViewContent) return

  const cardsHtmlArray = await Promise.all(
    genreCards.map(async (genre, index) => {
      const artwork = await createBrowseGenreArtwork(genre)

      return `
        <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
          <div
            class="spotify-genre-card"
            data-genre-index="${index}"
            style="background-color: ${genre.colore};"
          >
            <h3>${genre.nome}</h3>
            <div class="spotify-genre-card-artwork">
              <img src="${artwork}" alt="${genre.nome}" />
            </div>
          </div>
        </div>
      `
    }),
  )

  browseViewContent.innerHTML = `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="browse-section-title m-0">Explorar todo</h1>
        <button class="btn btn-outline-light btn-sm rounded-pill back-home-btn">
          Torna alla home
        </button>
      </div>

      <div class="row g-3">
        ${cardsHtmlArray.join("")}
      </div>
    </div>
  `

  document.querySelectorAll(".spotify-genre-card").forEach((card) => {
    card.addEventListener("click", async () => {
      const genreIndex = Number(card.dataset.genreIndex)
      const genre = genreCards[genreIndex]
      if (!genre) return
      await renderGenrePage(genre)
    })
  })

  bindBackButtons()
}

const renderGenrePage = async (genre) => {
  if (!browseViewContent || !window.fetchSearchResults) return

  browseViewContent.innerHTML = `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="text-white m-0">${genre.nome}</h1>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-light btn-sm rounded-pill back-genres-btn">
            Tutti i generi
          </button>
          <button class="btn btn-outline-light btn-sm rounded-pill back-home-btn">
            Home
          </button>
        </div>
      </div>
      <p class="text-secondary">Caricamento...</p>
    </div>
  `

  try {
    const resultSets = await Promise.all(
      genre.querySeeds.map((seed) => window.fetchSearchResults(seed)),
    )

    const merged = resultSets.flat()
    const uniqueTracks = getUniqueTracks(merged)
      .sort((a, b) => (b.rank || 0) - (a.rank || 0))
      .slice(0, 24)

    browseViewContent.innerHTML = `
      <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="text-white m-0">${genre.nome}</h1>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-light btn-sm rounded-pill back-genres-btn">
              Tutti i generi
            </button>
            <button class="btn btn-outline-light btn-sm rounded-pill back-home-btn">
              Home
            </button>
          </div>
        </div>

        <div class="d-flex flex-column gap-2">
          ${uniqueTracks
            .map(
              (track, index) => `
              <a
                href="./album-page.html?albumId=${track.album?.id || ""}"
                class="text-decoration-none"
              >
                <div
                  class="d-flex align-items-center justify-content-between rounded px-3 py-2"
                  style="background-color: #181818;"
                >
                  <div class="d-flex align-items-center gap-3 overflow-hidden">
                    <div class="text-secondary" style="width: 24px;">${index + 1}</div>
                    <img
                      src="${track.album?.cover_small || track.album?.cover_medium || ""}"
                      alt="${track.title}"
                      class="rounded"
                      style="width: 48px; height: 48px; object-fit: cover;"
                    />
                    <div class="overflow-hidden">
                      <div class="text-white fw-bold text-truncate">${track.title}</div>
                      <div class="text-secondary small text-truncate">${track.artist?.name || ""}</div>
                    </div>
                  </div>
                  <div class="text-secondary small">${formatDuration(track.duration || 0)}</div>
                </div>
              </a>
            `,
            )
            .join("")}
        </div>
      </div>
    `

    bindBackButtons()
  } catch (error) {
    console.error("renderGenrePage error:", error)

    browseViewContent.innerHTML = `
      <div class="container-fluid">
        <h1 class="text-white">${genre.nome}</h1>
        <p class="text-danger">Errore nel caricamento del genere.</p>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-light btn-sm rounded-pill back-genres-btn">
            Tutti i generi
          </button>
          <button class="btn btn-outline-light btn-sm rounded-pill back-home-btn">
            Home
          </button>
        </div>
      </div>
    `

    bindBackButtons()
  }
}

const rankingSections = [
  {
    id: "italy",
    title: "Top del giorno - Italia",
    text: "Le canzoni più forti del momento in Italia.",
    button: "Apri classifica",
    color: "linear-gradient(135deg, #1f7a3d, #10251d)",
    queries: ["italy top hits", "italian hits", "top italy music"],
    limit: 20,
  },
  {
    id: "europe",
    title: "Top del giorno - Europa",
    text: "I brani più ascoltati del giorno in Europa.",
    button: "Apri classifica",
    color: "linear-gradient(135deg, #1d4ed8, #172554)",
    queries: ["europe top hits", "europe popular songs", "top european music"],
    limit: 20,
  },
  {
    id: "global",
    title: "Top mondiale",
    text: "La selezione globale più ascoltata del momento.",
    button: "Apri classifica",
    color: "linear-gradient(135deg, #7c3aed, #2e1065)",
    queries: ["global hits", "world top hits", "popular music worldwide"],
    limit: 20,
  },
]

const renderRankingsHome = () => {
  if (!browseViewContent) return

  browseViewContent.innerHTML = `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="browse-section-title m-0">Rankings</h1>
        <button class="btn btn-outline-light btn-sm rounded-pill back-home-btn">
          Torna alla home
        </button>
      </div>

      <div class="row g-4">
        ${rankingSections
          .map(
            (section, index) => `
            <div class="col-12 col-md-6 col-xl-4">
              <div
                class="spotify-podcast-card"
                id="ranking-card-${index}"
                style="background: ${section.color};"
              >
                <div class="spotify-podcast-card-title">${section.title}</div>
                <div class="spotify-podcast-card-text">${section.text}</div>
                <div class="spotify-podcast-card-button">${section.button}</div>
              </div>
            </div>
          `,
          )
          .join("")}
      </div>
    </div>
  `

  rankingSections.forEach((section, index) => {
    const el = document.getElementById(`ranking-card-${index}`)
    if (!el) return

    el.addEventListener("click", () => {
      renderRankingTracks(section)
    })
  })

  bindBackButtons()
}

const renderRankingTracks = async (section) => {
  if (!browseViewContent || !window.fetchSearchResults) return

  browseViewContent.innerHTML = `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="text-white m-0">${section.title}</h1>
        <button class="btn btn-outline-light btn-sm rounded-pill back-rankings-btn">
          Torna ai rankings
        </button>
      </div>
      <p class="text-secondary">Caricamento...</p>
    </div>
  `

  try {
    const results = await Promise.all(
      section.queries.map((query) => window.fetchSearchResults(query)),
    )

    const merged = results.flat()

    const tracks = getUniqueTracks(
      merged.sort((a, b) => (b.rank || 0) - (a.rank || 0)),
    ).slice(0, section.limit || 20)

    browseViewContent.innerHTML = buildTrackListHtml(
      tracks,
      section.title,
      "back-rankings-btn",
    )

    bindBackButtons()
  } catch (error) {
    console.error("renderRankingTracks error:", error)

    browseViewContent.innerHTML = `
      <div class="container-fluid">
        <h1 class="text-white">${section.title}</h1>
        <p class="text-danger">Errore nel caricamento della classifica.</p>
        <button class="btn btn-outline-light btn-sm rounded-pill back-rankings-btn">
          Torna ai rankings
        </button>
      </div>
    `

    bindBackButtons()
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (openBrowseBtn) {
    openBrowseBtn.addEventListener("click", async () => {
      showBrowseView()
      await renderGenreGrid()
    })
  }

  if (openPodcastBrowseBtn) {
    openPodcastBrowseBtn.addEventListener("click", () => {
      showBrowseView()
      renderRankingsHome()
    })
  }
})
