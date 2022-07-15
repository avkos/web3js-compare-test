import {Web3Eth as Web3Ethx4} from '../web3.js/packages/web3-eth'
import WebSocketProviderx4 from '../web3.js/packages/web3-providers-ws'
import Web3x1 from '../web3.js.1.x/packages/web3'
import {getSystemTestAccounts} from "./system_tests_utils";
import {sendFewTxes} from "./helper";

const checkTxCount = 5
describe('eth subscribe', () => {
    let clientUrl: string;
    let accounts: string[] = [];
    let providerWsx1: any;
    let providerWsx4: WebSocketProviderx4;
    let name: string;
    beforeAll(async () => {
        name = 'newBlockHeaders'
        clientUrl = 'ws://127.0.0.1:8545'
        accounts = await getSystemTestAccounts();
        providerWsx4 = new WebSocketProviderx4(clientUrl);
        providerWsx1 = new Web3x1.providers.WebsocketProvider(clientUrl);
    });
    afterAll(() => {
        providerWsx1.disconnect();
        providerWsx4.disconnect();
    });

    describe('heads', () => {
        it(`wait for newBlockHeaders`, async () => {
            // @ts-ignore
            const web3Ethx1 = new Web3x1.modules.Eth(providerWsx1);
            const web3Ethx4 = new Web3Ethx4(providerWsx4 as any);
            const subx1: any = await web3Ethx1.subscribe(name as 'newBlockHeaders');
            const subx4: any = await web3Ethx4.subscribe(name as 'newBlockHeaders');
            const from = accounts[0];
            const to = accounts[1];
            const value = `0x1`;

            let timesx1 = 0;
            let timesx4 = 0;
            let data1 = {}
            let data4 = {}
            const prx1 = new Promise((resolve: any) => {
                subx1.on('data', (data: any) => {
                    data1 = data
                    if (data.parentHash) {
                        timesx1 += 1;
                    }
                    if (timesx1 >= checkTxCount) {
                        resolve();
                    }
                });
            });
            const prx4 = new Promise((resolve: any) => {
                subx4.on('data', (data: any) => {
                    data4 = data
                    if (data.parentHash) {
                        timesx4 += 1;
                    }
                    if (timesx4 >= checkTxCount) {
                        resolve();
                    }
                });
            });

            await sendFewTxes({web3Eth: web3Ethx4, from, to, value, times: checkTxCount});
            await prx4;
            await prx1;
            expect(Object.keys(data1).sort()).toEqual(Object.keys(data4).sort())
        });
        it.skip(`clear`, async () => {
            // @ts-ignore
            const web3Ethx1 = new Web3x1.modules.Eth(providerWsx1);
            const web3Ethx4 = new Web3Ethx4(providerWsx4 as any);
            const subx1: any = await web3Ethx1.subscribe(name as 'newBlockHeaders');
            const subx4: any = await web3Ethx4.subscribe(name as 'newBlockHeaders');
            expect(subx1.id).toBeDefined();
            expect(subx4.id).toBeDefined();
            const resx1 = await web3Ethx1.clearSubscriptions(() => {
            });
            const resx4 = await web3Ethx4.clearSubscriptions();
            expect(resx1).toBe(!!resx4)
            expect(subx4.id).toBeUndefined();
        });
    });
});
