import { Request } from "express";

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
export default function validateRequestBody(
  body: Request["body"],
  rules: {
    [key: string]: {
      email?: boolean;
      label?: string;
      minLength?: number;
      required?: boolean;
    };
  }
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
