'use strict'

const APIController = (function () {

    const clientId = 'd12cf77d531548e18e4b051481c99c15'
    const clientSecret = '0a40b70a6ffc4ec28ae8c3024a17fcd4'

    //métodos privados
    
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
    })

        const data = await result.json();
        return data.items;
    }

    const getAlbumSongs = async (albumId, token) => {
    const result = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })

        const data = await result.json();
        return data.items; // cada item é uma música
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
        },
        getAlbumSongs(albumid, token){
            return getAlbumSongs(albumid, token)
        }
    }

})();

const apiController = APIController
const token = await apiController.getToken()

function criarGaleriaAlbuns(srcImagem, nomeAlbum){
    const galeria = document.getElementById('galeria')
    const album = document.createElement('div')
    const imagem = document.createElement('img')
    const nome = document.createElement('p')
    imagem.src = srcImagem
    nome.textContent = nomeAlbum

    galeria.appendChild(album)

    album.appendChild(imagem)
    album.appendChild(nome)

    album.addEventListener('click', () => {
        window.location.href = './album.html'
    })
}

const botaoBuscar = document.getElementById('buscar')
    botaoBuscar.addEventListener('click', async () => {
        const artista = document.getElementById('input-artista').value
        
        galeria.innerHTML = '';
        const idArtista = await apiController.getArtistIdByName(artista, token)
        const albuns = await apiController.getArtistAlbums(idArtista, token)

        for(let i = 0; i < albuns.length; i++){
            criarGaleriaAlbuns(albuns[i].images[0].url, albuns[i].name)
        }
})

