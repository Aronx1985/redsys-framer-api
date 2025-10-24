import { createRedsys } from 'redsys-easy';

const redsys = createRedsys({
  secretKey: process.env.REDSYS_KEY,
});

export default async function handler(req, res) {
  const { amount = '100', order = '99999999' } = req.query;

  const params = {
    DS_MERCHANT_AMOUNT: amount,
    DS_MERCHANT_ORDER: order,
    DS_MERCHANT_MERCHANTCODE: process.env.REDSYS_FUC,
    DS_MERCHANT_CURRENCY: '978',
    DS_MERCHANT_TRANSACTIONTYPE: '0',
    DS_MERCHANT_TERMINAL: '1',
    DS_MERCHANT_MERCHANTURL: 'https://tusitio.com/api/notify',
    DS_MERCHANT_URLOK: 'https://tusitioframer.com/pago-ok',
    DS_MERCHANT_URLKO: 'https://tusitioframer.com/pago-ko',
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
