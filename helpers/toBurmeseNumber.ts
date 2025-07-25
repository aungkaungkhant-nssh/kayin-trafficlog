export function toBurmeseNumber(input: string): string {
    const burmeseDigits = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];

    return input.replace(/\d/g, (digit) => burmeseDigits[parseInt(digit)]);
}