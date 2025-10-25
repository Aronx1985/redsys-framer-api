// CommonJS puro
const { createRedsys } = require('redsys-easy');

const TEST_SECRET = 'sq7HjrUOBfKmC576ILgskD5srU870gJ7'; // clave PRUEBAS

const redsys = createRedsys({
  secretKey: process.env.REDSYS_KEY || TEST_SECRET,
});

module.exports = async function (req, res) {
  try {
    const q = req.query || {};
    const amount = String(q.amount || '100');       // céntimos
    const order  = String(q.order  || '12345678');  // 4–12 chars, 4 primeros numéricos

    const params = {
      DS_MERCHANT_AMOUNT: amount,
      DS_MERCHANT_ORDER: order,
      DS_MERCHANT_MERCHANTCODE: process.env.REDSYS_FUC || '999008881',
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
  } catch (e) {
    res.status(500).json({ ok:false, error: String(e) });
  }
};
