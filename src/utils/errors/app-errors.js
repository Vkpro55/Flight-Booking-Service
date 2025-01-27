
/*== The main behind is, Multiple-developers working on same project will throw consistent errors, not by their own cutsom errors. ==*/

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.explanation = message;
    }
};

module.exports = AppError;