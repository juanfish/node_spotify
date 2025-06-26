require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});


const artistas = ['Bizarrap', 'Duki', 'Trueno', 'Nathy Peluso', 'Cazzu', 'Cattle Decapitation'];

spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('✅ Token recibido');
    spotifyApi.setAccessToken(data.body['access_token']);

    // Buscamos todos los artistas
    return Promise.all(
      artistas.map(nombre =>
        spotifyApi.searchArtists(nombre).then(res => {
          const artista = res.body.artists.items[0];
          return {
            nombre: artista.name,
            popularidad: artista.popularity,
            seguidores: artista.followers.total,
            url: artista.external_urls.spotify,
          };
        })
      )
    );
  },
  function(err) {
    console.error('❌ Error al obtener token:', err);
  }
).then(artistasConInfo => {
  // Ordenar de mayor a menor por popularidad
  const top = artistasConInfo.sort((a, b) => b.popularidad - a.popularidad);
  console.log('\n🎧 TOP ARTISTAS:\n');
  top.forEach((a, i) => {
    console.log(`#${i + 1} - ${a.nombre} | Popularidad: ${a.popularidad} | Seguidores: ${a.seguidores}`);
    console.log(`   Spotify: ${a.url}\n`);
  });
}).catch(err => {
  console.error('❌ Error al procesar artistas:', err);
});
