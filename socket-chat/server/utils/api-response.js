// api-response.js

function successResponse(data=null, message=null) {
    return {
        success: true,
        data,
        error: null,
        ...(message && { message }) // provide message only when message is not null
    };
}

function errorResponse(code, message) {
    return {
        success: false,
        data: null,
        error: {
            code,
            message
        }
    };
}

export { successResponse, errorResponse };