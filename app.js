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

    const getArtistDetails = async (artistId, token) => {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })

        const data = await response.json();
        return data;
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

    const getAlbumDetails = async (albumId, token) => {
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
        getArtistDetails(artistId, token){
            return getArtistDetails(artistId, token)
        },
        getArtistAlbums(artistId, token){
            return getArtistAlbums(artistId, token)
        },
        getAlbumDetails(albumid, token){
            return getAlbumDetails(albumid, token)
        }
        
    }

})();

const apiController = APIController
const token = await apiController.getToken()

const idArtista = await apiController.getArtistIdByName('Led Zeppelin', token)
const descricaoArtista = await apiController.getArtistDetails(idArtista, token)
const albuns = await apiController.getArtistDetails(idArtista, token)
console.log(albuns)
const descricaoAlbum = await apiController.getAlbumDetails('6VH2op0GKIl3WNTbZmmcmI', token)
console.log(descricaoAlbum)

if (document.getElementById('buscar')) {

    function criarGaleriaAlbuns(srcImagem, nomeAlbum, albumId){
        const galeria = document.getElementById('galeria')
        const album = document.createElement('div')
        const imagem = document.createElement('img')
        const nome = document.createElement('p')
        imagem.src = srcImagem
        nome.textContent = nomeAlbum

        album.dataset.albumId = albumId
        imagem.dataset.albumImg = srcImagem
        nome.dataset.albumName = nomeAlbum

        galeria.appendChild(album)

        album.appendChild(imagem)
        album.appendChild(nome)

        album.addEventListener('click', () => {
            sessionStorage.setItem('albumId', albumId)
            sessionStorage.setItem('albumImage', srcImagem)
            sessionStorage.setItem('albumName', nomeAlbum)
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
                criarGaleriaAlbuns(albuns[i].images[0].url, albuns[i].name, albuns[i].id)
            }
    })
}



if (window.location.pathname.includes('album.html')) {
    
    const albumId = sessionStorage.getItem('albumId');
    const albumImage = sessionStorage.getItem('albumImage');
    const albumName = sessionStorage.getItem('albumName')
    
    async function criarTelaAlbum(){

        await criarTelaAlbumHeader()

    }

    async function criarTelaAlbumHeader(){

        const headerAlbum = document.getElementById('header-album')

        const artista = document.createElement('div')
        const imagemAlbum = document.createElement('img')
        const nomeAlbum = document.createElement('h1')

        headerAlbum.appendChild(imagemAlbum)
        headerAlbum.appendChild(nomeAlbum)
        headerAlbum.appendChild(artista)

        const imagemArtista = document.createElement('img')
        const nomeArtista = document.createElement('p')

        artista.appendChild(imagemArtista)
        artista.appendChild(nomeArtista)

        imagemAlbum.src = albumImage 
        nomeAlbum.textContent = albumName

        const artistaDetalhes = await apiController.getArtistDetails(idArtista, token)
        imagemArtista.src = artistaDetalhes.images[0].url
        nomeArtista.textContent = artistaDetalhes.name
    }

    async function criarTelaAlbumMain(){

        const musicas = document.createElement('div')
        const nomeMusica = document.createElement('p')
    }

    criarTelaAlbum()

    


}





