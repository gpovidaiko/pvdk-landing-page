function handleLoad() {
	handleHashChange();
}

function handleHashChange() {
	const url = new URL(window.location.href);
	const sectionId = url.hash;
	
	const classSectionActive = "section--active";
	
	const sections = document.querySelectorAll("section");
	sections.forEach(section => {
		if (section.id === sectionId.substring(1)) {
			section.classList.add(classSectionActive);
		} else {
			section.classList.remove(classSectionActive);
		}
	});
}

window.addEventListener("load", handleLoad);
window.addEventListener("hashchange", handleHashChange);
