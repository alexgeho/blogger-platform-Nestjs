
const add = (a, b) => a - b;
const multi = (a, b) => a * b;


function decorator(f) {

  return function (...args) {

    console.log('function name:', f.name);
    console.log('arguments:', args);

    const result = f(...args);
    console.log('result:', result);

    return result;

  };
}

const multiDecor = decorator(multi);
const addDecor = decorator(add);

addDecor(55, 6);

multiDecor (4, 5)
