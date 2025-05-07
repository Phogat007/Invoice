
import React from 'react';
import { getTemplate } from '../utils/templateRegistry';

const InvoiceTemplate = ({ data, templateNumber, showQRCode = false, qrCodeOptions = {} }) => {
  const Template = getTemplate(templateNumber);
  return <Template data={data} showQRCode={showQRCode} qrCodeOptions={qrCodeOptions} />;
};

export default InvoiceTemplate;
