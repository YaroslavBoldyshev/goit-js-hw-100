'use strict';
import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './fetchCountries';
const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function handleInput(e) {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
  const input = e.target.value.trim();
  if (input != '') {
    const countriesArrPromice = fetchCountries(input);
    countriesArrPromice
      .then(p => {
        if (p.length > 10) {
          notifyTooManyMatches();
        } else if (p.length === 1) {
          drawCountry(p[0]);
        } else {
          drawCountriesList(p);
        }
      })
      .catch(notifyError);
  }
}
function drawCountriesList(countryArr) {
  refs.countryList.innerHTML = createCountriesMarkup(countryArr);
}
function drawCountry(country) {
  refs.countryInfo.innerHTML = createCountryMarkup(country);
}
function createCountriesMarkup(countryArr) {
  return countryArr
    .map(country => {
      return `
        <li><img src='${country.flags.png}' width='20'><span>${country.name.official}</span></li>
        `;
    })
    .join('');
}
function createCountryMarkup(country) {
  const lang = [];
  for (key in country.languages) {
    lang.push(country.languages[key]);
  }
  console.log(lang);
  return `
    <ul>
    <li><img src='${country.flags.svg}' width='30' height='30'><h2>${
    country.name.official
  }</h2></li>
    <li>Capital: <span>${country.capital}</span></li>
    <li>Population: ${country.population}</li>
    <li>Languages: ${lang.join(', ')}</li>
    </ul>
    `;
}
function notifyError() {
  Notify.failure('Oops, there is no country with that name');
}
function notifyTooManyMatches() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}
