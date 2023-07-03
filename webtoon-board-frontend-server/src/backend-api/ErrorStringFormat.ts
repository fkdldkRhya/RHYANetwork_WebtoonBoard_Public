export function errorFormat(location: string, message: any): string {
    throw new Error(`Error Occurred ==> ${location} / ${message}`);
}