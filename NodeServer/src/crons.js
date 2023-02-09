const { execFile } = require("node:child_process");
const path = require("node:path");
const CronJob = require("cron").CronJob;

const pathToRecordReducer = path.resolve("src", "recorders", "reducer.js");

function runRecordReducer() {
  const child = execFile(
    "node",
    [pathToRecordReducer],
    (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      console.log(stdout);
    }
  );
}

const recordReducerJob = new CronJob(
  "*/1 * * * * ",
  runRecordReducer,
  null,
  false,
  "Asia/Ho_Chi_Minh"
);
// Use this if the 4th param is default value(false)
// job.start()

module.exports = { recordReducerJob };
