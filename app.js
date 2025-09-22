'use strict'

const APIController = (function () {

    const clientId = 'd12cf77d531548e18e4b051481c99c15'
    const clientSecret = '0a40b70a6ffc4ec28ae8c3024a17fcd4'

    //private methods
    
    const getToken = async () => {

        const result = await fetch('http://accounts.spotify.com/api/token', {
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

    

    
})