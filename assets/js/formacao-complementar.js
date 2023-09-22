const sectionContent = document.querySelector('.formacao__complementar__content');
const filterInput = document.querySelector('#filter-input');
const filterButton = document.querySelector('#filter-button');

const currentPageLabel = document.querySelector('.formacao__complementar__pagination #currentPage');
const totalPagesLabel = document.querySelector('.formacao__complementar__pagination #totalPages');

const previousPageButton = document.querySelector('.formacao__complementar__pagination #previous');
const nextPageButton = document.querySelector('.formacao__complementar__pagination #next');

let data;

const itemsPerPage = 5;
let pageNumber = 0;
let lastFilterValue;

function getTotalPages() {
	return Math.ceil(getFilteredData().length / itemsPerPage);
}

function getPageData() {
	const data = getFilteredData();
	const startIndex = itemsPerPage * pageNumber;
	const endIndex = startIndex + itemsPerPage;

	return data.slice(startIndex, endIndex);
}

function updatePaginationInfo() {
	const totalPages = getTotalPages();
	const currentPage = pageNumber;

	currentPageLabel.innerText = totalPages ? currentPage + 1 : 0;
	totalPagesLabel.innerText = totalPages;

	previousPageButton.disabled = currentPage <= 0;
	nextPageButton.disabled = currentPage >= totalPages - 1;
}

previousPageButton.addEventListener('click', _ => {
	if (pageNumber === 0) return;
	pageNumber -= 1;
	renderData();
})

nextPageButton.addEventListener('click', _ => {
	if (pageNumber + 1 === getTotalPages()) return;
	pageNumber += 1;
	renderData();
})

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
	const itemClassSelector = 'formacao__complementar__item';

	sectionContent.querySelectorAll(`.${itemClassSelector}`).forEach(item => sectionContent.removeChild(item));

	for (const item of getPageData()) {
		const div = document.createElement('div');
		div.role = 'listitem';
		div.classList.add(itemClassSelector);

		if (item.institution === 'Alura') {
			const image = renderAluraLogo();
			div.appendChild(image);
		}

		const hName = document.createElement('h4');
		hName.innerText = item.name;
		hName.classList.add('formacao__complementar__nome');
		div.appendChild(hName);

		const pPeriod = document.createElement('p');
		pPeriod.innerText = item.period;
		pPeriod.classList.add('formacao__complementar__periodo');
		div.appendChild(pPeriod);

		if (item.level) {
			const pLevel = document.createElement('p');
			pLevel.innerText = item.level;
			pLevel.classList.add('formacao__complementar__level');
			div.appendChild(pLevel);
		}

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
	const itemClassSelector = 'formacao__complementar__item';

	const amount = itemsPerPage - getPageData().length;

	for (let item = 0; item < amount; item++) {
		const div = document.createElement('div');
		div.classList.add(itemClassSelector, 'formacao__complementar__item--empty');
		sectionContent.appendChild(div);
	}
}

function getFilteredData() {
	const filter = getFilterInputValue();

	if (lastFilterValue !== filter) {
		lastFilterValue = filter;
		pageNumber = 0;
	}

	return data.filter(item => !filter || item.name.toLowerCase().includes(filter.toLowerCase()));
}

function renderAluraLogo() {
	const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
	use.setAttribute('href', 'assets/svgs/alura.svg#alura-logo__svg');

	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('viewBox', '0 0 128 128');
	svg.setAttribute('alt', 'Alura');
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

readData();
