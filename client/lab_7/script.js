/* eslint-disable no-use-before-define */
async function dataHandler() {
  let foodmap = MapInit();
  const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
  const request = await fetch(endpoint);
  const arrayName = await request.json();
  let markers = [];

  function findMatches(wordToMatch, cities) {
    return cities.filter((place) => {
      const regex = new RegExp(wordToMatch, 'gi');
      return place.zip.match(regex);
    });
  }

  function displayMatches(event) {
    markers.forEach((marker) => {
      marker.remove();
    });
    const matchArray = findMatches(event.target.value, arrayName).slice(0,5);
    matchArray.forEach((f) => {
      if(f.hasOwnProperty('geocoded_column_1')) {
        const mark = f.geocoded_column_1;
        const latlong = mark.coordinates;
        let marker = latlong;

        if(latlong[0] < 0) {
          marker = latlong.reverse();
        }
        markers.push(L.marker(marker).addTo(foodmap));
        if(markers.length === 1) {
          foodmap.setView(marker, 12);
        }
      }
    })
    const html = matchArray.map((place) => {
      const regex = new RegExp(event.target.value, 'gi');
      return `
              <li>
              <span class="name">${place.name}</span></br>
              <span class="category">${place.category}</span></br>
              <span class="address">${place.address_line_1}</span></br>
              <span class="city">${place.city}</span></br>
              <span class="zip">${place.zip}</span>
              </li>
          `;
    }).join('');
    suggestions.innerHTML = html;
  }

  const searchInput = document.querySelector('.search');
  const suggestions = document.querySelector('.suggestions');

  searchInput.addEventListener('change', (evt) => { displayMatches(evt) });
  searchInput.addEventListener('keyup', (evt) => { displayMatches(evt) });
}
window.onload = dataHandler;

function MapInit() {
  var foodmap = L.map('fmap').setView([51.505, -0.09], 50);
  L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 50,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        'pk.eyJ1IjoiZHN0ZXdhcjYiLCJhIjoiY2t1dmdwa2d0NjhzMTJxcWplMWJmZXh1ZyJ9.y531qk17fAFYO_Rp9b--AQ',
    }
  ).addTo(foodmap);

  return foodmap;
}