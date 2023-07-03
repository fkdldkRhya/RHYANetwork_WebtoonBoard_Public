import { generate } from "randomstring";

export function getRandomString() : string {
    return generate({
        length: 10,
        charset: 'alphabetic'
    })
}