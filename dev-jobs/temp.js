const processTitles = require('./utils/processTitles');
const categories = require('./categories');

let obj = processTitles(categories, {
    ".net software engineer": 5,
    "front-end developer with phonegap background": 5,
    "c++ software engineer": 5,
    "java developer": 5,
    "front end software engineer": 5,
    "middle .net developer": 2,
    "asp.net developer": 1
});

console.log(obj);