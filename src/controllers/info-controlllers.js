const { StatusCodes } = require("http-status-codes");

const Info = (req, res) => {

    return res.status(StatusCodes.OK).json({
        "success": true,
        "message": "API is Live",
        "error": {},
        "data": {}
    });

};

module.exports = { Info };