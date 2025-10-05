'use strict'

const APIController = (function () {

    const clientId = 'd12cf77d531548e18e4b051481c99c15'
    const clientSecret = '0a40b70a6ffc4ec28ae8c3024a17fcd4'

    //private methods
    
    const getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'CONTENT-TYPE' : 'application/x-www-form-urlencoded',
                'AUTHORIZATION' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        })

        const data = await result.json()
        return data.access_token
    }

    const getArtistIdByName = async (artistName, token) => {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })

        const data = await response.json();
        const artist = data.artists.items[0]; // pega o primeiro resultado
        return artist ? artist.id : null;
    }

    const getArtistAlbums = async (artistId, token) => {
    const result = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&limit=50`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

        const data = await result.json();
        return data.items;
    }

    
    return{
        getToken(){
            return getToken()
        },
        getArtistIdByName(artistName, token){
            return getArtistIdByName(artistName, token)
        },
        getArtistAlbums(artistId, token){
            return getArtistAlbums(artistId, token)
        }
    }

})();

//const apiController = APIController
//const token = await apiController.getToken()
//console.log('Token atual: ' + token)
//const idArista = await apiController.getArtistIdByName('Led Zeppelin', token)
//console.log('ID do artista: ' + idArista)
//const albumsDoArtista = await apiController.getArtistAlbums(idArista, token)
//console.log(albumsDoArtista)