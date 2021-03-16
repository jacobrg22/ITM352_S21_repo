function isNonNegInt(q) {
    errors = []; // Assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return (errors.length == 0)
}

isNonNegInt('1');
isNonNegInt('-1');
isNonNegInt("cat");
isNonNegInt("2.21");
console.log("true")

attributes = "Jacob;20;MIS"

// Returns a new array with 3 parameters.
parts = attributes.split(";");