const pino = require("pino");
const rfs = require("rotating-file-stream");
const path = require("path");

const logFileName = () => {
    const date = new Date();
    // add the 1 to get the correct month, as it starts from 0
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}.log`;
};

const logDirectory = path.join(__dirname, "../../logs");

const rotatingStream = rfs.createStream(logFileName(), {
    interval: "1d",
    path: logDirectory,
});

const logger = pino(
    {
        timestamp: pino.stdTimeFunctions.isoTime,
        level: "debug",
        base: undefined, // undefined to avoid adding pid, hostname
    },
    pino.multistream([{ stream: rotatingStream }, { stream: process.stdout }])
);

module.exports = logger;
