export interface ErrorResponse {
  error?: true;
  code?: number;
  message?: string;
}

export type SuccessResponse<T = any> =
  | {
      success?: true;
      code?: number;
      message: string;
      data?: T;
    }
  | {
      success?: true;
      code?: number;
      message?: string;
      data: T;
    };
