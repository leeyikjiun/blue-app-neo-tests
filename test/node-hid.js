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
    const [publicKey] = await exchange(dongle, Buffer.from(`8004000014${bipp44_path}`, 'hex'));
    console.log(`publicKey [${publicKey.length}]`, publicKey.toString('hex'));
  });

  it('gets signed public key', async () => {
    const [signedPublicKey] = await exchange(dongle, Buffer.from(`8008000014${bipp44_path}`, 'hex'));
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

  // NEP-5
  //                       80020000ffd1014f0400e1f505143775292229eccdf904f16fff8e83e7cffdc0f0ce14175342b16a9ad150e200dc1d2c9d19052013773153c1087472616e736665726711c4d1f4fba619f2628870d36e3a9773e874705b00000000000000000001ceab6ef5c594711114ca99ae8c24afe3b673eb34a43ca50276cab6b04fc84780010002e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c6001000000000000003177132005199d2c1ddc00e250d19a6ab1425317e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c60dfee424e00000000175342b16a9ad150e200dc1d2c9d190520137731008000002c80000378
  //                       800280000c800000000000000000000000
  const textToSign_03 = Buffer.from(`d1014f0400e1f505143775292229eccdf904f16fff8e83e7cffdc0f0ce14175342b16a9ad150e200dc1d2c9d19052013773153c1087472616e736665726711c4d1f4fba619f2628870d36e3a9773e874705b00000000000000000001ceab6ef5c594711114ca99ae8c24afe3b673eb34a43ca50276cab6b04fc84780010002e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c6001000000000000003177132005199d2c1ddc00e250d19a6ab1425317e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c60dfee424e00000000175342b16a9ad150e200dc1d2c9d19052013773100${bipp44_path}`, 'hex');

  // too big TX, should generate error 0x6D08
  const textToSign_04 = Buffer.from(`${'0200048d121f4bc2bf104e547e85d680780fe629c2b3ce89ac73e0ff02feb572bb98e00000e47d4e3d0563a53232466fa7752b28db6c0485ee79e57dacb2646418f4e7ffd400002101dd269ec13b66360b29eb6ac78ba44b772b2b6369b7dd5ff8dcd5dd1aafa00000a5c04ecb7ff482474062fe0cbe030e653c77d28545a38490780f33be7469cdae0000000001e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c60276501000000000013354f4f5d3f989a221c794271e0bb2471c2735e'
                    + '0200048d121f4bc2bf104e547e85d680780fe629c2b3ce89ac73e0ff02feb572bb98e00000e47d4e3d0563a53232466fa7752b28db6c0485ee79e57dacb2646418f4e7ffd400002101dd269ec13b66360b29eb6ac78ba44b772b2b6369b7dd5ff8dcd5dd1aafa00000a5c04ecb7ff482474062fe0cbe030e653c77d28545a38490780f33be7469cdae0000000001e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c60276501000000000013354f4f5d3f989a221c794271e0bb2471c2735e'
                    + '0200048d121f4bc2bf104e547e85d680780fe629c2b3ce89ac73e0ff02feb572bb98e00000e47d4e3d0563a53232466fa7752b28db6c0485ee79e57dacb2646418f4e7ffd400002101dd269ec13b66360b29eb6ac78ba44b772b2b6369b7dd5ff8dcd5dd1aafa00000a5c04ecb7ff482474062fe0cbe030e653c77d28545a38490780f33be7469cdae0000000001e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c60276501000000000013354f4f5d3f989a221c794271e0bb2471c2735e'
                    + '0200048d121f4bc2bf104e547e85d680780fe629c2b3ce89ac73e0ff02feb572bb98e00000e47d4e3d0563a53232466fa7752b28db6c0485ee79e57dacb2646418f4e7ffd400002101dd269ec13b66360b29eb6ac78ba44b772b2b6369b7dd5ff8dcd5dd1aafa00000a5c04ecb7ff482474062fe0cbe030e653c77d28545a38490780f33be7469cdae0000000001e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c60276501000000000013354f4f5d3f989a221c794271e0bb2471c2735e'
                    + '0200048d121f4bc2bf104e547e85d680780fe629c2b3ce89ac73e0ff02feb572bb98e00000e47d4e3d0563a53232466fa7752b28db6c0485ee79e57dacb2646418f4e7ffd400002101dd269ec13b66360b29eb6ac78ba44b772b2b6369b7dd5ff8dcd5dd1aafa00000a5c04ecb7ff482474062fe0cbe030e653c77d28545a38490780f33be7469cdae0000000001e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c60276501000000000013354f4f5d3f989a221c794271e0bb2471c2735e'
                    + '0200048d121f4bc2bf104e547e85d680780fe629c2b3ce89ac73e0ff02feb572bb98e00000e47d4e3d0563a53232466fa7752b28db6c0485ee79e57dacb2646418f4e7ffd400002101dd269ec13b66360b29eb6ac78ba44b772b2b6369b7dd5ff8dcd5dd1aafa00000a5c04ecb7ff482474062fe0cbe030e653c77d28545a38490780f33be7469cdae0000000001e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c60276501000000000013354f4f5d3f989a221c794271e0bb2471c2735e'}${
    bipp44_path}`, 'hex');

  const textToSignArray = [
    textToSign_00,
    textToSign_01,
    textToSign_02,
    textToSign_03,
    textToSign_04,
  ];

  Object.entries(textToSignArray).forEach(([name, textToSign]) => {
    it(name, async () => {
      let chunk;
      let p1;
      let sw;
      let offset = 0;

      while (offset !== textToSign.length) {
        if (textToSign.length - offset > 250) {
          chunk = textToSign.slice(offset, offset + 250);
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
