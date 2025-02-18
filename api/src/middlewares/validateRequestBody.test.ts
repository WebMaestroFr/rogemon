import { describe, it, expect } from "vitest";
import { validateRequestBody } from "./validateRequestBody";

describe("validateRequestBody", () => {
  it("should throw an error if a required field is missing", () => {
    const body = {};
    const rules = {
      email: { required: true, label: "Email" },
    };

    expect(() => validateRequestBody(body, rules)).toThrow("Email is required");
  });

  it("should throw an error if a field does not meet the minimum length requirement", () => {
    const body = { username: "abc" };
    const rules = {
      username: { minLength: 5, label: "Username" },
    };

    expect(() => validateRequestBody(body, rules)).toThrow(
      "Username should have at least 5 characters"
    );
  });

  it("should throw an error if a field is not a valid email address", () => {
    const body = { email: "invalid-email" };
    const rules = {
      email: { email: true, label: "Email" },
    };

    expect(() => validateRequestBody(body, rules)).toThrow(
      "Email should be a valid email address"
    );
  });

  it("should not throw an error if all validations pass", () => {
    const body = { email: "test@example.com", username: "validUser" };
    const rules = {
      email: { email: true, required: true, label: "Email" },
      username: { minLength: 5, required: true, label: "Username" },
    };

    expect(() => validateRequestBody(body, rules)).not.toThrow();
  });

  it("should use the field name as the label if no custom label is provided", () => {
    const body = {};
    const rules = {
      email: { required: true },
    };

    expect(() => validateRequestBody(body, rules)).toThrow("email is required");
  });
});
