import { login } from "./login";
import "@babel/polyfill";
import { displayMap } from "./mapbox";

// DOM elements
const mapBox = document.getElementById("map");
const loginForm = document.getElementById(".form");


if (mapBox) {
  const locations = JSON.parse(
    document.getElementById("map").dataset.locations
  );
  displayMap(locations);
}

if (loginForm) {
  document.querySelector(".form").addEventListener("submit", (e) => {
    e.preventDefault();
    // User input values
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}
