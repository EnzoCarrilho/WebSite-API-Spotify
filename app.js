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

        const data = await response.json()
        const artist = data.artists.items[0] // pega o primeiro resultado
        return artist ? artist.id : null
    } 

    const getArtistDetails = async (artistId, token) => {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })

        const data = await response.json()
        return data
    }

    const getArtistAlbums = async (artistId, token) => {
    const result = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&limit=50`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })

        const data = await result.json()
        return data.items
    }

    const getAlbumDetails = async (albumId, token) => {
    const result = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })

        const data = await result.json()
        return data.items // cada item é uma música
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
//const descricaoArtista = await apiController.getArtistDetails(idArtista, token)
const artisitDetails = await apiController.getArtistDetails(idArtista, token)
console.log(artisitDetails)
//const descricaoAlbum = await apiController.getAlbumDetails('6VH2op0GKIl3WNTbZmmcmI', token)
//console.log(descricaoAlbum)
//const albuns = await apiController.getArtistAlbums(idArtista, token)
//console.log(albuns)

if (document.getElementById('buscar')) {

    function criarGaleriaAlbuns(srcImagem, nomeAlbum, albumId, dataLancamento){
        const galeria = document.getElementById('galeria')
        const album = document.createElement('div')
        const imagem = document.createElement('img')
        const nome = document.createElement('p')
        imagem.src = srcImagem
        nome.textContent = nomeAlbum

        album.className = 'album'
        imagem.className= 'capa-album'

        album.dataset.albumId = albumId
        album.dataset.releaseDate = dataLancamento
        imagem.dataset.albumImg = srcImagem
        nome.dataset.albumName = nomeAlbum

        galeria.appendChild(album)

        album.appendChild(imagem)
        album.appendChild(nome)

        album.addEventListener('click', () => {
            sessionStorage.setItem('albumId', albumId)
            sessionStorage.setItem('albumImage', srcImagem)
            sessionStorage.setItem('albumName', nomeAlbum)
            sessionStorage.setItem('releaseDate', dataLancamento)
            window.location.href = './album.html'
        })
        
    }

    const botaoBuscar = document.getElementById('buscar')
        botaoBuscar.addEventListener('click', async () => {
            const artista = document.getElementById('input-artista').value

            galeria.innerHTML = '';
            const idArtista = await apiController.getArtistIdByName(artista, token)
            sessionStorage.setItem('artistId', idArtista);
            const albuns = await apiController.getArtistAlbums(idArtista, token)

            for(let i = 0; i < albuns.length; i++){
                criarGaleriaAlbuns(albuns[i].images[0].url, albuns[i].name, albuns[i].id, albuns[i].release_date)
            }
    })
}



if (window.location.pathname.includes('album.html')) {
    
    const albumId = sessionStorage.getItem('albumId')
    const albumImage = sessionStorage.getItem('albumImage')
    const albumName = sessionStorage.getItem('albumName')
    const releaseDate = sessionStorage.getItem('releaseDate')
    const artistId = sessionStorage.getItem('artistId')

     function converterDataISOparaBR(dataISO) {
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }
 
    const date = converterDataISOparaBR(releaseDate)
    
    async function criarTelaAlbum(){

        await criarTelaAlbumHeader()
        await criarTelaAlbumMain()

    }

    async function criarTelaAlbumHeader(){

        const headerAlbum = document.getElementById('header-album')
        const infoAlbum = document.createElement('div')

        const artista = document.createElement('div')
        const imagemAlbum = document.createElement('img')
        const nomeAlbum = document.createElement('h1')
        const dataLancamento = document.createElement('span')

        const sobreArtista = document.createElement('a')

        headerAlbum.appendChild(imagemAlbum)
        headerAlbum.appendChild(infoAlbum)
        infoAlbum.appendChild(nomeAlbum)
        infoAlbum.appendChild(artista)
        infoAlbum.appendChild(dataLancamento)
        infoAlbum.appendChild(sobreArtista)

        const imagemArtista = document.createElement('img')
        const nomeArtista = document.createElement('p') 

        artista.appendChild(imagemArtista)
        artista.appendChild(nomeArtista)
        


       imagemAlbum .className = 'imagem-album'
       infoAlbum.className = 'info-album'
       artista.className = 'artista'
       imagemArtista.className = 'imagem-artista'

        imagemAlbum.src = albumImage 
        nomeAlbum.textContent = albumName
        dataLancamento.textContent = date
        sobreArtista.textContent = 'Sobre o Artista'
        sobreArtista.href = './artista.html'

        const artistaDetalhes = await apiController.getArtistDetails(artistId, token)
        imagemArtista.src = artistaDetalhes.images[0].url
        nomeArtista.textContent = artistaDetalhes.name
    }

    async function criarTelaAlbumMain(){

        const main = document.getElementById('musicas')
    
        const artistaDetalhes = await apiController.getArtistDetails(artistId, token)
        const albumDetails = await apiController.getAlbumDetails(albumId, token)
        for(let i = 0; i < albumDetails.length; i++){
                const nomeMusica = document.createElement('p')
                const nomeArtista = document.createElement('span')
                const musicas = document.createElement('div')
                const more = document.createElement('img')
                main.appendChild(musicas)
                musicas.appendChild(nomeMusica)
                musicas.appendChild(nomeArtista)
                musicas.appendChild(more)
                nomeMusica.textContent = albumDetails[i].name
                nomeArtista.textContent = artistaDetalhes.name
                more.src = './img/more-button.png'
            }
    }


    criarTelaAlbum()

} 


if (window.location.pathname.includes('artista.html')) {

    async function criarTelaArtista(){

        const artistId = sessionStorage.getItem('artistId')
        const detalhesArtista = await apiController.getArtistDetails(artistId, token)
        
        const header = document.getElementById('header')
        const main = document.getElementById('main')

        const nome = document.createElement('h1')
        const quantidadeSeguidores = document.createElement('p')
        const seguidoresSpan = document.createElement('span')
        const popularidade = document.createElement('span')
        const textPopularidade = document.createElement('p')
        const textGenero = document.createElement('h2')
        const imagem = document.createElement('img')

        nome.textContent = detalhesArtista.name
        seguidores.textContent = detalhesArtista.followers
        seguidoresSpan.textContent = 'Seguidors'
        popularidade.textContent = detalhesArtista.popularity
        textPopularidade.textContent = 'Popularidade'
        textGenero.textContent = 'Gêneros'
        imagem.src = detalhesArtista.images[0].url

        header.appendChild(nome)

        const artistSection = document.createElement('div')
        artistSection.className = 'artist-section'
        
        const artista = document.createElement('div')
        artista.className = 'artista'

        const seguidores = document.createElement('div')
        seguidores.className = 'seguidores'
        
        const divPopularidade = document.createElement('div')
        divPopularidade.className = 'popularidade'

        const generos = document.createElement('div')
        generos.className = 'generos'


        header.appendChild(nome)
        main.appendChild(artistSection)
        
        artistSection.appendChild(artista)
        artista.appendChild(imagem)
        artista.appendChild(seguidores)
        seguidores.appendChild(quantidadeSeguidores)
        seguidores.appendChild(seguidoresSpan)

        artistSection.appendChild(popularidade)
        popularidade.appendChild(textPopularidade)
        popularidade.appendChild(popularidade)

        main.appendChild(generos)
        generos.appendChild(textGenero)
    }

    criarTelaArtista()

}



    






