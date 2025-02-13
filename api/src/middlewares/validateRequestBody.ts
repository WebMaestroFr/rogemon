import { NextFunction, Request, Response } from "express";
import { sendError } from "../response";

export interface ValidationRules {
  [key: string]: {
    email?: boolean;
    label?: string;
    minLength?: number;
    required?: boolean;
  };
}

const EMAIL_REGEX =
  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

/**
 * Validates the request body against the provided rules.
 *
 * @param req - The request object containing the body to be validated.
 * @param rules - An object where each key corresponds to a field in the request body.
 * Each field can have the following validation rules:
 * - `email` (boolean): If true, the field should be a valid email address.
 * - `label` (string): A custom label for the field to be used in error messages.
 * - `minLength` (number): The minimum length the field should have.
 * - `required` (boolean): If true, the field must be present.
 *
 * @throws Will throw an error if a required field is missing or if a field does not meet the minimum length requirement.
 */
export function validateRequestBody(
  body: { [key: string]: string },
  rules: ValidationRules
) {
  for (const [key, rule] of Object.entries(rules)) {
    const input = body[key];
    const label = rule.label || key;
    if (rule.required && !input) {
      throw `${label} is required`;
    }
    if (rule.minLength && input.length < rule.minLength) {
      throw `${label} should have at least ${rule.minLength} characters`;
    }
    if (rule.email && !input.match(EMAIL_REGEX)) {
      throw `${label} should be a valid email address`;
    }
  }
}

/**
 * Middleware to validate the request body against specified validation rules.
 *
 * @param {ValidationRules} rules - The validation rules to apply to the request body.
 * @returns {Function} Middleware function to validate the request body.
 */
export default function validateRequestBodyMiddleware(
  rules: ValidationRules
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      validateRequestBody(req.body, rules);
      return next();
    } catch (error) {
      if (typeof error === "string") {
        return sendError(res, 400, error);
      }
      return next(error);
    }
  };
}
