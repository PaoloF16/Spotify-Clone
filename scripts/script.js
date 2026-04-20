
const likedSongs = []

const playlists = []

class Playlist {

    constructor(name = "", creator = "", description = "") {
        this.id = `pl-${Math.floor(Math.random() * 100000)}`;
        this.name = name;
        this.creator = creator;
        this.description = description;
        this.isPublic = true;
        this.createdAt = new Date().toISOString().split('T')[0];
        this.tracks = [];
        this.followerCount = 0;
        this.totalDurationSeconds = 0;
    }

    // Method to add a new song object to the array
    addTrack(title, artist, durationSeconds) {
        const newTrack = {
            // add track key:values
        };
        this.tracks.push(newTrack);
        console.log(`Added "${title}" to ${this.name}.`);
    }

    // Method to remove a track by its ID
    removeTrack(id) {
    this.tracks = this.tracks.filter(track => track.trackId !== id);
    }
}


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



getAlbum(75621062)
getArtist(412)

