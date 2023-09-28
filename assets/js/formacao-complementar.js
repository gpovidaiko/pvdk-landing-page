const desktopMediaQuerie = window.matchMedia('(min-width: 768px)');

const pagination = document.querySelector('.formacao__complementar__pagination');

const sectionContent = document.querySelector('.formacao__complementar__content');
const filterInput = document.querySelector('#filter-input');
const filterButton = document.querySelector('#filter-button');

const paginationInfo = document.querySelector('.formacao__complementar__pagination #paginationInfo');
const currentPageLabel = document.querySelector('.formacao__complementar__pagination #currentPage');
const totalPagesLabel = document.querySelector('.formacao__complementar__pagination #totalPages');

const previousPageButton = document.querySelector('.formacao__complementar__pagination #previous');
const nextPageButton = document.querySelector('.formacao__complementar__pagination #next');

const itemClass = 'formacao__complementar__item';

let pageNumber = 0;

let data;
let lastFilterValue;
let itemsPerPage;

function getItemsPerPage() {
	const desktopPageSize = 10;
	const mobilePageSize = 5;
	let pageResizeOffset = 1;

	if (desktopMediaQuerie.matches && itemsPerPage != desktopPageSize) {
		pageResizeOffset = itemsPerPage / desktopPageSize || 1;
		itemsPerPage = desktopPageSize;
	}

	if (!desktopMediaQuerie.matches && itemsPerPage != mobilePageSize) {
		pageResizeOffset = itemsPerPage / mobilePageSize || 1;
		itemsPerPage = mobilePageSize;
	}

	pageNumber = Math.floor(pageNumber * pageResizeOffset);

	return itemsPerPage;
}

function getTotalPages() {
	return Math.ceil(getFilteredData().length / getItemsPerPage());
}

function getPageData() {
	const data = getFilteredData();
	const itemsPerPage = getItemsPerPage();
	const startIndex = itemsPerPage * pageNumber;
	const endIndex = startIndex + itemsPerPage;

	return data.slice(startIndex, endIndex);
}

function updatePaginationInfo() {
	const totalPages = getTotalPages();
	const currentPage = pageNumber;

	currentPageLabel.innerText = totalPages ? currentPage + 1 : 0;
	totalPagesLabel.innerText = totalPages;

	previousPageButton.ariaDisabled = currentPage <= 0;
	nextPageButton.ariaDisabled = currentPage >= totalPages - 1;

	paginationInfo.ariaLabel = `página ${currentPageLabel.innerText} de ${totalPagesLabel.innerText}`;
}

previousPageButton.addEventListener('click', _ => {
	if (pageNumber === 0) return;
	const oringinalTop = pagination.getBoundingClientRect().top;
	pageNumber -= 1;
	renderData();
	keepPaginationPosition(oringinalTop);
})

nextPageButton.addEventListener('click', _ => {
	if (pageNumber + 1 === getTotalPages()) return;
	const oringinalTop = pagination.getBoundingClientRect().top;
	pageNumber += 1;
	renderData();
	keepPaginationPosition(oringinalTop);
})

function keepPaginationPosition(oringinalTop) {
	const offsetTop = pagination.getBoundingClientRect().top - oringinalTop;
	const parent = pagination.parentElement;
	parent.scrollBy({ top: offsetTop, behavior: "instant" });
}

function getFilterInputValue() {
	return filterInput.value.trim();
}

function readData() {
	fetch('assets/js/formacao-complementar.csv')
		.then(response => response.text())
		.then(response => csvToJson(response))
		.then(_ => renderData());
}

function renderData() {
	sectionContent.querySelectorAll(`.${itemClass}`).forEach(item => sectionContent.removeChild(item));
	sectionContent.role = 'list';

	for (const item of getPageData()) {
		const div = document.createElement('div');
		div.role = 'listitem';
		div.classList.add(itemClass);

		const hName = document.createElement('h4');
		hName.innerText = item.name;
		hName.tabIndex = 0;
		hName.classList.add('formacao__complementar__nome');
		div.appendChild(hName);

		if (item.institution === 'Alura') {
			const image = renderAluraLogo();
			div.appendChild(image);
		}

		if (item.level) {
			const pLevel = document.createElement('p');
			pLevel.innerText = item.level;
			pLevel.tabIndex = 0;
			pLevel.classList.add('formacao__complementar__level');
			div.appendChild(pLevel);
		}

		const pPeriod = document.createElement('p');
		pPeriod.innerText = item.period;
		pPeriod.tabIndex = 0;
		pPeriod.classList.add('formacao__complementar__periodo');
		div.appendChild(pPeriod);

		if (item.certificate) {
			const aCertificate = document.createElement('a');
			aCertificate.href = item.certificate;
			aCertificate.innerText = '★certificado';
			aCertificate.target = '_blank';
			aCertificate.classList.add('formacao__complementar__certificado');
			aCertificate.classList.add('external-link');
			aCertificate.appendChild(renderRedirectIcon());
			div.appendChild(aCertificate);
		}

		sectionContent.appendChild(div);
	}

	fillNoContentItens();
	updatePaginationInfo();
}

function fillNoContentItens() {
	const amount = getItemsPerPage() - getPageData().length;

	for (let item = 0; item < amount; item++) {
		const div = document.createElement('div');
		div.classList.add(itemClass, `${itemClass}--empty`);
		sectionContent.appendChild(div);
	}
}

function getFilteredData() {
	const filter = getFilterInputValue();

	if (lastFilterValue !== filter) {
		lastFilterValue = filter;
		pageNumber = 0;
	}

	return data?.filter(item => !filter || item.name.toLowerCase().includes(filter.toLowerCase()));
}

function renderAluraLogo() {
	const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
	use.setAttribute('href', 'assets/svgs/alura.svg#alura-logo__svg');

	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('viewBox', '0 0 128 128');
	svg.setAttribute('alt', 'Alura');
	svg.setAttribute('aria-label', 'Instituição Alura');
	svg.setAttribute('tabindex', '0');
	svg.classList.add('formacao__complementar__instituicao');
	svg.classList.add('alura__svg');

	svg.appendChild(use);

	return svg;
}

function renderRedirectIcon() {
	const i = document.createElement('i');

	i.classList.add('pf-redirect');

	return i;
}

function csvToJson(csvData) {
	const lines = csvData.replaceAll('\r', '').split('\n');
	const headers = lines.shift().split(';');
	const jsonData = [];

	for (const line of lines) {
		const attributes = line.split(';');
		const jsonEntry = {};

		for (const header in headers) {
			jsonEntry[headers[header]] = attributes[header];
		}

		jsonData.push(jsonEntry);
	}

	data = jsonData;

	return data;
}

filterInput.addEventListener('keyup', event => ['Enter', 'Escape'].includes(event.key) && renderData());
filterButton.addEventListener('click', renderData);
desktopMediaQuerie.addEventListener('change', renderData);

readData();
