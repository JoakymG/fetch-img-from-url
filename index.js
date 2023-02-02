const axios = require('axios');
const fs = require('fs');
const Path = require('path') 


// ------------------- 1. change url -------------------
let url = 'https://www.fs.com/c/campus-switches-3079'; // example url: https://www.axis.com/products/axis-m1075-l
// ------------2. change download path -----------------
let path = `images`; // example path: C:/Users/user/Documents/images, path: 'images' start from this folder IMPORTANT: use / not \ 
// ---------------3. run in terminal -------------------
// node index.js




















// check if path exist
if (!fs.existsSync(path)) {
  // exit program if path not exist
  console.log('Step 2: path not exist');
  process.exit(9);
}
let img = [];
axios({
  url: url,
  method: 'GET',
  responseType: 'blob', // important
}).then((response) => {
  let re = /<img.*?src=["|'](.*?)["|']/g;
  let s = response.data;
  let m;
  let domain = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/igm.exec(url)[1];

  do {
    m = re.exec(s);
    if (m) {
      let name = m[1].match(domain) ? m[1] : m[1].charAt(0) == '/' ? 'https://' + domain + m[1] : 'https://' + domain + '/' + m[1];
      img.push(name);
    }
  } while (m);
}).then(() => {
  //download image from img url array
  img.forEach((item, index) => {
    downloadImage(item);
    
  });
}).then(() => {
  console.log(`Downloaded ${img.length} images to folder: ${path}`);
}).catch((err) => {
  return;
});


async function downloadImage (url) {
  console.log(url);
  let imgName = url.match(/\/([^\/]+)\/?$/)[1];
  imgName = imgName.match(/(^.*)?\?/) != null ? imgName.match(/(^.*)?\?/)[1] : imgName;
  fullPath = Path.resolve(path, imgName)
  const writer = fs.createWriteStream(fullPath)
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}