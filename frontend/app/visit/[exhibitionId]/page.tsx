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
import { toast } from '@/hooks/use-toast';
import { startGlobalLoader, stopGlobalLoader } from '@/hooks/use-global-loader';

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
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [cityState, setCityState] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [companyType, setCompanyType] = useState<string[]>([]);
  const [companyTypeOther, setCompanyTypeOther] = useState('');
  const [industry, setIndustry] = useState<string[]>([]);
  const [industryOther, setIndustryOther] = useState('');
  const [companySize, setCompanySize] = useState<string[]>([]);
  const [interestAreas, setInterestAreas] = useState<string[]>([]);
  const [solutions, setSolutions] = useState<string[]>([]);
  const [solutionsOther, setSolutionsOther] = useState('');
  const [timeline, setTimeline] = useState<string[]>([]);
  const [budget, setBudget] = useState<string[]>([]);
  const [followUpMode, setFollowUpMode] = useState<string[]>([]);
  const [bestTimeToContact, setBestTimeToContact] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [consent, setConsent] = useState(false);

  // UI state
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
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
        startGlobalLoader();
        setIsLoading(true);
        setError(null);

        // Fetch exhibition details
        const exhibitionRes = await fetch(`${apiBase}/api/exhibitions/public/${exhibitionId}`)

        if (!exhibitionRes.ok) {
          throw new Error('Failed to load exhibition');
        }
        const exhibitionData = await exhibitionRes.json();
        setExhibition(exhibitionData);

        // Fetch products for exhibition
        const productsRes = await fetch(`${apiBase}/api/products/public`)

        if (!productsRes.ok) {
          throw new Error('Failed to load products');
        }
        const productsData = await productsRes.json();
        setProducts(productsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An error occurred'
        );
        toast({
          title: 'Failed to load exhibition',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        stopGlobalLoader();
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

  const toggleMulti = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
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
      if (!isFormValid) {
        setShowErrors(true);
        toast({
          title: 'Please fill all required fields',
          variant: 'warning',
        });
        return;
      }
      startGlobalLoader();
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`${apiBase}/api/visitors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          companyName: company,
          designation,
          cityState,
          companyType,
          companyTypeOther,
          industry,
          industryOther,
          companySize,
          interestAreas,
          solutions,
          solutionsOther,
          timeline,
          budget,
          followUpMode,
          bestTimeToContact,
          additionalNotes,
          consent,
          exhibitionId: Number(exhibitionId),
          productIds: selectedProducts,
        }),
      });

      if (!response.ok) {
        let message = 'Failed to submit registration';
        try {
          const errorBody = await response.json();
          if (typeof errorBody?.message === 'string' && errorBody.message.trim()) {
            message = errorBody.message;
          }
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(message);
      }

      setSuccess(true);
      toast({
        title: 'Registration submitted',
        variant: 'success',
      });
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setDesignation('');
      setCityState('');
      setSelectedProducts([]);
      setShowErrors(false);
      setCompanyType([]);
      setCompanyTypeOther('');
      setIndustry([]);
      setIndustryOther('');
      setCompanySize([]);
      setInterestAreas([]);
      setSolutions([]);
      setSolutionsOther('');
      setTimeline([]);
      setBudget([]);
      setFollowUpMode([]);
      setBestTimeToContact([]);
      setAdditionalNotes('');
      setConsent(false);

      // Show success message for 3 seconds then reset
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to submit registration';
      setError(message);
      toast({
        title: message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      stopGlobalLoader();
    }
  };

  const isFormValid = name && email && phone && exhibitionId && consent;

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

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Visitor Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Section 1: Basic Details</h3>
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
                  aria-invalid={showErrors && !name}
                  disabled={isSubmitting}
                  className="text-base"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Company / Organization Name
                </label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your company or organization"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={isSubmitting}
                  className="text-base"
                />
              </div>

              <div>
                <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Designation / Role
                </label>
                <Input
                  id="designation"
                  type="text"
                  placeholder="Your role"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
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
                  aria-invalid={showErrors && !email}
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
                  onChange={(e) => {
                    const next = e.target.value.replace(/\D/g, '').slice(0, 10)
                    setPhone(next)
                  }}
                  required
                  aria-invalid={showErrors && !phone}
                  disabled={isSubmitting}
                  className="text-base"
                />
              </div>

              <div>
                <label htmlFor="cityState" className="block text-sm font-medium text-gray-700 mb-1.5">
                  City & State
                </label>
                <Input
                  id="cityState"
                  type="text"
                  placeholder="City, State"
                  value={cityState}
                  onChange={(e) => setCityState(e.target.value)}
                  disabled={isSubmitting}
                  className="text-base"
                />
              </div>
            </div>

            {/* Company Profile */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Section 2: Company Profile</h3>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Company Type</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['Startup', 'SME', 'Enterprise', 'Freelancer / Consultant', 'Educational Institution', 'Other'].map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                      <Checkbox
                        checked={companyType.includes(option)}
                        onCheckedChange={() => toggleMulti(option, setCompanyType)}
                        disabled={isSubmitting}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {companyType.includes('Other') && (
                  <Input
                    className="mt-2"
                    placeholder="Other company type"
                    value={companyTypeOther}
                    onChange={(e) => setCompanyTypeOther(e.target.value)}
                    disabled={isSubmitting}
                  />
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Industry</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['IT / Software', 'Manufacturing', 'Healthcare', 'Education', 'Retail / E-commerce', 'Finance', 'Other'].map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                      <Checkbox
                        checked={industry.includes(option)}
                        onCheckedChange={() => toggleMulti(option, setIndustry)}
                        disabled={isSubmitting}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {industry.includes('Other') && (
                  <Input
                    className="mt-2"
                    placeholder="Other industry"
                    value={industryOther}
                    onChange={(e) => setIndustryOther(e.target.value)}
                    disabled={isSubmitting}
                  />
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Company Size</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['1–10', '11–50', '51–200', '201–500', '500+'].map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                      <Checkbox
                        checked={companySize.includes(option)}
                        onCheckedChange={() => toggleMulti(option, setCompanySize)}
                        disabled={isSubmitting}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Interest Areas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Section 3: Interest Areas</h3>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">What are you interested in?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['Products', 'Services', 'Partnership / Collaboration', 'Demo / Trial', 'Pricing & Commercials', 'Hiring / Staffing', 'General Inquiry'].map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                      <Checkbox
                        checked={interestAreas.includes(option)}
                        onCheckedChange={() => toggleMulti(option, setInterestAreas)}
                        disabled={isSubmitting}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Solutions / Services of Interest</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['SaaS Products', 'Custom Software Development', 'IT Staffing / Contract Hiring', 'ERP (SAP / Oracle / Odoo, etc.)', 'Cloud / AI / Data Services', 'Other'].map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                      <Checkbox
                        checked={solutions.includes(option)}
                        onCheckedChange={() => toggleMulti(option, setSolutions)}
                        disabled={isSubmitting}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {solutions.includes('Other') && (
                  <Input
                    className="mt-2"
                    placeholder="Other solutions/services"
                    value={solutionsOther}
                    onChange={(e) => setSolutionsOther(e.target.value)}
                    disabled={isSubmitting}
                  />
                )}
              </div>
            </div>

            {/* Buying Intent */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Section 4: Buying Intent</h3>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Timeline for Requirement</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['Immediate (0–1 month)', 'Short-term (1–3 months)', 'Medium-term (3–6 months)', 'Just exploring'].map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                      <Checkbox
                        checked={timeline.includes(option)}
                        onCheckedChange={() => toggleMulti(option, setTimeline)}
                        disabled={isSubmitting}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Estimated Budget Range (Optional)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['Not decided', 'Under 5 Lakhs', '5–20 Lakhs', '20 Lakhs+'].map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                      <Checkbox
                        checked={budget.includes(option)}
                        onCheckedChange={() => toggleMulti(option, setBudget)}
                        disabled={isSubmitting}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Follow-up Preference */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Section 5: Follow-up Preference</h3>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Preferred Mode of Follow-Up</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['Email', 'Phone Call', 'WhatsApp', 'Online Meeting'].map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                      <Checkbox
                        checked={followUpMode.includes(option)}
                        onCheckedChange={() => toggleMulti(option, setFollowUpMode)}
                        disabled={isSubmitting}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Best Time to Contact</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['Morning', 'Afternoon', 'Evening'].map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                      <Checkbox
                        checked={bestTimeToContact.includes(option)}
                        onCheckedChange={() => toggleMulti(option, setBestTimeToContact)}
                        disabled={isSubmitting}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Section 6: Additional Notes</h3>
              <div>
                <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Specific Requirements / Comments
                </label>
                <textarea
                  id="additionalNotes"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  disabled={isSubmitting}
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none"
                />
              </div>
              <label className="flex items-start gap-2 text-sm text-gray-700">
                <Checkbox
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(Boolean(checked))}
                  disabled={isSubmitting}
                  aria-invalid={showErrors && !consent}
                />
                I agree to be contacted regarding products, services, and future updates related to Nixel.
                <span className="text-red-600">*</span>
              </label>
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
