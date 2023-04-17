import {decodePortRange} from './helper';
import * as http from 'http';
import axios from 'axios';
import {
    HttpReverseProxy,
    createProxyServer
} from 'http-proxy';

export class LoadBalancer {
    protected proxyMap: Map<number,HttpReverseProxy> = new Map(); // server address
    protected portList: number[] =[];
    protected selectedProxy: HttpReverseProxy;
    protected selectedPortIndex: number = 0;
    protected server: any;
    protected minPort: number;
    protected maxPort: number;

    constructor(portRange: string){
        const decodedPort=decodePortRange(portRange);
        this.minPort=decodedPort[0];
        this.maxPort=decodedPort[1];
    }

    public start(port?:number){
        http.createServer((req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => {
            this.nextServer();
            return this.selectedProxy.web(req, res);
        }).listen(port || 80, () => {
            console.log(`listening por : ${port || 80}`)
        })

        this.refreshProxyList().catch((e) => console.log('failed to refresh proxy list',e));

    }

    async refreshProxyList(){
        while(1) {
            await this.loadServer();
            await this.delay(3000);
        }
    }

    async delay(ms:number){
        setTimeout(()=>{},ms)
    }

    async loadServer(){
        for (let i = this.minPort; i<=this.maxPort; i++){
            const url = `http://localhost:${i}`
            const isReady = await this.isServerReady(url);
            if(isReady && !this.portList.includes(i)){
                console.log(`new server ready, ${url}`)
                this.portList.push(i);
                this.proxyMap.set(i, createProxyServer({
                    target: url,
                }))
                continue;
            }

            if(!isReady && this.portList.includes(i)) {
                console.log(`server not healthy, ${url}`)
                this.nextServer();
                const idx = this.portList.indexOf(i);
                this.portList.splice(idx);
                this.proxyMap.delete(i);
            }
        }
    }

    async isServerReady(host:string):Promise<boolean>{
        try {
            await axios.get(`${host}/readiness`)
            return true;
        } catch (e) {
            return false;
        }
    }

    nextServer(){
        const maxIndex = this.portList.length
        if(this.selectedPortIndex>=maxIndex-1){
            this.selectedPortIndex=0;
        } else {
            this.selectedPortIndex++;
        }
        this.selectedProxy = this.proxyMap.get(this.portList[this.selectedPortIndex]);
    }
}