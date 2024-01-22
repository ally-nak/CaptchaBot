const puppeteer = require('puppeteer');
const { extractTextFromImage } = require('./ocr');

// constants for selectors
const DOWNLOAD_BUTTON = "#pagebody > div.epoBar.epoBarPdf.epoBarPdfEmbed > div:nth-child(2) > ul > li:nth-child(2) > a";
const CAPTCHA_IMAGE = "watermark";
const IFRAME_ID = "downloadFrame";
const APP_ID = "JP2013003836A";

async function run() {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    const client = await page.target().createCDPSession();
    // reroute downloading path to a folder
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: './downloads',
    });
    // original doc url
    const url = "https://worldwide.espacenet.com/publicationDetails/originalDocument?CC=JP&NR=" + APP_ID.substring(2,) + "&KC=A&FT=D&ND=3";
    await page.goto(url);
    await page.waitForSelector(DOWNLOAD_BUTTON);
    await page.click(DOWNLOAD_BUTTON);
    const frameHandle = await page.$("iframe[id=" + IFRAME_ID + "]");
    const frame = await frameHandle.contentFrame();
    const frameContent = await frame.content();
    // Wait for the image to load inside the iframe
    await frame.waitForSelector('#watermark');
    // Extract the src URL from the img element with id="watermark" inside the iframe
    const elementHandle = await frame.$('#watermark');
    const box = await elementHandle.boundingBox();
    // Take a screenshot of the captcha image
    const imagePath = "screenshots/" + Date.now() + ".png";
    await page.screenshot({
        path: imagePath,
        clip: {
            x: box.x,
            y: box.y,
            width: Math.min(box.width, page.viewport().width - box.x),
            height: Math.min(box.height, page.viewport().height - box.y)
        }
    });
    // OCR process to extract text from image
    const text = await extractTextFromImage(imagePath);
    console.log("text", text);
    console.log("finished extracting text from image");
    // submit captcha text
    await frame.type('input[name="response"]', text);
    await frame.click('input[id="submitBtnId"]');
    // [ code that waits for downloading to finish ?]
    await waitForDownloadCompletion(frame);
    browser.close();
}

async function waitForDownloadCompletion(page) {
    console.log("entered");
    const downloadEvent = new Promise(resolve => {
        page.on('download', download => {
            download.once('finished', resolve);
        });
    });

    // Wait for the download event to resolve
    console.log("waiting ....");
    await downloadEvent;
}

run();