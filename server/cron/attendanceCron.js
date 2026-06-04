const cron = require("node-cron");
const axios = require("axios");
import { API } from "../../client/src/config";
console.log(
  "Attendance Cron Started"
);

// 10:31 AM Daily

cron.schedule(
  "31 10 * * *",
  async () => {
    try {
      await axios.post(
        `${API}/api/attendance/auto-absent`
      );

      console.log(
        "Auto Absent Completed"
      );
    } catch (error) {
      console.log(error.message);
    }
  }
);

module.exports = {};