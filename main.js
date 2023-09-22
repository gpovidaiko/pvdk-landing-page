function handleHashChange() {
	const url = new URL(window.location.href);
	const sectionId = url.hash;

	const classSectionActive = 'section--active';

	const sections = document.querySelectorAll('section');
	sections.forEach(section => {
		if (section.id === sectionId.substring(1)) {
			section.classList.add(classSectionActive);
		} else {
			section.classList.remove(classSectionActive);
		}
	});
}

function goToSectionActive() {
	const url = new URL(window.location.href);
	const sectionId = url.hash;
	const section = document.getElementById(sectionId.substring(1));
	section?.scrollIntoView();
}

window.addEventListener('hashchange', handleHashChange);

handleHashChange();
goToSectionActive();
