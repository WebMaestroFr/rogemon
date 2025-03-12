import { it, expect } from 'vitest'

import assertRequestBody, { ValidationError, type IValidationRules } from './assertRequestBody'
import { mockExpressArguments } from '@api/testUtilities/mockExpress'

it('should throw an error if the request body is missing', () => {
  const [req, res] = mockExpressArguments()

  const validationProcess = () => assertRequestBody(req.body, res)
  expect(validationProcess).toThrow('Request body is missing')
  expect(res.status).toHaveBeenCalledWith(400)
  expect(res.send).toHaveBeenCalledWith('Request body is missing')
})

it('should validate the request body according to the provided rules', () => {
  const [req, res] = mockExpressArguments({
    body: { email: 'test@example.com' },
  })
  const validationRules: IValidationRules = {
    email: { required: true, email: true },
  }
  const validationProcess = () => assertRequestBody(req.body, res, validationRules)
  expect(validationProcess).not.toThrow()
})

it('should send an error if validation fails', () => {
  const [req, res] = mockExpressArguments({ body: { email: 'invalid-email' } })
  const validationRules: IValidationRules = {
    email: { required: true, email: true },
  }

  const validationProcess = () => assertRequestBody(req.body, res, validationRules)
  expect(validationProcess).toThrow(ValidationError)
  expect(res.status).toHaveBeenCalledWith(400)
  expect(res.send).toHaveBeenCalled()
})

it('should validate array fields', () => {
  const [req, res] = mockExpressArguments({ body: { tags: ['tag1', 'tag2', 'tag3'] } })
  const validationRules: IValidationRules = {
    tags: { type: 'array', minLength: 3 },
  }
  const validationProcess = () => assertRequestBody(req.body, res, validationRules)
  expect(validationProcess).not.toThrow()
})

it('should send an error if array validation fails', () => {
  const [req, res] = mockExpressArguments({ body: { tags: ['tag1', 'tag2'] } })
  const validationRules: IValidationRules = {
    tags: { type: 'array', minLength: 3 },
  }

  const validationProcess = () => assertRequestBody(req.body, res, validationRules)
  expect(validationProcess).toThrow(ValidationError)
  expect(res.status).toHaveBeenCalledWith(400)
  expect(res.send).toHaveBeenCalled()
})
