
export class CustomError extends Error
{
    public constructor(message: string = 'Something wrong happened', public statusCode: number = 500) {
        super(message);
    }
}

export class ErrorHandler {
    public handle(err: CustomError) {
        return {
            code: err.statusCode,
            message: err.message
        }
    }
}