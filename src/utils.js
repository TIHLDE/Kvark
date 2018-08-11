// Convert from snake case (JSON style) to camel case
function snakeToCamelCase(s) {
    let arr = Array.from(s);
    let narr = [];
    let next = false;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '_') {
            next = true;
        } else {
            if (next) {
                narr.push(arr[i].toUpperCase());
                next = false;
                continue;
            } else {
                narr.push(arr[i]);
            }
        }
    }
    return narr.join('');
}

// Convert all keys in the object v from snake to camel case
export const convertKeysToCamelCase = (v) => {
    let objects = {};
    for (let key in v) {
        if (v.hasOwnProperty(key)) {
            objects[snakeToCamelCase(key)] = v[key];
        }
    }
    return objects;
}

// Helper function: recursively convert object keys to camel case
export function helperRecursiveSnakeToCamelCase(v, depth=0, maxDepth=10) {
    if (depth >= maxDepth) {
        console.log('recursiveSnakeToCamelCase: exceeded maxDepth of ', maxDepth);
        return v;
    }
    if (typeof(v) !== 'object') {
        return v;
    }
    let objects = null;
    if (v instanceof Array) {
        objects = [];
    } else {
        objects = {};
    }
    for (let key in v) {
        if (v.hasOwnProperty(key) && v[key]) {
            objects[snakeToCamelCase(key)] = helperRecursiveSnakeToCamelCase(v[key], depth+1);
        }
    }
    return objects;
}

// Converts all keys (recursive) of a object from
// snake case to camel case
export default {
    recursiveSnakeToCamelCase: (v) => {
        return helperRecursiveSnakeToCamelCase(v);
    },
};

// Convert date-string to more readable text
export const refactorDateString = (dateString) => {
    if (!dateString || dateString.length < 10) {
        return dateString;
    } else if (!(typeof(dateString) === 'string')) {
        return dateString;
    }

    // This solutions also works for Safari
    const convertedStringDate = dateString.substring(0, 10);
    let date = new Date(convertedStringDate);
    if (!date) {
        date = new Date(convertedStringDate.replace(/-/g, '/'));
    }
    return date.toDateString();
};
