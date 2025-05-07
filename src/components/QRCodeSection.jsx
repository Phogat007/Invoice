
import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeSection = ({ 
  data, 
  size = 128, 
  bgColor = "#FFFFFF", 
  fgColor = "#000000",
  includeCompanyName = true,
  includeAmount = true,
  includeDueDate = true,
  includeInvoiceNumber = true
}) => {
  
  // Format data for QR code
  const formatQRData = () => {
    const { invoice, yourCompany, grandTotal } = data;
    
    let qrData = {};
    
    if (includeInvoiceNumber && invoice?.number) {
      qrData.invoiceNumber = invoice.number;
    }
    
    if (includeCompanyName && yourCompany?.name) {
      qrData.company = yourCompany.name;
    }
    
    if (includeAmount && grandTotal) {
      qrData.amount = grandTotal;
    }
    
    if (includeDueDate && invoice?.paymentDate) {
      qrData.dueDate = invoice.paymentDate;
    }
    
    return JSON.stringify(qrData);
  };
  
  return (
    <div className="qr-code-container">
      <QRCode 
        value={formatQRData()}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level="H"
        className="rounded"
      />
    </div>
  );
};

export default QRCodeSection;
