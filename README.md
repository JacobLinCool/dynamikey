# Dynamikey

Dynamic Call in JavaScript!

## Example

```javascript
const dynamikey = new Dynamikey({})
    .add(/^plus-\d{1,10}$/, (path, params) => +path[0].substring(5) + params.reduce((a, b) => a + b, 0))
    .add(/^hello\.[^.]*?$/, (path, params) => `Hello ${params[1]}!`, "value")
    .gen();

const plus_1000 = dynamikey["plus-1000"];
console.log(plus_1000(1, 2, 3)); // 1006

const plus_3000 = dynamikey["plus-3000"];
console.log(plus_3000(-1, -2, -3)); // 2994

const hello_world = dynamikey["hello.world"];
console.log(hello_world); // Hello World!

const hello_jacob = dynamikey["hello.jacob"];
console.log(hello_jacob); // Hello Jacob!
```

## Features

-   Support Dynamic Call
-   Support Nested Call
-   Support Rirect Value Evaluation
