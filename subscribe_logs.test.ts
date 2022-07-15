import {Web3Eth as Web3Ethx4} from '../web3.js/packages/web3-eth'
import WebSocketProviderx4 from '../web3.js/packages/web3-providers-ws'
import Web3x1 from '../web3.js.1.x/packages/web3'
import {getSystemTestAccounts} from "./system_tests_utils";
import { Contract, decodeEventABI } from '../web3.js/packages/web3-eth-contract';
import { BasicAbi, BasicBytecode } from '../web3.js/packages/web3-eth/test/shared_fixtures/build/Basic';
import { eventAbi, Resolve } from '../web3.js/packages/web3-eth/test/integration/helper';

const checkEventCount = 2;

type MakeFewTxToContract = {
	sendOptions: Record<string, unknown>;
	contract: Contract<typeof BasicAbi>;
	testDataString: string;
};
const makeFewTxToContract = async ({
	contract,
	sendOptions,
	testDataString,
}: MakeFewTxToContract): Promise<void> => {
	const prs = [];
	for (let i = 0; i < checkEventCount; i += 1) {
		// eslint-disable-next-line no-await-in-loop
		prs.push(await contract.methods?.firesStringEvent(testDataString).send(sendOptions));
	}
};
describe('subscription', () => {
	let clientUrl: string;
	let accounts: string[] = [];
	let providerWsx1: any;
	let providerWsx4: WebSocketProviderx4;
	let contract: Contract<typeof BasicAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;
	let from: string;
	const testDataString = 'someTestString';
	beforeAll(async () => {
		clientUrl = 'ws://127.0.0.1:8545';
		accounts = await getSystemTestAccounts();
		[, from] = accounts;
		providerWsx4 = new WebSocketProviderx4(
			clientUrl,
			{},
			{ delay: 1, autoReconnect: false, maxAttempts: 1 },
		);
		providerWsx1 = new Web3x1.providers.WebsocketProvider(clientUrl)
		contract = new Contract(BasicAbi, undefined, {
			provider: clientUrl,
		});

		deployOptions = {
			data: BasicBytecode,
			arguments: [10, 'string init value'],
		};

		sendOptions = { from, gas: '1000000' };

		contract = await contract.deploy(deployOptions).send(sendOptions);
	});
	afterAll(() => {
		providerWsx4.disconnect();
		providerWsx1.disconnect();
	});

	describe('logs', () => {
		it(`wait for ${checkEventCount} logs`, async () => {
			// @ts-ignore
			const web3Ethx1 = new Web3x1.modules.Eth(providerWsx1);
			const web3Ethx4 = new Web3Ethx4(providerWsx4 as any);

			const subx4: any = await web3Ethx4.subscribe('logs', {
				fromBlock:'0x1',
				address: contract.options.address,
			});
			const subx1: any = await web3Ethx1.subscribe('logs', {
				fromBlock:'0x1',
				address: contract.options.address,
			});

			let count = 0;
			let datax1={}
			let datax4={}
			const prx4 = new Promise((resolve: Resolve) => {
				subx4.on('data', (data: any) => {
					count += 1;
					datax4=data
					const decodedData = decodeEventABI(
						eventAbi as any & { signature: string },
						data,
						[],
					);
					expect(decodedData.returnValues['0']).toBe(testDataString);
					if (count >= checkEventCount) {
						resolve();
					}
				});
			});
			const prx1 = new Promise((resolve: Resolve) => {
				subx1.on('data', (data: any) => {
					count += 1;
					datax1=data
					const decodedData = decodeEventABI(
						eventAbi as any & { signature: string },
						data,
						[],
					);
					expect(decodedData.returnValues['0']).toBe(testDataString);
					if (count >= checkEventCount) {
						resolve();
					}
				});
			});

			await makeFewTxToContract({ contract, sendOptions, testDataString });
			await prx1;
			await prx4;
			await web3Ethx1.clearSubscriptions(()=>{});
			await web3Ethx4.clearSubscriptions();

			expect(Object.keys(datax1).sort()).toEqual(Object.keys(datax4).sort())
		});
	});
});
