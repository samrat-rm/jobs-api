let express = require("express");
let router = express.Router();
const {
    getAllJobs,
    getJob,
    createJobs,
    updateJobs,
    deleteJobs,
} = require("../controllers/jobs");

router.route("/").get(getAllJobs).post(createJobs);
router.route("/:id").get(getJob).patch(updateJobs).delete(deleteJobs);

module.exports = router;
