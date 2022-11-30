'use strict';
function fetchCountries(input) {
  return fetch(
    `https://restcountries.com/v3.1/name/${input}?fields=name,capital,population,flags,languages`
  ).then(p => p.json());
}

export default fetchCountries;
