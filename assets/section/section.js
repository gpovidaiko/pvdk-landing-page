const main = document.querySelector('main.main');
const sections = document.querySelectorAll('section.section');

function getHighlightedSection() {
	const snapTolerance = 20;
	return Array.from(sections)
		.filter(section => Math.abs(section.getBoundingClientRect().left) < snapTolerance)
		.shift();
}

function updateHash() {
	const section = getHighlightedSection();
	const sectionId = section?.getAttribute('id');4
	if (sectionId) {
		window.location.hash = `#${sectionId}`;
	}
}

function setFocus() {
	const section = getHighlightedSection();
	section?.focus();
}

main.addEventListener('scrollend', updateHash);
main.addEventListener('scrollend', setFocus);
