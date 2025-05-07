
import React from 'react';
import QRCodeSection from '../QRCodeSection';

const BaseTemplate = ({ data, children, showQRCode = false, qrCodeOptions = {} }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-lg mx-auto"
      style={{ width: "794px", height: "1123px", position: "relative" }}
    >
      {children}
      {showQRCode && (
        <div className="absolute bottom-4 right-4">
          <QRCodeSection data={data} {...qrCodeOptions} />
        </div>
      )}
    </div>
  );
};

export default BaseTemplate;
