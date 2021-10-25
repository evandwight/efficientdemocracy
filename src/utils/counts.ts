export function normalize(l) {
    const n = sum(l);
    return l.map(v => ({...v, count:v.count/n}));
}

export function sum(l) {
    return l.reduce((cv, v) => cv + v.count, 0);
}