class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return 'Hello, ' + this.greeting;
  }
}

const greeter = new Greeter('world');
console.log('greeter: ', greeter.greet());

class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

const dog = new Animal('Dog');
dog.move(10);

console.log('Dog: ', dog.name, dog.move(555));
