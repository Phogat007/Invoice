
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, QrCode } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import InvoiceTemplate from '../components/InvoiceTemplate';
import { generatePDF } from '../utils/pdfGenerator';
import { templates } from '../utils/templateRegistry';

const TemplatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [currentTemplate, setCurrentTemplate] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeOptions, setQRCodeOptions] = useState({
    size: 128,
    includeCompanyName: true,
    includeAmount: true,
    includeDueDate: true,
    includeInvoiceNumber: true
  });

  useEffect(() => {
    if (location.state && location.state.formData) {
      setFormData(location.state.formData);
      setCurrentTemplate(location.state.selectedTemplate || 1);
    } else {
      // If no form data in location state, try to load from localStorage
      const savedFormData = localStorage.getItem('formData');
      if (savedFormData) {
        setFormData(JSON.parse(savedFormData));
      }
    }
  }, [location.state]);

  const handleTemplateChange = (templateNumber) => {
    setCurrentTemplate(templateNumber);
  };

  const handleQROptionChange = (option) => {
    setQRCodeOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleDownloadPDF = async () => {
    if (formData && !isDownloading) {
      setIsDownloading(true);
      try {
        await generatePDF(formData, currentTemplate, showQRCode, qrCodeOptions);
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handleDownloadPDF} disabled={isDownloading}>
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            "Download PDF"
          )}
        </Button>
      </div>

      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-4">
          {templates.map((template, index) => (
            <div
              key={index}
              className={`cursor-pointer p-4 border rounded ${
                currentTemplate === index + 1
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
              onClick={() => handleTemplateChange(index + 1)}
            >
              {template.name}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox 
            id="qrcode-toggle" 
            checked={showQRCode} 
            onCheckedChange={() => setShowQRCode(!showQRCode)} 
          />
          <label htmlFor="qrcode-toggle" className="cursor-pointer flex items-center">
            <QrCode className="h-4 w-4 mr-2" />
            Include QR Code
          </label>
        </div>
        
        {showQRCode && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">QR Code Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox 
                  id="qr-invoice-number" 
                  checked={qrCodeOptions.includeInvoiceNumber}
                  onCheckedChange={() => handleQROptionChange('includeInvoiceNumber')} 
                />
                <label htmlFor="qr-invoice-number" className="ml-2 text-sm">Include Invoice Number</label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="qr-company-name" 
                  checked={qrCodeOptions.includeCompanyName}
                  onCheckedChange={() => handleQROptionChange('includeCompanyName')} 
                />
                <label htmlFor="qr-company-name" className="ml-2 text-sm">Include Company Name</label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="qr-amount" 
                  checked={qrCodeOptions.includeAmount}
                  onCheckedChange={() => handleQROptionChange('includeAmount')} 
                />
                <label htmlFor="qr-amount" className="ml-2 text-sm">Include Amount</label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="qr-due-date" 
                  checked={qrCodeOptions.includeDueDate}
                  onCheckedChange={() => handleQROptionChange('includeDueDate')} 
                />
                <label htmlFor="qr-due-date" className="ml-2 text-sm">Include Due Date</label>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-[210mm] h-[297mm] mx-auto border shadow-lg">
        <InvoiceTemplate 
          data={formData} 
          templateNumber={currentTemplate} 
          showQRCode={showQRCode}
          qrCodeOptions={qrCodeOptions}
        />
      </div>
    </div>
  );
};

export default TemplatePage;
