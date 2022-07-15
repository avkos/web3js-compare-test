import {Web3Eth as Web3Ethx4} from '../web3.js/packages/web3-eth'
import WebSocketProviderx4 from '../web3.js/packages/web3-providers-ws'
import Web3x1 from '../web3.js.1.x/packages/web3'
import {getSystemTestAccounts} from "./system_tests_utils";
import { Resolve } from '../web3.js/packages/web3-eth/test/integration/helper';
import {sendFewTxes} from "./helper";

const checkTxCount = 5;

describe('subscription', () => {
	let providerWsx1: any;
	let providerWsx4: WebSocketProviderx4;
	let clientUrl: string;
	let accounts: string[] = [];
	beforeAll(async () => {
		clientUrl = 'ws://127.0.0.1:8545';
		accounts = await getSystemTestAccounts();
		providerWsx4 = new WebSocketProviderx4(
			clientUrl,
			{},
			{ delay: 1, autoReconnect: false, maxAttempts: 1 },
		);
		providerWsx1 = new Web3x1.providers.WebsocketProvider(clientUrl)
	});
	afterAll(() => {
		providerWsx1.disconnect();
		providerWsx4.disconnect();
	});

	describe('new pending transaction', () => {
		it(`wait ${checkTxCount} transaction - new pending tx`, async () => {
			// @ts-ignore
			const web3Ethx1 = new Web3x1.modules.Eth(providerWsx1);
			const web3Ethx4 = new Web3Ethx4(providerWsx4 as any);

			const subx4: any = await web3Ethx4.subscribe('pendingTransactions');
			const subx1: any = await web3Ethx1.subscribe('pendingTransactions');
			const from = accounts[0];
			const to = accounts[1];
			const value = `0x1`;

			let times = 0;
			let data1={}
			let data4={}
			const txHashes: string[] = [];
			const pr1 = new Promise((resolve: Resolve) => {
				subx1.on('data', (data: string) => {
					data1=data
					txHashes.push(data);
					times += 1;
					if (times >= checkTxCount) {
						resolve();
					}
				});
			});
			const pr4 = new Promise((resolve: Resolve) => {
				subx4.on('data', (data: string) => {
					data4=data
					txHashes.push(data);
					times += 1;
					if (times >= checkTxCount) {
						resolve();
					}
				});
			});

			await sendFewTxes({
				web3Eth:web3Ethx4,
				from,
				to,
				value,
				times: checkTxCount,
			});
			await pr1;
			await pr4;
			expect(data1).toEqual(data4)
			await web3Ethx4.clearSubscriptions();
			await web3Ethx1.clearSubscriptions(()=>{});
		});
	});
});
