export class RepositoryError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: any
  ) {
    super(message);
    this.name = "RepositoryError";
  }
}

export class ValidationError extends RepositoryError {
  constructor(message: string, public field?: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class NotFoundError extends RepositoryError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with id '${id}' not found` : `${resource} not found`;
    super(message, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class DuplicateError extends RepositoryError {
  constructor(resource: string, field?: string) {
    const message = field ? `${resource} with this ${field} already exists` : `${resource} already exists`;
    super(message, "DUPLICATE_ERROR");
    this.name = "DuplicateError";
  }
}

export class ForeignKeyError extends RepositoryError {
  constructor(resource: string, referencedResource: string) {
    super(`Cannot create/update ${resource}: referenced ${referencedResource} does not exist`, "FOREIGN_KEY_ERROR");
    this.name = "ForeignKeyError";
  }
}

export class ErrorHandler {
  static handleDatabaseError(error: any, context: string): RepositoryError {
    console.error(`Database error in ${context}:`, error);
    if (error?.code) {
      switch (error.code) {
        case "23505":
          return new DuplicateError(context);
        case "23503":
          return new ForeignKeyError(context, "referenced record");
        case "23502":
          return new ValidationError("Required field is missing");
        case "23514":
          return new ValidationError("Invalid data provided");
        default:
          return new RepositoryError(`Database operation failed in ${context}: ${error.message}`, error.code, error);
      }
    }
    if (error?.message?.includes("connection") || error?.message?.includes("timeout")) {
      return new RepositoryError(`Database connection failed in ${context}`, "CONNECTION_ERROR", error);
    }
    return new RepositoryError(`Operation failed in ${context}: ${error?.message || "Unknown error"}`, "UNKNOWN_ERROR", error);
  }

  static validateRequired(data: Record<string, any>, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === "") {
        throw new ValidationError(`${field} is required`, field);
      }
    }
  }

  static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new ValidationError("Invalid email format", "email");
  }

  static validatePhone(phone: string): void {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) throw new ValidationError("Invalid phone number format", "phone");
  }

  static validateUUID(uuid: string, fieldName: string = "id"): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) throw new ValidationError(`Invalid UUID format for ${fieldName}`, fieldName);
  }

  static validateUserId(userId: string, fieldName: string = "userId"): void {
    // More flexible validation for user IDs (better-auth may use different formats)
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }
    if (userId.trim().length < 3 || userId.trim().length > 50) {
      throw new ValidationError(`${fieldName} must be between 3 and 50 characters`, fieldName);
    }
  }
}

