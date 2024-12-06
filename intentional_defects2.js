export default function func() {
    // Curly: Missing curly braces in if statements
    if (name === "John") console.log("No curly braces!"); // ESLint: Expected { after 'if' condition

    // Indent: Incorrect indentation
    function sayHello {
        console.log("Hi!"); // ESLint: Expected indentation of 2 spaces but found 0
    }
}