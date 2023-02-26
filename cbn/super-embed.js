function clearBlock(el) {
    const node = el.parentElement.parentElement;
    node.innerHTML = '';
    return node;
}

const SELECTOR = 'code:not([super-embed-seen])';
function setupEmbeds() {

document.querySelectorAll(SELECTOR).forEach((node) => {
node.setAttribute('super-embed-seen', 1);
if (node.innerText.startsWith('super-embed:')) {
    const code = node.innerText.replace('super-embed:', '');
        const parentNode = clearBlock(node);
        parentNode.innerHTML = code;
        parentNode.querySelectorAll('script').forEach((script) => {
            if (!script.src && script.innerText) {
                eval(script.innerText);
            } else {
                const scr = document.createElement('script');
                scr.src = script.src;
                document.body.appendChild(scr);
            }
        })
    }
})
}

setupEmbeds();

var observer = new MutationObserver(function(mutations) {
if (document.querySelector(SELECTOR)) {
  setupEmbeds();
}
});
observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

const video = document.getElementById("video");

setTimeout(() => {
  video.classList.add("slide-in");
}, 500); /* Fade in after 0.5 seconds */

setTimeout(() => {
  video.classList.remove("slide-in");
}, 5000); /* Fade out after 5 seconds */
