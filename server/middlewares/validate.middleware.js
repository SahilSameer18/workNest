import { ZodError } from "zod";

// Validates req.body against a Zod schema and maps validation failures to res.status(400)
export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const parsedData = await schema.parseAsync(req.body);
      
      // Update req.body with the parsed/coerced values
      req.body = parsedData;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Map Zod errors to a flat object: { field: message }
        const fieldErrors = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          fieldErrors[path] = err.message;
        });

        return res.status(400).json({
          message: "Validation constraints failed.",
          errors: fieldErrors
        });
      }
      
      // Pass other unexpected errors to the global handler
      next(error);
    }
  };
};

