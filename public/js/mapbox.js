const mapBox = document.getElementById('map');

if(mapBox){
  
  const locations = JSON.parse(mapBox.dataset.locations);
  mapboxgl.accessToken =
  "pk.eyJ1IjoicGF1cGF1ZHJhZ29uIiwiYSI6ImNsazMwcDMwbjAydmkza3F3NGVyY2UwamEifQ.HJatPBeSZDETGc-NkQJQKg";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/paupaudragon/clk311rjj000601rm908k6fan",
  scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // Add marker
  const el = document.createElement("div");
  el.className = "marker";

  new mapboxgl.Marker({
    element: el,
    anchor: "bottom", // the bottom of the pin is at the location
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

    // Add popup
    new mapboxgl.Popup({
        offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 150,
    bottom: 150,
    left: 100,
    right: 100,
  },
});



}


