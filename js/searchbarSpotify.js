const searchInput = document.getElementById("inputSearch")
const dataList = document.getElementById("listaData")
const containerProfileArtist = document.getElementById("cardArtist")
const cardSongs = document.getElementById("cardSongs")

const apiUrl = "https://striveschool-api.herokuapp.com/api/deezer/search?q="

// Search and show suggestions in the navbar
const searchArtistSuggestions = async (artist) => {
  try {
    const response = await fetch(apiUrl + encodeURIComponent(artist))
    if (!response.ok) {
      throw new Error("Data not found")
    }

    const data = await response.json()
    dataList.innerHTML = ""

    // Show the artist not repeated
    const uniqueArtists = []
    const artistIds = new Set()

    data.data.forEach((song) => {
      if (!artistIds.has(song.artist.id)) {
        artistIds.add(song.artist.id)
        uniqueArtists.push(song.artist)
      }
    })

    uniqueArtists.slice(0, 5).forEach((artist) => {
      const li = document.createElement("li")
      li.textContent = artist.name

      li.addEventListener("click", () => {
        searchInput.value = artist.name
        dataList.innerHTML = ""
        renderArtistProfile(artist.name)
      })

      dataList.appendChild(li)
    })
  } catch (error) {
    console.error(error)
    dataList.innerHTML = "<li>Error al buscar artista</li>"
  }
}

// Create artist card + songs list
const renderArtistProfile = async (artist) => {
  try {
    const response = await fetch(apiUrl + encodeURIComponent(artist))
    if (!response.ok) {
      throw new Error("Data not found")
    }

    const data = await response.json()

    containerProfileArtist.innerHTML = ""
    cardSongs.innerHTML = ""

    if (!data.data.length) {
      containerProfileArtist.innerHTML = "<p>Artist not found</p>"
      return
    }

    // Take the first song to show the artist info
    const firstSong = data.data[0]
    const artistInfo = firstSong.artist

    // Card Artist Here we need to change the card values with the info html
    const card = document.createElement("div")
    card.className = "card bg-black text-white p-3"
    card.style.maxWidth = "400px"

    card.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <img src="${artistInfo.picture_medium}" alt="${artistInfo.name}">
        <div>
          <h2 class="mb-0">${artistInfo.name}</h2>
          <small>Artist</small>
        </div>
      </div>
    `

    containerProfileArtist.appendChild(card)

    // Lista de canciones sin repetir
    const uniqueSongs = []
    const songTitles = new Set()

    data.data.forEach((song) => {
      if (!songTitles.has(song.title)) {
        songTitles.add(song.title)
        uniqueSongs.push(song)
      }
    })

    const titleSongs = document.createElement("h3")
    titleSongs.textContent = "Songs"
    titleSongs.className = "mt-4"

    const ul = document.createElement("ul")
    ul.className = "list-group"

    uniqueSongs.slice(0, 10).forEach((song) => {
      const li = document.createElement("li")
      li.className = "list-group-item bg-dark text-white border-secondary"
      li.textContent = song.title
      ul.appendChild(li)
    })

    cardSongs.appendChild(titleSongs)
    cardSongs.appendChild(ul)
  } catch (error) {
    console.error(error)
    containerProfileArtist.innerHTML = "<p>Error al cargar artista</p>"
    cardSongs.innerHTML = ""
  }
}

// suggestion nav bar
searchInput.addEventListener("input", () => {
  const artistName = searchInput.value.trim()

  if (artistName === "") {
    dataList.innerHTML = ""
    return
  }

  searchArtistSuggestions(artistName)
})

// when press enter show the info
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault()

    const artistName = searchInput.value.trim()
    if (artistName === "") return

    dataList.innerHTML = ""
    renderArtistProfile(artistName)
  }
})
