const fs = require('fs')
//const JSON = require('json')

class JsonReporter {
    onRunComplete(_, results) {
      const fs = require("fs");
      const outputFile = "custom-test-results.json";
  
      fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
      console.log(`Test results written to ${outputFile}`);
    }
}

function main() {
    let testResults = {}
    let report = {}

    testResults = JSON.parse(fs.readFileSync("./src/Pages/Home/tests/testResults.json", encoding = "utf-8"))
    report = JSON.parse(fs.readFileSync("./src/Pages/Home/tests/changes_report.json", encoding = "utf-8"))

    testResults.testResults.forEach((result) => {
        const failedTestsTitles = []
        const item = report.changes.find(item => item.testFilePath === result.testFilePath);

        for (let {title, status} of result.assertionResults) {
            if (status === "failed") {
                failedTestsTitles.push(title)
            }
        }
        if (failedTestsTitles.length === 0) return

        if (!item) {
            report.changes.push({
                testFilePath : result.name,
                testsFalied : [...failedTestsTitles],
                description : "",
                solution : "",
                alteredFiles : [],
                status : "IN PROCESS"
            })
        } else {
            item.testsFalied = [...failedTestsTitles]
        }
    })

    fs.writeFileSync("./src/Pages/Home/tests/changes_report.json", JSON.stringify(report))

}
main()