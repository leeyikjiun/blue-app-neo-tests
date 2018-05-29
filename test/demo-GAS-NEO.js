const { default: LedgerNode } = require('@ledgerhq/hw-transport-node-hid');

const bipp44_path =
               '8000002C'
              + '80000378'
              + '80000000'
              + '00000000'
              + '00000000';

describe('', () => {
  let dongle;
  let signature;

  before(async () => {
    const paths = await LedgerNode.list();
    dongle = await LedgerNode.open(paths[0]);
  });

  after(async () => {
    await dongle.close();
  });

  it('gets public key', async () => {
    const [publicKey] = await exchange(dongle, Buffer.from(`80040000FF${bipp44_path}`, 'hex'));
    console.log(`publicKey [${publicKey.length}]`, publicKey.toString('hex'));
  });

  it('gets signed public key', async () => {
    const [signedPublicKey] = await exchange(dongle, Buffer.from(`80080000FF${bipp44_path}`, 'hex'));
    console.log(`signedPublicKey [${signedPublicKey.length}]`, signedPublicKey.toString('hex'));
    signature = signedPublicKey.slice(67);
  });

  it('gets signature', () => {
    console.log(`signature [${signature.length}]`, signature.toString('hex'));
  });

  // sending to AHXSMB19pWytwJ7vzvCw5aWmd1DUniDKRT
  // sending 0.001 GAS
  //                       80028000b38000000185e7e907cc5c5683e7fc926ba4be613d1810aebe14686b3675ee27d2476e5201000002e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c60a08601000000000013354f4f5d3f989a221c794271e0bb2471c2735ee72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c60e23f01000000000013354f4f5d3f989a221c794271e0bb2471c2735e8000002c80000378800000000000000000000000
  const textToSign_00 = Buffer.from(`8000000185e7e907cc5c5683e7fc926ba4be613d1810aebe14686b3675ee27d2476e5201000002e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c60a08601000000000013354f4f5d3f989a221c794271e0bb2471c2735ee72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c60e23f01000000000013354f4f5d3f989a221c794271e0bb2471c2735e${bipp44_path}`, 'hex');

  // sending 1 NEO
  //                             8002800077800000018d121f4bc2bf104e547e85d680780fe629c2b3ce89ac73e0ff02feb572bb98e00000019b7cffdaa674beae0f930ebe6085af9093e5fe56b34a5c220ccdcf6efc336fc500e1f5050000000013354f4f5d3f989a221c794271e0bb2471c2735e8000002c80000378800000000000000000000000
  const textToSign_01 = Buffer.from(`800000018d121f4bc2bf104e547e85d680780fe629c2b3ce89ac73e0ff02feb572bb98e00000019b7cffdaa674beae0f930ebe6085af9093e5fe56b34a5c220ccdcf6efc336fc500e1f5050000000013354f4f5d3f989a221c794271e0bb2471c2735e${bipp44_path}`, 'hex');

  // claiming GAS
  //                       80028000de0200048d121f4bc2bf104e547e85d680780fe629c2b3ce89ac73e0ff02feb572bb98e00000e47d4e3d0563a53232466fa7752b28db6c0485ee79e57dacb2646418f4e7ffd400002101dd269ec13b66360b29eb6ac78ba44b772b2b6369b7dd5ff8dcd5dd1aafa00000a5c04ecb7ff482474062fe0cbe030e653c77d28545a38490780f33be7469cdae0000000001e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c60276501000000000013354f4f5d3f989a221c794271e0bb2471c2735e8000002c80000378800000000000000000000000
  const textToSign_02 = Buffer.from(`0200048d121f4bc2bf104e547e85d680780fe629c2b3ce89ac73e0ff02feb572bb98e00000e47d4e3d0563a53232466fa7752b28db6c0485ee79e57dacb2646418f4e7ffd400002101dd269ec13b66360b29eb6ac78ba44b772b2b6369b7dd5ff8dcd5dd1aafa00000a5c04ecb7ff482474062fe0cbe030e653c77d28545a38490780f33be7469cdae0000000001e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c60276501000000000013354f4f5d3f989a221c794271e0bb2471c2735e${bipp44_path}`, 'hex');

  const textToSignArray = [textToSign_00, textToSign_01, textToSign_02];

  textToSignArray.forEach((textToSign) => {
    it('', async () => {
      let chunk;
      let p1;
      let sw;
      let offset = 0;

      while (offset !== textToSign.length) {
        if (textToSign.length - offset > 255) {
          chunk = textToSign.slice(offset, offset + 255);
        } else {
          chunk = textToSign.slice(offset);
        }
        if (offset + chunk.length === textToSign.length) {
          p1 = '80';
        } else {
          p1 = '00';
        }
        const apdu = Buffer.concat([Buffer.from(`8002${p1}00${chunk.length.toString(16)}`, 'hex'), chunk]);
        [signature, sw] = await exchange(dongle, apdu);
        offset += chunk.length;
      }
      sw = sw.toString('hex');
      if (sw === '9000') {
        console.log(`signature ${signature.toString('hex')}`);
      } else if (sw === '6985') {
        console.log('Aborted by user');
      } else {
        console.log(`Invalid status ${sw}`);
      }
    });
  });
});

async function exchange(dongle, apdu) {
  console.log('HID =>', apdu.toString('hex'));
  const response = await dongle.exchange(apdu);
  console.log('HID <=', response.toString('hex'));
  return [response.slice(0, response.length - 2), response.slice(response.length - 2)];
}
