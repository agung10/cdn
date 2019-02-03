'use strict';

import fs from 'fs';
import axios from 'axios';
import rimraf from 'rimraf';

const downloadsFolder = 'downloads';
const illustrationsUrl = 'https://vue-undraw.github.io/cdn/illustrations';

const capitalize = (s) => {
  return s[0].toUpperCase() + s.slice(1);
}

Array.prototype.stringify = function () {
  const value = this.valueOf();
  let str = '';
  for (let i = 0; i < value.length; i++) {
    str += capitalize(value[i]);
  }
  return str;
}

String.prototype.capitalize = function () {
  return '-';
}

String.prototype.capitalize = function (char) {
  const chunks = this.valueOf().split(char);
  return chunks.stringify();
};

Number.prototype.pad = function(n) {
  return new Array(n).join('0').slice((n || 2) * -1) + this;
};

const downloadImage = (url, imagePath ) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios({
        url: url,
        responseType: 'stream' 
      }).then(response => {
        response.data.pipe( fs.createWriteStream( imagePath ) );
      
        resolve({ 
          image: imagePath,
          status: true,
          error: '' 
        });
      }).catch(error => {
        resolve({
          image: imagePath,
          status: false,
          error: 'Error: ' + error.message
        });
      })
    }, 2000)
  })
};

rimraf(downloadsFolder, () => {
  fs.mkdirSync(downloadsFolder);

  axios.get(`${illustrationsUrl}.json`)
    .then(async ({ data }) => {
      const illustrations = data;
      for (let i = 0; i < illustrations.length; i++) {
        const illustration = illustrations[i].file;
        let image = await downloadImage(`${illustrationsUrl}/${illustration}`, `${downloadsFolder}/${(i + 1).pad(4)} ${illustration.capitalize('_')}`);
        console.log(`#${ i + 1 }: ${JSON.stringify(image, null, 2)}`);
      }
    })
    .catch((error) => {
      console.log(error.toString());
    });
});
