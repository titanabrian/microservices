import {LoadBalancer} from "../common/loadbalancer";

const loadBalancer=new LoadBalancer('3000:3010');
loadBalancer.start();
