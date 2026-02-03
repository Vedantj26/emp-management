'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Download, AlertCircle } from 'lucide-react';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType?: string;
}

export default function FilePreviewModal({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileType,
}: FilePreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Determine file type from extension if not provided
  const getFileExtension = (name: string): string => {
    return name.split('.').pop()?.toLowerCase() || '';
  };

  const extension = fileType || getFileExtension(fileName);
  const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension);
  const isPdf = extension === 'pdf';

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(false);
    }
  }, [isOpen, fileUrl]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="truncate">{fileName}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center min-h-96 bg-gray-50 rounded-lg p-6">
          {isLoading && !error && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-600">Loading preview...</p>
            </div>
          )}

          {isImage && !error && (
            <>
              <img
                src={fileUrl || "/placeholder.svg"}
                alt={fileName}
                onLoad={handleImageLoad}
                onError={handleImageError}
                className="max-w-full max-h-96 object-contain rounded"
              />
            </>
          )}

          {isPdf && !error && (
            <>
              <iframe
                src={fileUrl}
                title={fileName}
                className="w-full h-96 rounded border border-gray-200"
                onLoad={() => setIsLoading(false)}
                onError={handleImageError}
              />
            </>
          )}

          {!isImage && !isPdf && !error && (
            <div className="flex flex-col items-center gap-4">
              {isLoading ? (
                <>
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-sm text-gray-600">Preparing download...</p>
                </>
              ) : (
                <>
                  <FileText size={48} className="text-gray-400" />
                  <p className="text-sm text-gray-600 text-center">
                    Preview not available for this file type
                  </p>
                  <Button onClick={handleDownload} className="gap-2">
                    <Download size={16} />
                    Download File
                  </Button>
                </>
              )}
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-4">
              <AlertCircle size={48} className="text-red-400" />
              <p className="text-sm text-gray-600 text-center">
                Failed to load preview
              </p>
              <Button onClick={handleDownload} variant="outline" className="gap-2 bg-transparent">
                <Download size={16} />
                Download File
              </Button>
            </div>
          )}
        </div>

        {/* <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleDownload} className="gap-2">
            <Download size={16} />
            Download
          </Button>
        </div> */}
      </DialogContent>
    </Dialog>
  );
}
