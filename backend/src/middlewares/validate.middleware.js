const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Middleware to intercept express-validator results
 * Returns clean standard error shape { success: false, message, errors: [{ field, msg }] }
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all express-validator validation chains
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      msg: err.msg,
    }));

    return next(new ApiError(400, 'Validation failed. Please correct input fields.', formattedErrors));
  };
};

module.exports = validate;
