const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const xss = require('xss');

const { getImagePath } = require('./utils'); // eslint-disable-line

dotenv.load();

const remoteFolder = 'vefforritun-hopverkefni-1';

function filterImages(arr) {
  const allowedExt = ['jpg', 'png', 'gif'];
  const images = arr;
  return images.filter((el) => {
    const split = el.split('.');
    const ext = split[split.length - 1];
    return allowedExt.includes(ext);
  });
}

async function uploadImages(arr, relative = true) {
  const images = filterImages(arr);

  const multiUpload = new Promise(async (resolve, reject) => {
    const uploadRes = [];

    const options = {
      folder: remoteFolder,
      use_filename: true,
      unique_filename: false,
    };

    images.forEach(async (filename, index) => {
      let imagePath = xss(filename);

      // default er að uploada relative frá img möppunni
      if (relative) {
        imagePath = getImagePath(filename);
      }

      await cloudinary.uploader.upload(imagePath, options, (error) => {
        if (error) {
          reject(error);
        }
        uploadRes.push(imagePath);
        // síðasta uploadið komið þá resolvum við
        if (index === images.length - 1) {
          resolve(uploadRes);
        }
      }).then().catch(e => console.error('ekki pæla í þessum error:', e));
    });
  }).then(result => result).catch(error => error);

  const uploadResults = await multiUpload;
  return uploadResults;
}

// hægt að uploada með full path eða relative frá img möppunni!
async function uploadImagesReq(req, res) {
  const { images } = req.body;
  let response = null;
  // prófum að uploada relative fyrst (útfrá img)
  response = await uploadImages(images);
  // ef við fengum error prófum við að uploada sem full path
  if (response.errno) {
    response = await uploadImages(images, false);
  }
  return res.status(200).json(response);
}

async function getImageUrl(filename) {
  const remotePath = path.join(remoteFolder, filename);
  const image = await cloudinary.url(remotePath);

  return image;
}

module.exports = {
  filterImages,
  uploadImages,
  uploadImagesReq,
  getImageUrl,
};
