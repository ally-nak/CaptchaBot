const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
  keyFilename: '/Users/Ally_Mac/Downloads/captchaproject/still-smithy-395608-78c26cb25b8a.json'
});

async function extractTextFromImage(imagePath) {
  const [result] = await client.textDetection(imagePath);
  const detections = result.textAnnotations;
  const s = detections[0].description.replace(/\s/g, ''); // remove all whitespace
  console.log('Text detected:', s);
  return s;
}

module.exports = {
    extractTextFromImage
};


// const Tesseract = require('tesseract.js');

// const imagePath = 'screenshots/c5.png';
// extractTextFromImage(imagePath);


// Tesseract.recognize(
//   imagePath,
//   'eng', // English. You can set other languages if required
//   {
//     logger: progress => console.log(progress)  // Log progress. Optional.
//   }
// )
// .then(({ data: { text } }) => {
//   console.log('Recognized text:', text);
// })
// .catch(err => {
//   console.error('Error:', err);
// });
