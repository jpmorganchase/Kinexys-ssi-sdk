import { randomBytes } from "crypto";
import { DIDMethodFailureError } from "../../../src/errors";
import { EthrDIDMethod } from "../../../src/services/common";
import { KEY_ALG } from "../../../src/utils";


describe('did:ethr utilities', () => {

    let ethrDidMethod: EthrDIDMethod
    
    const SAMPLE_DID = {
        did: 'did:ethr:maticmum:0x076231A475b8F905f71f45580bD00642025c4e0D',
        keyPair: {
            algorithm: KEY_ALG.ES256K,
            publicKey: '02f034136f204a02045c17f977fa9ac36362fe5a86524b464a56a26cbfb0754e23',
            privateKey: '0xd42a4eacb5cf7758ae07e12f3b3971b643b6c78f18972eb5444ffd66e03bac15'
        }
    }

    const DID_DOC = {
        didDocumentMetadata: {},
        didResolutionMetadata: { contentType: 'application/did+ld+json' },
        didDocument: {
        }
    }

    beforeAll(async () => {
        ethrDidMethod = new EthrDIDMethod({
            registry: '0x46149ec0222143d17A39D662415aA1531f93485E',
            name: 'matic',
            rpcUrl: 'https://rpc-amoy.polygon.technology/'
        })
    })

    it('Rejects generation from non-hex private key', async () => {
        const pk = await randomBytes(64)
        await expect(ethrDidMethod.generateFromPrivateKey(pk))
            .rejects.toThrowError(DIDMethodFailureError)
    })

    it('Resolution fails with did:key', async () => {
        const didKey = 'did:key:z6Mkmo5LhWKseUg9SnDrfAirNqeL6LWX5DhFXF4RpQQprQNR'
        expect(ethrDidMethod.resolve(didKey))
            .rejects.toThrowError(DIDMethodFailureError)
    })

    it('Successfully extract did:ethr:maticmum identifier', async () => {
        expect(ethrDidMethod.getIdentifier('did:ethr:maticmum:0xDE5e9Cb48C36e3D53514CF24bcD987cD963f9B02'))
            .toEqual('0xDE5e9Cb48C36e3D53514CF24bcD987cD963f9B02')
        expect(true).toEqual(true)
    })

    it('Successfully extract did:ethr identifier', async () => {
        expect(ethrDidMethod.getIdentifier('did:ethr:0xDE5e9Cb48C36e3D53514CF24bcD987cD963f9B02'))
            .toEqual('0xDE5e9Cb48C36e3D53514CF24bcD987cD963f9B02')
        expect(true).toEqual(true)
    })

    it('Fails to extract incorrect did:ethr identifier', async () => {
        expect(() => ethrDidMethod.getIdentifier('did:ethr:maticmum:0xDE5e9Cb48C36e3D53514CF24bcD987cD963f9B0'))
            .toThrowError(DIDMethodFailureError)
    })

    it('Fails to extract incorrect did:ethr identifier', async () => {
        expect(() => ethrDidMethod.getIdentifier('did:0xDE5e9Cb48C36e3D53514CF24bcD987cD963f9B02'))
            .toThrowError(DIDMethodFailureError)
    })

    it('Successfully checks did:ethr isActive', async () => {
        ethrDidMethod.resolve = jest.fn().mockResolvedValueOnce(DID_DOC)
        const res = await ethrDidMethod.isActive(SAMPLE_DID.did)
        expect(res).toBeTruthy()
    })

    it('Successfully checks active did:ethr isActive', async () => {
        ethrDidMethod.resolve = jest.fn().mockResolvedValueOnce({...DID_DOC, didDocumentMetadata:  { deactivated: false, versionId: '35961950', updated: '2023-05-23T20:59:17Z' }})
        const res = await ethrDidMethod.isActive(SAMPLE_DID.did)
        expect(res).toBeTruthy()
    })

    it('Successfully checks deactivated did:ethr isActive', async () => {
        ethrDidMethod.resolve = jest.fn().mockResolvedValueOnce({...DID_DOC, didDocumentMetadata:  { deactivated: true, versionId: '35961950', updated: '2023-05-23T20:59:17Z' }})
        const res = await ethrDidMethod.isActive(SAMPLE_DID.did)
        expect(res).toBeFalsy()
    })
})