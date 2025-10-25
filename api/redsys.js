// IMPORT CORRECTO PARA CommonJS
import redsysEasy from 'redsys-easy';
const { createRedsys } = redsysEasy;

const TEST_SECRET = 'sq7HjrUOBfKmC576ILgskD5srU870gJ7'; // clave PRUEBAS

const redsys = createRedsys({
  secretKey: process.env.REDSYS_KEY || TEST_SECRET,
});

export default async function handler(req, res) {
  const { amount = '100', order = '12345678' } = req.query;

  const params = {
    DS_MERCHANT_AMOUNT: amount,                 // céntimos
    DS_MERCHANT_ORDER: order,                   // 4–12 chars, 4 primeros numéricos
    DS_MERCHANT_MERCHANTCODE: process.env.REDSYS_FUC || '999008881', // FUC PRUEBAS
    DS_MERCHANT_CURRENCY: '978',
    DS_MERCHANT_TRANSACTIONTYPE: '0',
    DS_MERCHANT_TERMINAL: '1',
    DS_MERCHANT_MERCHANTURL: 'https://example.com/notify',
    DS_MERCHANT_URLOK: 'https://example.com/ok',
    DS_MERCHANT_URLKO: 'https://example.com/ko'
  };

  const Ds_MerchantParameters = redsys.createMerchantParameters(params);
  const Ds_Signature = redsys.createMerchantSignature(params);

  res.status(200).json({
    Ds_SignatureVersion: 'HMAC_SHA256_V1',
    Ds_MerchantParameters,
    Ds_Signature,
    redsysUrl: 'https://sis-t.redsys.es:25443/sis/realizarPago'
  });
}
