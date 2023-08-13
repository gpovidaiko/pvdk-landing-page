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
	const sectionId = section.getAttribute('id');
	window.location.hash = `#${sectionId}`;
}

main.addEventListener('scrollend', updateHash);
