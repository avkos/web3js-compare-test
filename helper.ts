type SendFewTxParams = {
    web3Eth: any;
    to: string;
    from: string;
    value: string;
    times?: number;
};
export type Resolve = (value?: any) => void;
export const sendFewTxes = async ({
                                      web3Eth,
                                      to,
                                      value,
                                      from,
                                      times = 3,
                                  }: SendFewTxParams): Promise<any[]> => {
    const res: any[] = [];
    for (let i = 0; i < times; i += 1) {
        const tx: any = web3Eth.sendTransaction({
            to,
            value,
            from,
        });
        res.push(
            // eslint-disable-next-line no-await-in-loop
            (await new Promise((resolve: Resolve) => {
                // tx promise is handled separately
                // eslint-disable-next-line no-void
                void tx.on('receipt', (params: any) => {
                    expect(params.status).toBe(BigInt(1));
                    resolve(params);
                });
            })) as any,
        );
    }

    return res;
};
