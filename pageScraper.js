const puppeteer = require('puppeteer');
const fs = require('fs');

// Starting URLs to scrape
const startUrls = [
'https://developers.hubspot.com/beta-docs/guides/api'
];
// Tags to extract content from, ordered hierarchically
const tagsToExtract = ['h1', 'h2', 'h3', 'h4', 'h5', 'p'];

async function scrapePageLinks(page) {
  // Extract all page links for pagination
  return await page.evaluate(() => {
    let links = [];
    document.querySelectorAll('.kb-link.uiLinkWithoutUnderline.uiLinkDark').forEach(link => {
      if (link && link.href) {
        links.push(link.href);
      }
    });
    return links;
  });
}

async function scrapeUrl(url, browser) {
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Evaluating the page content with correct hierarchy
    const extractedContent = await page.evaluate((tagsToExtract) => {
      let contentArray = [];

      // Function to capture each tag with its hierarchy
      tagsToExtract.forEach((tag) => {
        document.querySelectorAll(tag).forEach((element) => {
          contentArray.push({
            tag: tag,
            content: element.innerText.trim(),
          });
        });
      });

      return contentArray;
    }, tagsToExtract);

    await page.close();
    return extractedContent;
  } catch (error) {
    console.error(`Error scraping ${url}: ${error.message}`);
    await page.close();
    return null;
  }
}

async function scrapeAllUrls() {
  const browser = await puppeteer.launch();
  const results = [];

  try {
    for (const startUrl of startUrls) {
      const page = await browser.newPage();
      await page.goto(startUrl, { waitUntil: 'networkidle2' });
      let urls = await scrapePageLinks(page);
      await page.close();

      for (const url of urls) {
        if (typeof url === 'string' && url.trim() !== '') {
          console.log(`Scraping URL: ${url}`);
          const content = await scrapeUrl(url, browser);
          if (content) {
            results.push({ url, content });
          }
        }
      }
    }

    // Convert results to JSON string
    const jsonOutput = JSON.stringify(results, null, 2);

    fs.writeFile('HIERARCHICAL_CONTENT_DUMP.json', jsonOutput, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('Scraped content has been saved to hierarchical_content.json');
      }
    });

    await browser.close();
  } catch (error) {
    console.error('An error occurred:', error);
    await browser.close();
  }
}

scrapeAllUrls();
