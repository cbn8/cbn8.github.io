const video = document.getElementById("video");

setTimeout(() => {
  video.classList.add("slide-in");
}, 500); /* Fade in after 0.5 seconds */

setTimeout(() => {
  video.classList.remove("slide-in");
}, 5000); /* Fade out after 5 seconds */
