// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();


// tooltip
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))



// map show
document.addEventListener("DOMContentLoaded", function () {
  var mapElement = document.getElementById("map");

  if (mapElement) {
    var lat = mapElement.getAttribute("data-lat");
    var lng = mapElement.getAttribute("data-lng");
    var title = mapElement.getAttribute("data-title");
    var location = mapElement.getAttribute("data-location");

    if (lat && lng) {
      var map = L.map("map").setView([lat, lng], 13);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add a marker
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<b>${title}</b><br>${location}`)
        .openPopup();
    } else {
      console.error("Latitude and Longitude are not available");
    }
  }
});


// add map
document.addEventListener("DOMContentLoaded", function () {
  var map = L.map("map").setView([20.5937, 78.9629], 5); // Default India

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Add a marker with drag & drop functionality
  var marker = L.marker([20.5937, 78.9629], { draggable: true }).addTo(map);

  // Add Geocoder (Search Box)
  var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false
  })
    .on('markgeocode', function (e) {
      var latlng = e.geocode.center;
      marker.setLatLng(latlng);
      map.setView(latlng, 13);
      document.getElementById('latitude').value = latlng.lat;
      document.getElementById('longitude').value = latlng.lng;
    })
    .addTo(map);

  // Marker Drag Event to Update Coordinates
  marker.on('dragend', function (e) {
    var position = marker.getLatLng();
    document.getElementById('latitude').value = position.lat;
    document.getElementById('longitude').value = position.lng;
  });

  // Click on Map to Add Marker
  map.on('click', function (e) {
    marker.setLatLng(e.latlng);
    document.getElementById('latitude').value = e.latlng.lat;
    document.getElementById('longitude').value = e.latlng.lng;
  });
});
