import { sendError } from '@api/utilities/sendResponse'
import chalk from 'chalk'
import { type Request, type Response } from 'express'

export interface IValidationRule {
  email?: boolean
  label?: string
  minLength?: number
  required?: boolean
  array?: boolean
}

export interface IValidationRules {
  [key: string]: IValidationRule
}

export class ValidationError extends Error {
  constructor(header: string, input: unknown) {
    super(`${chalk.bold(header)}\n${chalk.dim(JSON.stringify(input, null, 2))}`)
    this.name = 'ValidationError'
  }
}

const EMAIL_REGEX =
  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i

/**
 * Asserts that the request body is valid according to the provided validation rules.
 *
 * @template T - The expected shape of the request body. Defaults to an object with string values.
 * @param {Request['body']} body - The request body to be validated.
 * @param {Response} res - The response object used to send error responses.
 * @param {IValidationRules} [validationRules] - Optional validation rules to validate the request body against.
 * @throws Will throw an error if the request body is missing or if validation fails.
 */
export default function assertRequestBody<T = { [key: string]: string }>(
  body: Request['body'],
  res: Response,
  validationRules?: IValidationRules,
): asserts body is T {
  if (!body) {
    sendError(res, 400, 'Request body is missing')
    throw 'Request body is missing'
  }
  if (validationRules) {
    try {
      validateRequestBody(body, validationRules)
    } catch (error) {
      if (error instanceof ValidationError) {
        sendError(res, 400, error.message)
      }
      throw error
    }
  }
}

function validateRequestBody(
  body: Exclude<Request['body'], null>,
  validationRules: IValidationRules,
) {
  for (const [key, rule] of Object.entries(validationRules)) {
    const input = body[key]
    const label = rule.label || key

    if (rule.array) {
      validateArray(input, label, rule)
      continue
    }

    validateField(input, label, rule)
  }
}

function validateArray(input: unknown, label: string, rule: IValidationRule) {
  if (!Array.isArray(input)) {
    throw new ValidationError(`${label} should be an array`, input)
  }

  for (const value of input) {
    validateField(value, label, rule)
  }
}

function validateField(input: unknown, label: string, rule: IValidationRule) {
  if (rule.required && !input) {
    throw new ValidationError(`${label} is required`, input)
  }

  if (typeof input !== 'string') {
    throw new ValidationError(`${label} should be a string`, input)
  }

  if (rule.minLength && input.length < rule.minLength) {
    throw new ValidationError(`${label} should have at least ${rule.minLength} characters`, input)
  }

  if (rule.email && !input.match(EMAIL_REGEX)) {
    throw new ValidationError(`${label} should be a valid email address`, input)
  }
}
