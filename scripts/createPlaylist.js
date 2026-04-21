
const likedSongs = []
const userPlaylists = JSON.parse(localStorage.getItem("userPlaylists")) || []


// DOM ELEMENTS

const asidePlaylistList = document.getElementById("playlists")

const createPlaylistForm = document.getElementById("createPlaylistForm")
const clearFormButton = document.getElementById("clearInputs")

// CLEAR FORM
const clearForm = function(e) {
    if (e) e.preventDefault()
    createPlaylistForm.reset()
}

// ASIDE EXPAND AND CONTRACT

document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("main-sidebar");
    const toggleBtn = document.getElementById("toggle-sidebar");

    toggleBtn.addEventListener("click", function () {
        sidebar.classList.toggle("closed");
    });
});


// INITIALIZE PLAYLIST CLASS

class Playlist {

    constructor(title = "", creator = "", description = "", image) {
        this.id = `pl-${Math.floor(Math.random() * 100000)}`;
        this.title = title;
        this.creator = creator;
        this.description = description;
        this.img = image
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

/* 
const getArtist = function(artist) {

    fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/`)

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

    fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/`)

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
*/

const createPlaylist = function(e) {

    e.preventDefault()

    const playlistTitleInput = document.getElementById("playlistTitle").value
    const playlistDescriptionInput = document.getElementById("playlistDescription").value
    const playlistImageInput = document.getElementById("playlistImage").value
    const isPlaylistPublic = document.getElementById("playlistPublicCheck").checked

    const newPlaylist = new Playlist(playlistTitleInput, "User", playlistDescriptionInput, playlistImageInput)
    
    newPlaylist.isPublic = isPlaylistPublic

    userPlaylists.push(newPlaylist)

    clearForm()

    console.log(userPlaylists)


    // PUSH PLAYLISTS TO LOCAL STORAGE

    localStorage.setItem("userPlaylists", JSON.stringify(userPlaylists))
    displayAsidePlaylists()

}


const deletePlaylist = function(id) {

}


const displayAsidePlaylists = function() {

    let defaultContent = asidePlaylistList.innerHTML

    if (userPlaylists.length !== 0) {

        asidePlaylistList.innerHTML = ""

        const list = document.createElement("div")
        list.classList.add("hide-on-closed")

        userPlaylists.forEach((playlist) => {
            const card = document.createElement("div")
            card.classList.add("card", "bg-secondary", "bg-opacity-10", "text-white", "p-1", "my-4", "flex-start", "flex-row")
            card.innerHTML = `
                <img src="${playlist.img}" class="rounded-start" style="width: 80px; object-fit: cover;" alt="...">
                <div class="card-body">
                    <h5 class="card-title mb-3">
                        <a class="text-decoration-none text-white" href="./album-page.html">${playlist.title}</a>
                    </h5>
                    <p class="card-text text-secondary mb-3">${playlist.description}</p>
                    <div class="d-flex align-items-center justify-content-between">
                        <p class="card-text mb-1">${playlist.tracks.length} songs</p>
                        <a href="#" class="btn btn-sm btn-success px-3">Play</a>
                    </div>
                </div>`
            list.appendChild(card)
        })

        asidePlaylistList.appendChild(list)

    } else {

        asidePlaylistList.innerHTML = defaultContent

    }
}


// PUSH LIKED SONGS TO LOCAL STORAGE
localStorage.setItem("userLikedSongs", likedSongs)


//ADD EVENT LISTENERS
createPlaylistForm.addEventListener("submit", createPlaylist)
clearFormButton.addEventListener("click", clearForm)

//getAlbum()
//getArtist()

displayAsidePlaylists()