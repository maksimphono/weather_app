import React from "react";

export default function func() {
    // No-unused-vars: Declaring a variable and not using it
    let unusedVar = 42; // ESLint: 'unusedVar' is defined but never used

    // No-extra-semi: Extra semicolon
    const name = "John";; // ESLint: Unnecessary semicolon

    // Calling method, that doesn't exist
    nonexistent(1, 2, 3)

    // Directly changing prototypes of build-in objects
    Object.prototype.mymethod = () => console.log("mymethod")

    // No-redeclare: Redeclaring a variable
    let age = 25;
    let age = 30; // ESLint: 'age' is already defined

    // assigning before declaration
    weatherData = 1
    var weatherData;
}