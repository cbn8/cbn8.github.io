document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".theme-toggle"); // Adjust this to your actual class name
  const select = document.querySelector("select"); // Select the 'select' element directly
  let currentTheme;

  function setIcon(theme) {
    if (theme === "dark") {
      toggleButton.classList.remove("light-mode");
      toggleButton.classList.add("dark-mode");
      select.classList.remove("light-mode"); // Target the 'select' element
      select.classList.add("dark-mode"); // Target the 'select' element
    } else {
      toggleButton.classList.remove("dark-mode");
      toggleButton.classList.add("light-mode");
      select.classList.remove("dark-mode"); // Target the 'select' element
      select.classList.add("light-mode"); // Target the 'select' element
    }
  }

  function initTheme() {
    const storedTheme = localStorage.getItem("overriddenTheme");
    if (storedTheme) {
      applyTheme(storedTheme);
      currentTheme = storedTheme;
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      currentTheme = "dark";
    } else {
      currentTheme = "light";
    }
    setIcon(currentTheme);
  }

  function applyTheme(theme) {
    const existingOverride = document.getElementById("theme-override");
    if (existingOverride) {
      existingOverride.remove();
    }

    if (theme !== currentTheme) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.id = "theme-override";
      link.href = `css/theme.${theme}.css`;
      document.head.appendChild(link);
    }

    localStorage.setItem("overriddenTheme", theme);
    setIcon(theme);
  }

  function toggleTheme() {
    const oppositeTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(oppositeTheme);
    currentTheme = oppositeTheme;
  }

  initTheme();
  toggleButton.addEventListener("click", toggleTheme);
});
