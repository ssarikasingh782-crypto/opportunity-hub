/**
 * Standardized JSON API Response Helper
 * Enforces consistent response shapes across all API endpoints:
 * 
 * 1. Single/Action:
 *    { success: true, data: {...}, message: "..." }
 * 
 * 2. Paginated List:
 *    { success: true, data: [...], pagination: { page, limit, total, pages }, message: "..." }
 */
class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }

  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, data = null, message = 'Resource created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static list(res, data = [], pagination = {}, message = 'Data retrieved successfully', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      pagination: {
        page: Number(pagination.page) || 1,
        limit: Number(pagination.limit) || data.length,
        total: Number(pagination.total) || data.length,
        pages: Number(pagination.pages) || 1,
      },
    });
  }
}

module.exports = ApiResponse;
