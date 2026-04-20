const getArtist = function() {
    fetch("https://striveschool-api.herokuapp.com/api/deezer/artist/412")
        .then((response) => {
            if (response.ok) {
                return response.json() 
            } else {
                throw new Error(`Request failed: ${response.status}`)
            }
        })
        .then((data) => {
            console.log(data) 
        })
        .catch((error) => console.log(error))
}

const getAlbum = function() {
    fetch("https://striveschool-api.herokuapp.com/api/deezer/album/75621062")
        .then((response) => {
            if (response.ok) {
                return response.json() 
            } else {
                throw new Error(`Request failed: ${response.status}`)
            }
        })
        .then((data) => {
            console.log(data) 
        })
        .catch((error) => console.log(error))
}

getAlbum()
getArtist()