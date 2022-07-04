import Web3x4 from '../web3.js/packages/web3/dist/src/web3'
import Web3x1 from '../web3.js.1.x/packages/web3'

describe('abi', () => {
    let web3x4: Web3x4
    let web3x1: Web3x1
    beforeAll(() => {
        web3x4 = new Web3x4()
        web3x1 = new Web3x1()
    })
    it('encodeFunctionCall', () => {
        const param1 = {
            name: 'myMethod',
            type: 'function',
            stateMutability: 'view',
            inputs: [{
                type: 'uint256',
                name: 'myNumber'
            }, {
                type: 'string',
                name: 'myString'
            }],
            outputs: [{
                type: 'uint256',
                name: 'myNumber'
            }, {
                type: 'string',
                name: 'myString'
            }]
        }
        const param2 = ['2345675643', 'Hello!%']

        const res4 = web3x4.eth.abi.encodeFunctionCall(param1, param2)
        // @ts-ignore
        const res1 = web3x1.eth.abi.encodeFunctionCall(param1, param2)
        expect(res1).toBe(res4)
    })
    it('encodeEventSignature', () => {
        const param1 = 'myEvent(uint256,bytes32)'
        const res4 = web3x4.eth.abi.encodeEventSignature(param1)
        const res1 = web3x1.eth.abi.encodeEventSignature(param1)
        expect(res1).toBe(res4)
    })
    it('encodeEventSignature v2', () => {
        const param1 ={
            name: 'myEvent',
            type: 'event',
            stateMutability: 'view',
            inputs: [{
                type: 'uint256',
                name: 'myNumber'
            },{
                type: 'bytes32',
                name: 'myBytes'
            }],
            outputs: [{
                type: 'uint256',
                name: 'myNumber'
            }, {
                type: 'string',
                name: 'myString'
            }]
        }
        const res4 = web3x4.eth.abi.encodeEventSignature(param1)
        // @ts-ignore
        const res1 = web3x1.eth.abi.encodeEventSignature(param1)
        expect(res1).toBe(res4)
    })
    it('encodeFunctionSignature', () => {
        const param1 ='myMethod(uint256,string)'
        const res4 = web3x4.eth.abi.encodeFunctionSignature(param1)
        const res1 = web3x1.eth.abi.encodeFunctionSignature(param1)
        expect(res1).toBe(res4)
    })
    it('encodeFunctionSignature v2', () => {
        const param1 ={
            name: 'myMethod',
            type: 'function',
            inputs: [{
                type: 'uint256',
                name: 'myNumber'
            },{
                type: 'string',
                name: 'myString'
            }],
            outputs: [{
                type: 'uint256',
                name: 'myNumber'
            }, {
                type: 'string',
                name: 'myString'
            }],
            stateMutability: 'view',
        }
        const res4 = web3x4.eth.abi.encodeFunctionSignature(param1)
        // @ts-ignore
        const res1 = web3x1.eth.abi.encodeFunctionSignature(param1)
        expect(res1).toBe(res4)
    })
    it('encodeParameter', () => {
        const param1='uint256'
        const param2 ='2345675643'
        const res4 = web3x4.eth.abi.encodeParameter(param1,param2)
        const res1 = web3x1.eth.abi.encodeParameter(param1,param2)
        expect(res1).toBe(res4)
        expect(res1).toBe('0x000000000000000000000000000000000000000000000000000000008bd02b7b')
    })
    it('encodeParameter v2', () => {
        const param1='bytes32'
        const param2 ='0xdf3234'
        const res4 = web3x4.eth.abi.encodeParameter(param1,param2)
        const res1 = web3x1.eth.abi.encodeParameter(param1,param2)
        expect(res1).toBe(res4)
        expect(res1).toBe('0xdf32340000000000000000000000000000000000000000000000000000000000')
    })
    it('encodeParameter v3', () => {
        const param1='bytes'
        const param2 ='0xdf3234'
        const res4 = web3x4.eth.abi.encodeParameter(param1,param2)
        const res1 = web3x1.eth.abi.encodeParameter(param1,param2)
        expect(res1).toBe(res4)
        expect(res1).toBe('0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003df32340000000000000000000000000000000000000000000000000000000000')
    })
    it('encodeParameter v4', () => {
        const param1='bytes32[]'
        const param2 =['0xdf3234', '0xfdfd']
        const res4 = web3x4.eth.abi.encodeParameter(param1,param2)
        const res1 = web3x1.eth.abi.encodeParameter(param1,param2)
        expect(res1).toBe(res4)
        expect(res1).toBe('0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002df32340000000000000000000000000000000000000000000000000000000000fdfd000000000000000000000000000000000000000000000000000000000000')
    })
    it('encodeParameter v5', () => {
        const param1={
            "ParentStruct": {
                "propertyOne": 'uint256',
                "propertyTwo": 'uint256',
                "childStruct": {
                    "propertyOne": 'uint256',
                    "propertyTwo": 'uint256'
                }
            }
        }
        const param2 ={
            "propertyOne": 42,
            "propertyTwo": 56,
            "childStruct": {
                "propertyOne": 45,
                "propertyTwo": 78
            }
        }
        const res4 = web3x4.eth.abi.encodeParameter(param1,param2)
        const res1 = web3x1.eth.abi.encodeParameter(param1,param2)
        expect(res1).toBe(res4)
        expect(res1).toBe('0x000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000002d000000000000000000000000000000000000000000000000000000000000004e')
    })
    it('encodeParameters', () => {
        const param1=['uint256','string']
        const param2 =['2345675643', 'Hello!%']
        const res4 = web3x4.eth.abi.encodeParameters(param1,param2)
        const res1 = web3x1.eth.abi.encodeParameters(param1,param2)
        expect(res1).toBe(res4)
        expect(res1).toBe('0x000000000000000000000000000000000000000000000000000000008bd02b7b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000')
    })
    it('encodeParameters v2', () => {
        const param1=['bytes32[]','bytes32']
        const param2 =[['0xdf3234', '0xfdfd'], '0x324567fff']
        const res4 = web3x4.eth.abi.encodeParameters(param1,param2)
        const res1 = web3x1.eth.abi.encodeParameters(param1,param2)
        expect(res1).toBe(res4)
        expect(res1).toBe('0x0000000000000000000000000000000000000000000000000000000000000040324567fff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002df32340000000000000000000000000000000000000000000000000000000000fdfd000000000000000000000000000000000000000000000000000000000000')
    })
    it('encodeParameters v3', () => {
        const param1=[
            'uint256',
            {
                "ParentStruct": {
                    "propertyOne": 'uint256',
                    "propertyTwo": 'uint256',
                    "childStruct": {
                        "propertyOne": 'uint256',
                        "propertyTwo": 'uint256'
                    }
                }
            }
        ]
        const param2 =[
            '2345675643',
            {
                "propertyOne": 42,
                "propertyTwo": 56,
                "childStruct": {
                    "propertyOne": 45,
                    "propertyTwo": 78
                }
            }
        ]
        const res4 = web3x4.eth.abi.encodeParameters(param1,param2)
        const res1 = web3x1.eth.abi.encodeParameters(param1,param2)
        expect(res1).toBe(res4)
        expect(res1).toBe('0x000000000000000000000000000000000000000000000000000000008bd02b7b000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000002d000000000000000000000000000000000000000000000000000000000000004e')
    })
    it('decodeParameter', () => {
        const param1='uint256'
        const param2 ='0x0000000000000000000000000000000000000000000000000000000000000010'
        const res4 = web3x4.eth.abi.decodeParameter(param1,param2)
        const res1 = web3x1.eth.abi.decodeParameter(param1,param2)
        expect(res1).toBe(res4)
        expect(res1).toBe('16')
    })
    it('decodeParameter v2', () => {
        const param1='string'
        const param2 ='0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000'
        const res4 = web3x4.eth.abi.decodeParameter(param1,param2)
        const res1 = web3x1.eth.abi.decodeParameter(param1,param2)
        expect(res1).toBe(res4)
        expect(res1).toBe('Hello!%!')
    })
    it('decodeParameter v3', () => {
        const param1={
            "ParentStruct": {
                "propertyOne": 'uint256',
                "propertyTwo": 'uint256',
                "childStruct": {
                    "propertyOne": 'uint256',
                    "propertyTwo": 'uint256'
                }
            }
        }
        const param2 ='0x000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000002d000000000000000000000000000000000000000000000000000000000000004e'
        const res4 = web3x4.eth.abi.decodeParameter(param1,param2) as any
        const res1 = web3x1.eth.abi.decodeParameter(param1,param2) as any
        expect(res1?.propertyOne).toBe(res4.propertyOne)
        expect(res1?.propertyTwo).toBe(res4.propertyTwo)
        expect(res1?.childStruct?.propertyOne).toEqual(res4.childStruct?.propertyOne)
        expect(res1?.childStruct?.propertyTwo).toEqual(res4.childStruct?.propertyTwo)
        expect(res4).toEqual({
                propertyOne: '42',
                propertyTwo: '56',
                childStruct: { propertyOne: '45', propertyTwo: '78' }
            }
        )
    })
    it('decodeParameters', () => {
        const param1=['string', 'uint256']
        const param2 ='0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000ea000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000'
        const res4 = web3x4.eth.abi.decodeParameters(param1,param2)
        const res1 = web3x1.eth.abi.decodeParameters(param1,param2)
        expect(res1[0]).toBe(res4[0])
        expect(res1[1]).toBe(res4[1])
        expect(res4).toEqual( ['Hello!%!', '234' ])
    })
    it('decodeParameters v2', () => {
        const param1=[{
            type: 'string',
            name: 'myString'
        },{
            type: 'uint256',
            name: 'myNumber'
        }]
        const param2 ='0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000ea000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000'
        const res4 = web3x4.eth.abi.decodeParameters(param1,param2)
        const res1 = web3x1.eth.abi.decodeParameters(param1,param2)
        expect(res1[0]).toBe(res4[0])
        expect(res1[1]).toBe(res4[1])
        expect(res4).toEqual(['Hello!%!','234'])
    })
    it('decodeParameters v3', () => {
        const param1 = [
            'uint8[]',
            {
                "ParentStruct": {
                    "propertyOne": 'uint256',
                    "propertyTwo": 'uint256',
                    "childStruct": {
                        "propertyOne": 'uint256',
                        "propertyTwo": 'uint256'
                    }
                }
            }
        ]
        const param2 = '0x00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000002d000000000000000000000000000000000000000000000000000000000000004e0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000018'
        const res4 = web3x4.eth.abi.decodeParameters(param1, param2) as unknown[]
        const res1 = web3x1.eth.abi.decodeParameters(param1, param2) as unknown[]

        expect(res1[0] as any [0]).toEqual(res4[0]as any[0])
        expect(res1[0] as any [1]).toEqual(res4[0]as any[1])
        expect((res1[1] as any)?.propertyOne).toEqual((res4[1] as any)?.propertyOne)
        expect((res1[1] as any)?.propertyTwo).toEqual((res4[1] as any)?.propertyTwo)
        expect((res1[1] as any)?.childStruct?.propertyOne).toEqual((res4[1] as any)?.childStruct?.propertyOne)
        expect((res1[1] as any)?.childStruct?.propertyTwo).toEqual((res4[1] as any)?.childStruct?.propertyTwo)
        expect(res4).toEqual([
                [ '42', '24' ],
                {
                    propertyOne: '42',
                    propertyTwo: '56',
                    childStruct: { propertyOne: '45', propertyTwo: '78' }
                }
            ]
        )
    })
    it('decodeLog', () => {
        const param1=[{
            type: 'string',
            name: 'myString'
        },{
            type: 'uint256',
            name: 'myNumber',
            indexed: true
        },{
            type: 'uint8',
            name: 'mySmallNumber',
            indexed: true
        }]
        const param2 ='0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000748656c6c6f252100000000000000000000000000000000000000000000000000'
        const param3 = ['0x000000000000000000000000000000000000000000000000000000000000f310', '0x0000000000000000000000000000000000000000000000000000000000000010']
        const res4 = web3x4.eth.abi.decodeLog(param1,param2,param3)
        const res1 = web3x1.eth.abi.decodeLog(param1,param2,param3)
        expect(res1).toEqual(res4)
        expect(res1).toEqual({
            '0': 'Hello%!',
            '1': '62224',
            '2': '16',
            "__length__": 3,
            myString: 'Hello%!',
            myNumber: '62224',
            mySmallNumber: '16'
        })
    })
});
