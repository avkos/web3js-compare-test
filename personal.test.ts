import Web3Personalx4 from '../web3.js/packages/web3-eth-personal/dist'
import Web3x1 from '../web3.js.1.x/packages/web3'
import {create as createAccount} from '../web3.js/packages/web3-eth-accounts';
import Web3Eth from '../web3.js/packages/web3-eth';

export const createNewAccount = async (): Promise<{ address: string; privateKey: string }> => {
    const acc = createAccount();

    let clientUrl = 'http://127.0.0.1:8545'

    const web3Personal = new Web3Personalx4(clientUrl);
    await web3Personal.importRawKey(
        acc.privateKey.slice(2),
        '123456',
    );
    await web3Personal.unlockAccount(acc.address, '123456', 1000);

    const web3Eth = new Web3Eth(clientUrl);
    const accList = await web3Personal.getAccounts();
    await web3Eth.sendTransaction({
        from: accList[0],
        to: acc.address,
        value: '1000000000000000000',
    });

    return {address: acc.address, privateKey: acc.privateKey};
};
describe('personal', () => {
    let personalx4: Web3Personalx4
    let personalx1: any
    let provider: string
    beforeAll(() => {
        personalx4 = new Web3Personalx4('http://127.0.0.2:8545')
        // @ts-ignore
        personalx1 = new Web3x1.modules.Personal('http://127.0.0.2:8545')
        provider = 'http://127.0.0.1:8545'
        personalx4.setProvider(provider)
        personalx1.setProvider(provider)
    })
    it('setProvider', () => {
        const res4 = personalx4.setProvider(provider)
        const res1 = personalx1.setProvider(provider)
        expect(res1).toBe(true)
        expect(res4).toBe(true)
        expect(res1).toBe(res4)
        expect((personalx4?.provider as any)?.clientUrl).toBe(provider)
        expect((personalx4?.provider as any)?.clientUrl).toBe(personalx1.currentProvider.host)
    })

    it('providers', () => {
        expect(Object.keys(personalx1.providers).sort()).toEqual(Object.keys(personalx4.providers).sort())
    })

    it('givenProvider', () => {
        expect(personalx1.givenProvider).toBe(null)
        expect(personalx4.givenProvider).toBe(undefined)
    })
    it('currentProvider', () => {
        expect(personalx1.currentProvider.host).toBe(provider)
        expect(personalx1.currentProvider.host).toBe((personalx4?.currentProvider as any).clientUrl)
    })
    it('newAccount', async () => {
        const pass = 'somePass'
        const res1 = await personalx1.newAccount(pass)
        const res2 = await personalx4.newAccount(pass)
        expect(res1.length).toBe(res2.length)
    })
    it('sign', async () => {
        const pass = 'somePass'
        const acc1 = await personalx1.newAccount(pass)
        const acc4 = await personalx4.newAccount(pass)
        const str = "Hello world"
        const res1 = await personalx1.sign(str, acc1, pass)
        const res4 = await personalx4.sign(str, acc4, pass)
        expect(res1.length).toBe(res4.length)
    })
    it('recover', async () => {
        const pass = 'somePass'
        const acc1 = await personalx1.newAccount(pass)
        const acc4 = await personalx4.newAccount(pass)
        const str = "Hello world"
        const res1 = await personalx1.sign(str, acc1, pass)
        const res4 = await personalx4.sign(str, acc4, pass)
        expect(res1.length).toBe(res4.length)

        expect((await personalx1.ecRecover(str, res1)).toLowerCase()).toBe(acc1.toLowerCase())
        expect((await personalx4.ecRecover(str, res4)).toLowerCase()).toBe(acc4.toLowerCase())

    })
    it('sendTransaction', async () => {
        const fromAcc = await createNewAccount()
        const pass = '123456'
        const acc1 = await personalx1.newAccount(pass)
        const acc4 = await personalx4.newAccount(pass)
        const res1 = await personalx1.sendTransaction({
            from: fromAcc.address,
            gasPrice: "20000000000",
            gas: "21000",
            to: acc1,
            value: "10",
            data: ""
        }, pass)
        const res4 = await personalx4.sendTransaction({
            from: fromAcc.address,
            gasPrice: "20000000000",
            gas: "21000",
            to: acc4,
            value: "10",
            data: ""
        }, pass)
        expect(res1.length).toBe(res4.length)
    })
    it('unlockAccount', async () => {
        const pass = '123456'
        const acc1 = await personalx1.newAccount(pass)
        const acc4 = await personalx4.newAccount(pass)
        const res1 = await personalx1.unlockAccount(acc1, pass, 1000);
        const res4 = await personalx4.unlockAccount(acc4, pass, 1000);
        expect(res1).toBe(res4)
        expect(res4).toBe(true)
    })
    it('lockAccount', async () => {
        const pass = '123456'
        const acc1 = await personalx1.newAccount(pass)
        const acc4 = await personalx4.newAccount(pass)
        await personalx1.unlockAccount(acc1, pass, 1000);
        await personalx4.unlockAccount(acc4, pass, 1000);
        const res1 = await personalx1.lockAccount(acc1);
        const res4 = await personalx4.lockAccount(acc4);
        expect(res1).toBe(res4)
        expect(res4).toBe(true)
    })
    it('getAccounts', async () => {
        const list1 = await personalx1.getAccounts()
        const list4 = await personalx4.getAccounts()
        expect(list1).toEqual(list4)
    })
    it('importRawKey', async () => {
        const acc1 = createAccount();
        const acc2 = createAccount();
        const res1 = await personalx1.importRawKey(acc1.privateKey.slice(2), '123456')
        const res4 = await personalx4.importRawKey(acc2.privateKey.slice(2), '123456')
        expect(res1.length).toEqual(res4.length)
    })

});
