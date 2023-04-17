export function decodePortRange(portRange: string): number[]{
    const splits = portRange.split(':');
    const min = Number(splits[0]);
    const max  = Number(splits[1]);
    if(typeof min != 'number' || typeof max != 'number') {
        throw new Error('invalid port range format (example: "3000:3010"');
    }
    return [min, max];
}