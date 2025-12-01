/**
 * Students Controller
 * Following SOLID Principles:
 * - Single Responsibility: Each function handles one specific HTTP endpoint
 * - Open/Closed: Easy to extend with new endpoints without modifying existing code
 * - Liskov Substitution: All handlers follow the same contract
 * - Interface Segregation: Each handler is independent
 * - Dependency Inversion: Depends on abstractions (service layer, validators, formatters)
 */

const asyncHandler = require("express-async-handler");
const {
    getAllStudents,
    addNewStudent,
    getStudentDetail,
    setStudentStatus,
    updateStudent,
    deleteStudent
} = require("./students-service");
const { StudentValidator } = require("./helpers/students-validator");
const { ResponseFormatter } = require("./helpers/students-response-formatter");

/**
 * GET /students - Retrieve all students with optional filters
 * @route GET /students?name=&className=&section=&roll=
 */
const handleGetAllStudents = asyncHandler(async (req, res) => {
    const { name, className, section, roll } = req.query;

    // Validate query parameters
    const validation = StudentValidator.validateQueryParams(req.query);
    if (!validation.isValid) {
        return ResponseFormatter.validationError(res, validation.errors);
    }

    // Fetch students from service layer
    const students = await getAllStudents({ name, className, section, roll });

    // Return formatted success response
    return ResponseFormatter.success(res, {
        statusCode: 200,
        data: students,
        message: "Students retrieved successfully"
    });
});

/**
 * POST /students - Create a new student
 * @route POST /students
 */
const handleAddStudent = asyncHandler(async (req, res) => {
    const studentData = req.body;

    // Validate student data
    const validation = StudentValidator.validateCreateStudent(studentData);
    if (!validation.isValid) {
        return ResponseFormatter.validationError(res, validation.errors);
    }

    // Create student via service layer
    const result = await addNewStudent(studentData);

    // Return formatted created response
    return ResponseFormatter.created(res, result.message);
});

/**
 * PUT /students/:id - Update an existing student
 * @route PUT /students/:id
 */
const handleUpdateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const studentData = req.body;

    // Validate update request
    const validation = StudentValidator.validateUpdateStudent(studentData, id);
    if (!validation.isValid) {
        return ResponseFormatter.validationError(res, validation.errors);
    }

    studentData.userId = parseInt(id);
    const result = await updateStudent(studentData);

    return ResponseFormatter.success(res, {
        statusCode: 200,
        message: result.message
    });
});

/**
 * GET /students/:id - Retrieve a specific student's details
 * @route GET /students/:id
 */
const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate student ID
    const validation = StudentValidator.validateStudentId(id);
    if (!validation.isValid) {
        return ResponseFormatter.validationError(res, validation.errors);
    }

    // Fetch student details from service layer
    const student = await getStudentDetail(parseInt(id));

    // Return formatted success response
    return ResponseFormatter.success(res, {
        statusCode: 200,
        data: student,
        message: "Student details retrieved successfully"
    });
});

/**
 * POST /students/:id/status - Change student status (enable/disable)
 * @route POST /students/:id/status
 */
const handleStudentStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, reviewerId } = req.body;

    // Validate status change request
    const validation = StudentValidator.validateStatusChange({ status, reviewerId }, id);
    if (!validation.isValid) {
        return ResponseFormatter.validationError(res, validation.errors);
    }

    // Update student status via service layer
    const result = await setStudentStatus({
        userId: parseInt(id),
        reviewerId: parseInt(reviewerId),
        status: Boolean(status)
    });

    // Return formatted success response
    return ResponseFormatter.success(res, {
        statusCode: 200,
        message: result.message
    });
});

/**
 * DELETE /students/:id - Delete a student
 * @route DELETE /students/:id
 */
const handleDeleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate student ID
    const validation = StudentValidator.validateStudentId(id);
    if (!validation.isValid) {
        return ResponseFormatter.validationError(res, validation.errors);
    }

    // Delete student via service layer
    const result = await deleteStudent(parseInt(id));

    // Return formatted success response
    return ResponseFormatter.success(res, {
        statusCode: 200,
        message: result.message,
    });
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
    handleDeleteStudent,
};
