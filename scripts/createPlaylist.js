
const likedSongs = []
const userPlaylists = []


// DOM ELEMENTS

const asidePlaylistList = document.getElementById("playlists")

const createPlaylistForm = document.getElementById("createPlaylistForm")
const clearFormButton = document.getElementById("clearInputs")


// ASIDE 

document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("main-sidebar");
    const toggleBtn = document.getElementById("toggle-sidebar");

    toggleBtn.addEventListener("click", function () {
        sidebar.classList.toggle("closed");
    });
});


// INITIALIZE PLAYLIST CLASS

class Playlist {

    constructor(title = "", creator = "", description = "") {
        this.id = `pl-${Math.floor(Math.random() * 100000)}`;
        this.title = title;
        this.creator = creator;
        this.description = description;
        this.isPublic = true;
        this.createdAt = new Date().toISOString().split('T')[0];
        this.tracks = [];
        this.followerCount = 0;
        this.totalDurationSeconds = 0;
    }

    // Method to add a new song object to the array
    addTrack(id) {
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


// GET ARTIST FETCH FUNCTION 

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


const createPlaylist = function(e) {

    e.preventDefault()

    const playlistTitleInput = document.getElementById("playlistTitle").value
    const playlistDescriptionInput = document.getElementById("playlistDescription").value
    const isPlaylistPublic = document.getElementById("playlistPublicCheck").checked
    newPlaylist.isPublic = isPlaylistPublic

    const newPlaylist = new Playlist(playlistTitleInput, "User", playlistDescriptionInput)
    
    newPlaylist.isPublic = isPlaylistPublic

    userPlaylists.push(newPlaylist)


    // PUSH PLAYLISTS TO LOCAL STORAGE

    localStorage.setItem("userPlaylists", JSON.stringify(userPlaylists))

}


const deletePlaylist = function(id) {

}


const displayAsidePlaylists = function() {

    let defaultContent = asidePlaylistList.innerHTML
    if (userPlaylists.length !== 0) {
        const list = document.createElement("div")

        userPlaylists.forEach((playlist) => {
            const card = document.createElement("div")
            card.classList.add("card")
            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${playlist.title}</h5>
                    <p class="card-text">${playlist.description}</p>
                    <p class="card-text">${playlist.tracks.length} songs</p>
                    <a href="#" class="btn btn-primary">Play</a>
                </div>`
        })
        
    }
}

const clearForm = function(e) {
    e.preventDefault()
    createPlaylistForm.reset()
}

// PUSH LIKED SONGS TO LOCAL STORAGE
localStorage.setItem("userLikedSongs", likedSongs)


//ADD EVENT LISTENERS
createPlaylistForm.addEventListener("submit", createPlaylist)
clearFormButton.addEventListener("click", clearForm)

getAlbum()
getArtist()

displayAsidePlaylists()