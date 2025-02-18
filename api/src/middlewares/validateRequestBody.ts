import { Request, Response } from "express";
import { sendError } from "../response";

export interface ValidationRule {
  email?: boolean;
  label?: string;
  minLength?: number;
  required?: boolean;
  array?: boolean;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

const EMAIL_REGEX =
  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

/**
 * Validates the request body against the provided validation rules.
 *
 * @param body - The request body to validate, where each key is a field name and the value is the field value.
 * @param rules - The validation rules to apply, where each key is a field name and the value is the validation rule.
 *
 * The function iterates over each rule and validates the corresponding field in the request body.
 * If the rule specifies that the field is an array, it calls `validateArray` to validate the array.
 * Otherwise, it calls `validateField` to validate the individual field.
 */
export function validateRequestBody(
  body: { [key: string]: string },
  rules: ValidationRules
) {
  for (const [key, rule] of Object.entries(rules)) {
    const input = body[key];
    const label = rule.label || key;

    if (rule.array) {
      validateArray(input, label, rule);
      continue;
    }

    validateField(input, label, rule);
  }
}

/**
 * Validates that the input is an array and that each element in the array
 * conforms to the specified validation rule.
 *
 * @param input - The input to be validated.
 * @param label - A label to be used in error messages.
 * @param rule - The validation rule to apply to each element in the array.
 * @throws Will throw an error if the input is not an array or if any element
 *         in the array does not pass the validation rule.
 */
function validateArray(input: unknown, label: string, rule: ValidationRule) {
  if (!Array.isArray(input)) {
    throw `${label} should be an array`;
  }

  for (const value of input) {
    validateField(value, label, rule);
  }
}

/**
 * Validates a field based on the provided validation rule.
 *
 * @param input - The input value to be validated.
 * @param label - The label of the field being validated, used in error messages.
 * @param rule - The validation rule to apply to the input.
 * @throws Will throw an error if the input is required but not provided.
 * @throws Will throw an error if the input is a string and does not meet the minimum length requirement.
 * @throws Will throw an error if the input is a string and is not a valid email address.
 */
function validateField(input: unknown, label: string, rule: ValidationRule) {
  if (rule.required && !input) {
    throw `${label} is required`;
  }

  if (typeof input !== "string") {
    throw `${label} should be a string`;
  }

  if (rule.minLength && input.length < rule.minLength) {
    throw `${label} should have at least ${rule.minLength} characters`;
  }

  if (rule.email && !input.match(EMAIL_REGEX)) {
    throw `${label} should be a valid email address`;
  }
}

export function assertBody<T = { [key: string]: string }>(
  body: Request["body"],
  res: Response,
  rules?: ValidationRules
): asserts body is T {
  if (!body) {
    sendError(res, 400, "Request body is missing");
    throw "Request body is missing";
  }
  if (rules) {
    try {
      validateRequestBody(body, rules);
    } catch (error) {
      if (typeof error === "string") {
        sendError(res, 400, error);
      }
      throw error;
    }
  }
}
