console.log("Hello, World! 🎉");

// A simple function to demonstrate TypeScript
function greet(name: string): string {
  return `Hello, ${name}! Welcome to your TypeScript project.`;
}

// Use the function
const message = greet("TypeScript Developer");
console.log(message);

// Show current date and time
console.log(`Current time: ${new Date().toISOString()}`); 