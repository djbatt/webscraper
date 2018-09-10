const Nick = require("nickjs")
const nick = new Nick({
	timeout: 30000
})


;(async () => {
	const tab = await nick.newTab()
	await tab.open("healthspace.com/Clients/VDH/Richmond/Web.nsf/module_facilities.xsp?module=Food")
	await tab.untilVisible(".table") // Make sure we have loaded the page
	await tab.inject("./injectables/jquery-3.3.1.min.js") // We're going to use jQuery to scrape
	
	//console.log(await tab.getContent()) // log the page content to see what we can work with! In string form
	const scrapedData = await tab.evaluate((arg, callback) => {
		// Here we're in the page context. It's like being in your browser's inspector tool
		rowIndex = 0;
		var data = [];

		tab.getContent(function(err, content) {
			if (err) {
				console.log(err)
			} else {
				console.log(content);
			}
		})
		//scrapeFrontPage();

		//console.log(content.match(/formFacility\.xsp\?id\=\w{32}/g));

		function scrapeFrontPage() { // This function scrapes the front page, we are trying to get the location of each details!

			$("tr").each((index, element) => {
	
				var name = "#view\\:_id1\\:_id247\\:repeatFacilities\\:" + rowIndex + "\\:facilityNameLink";
				var address= "#view\\:_id1\\:_id247\\:repeatFacilities\\:" + rowIndex + "\\:detailCF1";
				var last = "#view\\:_id1\\:_id247\\:repeatFacilities\\:" + rowIndex + "\\:lastInspectionCF2";
				var type ="#view\\:_id1\\:_id247\\:repeatFacilities\\:" + rowIndex + "\\:detailSubTypeCF2";
				//var details = "view__id1__id247_repeatFacilities_" + rowIndex + "__id278_clientSide_onclick(thisEvent)";
				console.log()
				data.push({
					title: $(element).find(name).text(),
					address: $(element).find(address).text(),
					lastInspection: $(element).find(last).text(),
					facilityType: $(element).find(type).text()
					//details: $(document).find(details).text()
				})
				rowIndex++
			})
	
			//$("#view\\:_id1\\:_id247\\:pager8__Next__lnk").trigger("click");
			
		}

		callback(null, data)
	})

	console.log(JSON.stringify(scrapedData, null, 2))
})()
.then(() => {
	console.log("Job done!")
	nick.exit()
})
.catch((err) => {
	console.log(`Something went wrong: ${err}`)
	nick.exit(1)
})