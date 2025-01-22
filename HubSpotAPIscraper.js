// Puppeteer script to scrape links and their respective content from the HubSpot sidebar

const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // URL of the HubSpot documentation
    const url = 'https://developers.hubspot.com/docs/reference/api/overview';
    await page.goto(url, { waitUntil: 'networkidle2' });

    try {
        // Sidebar selector for navigation links
        const sidebarSelector = '.SecondaryNav__Wrapper-sc-181bkap-8 a';
        await page.waitForSelector(sidebarSelector, { timeout: 15000 });

        // Extract links from the sidebar
        const sidebarLinks = await page.$$eval(sidebarSelector, links => 
            links.map(link => ({ href: link.href, text: link.textContent.trim() }))
        );

        if (sidebarLinks.length === 0) {
            console.log('No links found in the sidebar. Please verify the selector.');
            await browser.close();
            return;
        }

        console.log(`Found ${sidebarLinks.length} links in the sidebar.`);

        const results = [];

        for (const link of sidebarLinks) {
            console.log(`Navigating to: ${link.href}`);

            try {
                await page.goto(link.href, { waitUntil: 'networkidle2' });

                // Extract page content
                const content = await page.evaluate(() => {
                    return {
                        title: document.title,
                        body: document.querySelector('main')?.innerText || 'No content found',
                    };
                });

                results.push({
                    url: link.href,
                    title: link.text,
                    content: content.body
                });
            } catch (err) {
                console.error(`Failed to navigate to: ${link.href}`, err);
            }
        }

        // Save results to a JSON file
        const fs = require('fs');
        fs.writeFileSync('hubspot_sidebar_content.json', JSON.stringify(results, null, 2));

        console.log('Scraping complete. Content saved to hubspot_sidebar_content.json');
    } catch (error) {
        console.error('Error during scraping:', error);
    } finally {
        await browser.close();
    }
})();
