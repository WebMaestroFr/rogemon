import { sendError } from '@api/utilities/sendResponse'
import chalk from 'chalk'
import { type Request, type Response } from 'express'

export interface IValidationRule {
  email?: boolean
  label?: string
  minLength?: number
  required?: boolean
  type?: 'object' | 'array' | 'string' | 'number' | 'boolean'
  rules?: IValidationRules
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
export default function assertRequestBody<T>(
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
      validateObject(body, 'Request body', validationRules)
    } catch (error) {
      if (error instanceof ValidationError) {
        sendError(res, 400, error.message)
      }
      throw error
    }
  }
}

function assertRecordObject(
  input: unknown,
  label: string,
): asserts input is Record<string, unknown> {
  if (typeof input !== 'object' || input === null) {
    throw new ValidationError(`${label} should be an object`, input)
  }
}

function validateObject(
  input: unknown,
  label: string,
  rules?: IValidationRules,
  allowUnknownKeys = false,
) {
  assertRecordObject(input, label)
  if (rules) {
    if (!allowUnknownKeys) {
      for (const key of Object.keys(input)) {
        if (!(key in rules)) {
          throw new ValidationError(`${label} includes unknown key ${key}`, input)
        }
      }
    }
    for (const [key, fieldRule] of Object.entries(rules)) {
      const value = input[key] as unknown
      const label = fieldRule.label || key
      assertValidType(value, label, fieldRule)
    }
  }
}

function validateArray(input: unknown, label: string, rule: IValidationRule) {
  if (!Array.isArray(input)) {
    throw new ValidationError(`${label} should be an array`, input)
  }

  const { minLength, type, ...fieldRule } = rule

  if (minLength && input.length < minLength) {
    throw new ValidationError(`${label} should have at least ${minLength} items`, input)
  }

  for (const value of input) {
    assertValidType(value, label, fieldRule)
  }
}

function validateNumber(input: unknown, label: string, _rule: IValidationRule) {
  if (typeof input !== 'number') {
    throw new ValidationError(`${label} should be a number`, input)
  }
}

function validateBoolean(input: unknown, label: string, _rule: IValidationRule) {
  if (typeof input !== 'boolean') {
    throw new ValidationError(`${label} should be a boolean`, input)
  }
}

function validateString(input: unknown, label: string, rule: IValidationRule) {
  if (typeof input !== 'string') {
    throw new ValidationError(`${label} should be a string`, input)
  }
  if (rule.minLength && String(input).length < rule.minLength) {
    throw new ValidationError(`${label} should have at least ${rule.minLength} characters`, input)
  }
  if (rule.email && !String(input).match(EMAIL_REGEX)) {
    throw new ValidationError(`${label} should be a valid email address`, input)
  }
}

function assertValidType<T = Record<string, unknown>>(
  input: unknown,
  label: string,
  rule: IValidationRule,
): asserts input is T {
  if (rule.required && !input) {
    throw new ValidationError(`${label} is required`, input)
  }

  switch (rule.type) {
    case 'object':
      validateObject(input, label, rule.rules)
      break
    case 'array':
      validateArray(input, label, rule)
      break
    case 'number':
      validateNumber(input, label, rule)
      break
    case 'boolean':
      validateBoolean(input, label, rule)
      break
    case 'string':
    default:
      validateString(input, label, rule)
  }
}
