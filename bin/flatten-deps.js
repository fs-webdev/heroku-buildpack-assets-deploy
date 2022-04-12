const path = require('path');
const fs = require('fs');
// heroku buildpack dir or local test
const buildDir = process.env.BUILD_DIR || '../'
const bpDir = process.env.BP_DIR || './'
const deps = require(path.join(bpDir, 'deps.json'));
// get host app's package.json
const package = require(path.join(buildDir, 'package.json'));
console.log('Flattening dependencies for', package.name, '...');

const output = {
  name: deps.name,
  version: deps.version
}

const recursiveSearch = (obj, searchKey, results = []) => {
  const r = results;
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    // push package version
    if (key !== searchKey && typeof value === 'object' && value.hasOwnProperty('version')) {
      r.push({ name: key, version: value.version });
    }
    // recurse into deps
    if (key === searchKey && typeof value === 'object') {
      recursiveSearch(value, searchKey, r);
    }
    // recurse into sub-deps
    if (typeof value === 'object' && value.hasOwnProperty(searchKey)) {
      recursiveSearch(value[searchKey], searchKey, r);
    }
  });
  return r;
};

function findDepVersion(deps, searchKey) {
  let dep = {name: searchKey};
  for (const d of deps) {
    if (d.name === searchKey) {
      dep = d;
      break;
    }
  };
  return dep
}

const deepDeps = recursiveSearch(deps, 'dependencies');
console.log("Deep dependency count:", deepDeps.length);

// normal deps
output.deps = package.dependencies ? Object.keys(package.dependencies).map(d => findDepVersion(deepDeps, d)): [];
output.devDeps = package.devDependencies ? Object.keys(package.devDependencies).map(d => findDepVersion(deepDeps, d)) : [];
output.peerDeps = package.peerDependencies ? Object.keys(package.peerDependencies).map(d => findDepVersion(deepDeps, d)) : [];
// deps that aren't in deps, devDeps, or peerDeps
output.secondaryDeps = deepDeps.filter(d => !output.deps.includes(d) && !output.devDeps.includes(d) && !output.peerDeps.includes(d));

// Write to file
fs.writeFileSync(path.join(bpDir, 'deps.json.flat'), JSON.stringify(output, null, 2));