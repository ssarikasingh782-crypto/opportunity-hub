/**
 * Async handler utility to eliminate try-catch boilerplate in route controllers
 * Forwards any rejected Promise to the Express next() error middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
