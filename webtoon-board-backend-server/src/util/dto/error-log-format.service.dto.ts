export class ErrorLogFormat {
    location: string;
    error: any;
    input?: string;
    moreMessage?: string
}

/**
 * 오류 메시지 생성
 * @param errorLogFormat 오류 메시지 정보
 * @returns 오류 메시지
 */
export function getErrorMessage(errorLogFormat: ErrorLogFormat) {
    const input : string = !errorLogFormat.input ? 'No input values.' : `${errorLogFormat.input}`;
    const message : string = !errorLogFormat.moreMessage ? 'No messages.' : `${errorLogFormat.moreMessage}`;
    
    return (`${errorLogFormat.location} --> ${errorLogFormat.error} | (Message: ${message}) (Input: ${input})`);
}