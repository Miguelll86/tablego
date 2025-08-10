export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleApiError(error: unknown): { error: string; statusCode: number } {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return {
      error: error.message,
      statusCode: error.statusCode
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      statusCode: 500
    };
  }

  return {
    error: 'Errore interno del server',
    statusCode: 500
  };
}

export function validateRequired(data: any, fields: string[]): void {
  for (const field of fields) {
    if (!data[field]) {
      throw new AppError(`Campo richiesto mancante: ${field}`, 400);
    }
  }
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
} 