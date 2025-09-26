const errorMiddleware = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    const message = err.message || "Internal Server Error";

    console.error(`[BACKEND ERROR] Status: ${statusCode}, Message: ${message}`);

    return res.status(statusCode).json({
        success: false,
        message: message, // This is the message the frontend reads as data.message
    });
};

export { errorMiddleware };