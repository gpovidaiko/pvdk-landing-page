const sectionContent = document.querySelector('.formacao__complementar__content');
const filterInput = document.querySelector('#filter-input');
const filterButton = document.querySelector('#filter-button');

function getFilterInputValue() {
	return filterInput.value.trim();
}

function readData() {
		fetch('assets/js/formacao-complementar.csv')
			.then(response => response.text())
			.then(response => csvToJson(response))
			.then(response => renderData(response));
}

function renderData(data) {
	sectionContent.innerHTML = null

	for (const item of data) {
		const div = document.createElement('div');
		div.classList.add('formacao__complementar__item');

		if (item.institution === 'Alura') {
			const image = renderAluraLogo();
			div.appendChild(image);
		}

		const pName = document.createElement('p');
		pName.innerText = item.name;
		pName.classList.add('formacao__complementar__nome');
		div.appendChild(pName);
		
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
			aCertificate.innerText = '★certificado'
			aCertificate.target = '_blank';
			aCertificate.classList.add('formacao__complementar__certificado');
			aCertificate.appendChild(renderRedirectIcon());
			div.appendChild(aCertificate);
		}

		sectionContent.appendChild(div);
	}
}

function renderAluraLogo() {
	const object = document.createElement('object');

	object.data = "assets/svgs/alura.svg";
	object.type = "image/svg+xml";

	object.classList.add('formacao__complementar__instituicao');

	return object;
}

function renderRedirectIcon() {
	const i = document.createElement('i');

	i.classList.add('pf-redirect');

	return i;
}

function csvToJson(csvData) {
	const lines = csvData.split('\r\n');
	const headers = lines.shift().split(';');
	const jsonData = [];

	for (const line of lines) {
		const attributes = line.split(';');
		const jsonEntry = {};

		for (const header in headers) {
			jsonEntry[headers[header]] = attributes[header];
		}

		const filter = getFilterInputValue();

		if (!filter || jsonEntry.name.toLowerCase().includes(filter.toLowerCase())) {
			jsonData.push(jsonEntry);
		}
	}

	return jsonData;
}

window.addEventListener('load', readData);
filterInput.addEventListener('keydown', event => ["Enter", "Escape"].includes(event.key) && readData());
filterButton.addEventListener('click', readData);