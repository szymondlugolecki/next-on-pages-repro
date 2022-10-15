const fs = require('fs');
const x = require('./public/worldmap.geo.json');

const countries = x.features;

const names = countries.map((c) => c.properties.iso_a2 || c.properties.iso_a2_eh);
console.log(names, names.length);

fs.writeFileSync('countriesWithTopology.json', JSON.stringify(names));
