const fs = require('fs');

const html = fs.readFileSync('raw_home.html', 'utf-8');
const tiMatches = [...html.matchAll(/trustindex/gi)];
console.log('Trustindex occurrences:', tiMatches.length);

const reviewIdx = html.indexOf('Trustindex verifies');
if (reviewIdx !== -1) {
  console.log('Snippet around review:');
  console.log(html.substring(reviewIdx - 200, reviewIdx + 400));
} else {
  console.log('Snippet not found directly');
}
