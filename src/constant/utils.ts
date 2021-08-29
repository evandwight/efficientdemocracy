export function mapProp(list, index, prop) {
    return list.reduce((acc, v) => {
        acc[v[index]] = v[prop];
        return acc;
    }, {});
}

export function mapAll(list, index, props) {
    let obj = {};
    // List of keys
    obj[index] = list.map(v => v[index]);
    return {
        ... obj,
        ... props.reduce((acc, prop) => {
            acc[prop] = mapProp(list, index, prop);
            return acc;
        }, {})
    };
}