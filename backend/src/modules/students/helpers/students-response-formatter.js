/**
 * HTTP Response Formatter
 */

class ResponseFormatter {
    /**
     * Format a successful response
     * @param {Object} res - Express response object
     * @param {Object} options - Response options
     * @param {number} options.statusCode - HTTP status code (default: 200)
     * @param {*} options.data - Response data
     * @param {string} options.message - Response message
     */
    static success(res, { statusCode = 200, data = null, message = 'Success' }) {
        const response = {
            success: true,
            message
        };

        if (data !== null) {
            response.data = data;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Format a created resource response (201)
     * @param {Object} res - Express response object
     * @param {string} message - Success message
     * @param {*} data - Optional created resource data
     */
    static created(res, message, data = null) {
        return this.success(res, {
            statusCode: 201,
            data,
            message
        });
    }

    /**
     * Format an error response
     * @param {Object} res - Express response object
     * @param {Object} options - Error options
     * @param {number} options.statusCode - HTTP status code (default: 400)
     * @param {string|string[]} options.errors - Error message(s)
     * @param {string} options.message - General error message
     */
    static error(res, { statusCode = 400, errors = [], message = 'An error occurred' }) {
        const response = {
            success: false,
            message
        };

        // Handle both single error string and array of errors
        if (typeof errors === 'string') {
            response.errors = [errors];
        } else if (Array.isArray(errors) && errors.length > 0) {
            response.errors = errors;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Format a validation error response (400)
     * @param {Object} res - Express response object
     * @param {string[]} errors - Array of validation errors
     */
    static validationError(res, errors) {
        return this.error(res, {
            statusCode: 400,
            errors,
            message: 'Validation failed'
        });
    }

    /**
     * Format a not found error response (404)
     * @param {Object} res - Express response object
     * @param {string} message - Not found message
     */
    static notFound(res, message = 'Resource not found') {
        return this.error(res, {
            statusCode: 404,
            errors: [message],
            message: 'Not Found'
        });
    }

    /**
     * Format an internal server error response (500)
     * @param {Object} res - Express response object
     * @param {string} message - Error message
     */
    static serverError(res, message = 'Internal server error') {
        return this.error(res, {
            statusCode: 500,
            errors: [message],
            message: 'Server Error'
        });
    }
}

module.exports = { ResponseFormatter };
