import { query, matchedData, validationResult, body } from "express-validator";
import { createHttpError } from "../utils/httpError.js";

const sanitize = (validations) => {
  return async (req, res, next) => {
    let err;
    // sequential processing, stops running validations chain if one fails.
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        err = createHttpError(
          result.array()?.status || 500,
          result.array()?.message || "internal server error",
        );
      }
    }

    next();
  };
};

export { sanitize };
