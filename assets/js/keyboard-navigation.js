const homeAnchor = document.querySelector("a.home__link");
const menuAnchors = document.querySelectorAll("a.nav__link");

window.addEventListener("keydown", (event) => {
	if (event.key === "0") {
		homeAnchor.click();
	}
	if (Number(event.key) >= 1 && Number(event.key) <= 5) {
		menuAnchors[event.key - 1].click();
	}
});
