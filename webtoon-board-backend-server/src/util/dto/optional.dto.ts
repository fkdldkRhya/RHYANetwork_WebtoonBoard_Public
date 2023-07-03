export interface Optional<T> {
    result: OptionalResult;
    data?: T;
    message?: String;
}

export enum OptionalResult {
    SUCCESS = "SUCCESS",
    FAIL = "FAIL",
    NULL = "NULL"
}