const Job = require("../models/Job");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllJobs = async (req, res) => {
    // not all the job , jobs associated with the user
    const jobs = await Job.find({ createdBy: req.user.userId }).sort(
        "createdAt"
    );
    res.status(StatusCodes.OK).json({
        msg: `All the jobs associated with ${req.user.name}`,
        jobNum: jobs.length,
        jobs,
    });
};

const getJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
    } = req;
    let job = await Job.findOne({
        _id: jobId,
        createdBy: userId,
    });

    if (!job) {
        throw new NotFoundError("job not found !");
    }
    res.status(StatusCodes.OK).json({ job });
};

const createJobs = async (req, res) => {
    req.body.createdBy = req.user.userId; // from the token the "user id" is taken and added to the request body
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({
        msg: "Job created successfully",
        job,
    });
};

const updateJobs = async (req, res) => {
    const {
        params: { id: jobId },
        user: { userId },
        body: updateJob,
    } = req;
    if (updateJob.company === "" || updateJob.position === "") {
        throw new BadRequestError("Please specify the comapny and position");
    }
    const job = await Job.findByIdAndUpdate(
        { _id: jobId, createdBy: userId },
        updateJob,
        { new: true, runValidators: true }
    );
    if (!job) {
        throw new NotFoundError("Job not found !");
    }
    res.status(StatusCodes.OK).json({ updatedJob: job });
};

const deleteJobs = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
    } = req;
    let job = await Job.findByIdAndDelete({
        _id: jobId,
        createdBy: userId,
    });
    if (!job) {
        throw new NotFoundError("job not found !");
    }
    res.status(StatusCodes.OK).json({ deletedJob: job });
};

module.exports = {
    getAllJobs,
    getJob,
    updateJobs,
    createJobs,
    deleteJobs,
};
