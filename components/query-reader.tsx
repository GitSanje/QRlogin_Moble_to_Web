"use client"
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { QrReader } from 'react-qr-reader';
import Image from 'next/image';
import jsQR from "jsqr";

const QueryReader = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            
            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleQRScanResult = (result: any) => {
        if (result) {
            setScannedData(result.text); // Store the scanned QR code data
        }
    };

    const handleQRScanError = (error: any) => {
        console.info(error); // Log any errors encountered during scanning
    };
    const handleQRUpload = async () => {
        if (selectedFile) {
          setIsUploading(true);
          const reader = new FileReader();
          reader.onloadend = async () => {
            const img = document.createElement('img');

            img.src = reader.result as string;
            img.onload = () => {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              canvas.width = img.width;
              canvas.height = img.height;
              ctx?.drawImage(img, 0, 0, img.width, img.height);
              const imageData = ctx?.getImageData(0, 0, img.width, img.height);
              if (imageData) {
                const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
                if (qrCode) {
                  setScannedData(qrCode.data);
                //   alert(`QR Code scanned: ${qrCode.data}`);
                } else {
                  alert("No QR code found in the image.");
                }
              }
            };
          };
          reader.readAsDataURL(selectedFile);
          setIsUploading(false);
        }
      };


    
    return (
        <div className="container mx-auto px-4 py-8 max-w-md">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-4">QR Code Upload</h1>
                <p className="text-gray-600">Upload a QR code to authenticate</p>
            </div>

            <div className="mb-4">
                <Input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full"
                />
            </div>

            {previewUrl && (
                <div className="mb-4 flex justify-center">
                    <Image 
                        src={previewUrl} 
                        alt="QR Code Preview" 
                        width={250} 
                        height={250} 
                        className="object-contain rounded-lg"
                    />
                </div>
            )}

            {/* QR Reader component */}
            {/* {selectedFile && (
                <div className="mb-4">
                    <QrReader
                        onResult={(result, error) => {
                            if (!!result) {
                                handleQRScanResult(result); // Handle successful scan
                            }

                            if (!!error) {
                                handleQRScanError(error); // Handle scan error
                            }
                        }}
                        style={{ width: '100%' }}
                    />
                    {scannedData && (
                        <p className="mt-2 text-center text-lg font-semibold">{scannedData}</p>
                    )}
                </div>
            )} */}


{scannedData && (
        <div className="mt-6 text-center">
          <h4 className="text-lg font-bold">Scanned QR Code Data:</h4>
          <p className="text-gray-700">{scannedData}</p>
        </div>
      )}
            <div className="space-y-4">
                <Button 
                    disabled={!selectedFile || isUploading}
                    className="w-full"
                    onClick={handleQRUpload}
                >
                    {isUploading ? 'Processing...' : 'Upload QR Code'}
                </Button>

                <Button 
                    variant="destructive"
                    className="w-full"
                >
                    Logout
                </Button>
            </div>
        </div>
    );
}

export default QueryReader;