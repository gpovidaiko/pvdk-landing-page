const nav = document.querySelector('.nav');
const menuButton = document.querySelector('button.nav__toggle');
const homeAnchor = document.querySelector('a.home__link');
const menuAnchors = document.querySelectorAll('a.nav__link');

function toggleNav() {
	const navToggleOpenClass = 'nav__toggle--open';
	const navOpenClass = 'nav--open';
	const isOpen = menuButton.classList.contains(navToggleOpenClass);
	menuButton.classList.toggle(navToggleOpenClass, !isOpen);
	nav.classList.toggle(navOpenClass, !isOpen);
}

function highlightActiveLink() {
	menuAnchors.forEach(menuAnchor => {
		const navLinkActiveClass = 'nav__link--active';
		const navItemActiveClass = 'nav__item--active';
		const linkHash = menuAnchor.getAttribute('href');
		const matchHash = linkHash === window.location.hash;
		menuAnchor.classList.toggle(navLinkActiveClass, matchHash);
		menuAnchor.parentNode.classList.toggle(navItemActiveClass, matchHash);
	});
}

function showHomeLink() {
	const homeLinkActiveClass = 'home__link--active';
	const activeHash = Array.from(menuAnchors)
		.map(menuAnchor => menuAnchor.getAttribute('href'))
		.filter(linkHash => linkHash === window.location.hash)
		.shift();
	homeAnchor.classList.toggle(homeLinkActiveClass, !!activeHash);
}

window.addEventListener('load', highlightActiveLink);
window.addEventListener('hashchange', highlightActiveLink);
window.addEventListener('hashchange', showHomeLink);
menuButton.addEventListener('click', toggleNav);
homeAnchor.addEventListener('click', toggleNav);
menuAnchors.forEach(menuAnchor => menuAnchor.addEventListener('click', toggleNav));
