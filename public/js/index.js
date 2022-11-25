let body = document.body;
let lightModeButton = document.getElementById("lightmode-button");
let darkModeButton = document.getElementById("darkmode-button");

lightModeButton.addEventListener("click", function () {
  if (this.classList.contains("selected")) {
    // light mode is already selected
    return;
  }

  darkModeButton.classList.remove("selected");
  lightModeButton.classList.add("selected");
  // body.classList.remove("dark-mode");
  document.documentElement.setAttribute("data-theme", "light");

  localStorage.removeItem("darkMode");
});

darkModeButton.addEventListener("click", function () {
  if (this.classList.contains("selected")) {
    // light mode is already selected
    return;
  }

  this.classList.add("selected");
  lightModeButton.classList.remove("selected");
  // body.classList.add("dark-mode");

  document.documentElement.setAttribute("data-theme", "dark");
  localStorage.setItem("darkMode", true);
});

if (localStorage.getItem("darkMode")) {
  lightModeButton.classList.remove("selected");
  darkModeButton.classList.add("selected");
  // body.classList.add("dark-mode");
  document.documentElement.setAttribute("data-theme", "dark");
}
