"use strict";
exports.__esModule = true;
var loadbalancer_1 = require("../common/loadbalancer");
if (require.main === module) {
    var loadBalancer = new loadbalancer_1.LoadBalancer('3000:3010');
    loadBalancer.start();
}
