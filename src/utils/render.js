const puppeteer = require('puppeteer');
const pug = require('pug');

const render = async (opts) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      // executablePath: '/usr/bin/chromium-browser',
      // args: [
      //   '--no-sandbox',
      //   '--headless',
      //   '--disable-gpu',
      //   '--disable-dev-shm-usage'
      // ]
    });
    const page = await browser.newPage();
  
    await page.setContent(opts.content);
    const data = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
    });
  
    // await browser.close();
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

exports.renderFile = async (opts) => {
  try {
    const file = await render({
      content: pug.renderFile(opts.template, opts.render),
      size: 'A4',
      type: 'pdf',
      extension: 'pdf',
    })
    return file;
  } catch (e) {
    console.error(e);
    return e;
  }
}
