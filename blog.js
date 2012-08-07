var routing = require("routing");

routing.configure({"controller_default":"blog","debug":1});

routing.listen(8080);
console.log("blog server start at localhost:8080");