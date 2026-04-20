const searchInput = document.getElementById("inputSearch")
const artistName = searchInput.value
const dataList = document.getElementById("listaData")

const apiUrl = `https://striveschool-api.herokuapp.com/api/deezer/search?q=`

const searchArtist = (artist) => {
  fetch(apiUrl + artist)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Data not found")
      }
      return response.json()
    })
    .then((data) => {
      dataList.innerHTML = ""

      data.data.forEach((song) => {
        const li = document.createElement("li")
        li.textContent = `${song.artist.name} - ${song.title}`
        dataList.appendChild(li)
      })
    })
    .catch((error) => {
      console.error(error)
      dataList.innerHTML = "<li>Error al buscar artista</li>"
    })
}

searchInput.addEventListener("input", () => {
  const artistName = searchInput.value.trim()

  dataList.innerHTML = ""

  if (artistName === "") {
    return
  }

  searchArtist(artistName)
})
