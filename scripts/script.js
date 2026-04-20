
class Artist {
    
}


const getArtist = function(artist) {

    fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artist}`)

    .then((response) => { 
        if (response.ok) {
            console.log(response)
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


// GET ALBUM FETCH FUNCTION 

const getAlbum = function(album) {

    fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${album}`)

    .then((response) => { 
        if (response.ok) {
            console.log(response)
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




