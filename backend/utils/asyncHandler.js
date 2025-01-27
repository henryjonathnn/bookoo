/**
 * Wrapper untuk async function di Express untuk handle error secara otomatis
 * @param {Function} fn - Async function yang akan di-wrap
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      res.status(error.status || 500).json({
        message: error.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    });
  };
}; 