/**
 * Student Validation Module
 */

class StudentValidator {
    /**
     * Validate student creation payload
     * @param {Object} data - Student data
     * @returns {Object} - { isValid: boolean, errors: string[] }
     */
    static validateCreateStudent(data) {
        const errors = [];

        if (!data || typeof data !== 'object') {
            errors.push('Invalid request body');
            return { isValid: false, errors };
        }

        if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
            errors.push('Name is required and must be a valid string');
        }

        if (!data.email || typeof data.email !== 'string') {
            errors.push('Email is required and must be a valid string');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('Email must be in a valid format');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate student update payload
     * @param {Object} data - Student data
     * @param {string|number} id - Student ID
     * @returns {Object} - { isValid: boolean, errors: string[] }
     */
    static validateUpdateStudent(data, id) {
        const errors = [];

        if (!id) {
            errors.push('Student ID is required');
        }

        if (!this.isValidId(id)) {
            errors.push('Student ID must be a valid number');
        }

        if (!data || typeof data !== 'object') {
            errors.push('Invalid request body');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate student status change payload
     * @param {Object} data - Status data
     * @param {string|number} id - Student ID
     * @returns {Object} - { isValid: boolean, errors: string[] }
     */
    static validateStatusChange(data, id) {
        const errors = [];

        if (!id) {
            errors.push('Student ID is required');
        }

        if (!this.isValidId(id)) {
            errors.push('Student ID must be a valid number');
        }

        if (data.status === undefined || data.status === null) {
            errors.push('Status is required');
        }

        if (!data.reviewerId) {
            errors.push('Reviewer ID is required');
        }

        if (data.reviewerId && !this.isValidId(data.reviewerId)) {
            errors.push('Reviewer ID must be a valid number');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate student ID for GET requests
     * @param {string|number} id - Student ID
     * @returns {Object} - { isValid: boolean, errors: string[] }
     */
    static validateStudentId(id) {
        const errors = [];

        if (!id) {
            errors.push('Student ID is required');
        }

        if (!this.isValidId(id)) {
            errors.push('Student ID must be a valid number');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate query parameters for student listing
     * @param {Object} query - Query parameters
     * @returns {Object} - { isValid: boolean, errors: string[] }
     */
    static validateQueryParams(query) {
        // Query params are optional, so always valid
        // But we can add specific validation if needed
        return {
            isValid: true,
            errors: []
        };
    }

    /**
     * Helper method to validate email format
     * @private
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Helper method to validate ID
     * @private
     */
    static isValidId(id) {
        const numId = typeof id === 'string' ? parseInt(id) : id;
        return !isNaN(numId) && numId > 0;
    }
}

module.exports = { StudentValidator };
