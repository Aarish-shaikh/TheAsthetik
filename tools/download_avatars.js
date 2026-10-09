const https = require('https');
const fs = require('fs');

const avatars = [
  { name: 'avatar-yves.jpg', url: 'https://lh3.googleusercontent.com/a/ACg8ocL6LA_x7cHmvpmGDL_2-CNZbNk8K1PCEDIfzV8ImX3sCpzKnA=w40-h40-c-rp-mo-br100' },
  { name: 'avatar-muqadus.jpg', url: 'https://lh3.googleusercontent.com/a-/ALV-UjWGFMALXE3z2q2UNtftKN_CUbYKpAV1NKB_iD4aZpzLP65-4PM=w40-h40-c-rp-mo-br100' },
  { name: 'avatar-sami.jpg', url: 'https://lh3.googleusercontent.com/a/ACg8ocJKhhxywn-eYlUIToSXCuFY9ikFXYkWluKmGRuoyxEvRwdw4Doa=w40-h40-c-rp-mo-br100' }
];

avatars.forEach(a => {
  https.get(a.url, res => {
    if (res.statusCode === 200) {
      const file = fs.createWriteStream('E:/TheAsthetik/assets/external/' + a.name);
      res.pipe(file);
      file.on('finish', () => console.log('Downloaded', a.name));
    } else {
      console.log('Failed', a.name, res.statusCode);
    }
  }).on('error', err => console.log('Error', a.name, err.message));
});
