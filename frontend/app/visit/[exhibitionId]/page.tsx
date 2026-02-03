'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import FilePreviewModal from '@/components/ui/FilePreviewModal';
import { Eye, AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface Exhibition {
  id: number;
  name: string;
  location?: string;
  date?: string;
}

interface Product {
  id: number;
  name: string;
  attachment?: string;
}

export default function VisitorRegistrationPage() {
  const params = useParams();
  const exhibitionId = params.exhibitionId as string;

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // UI state
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    fileName: string;
    type: string;
  } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Fetch exhibition and products on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch exhibition details
        const exhibitionRes = await fetch(`http://localhost:8080/api/exhibitions/public/${exhibitionId}`)

        if (!exhibitionRes.ok) {
          throw new Error('Failed to load exhibition');
        }
        const exhibitionData = await exhibitionRes.json();
        setExhibition(exhibitionData);

        // Fetch products for exhibition
        const productsRes = await fetch(`http://localhost:8080/api/products/public`)

        if (!productsRes.ok) {
          throw new Error('Failed to load products');
        }
        const productsData = await productsRes.json();
        setProducts(productsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (exhibitionId) {
      fetchData();
    }
  }, [exhibitionId]);

  const handleProductToggle = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handlePreviewClick = (product: Product) => {
    if (product.attachment) {
      const extension = product.attachment.split('.').pop() || 'unknown';
      setPreviewFile({
        url: `https://example.com/files/${product.attachment}`,
        fileName: product.attachment,
        type: extension,
      });
      setIsPreviewOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch('http://localhost:8080/api/visitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          companyName: company,
          exhibitionId: Number(exhibitionId),
          productIds: selectedProducts,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit registration');
      }

      setSuccess(true);
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setSelectedProducts([]);

      // Show success message for 3 seconds then reset
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to submit registration'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = name && email && phone;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading exhibition details...</p>
        </Card>
      </div>
    );
  }

  if (error && !exhibition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="font-semibold text-gray-900">Error</h2>
              <p className="text-sm text-gray-600 mt-1">{error}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 py-8">
      <Card className="w-full max-w-2xl">
        {/* Exhibition Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 md:px-8 py-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {exhibition?.name}
          </h1>
          {(exhibition?.location || exhibition?.date) && (
            <p className="text-blue-100 text-sm md:text-base">
              {exhibition?.location && (
                <span>{exhibition.location}</span>
              )}
              {exhibition?.location && exhibition?.date && (
                <span> • </span>
              )}
              {exhibition?.date && <span>{exhibition.date}</span>}
            </p>
          )}
          <p className="text-blue-100 mt-4">
            Please fill the form below to receive product details
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8">
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900">
                  Registration Successful!
                </h3>
                <p className="text-sm text-green-800 mt-1">
                  Thank you for registering. We'll send you product details soon.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-sm text-red-800 mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Visitor Information */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="text-base"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="text-base"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="text-base"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Company Name <span className="text-gray-400">(Optional)</span>
                </label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={isSubmitting}
                  className="text-base"
                />
              </div>
            </div>

            {/* Interested Products */}
            {products.length > 0 && (
              <div className="pt-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Interested Products
                </h3>
                <div className="space-y-3">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        id={`product-${product.id}`}
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() =>
                          handleProductToggle(product.id)
                        }
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor={`product-${product.id}`}
                        className="flex-1 font-medium text-gray-700 cursor-pointer"
                      >
                        {product.name}
                      </label>
                      {product.attachment && (
                        <button
                          type="button"
                          onClick={() => handlePreviewClick(product)}
                          disabled={isSubmitting}
                          className="p-2 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Preview product details"
                        >
                          <Eye size={18} className="text-blue-600" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full mt-6"
              size="lg"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By submitting, you agree to receive information about this exhibition.
            </p>
          </form>
        </div>
      </Card>

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          fileUrl={previewFile.url}
          fileName={previewFile.fileName}
          fileType={previewFile.type}
        />
      )}
    </div>
  );
}
