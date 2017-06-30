var x = require('casper').selectXPath;

casper.test.begin('Home page and Review Overview tests', function(test) {
    casper.start('http://localhost:3000');
    casper.then(function(result) {
        test.assert(result.status === 200, 'Front page opens');
    });

    //Navigate to Review Overview tab
    casper.waitForSelector(x("//a[normalize-space(text())='Review Overview']"),
        function success() {
            test.assertExists(x("//a[normalize-space(text())='Review Overview']"), "Review overview tab exists");
            this.click(x("//a[normalize-space(text())='Review Overview']"));
        }
    );
   casper.waitForSelector(x("//*[contains(text(), \'Product Review Counts\')]"),
        function success() {
            test.assertExists(x("//*[contains(text(), \'Home/Kitchen Amazon Product Reviews Overview\')]"), "Page title exists");
            test.assertExists(x("//*[contains(text(), \'Product Review Counts\')]"), "Product Review Counts panel exists");
            test.assertExists(x("//*[contains(text(), \'Product Reviews Over Time\')]"), "Product Reviews Over Time panel exists");
            test.assertExists(x("//*[contains(text(), \'Keyword Counts in Product Reviews\')]"), "Keywords panel exist");
        }
    );

   casper.run(function() {test.done();});
});

casper.test.begin('Enrichment Visualizer tests', function(test) {
    casper.start('http://localhost:3000');

    // Navigate to 'Enrichment Visualizer' tab
    casper.waitForSelector(x("//a[normalize-space(text())='Enrichment Visualizer']"),
       function success() {
           test.assertExists(x("//a[normalize-space(text())='Enrichment Visualizer']"), "Enrichment Visualizer tab exists");
           this.click(x("//a[normalize-space(text())='Enrichment Visualizer']"));
       }
    );

    // Submit query on Enrichment Visualizer
    casper.waitForSelector(".sub-container",
        function success() {
            test.assertExists("input[name='query']", "Query input field exists");
            this.click("input[name='query']");
            this.sendKeys("input[name='query']", "Cuisinart Ice Cream Maker", { reset: true });

            test.assertExists("input[name='count']", "Count input field exists");
            this.click("input[name='count']");
            this.sendKeys("input[name='count']", "5", { reset: true });

            this.click("button");
        }
    );

    // Product Returned
    casper.waitForSelector(".sub-container",
        function success() {
            test.assertExists(x("//*[contains(text(), \'Cuisinart ICE-20 Automatic 1-1/2-Quart Ice Cream Maker, White\')]"), "Product returned");
        }
    );

    // Relations tab is accessible
    casper.waitForSelector(x("//*[contains(text(), \'Relations\')]"),
       function success() {
            test.assertExists(x("//*[contains(text(), \'Relations\')]"), "Results table relations tab exists");
        }
    );

    // Concepts tab is accessible
    casper.waitForSelector(x("//*[contains(text(), \'Concepts\')]"),
       function success() {
            test.assertExists(x("//*[contains(text(), \'Concepts\')]"), "Results table concepts tab exists");
        }
    );

    casper.waitForSelector(x("//*[contains(text(), \'Entities\')]"),
        function success() {
            test.assertExists(x("//*[contains(text(), \'Entities\')]"), "Results table entities tab exists");
        }
    );

    casper.waitForSelector(x("//*[contains(text(), \'Keywords\')]"),
        function success() {
           test.assertExists(x("//*[contains(text(), \'Keywords\')]"), "Results table keywords tab exists");
        }
    );
   casper.run(function() {test.done();});
});


casper.test.begin('Product Search tests', function(test) {
    casper.start('http://localhost:3000');

    // Navigate to 'Product Search' tab

    casper.waitForSelector(x("//a[normalize-space(text())='Product Search']"),
        function success() {
            test.assertExists(x("//a[normalize-space(text())='Product Search']"), "Product search tab exists");
            this.click(x("//a[normalize-space(text())='Product Search']"));
        }
    );

    // Seasrch for ice cream maker
    casper.waitForSelector("button",
        function success() {
            test.assertExists("button", "Find a product button exists");
            this.sendKeys("input[name='product']", "ice cream maker");
            this.click("button");
        }
    );

    // Expect results
    casper.waitForSelector(x("//*[contains(text(), \'Cuisinart ICE-20 Automatic 1-1/2-Quart Ice Cream Maker, White\')]"),
        function success() {
            test.assertExists(x("//*[contains(text(), \'Cuisinart ICE-20 Automatic 1-1/2-Quart Ice Cream Maker, White\')]"), "Product Returned");
            test.assertExists(x("//*[contains(text(), \'Sentiment Breakdown of Reviews\')]"), "Pie chart returned");
            test.assertExists(x("//*[contains(text(), \'Average Sentiment of Reviews\')]"), "Average sentiment graph returned");
            test.assertExists(x("//*[contains(text(), \'Product Sentiment Over Time\')]"), "Sentiment timeline returned");
            test.assertExists(x("//*[contains(text(), \'Sentiment by Keywords\')]"), "Sentiment keyword bar graph returned");
        }
    );

   casper.run(function() {test.done();});
});
