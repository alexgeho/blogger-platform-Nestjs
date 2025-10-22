function LogMethod(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(
      `Вызов метода ${propertyKey} с аргументами: ${JSON.stringify(args)}`,
    );
    return originalMethod.apply(this, args);
  };

  return descriptor;
}

class Calculator {
  @LogMethod
  add(a: number, b: number): number {
    return a + b;
  }
}

const calculator = new Calculator();
console.log(calculator.add(2, 3)); // Вызов метода add с аргументами: [2,3]
// 5
