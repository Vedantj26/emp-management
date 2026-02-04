'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import DataTable from '@/components/ui/DataTable';
import FormModal from '@/components/ui/FormModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import FilePreviewModal from '@/components/ui/FilePreviewModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Trash2 } from 'lucide-react';
import { getExhibitions } from '@/api/exhibitions';
import { getProducts } from '@/api/products';
import { createVisitor, getVisitorsByExhibition } from '@/api/visitors';
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Visitor {
  id: number;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  designation?: string;
  cityState?: string;
  companyType?: string[];
  companyTypeOther?: string;
  industry?: string[];
  industryOther?: string;
  companySize?: string[];
  interestAreas?: string[];
  solutions?: string[];
  solutionsOther?: string;
  timeline?: string[];
  budget?: string[];
  followUpMode?: string[];
  bestTimeToContact?: string[];
  additionalNotes?: string;
  consent?: boolean;

  exhibition: {
    id: number;
    name: string;
  };

  visitorProducts: {
    id: number;
    product: {
      id: number;
      name: string;
      attachment?: string;
    };
  }[];
}

const COMPANY_TYPES = [
  'Startup',
  'SME',
  'Enterprise',
  'Freelancer / Consultant',
  'Educational Institution',
  'Other',
];

const INDUSTRIES = [
  'IT / Software',
  'Manufacturing',
  'Healthcare',
  'Education',
  'Retail / E-commerce',
  'Finance',
  'Other',
];

const COMPANY_SIZES = ['1–10', '11–50', '51–200', '201–500', '500+'];

const INTEREST_AREAS = [
  'Products',
  'Services',
  'Partnership / Collaboration',
  'Demo / Trial',
  'Pricing & Commercials',
  'Hiring / Staffing',
  'General Inquiry',
];

const SOLUTIONS = [
  'SaaS Products',
  'Custom Software Development',
  'IT Staffing / Contract Hiring',
  'ERP (SAP / Oracle / Odoo, etc.)',
  'Cloud / AI / Data Services',
  'Other',
];

const TIMELINES = [
  'Immediate (0–1 month)',
  'Short-term (1–3 months)',
  'Medium-term (3–6 months)',
  'Just exploring',
];

const BUDGETS = ['Not decided', 'Under 5 Lakhs', '5–20 Lakhs', '20 Lakhs+'];

const FOLLOW_UP_MODES = ['Email', 'Phone Call', 'WhatsApp', 'Online Meeting'];

const BEST_TIMES = ['Morning', 'Afternoon', 'Evening'];

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    fileName: string;
    type: string;
  } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedExhibitionId, setSelectedExhibitionId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    designation: "",
    cityState: "",
    companyType: [] as string[],
    companyTypeOther: "",
    industry: [] as string[],
    industryOther: "",
    companySize: [] as string[],
    interestAreas: [] as string[],
    solutions: [] as string[],
    solutionsOther: "",
    timeline: [] as string[],
    budget: [] as string[],
    followUpMode: [] as string[],
    bestTimeToContact: [] as string[],
    additionalNotes: "",
    consent: false,
    exhibitionId: 0,
    productIds: [] as number[],
  });
  const isViewMode = editingId !== null;

  const fetchProducts = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  const fetchExhibitions = async () => {
    const res = await getExhibitions();
    setExhibitions(res.data.filter((e: any) => e.active));
  };

  const fetchVisitorsByExhibition = async (exhibitionId: number) => {
    try {
      const res = await getVisitorsByExhibition(exhibitionId);
      setVisitors(res.data);
    } catch (err) {
      console.error("Failed to fetch visitors", err);
    }
  };

  useEffect(() => {
    if (selectedExhibitionId) {
      fetchVisitorsByExhibition(selectedExhibitionId);
    } else {
      setVisitors([]);
    }
  }, [selectedExhibitionId]);


  useEffect(() => {
    fetchExhibitions();
    fetchProducts();
  }, []);

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      companyName: '',
      designation: '',
      cityState: '',
      companyType: [],
      companyTypeOther: '',
      industry: [],
      industryOther: '',
      companySize: [],
      interestAreas: [],
      solutions: [],
      solutionsOther: '',
      timeline: [],
      budget: [],
      followUpMode: [],
      bestTimeToContact: [],
      additionalNotes: '',
      consent: false,
      exhibitionId: 0,
      productIds: [],
    });
    setShowErrors(false);
    setIsModalOpen(true);
  };

  const handleEditClick = (visitor: Visitor) => {
    setEditingId(visitor.id);

    setFormData({
      name: visitor.name,
      email: visitor.email,
      phone: visitor.phone,
      companyName: visitor.companyName,
      designation: visitor.designation || '',
      cityState: visitor.cityState || '',
      companyType: visitor.companyType || [],
      companyTypeOther: visitor.companyTypeOther || '',
      industry: visitor.industry || [],
      industryOther: visitor.industryOther || '',
      companySize: visitor.companySize || [],
      interestAreas: visitor.interestAreas || [],
      solutions: visitor.solutions || [],
      solutionsOther: visitor.solutionsOther || '',
      timeline: visitor.timeline || [],
      budget: visitor.budget || [],
      followUpMode: visitor.followUpMode || [],
      bestTimeToContact: visitor.bestTimeToContact || [],
      additionalNotes: visitor.additionalNotes || '',
      consent: visitor.consent ?? false,

      exhibitionId: visitor.exhibition.id,

      productIds: visitor.visitorProducts.map(
        (vp) => vp.product.id
      ),
    });

    setShowErrors(false);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleProductToggle = (product: string) => {
    setFormData((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(Number(product))
        ? prev.productIds.filter((p) => p !== Number(product))
        : [...prev.productIds, Number(product)],
    }));
  };

  const toggleMulti = (value: string, key: keyof typeof formData) => {
    setFormData((prev) => {
      const current = prev[key] as string[];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!formData.name || !formData.email || !formData.phone || !formData.exhibitionId || !formData.consent) {
      setShowErrors(true);
      toast({
        title: "Please fill all required fields",
        variant: "warning",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await createVisitor(formData);

      if (selectedExhibitionId) {
        fetchVisitorsByExhibition(selectedExhibitionId);
      }

      if (res.data?.emailSent === false) {
        toast({
          title: res.data.emailError || "Email failed to send",
          variant: "warning",
        });
      }

      setIsModalOpen(false);
      setEditingId(null);
      setShowErrors(false);
      toast({
        title: "Visitor created",
        variant: "success",
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (err instanceof Error ? err.message : "Failed to save visitor");
      console.error("Failed to save visitor", err);
      toast({
        title: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteId && !isDeleting) {
      setIsDeleting(true);
      setVisitors((prev) => prev.filter((v) => v.id !== deleteId));
      setIsConfirmOpen(false);
      toast({
        title: "Visitor deleted",
        variant: "success",
      });
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Visitors</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Manage exhibition visitors</p>
          </div>
          <Button onClick={handleAddClick} className="w-full md:w-auto">Add Visitor</Button>
        </div>

        {/* Filter Controls */}
        <div className="flex gap-2 md:gap-4 flex-col md:flex-row">
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Exhibition
            </label>
            <Select
              value={selectedExhibitionId ? String(selectedExhibitionId) : ""}
              onValueChange={(value) =>
                setSelectedExhibitionId(Number(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select exhibition" />
              </SelectTrigger>

              <SelectContent>
                {exhibitions.map((ex) => (
                  <SelectItem key={ex.id} value={String(ex.id)}>
                    {ex.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          columns={[
            { key: 'name', label: 'Visitor Name' },
            { key: 'email', label: 'Email', hideOnMobile: true },
            { key: 'phone', label: 'Phone', hideOnMobile: true },
            { key: 'companyName', label: 'Company', hideOnMobile: true },
            { key: 'exhibitionName', label: 'Exhibition', hideOnMobile: true },
            {
              key: 'id',
              label: 'Actions',
              render: (_, row: any) => (
                <div className="flex gap-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 md:h-9 md:w-9"
                        onClick={() => handleEditClick(row)}
                      >
                        <Eye size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 md:h-9 md:w-9"
                        onClick={() => handleDeleteClick(row.id)}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                </div>
              ),
            },
          ]}
          data={visitors}
        />

        <FormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title={editingId ? 'View Visitor' : 'Add Visitor'}
          onSubmit={editingId ? () => "" : handleSubmit}
          submitText={editingId ? undefined : "Save"}
          isViewMode={isViewMode}
          isLoading={isSubmitting}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visitor Name <span className="text-red-600">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter visitor name"
                required
                aria-invalid={showErrors && !formData.name}
                disabled={isViewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-600">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter email"
                required
                aria-invalid={showErrors && !formData.email}
                disabled={isViewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-600">*</span>
              </label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="Enter phone"
                maxLength={10}
                required
                aria-invalid={showErrors && !formData.phone}
                disabled={isViewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <Input
                value={formData.companyName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, companyName: e.target.value }))
                }
                placeholder="Enter company name"
                disabled={isViewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation / Role
              </label>
              <Input
                value={formData.designation}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, designation: e.target.value }))
                }
                placeholder="Enter designation or role"
                disabled={isViewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City & State
              </label>
              <Input
                value={formData.cityState}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, cityState: e.target.value }))
                }
                placeholder="City, State"
                disabled={isViewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exhibition <span className="text-red-600">*</span>
              </label>
              <Select
                value={formData.exhibitionId ? String(formData.exhibitionId) : ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, exhibitionId: Number(value) }))
                }
                disabled={isViewMode}
              >
                <SelectTrigger aria-invalid={showErrors && !formData.exhibitionId}>
                  <SelectValue placeholder="Select exhibition" />
                </SelectTrigger>
                <SelectContent>
                  {exhibitions.map((ex) => (
                    <SelectItem key={ex.id} value={String(ex.id)}>
                      {ex.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="pt-2">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Section 2: Company Profile</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Company Type</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {COMPANY_TYPES.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                        <Checkbox
                          checked={formData.companyType.includes(option)}
                          onCheckedChange={() => toggleMulti(option, 'companyType')}
                          disabled={isViewMode}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  {formData.companyType.includes('Other') && (
                    <Input
                      className="mt-2"
                      placeholder="Other company type"
                      value={formData.companyTypeOther}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, companyTypeOther: e.target.value }))
                      }
                      disabled={isViewMode}
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Industry</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {INDUSTRIES.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                        <Checkbox
                          checked={formData.industry.includes(option)}
                          onCheckedChange={() => toggleMulti(option, 'industry')}
                          disabled={isViewMode}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  {formData.industry.includes('Other') && (
                    <Input
                      className="mt-2"
                      placeholder="Other industry"
                      value={formData.industryOther}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, industryOther: e.target.value }))
                      }
                      disabled={isViewMode}
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Company Size</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {COMPANY_SIZES.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                        <Checkbox
                          checked={formData.companySize.includes(option)}
                          onCheckedChange={() => toggleMulti(option, 'companySize')}
                          disabled={isViewMode}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Section 3: Interest Areas</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">What are you interested in?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {INTEREST_AREAS.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                        <Checkbox
                          checked={formData.interestAreas.includes(option)}
                          onCheckedChange={() => toggleMulti(option, 'interestAreas')}
                          disabled={isViewMode}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Solutions / Services of Interest</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SOLUTIONS.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                        <Checkbox
                          checked={formData.solutions.includes(option)}
                          onCheckedChange={() => toggleMulti(option, 'solutions')}
                          disabled={isViewMode}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  {formData.solutions.includes('Other') && (
                    <Input
                      className="mt-2"
                      placeholder="Other solutions/services"
                      value={formData.solutionsOther}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, solutionsOther: e.target.value }))
                      }
                      disabled={isViewMode}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Section 4: Buying Intent</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Timeline for Requirement</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TIMELINES.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                        <Checkbox
                          checked={formData.timeline.includes(option)}
                          onCheckedChange={() => toggleMulti(option, 'timeline')}
                          disabled={isViewMode}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Estimated Budget Range (Optional)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {BUDGETS.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                        <Checkbox
                          checked={formData.budget.includes(option)}
                          onCheckedChange={() => toggleMulti(option, 'budget')}
                          disabled={isViewMode}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Section 5: Follow-up Preference</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Preferred Mode of Follow-Up</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {FOLLOW_UP_MODES.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                        <Checkbox
                          checked={formData.followUpMode.includes(option)}
                          onCheckedChange={() => toggleMulti(option, 'followUpMode')}
                          disabled={isViewMode}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Best Time to Contact</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {BEST_TIMES.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                        <Checkbox
                          checked={formData.bestTimeToContact.includes(option)}
                          onCheckedChange={() => toggleMulti(option, 'bestTimeToContact')}
                          disabled={isViewMode}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Section 6: Additional Notes</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specific Requirements / Comments
                </label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, additionalNotes: e.target.value }))
                  }
                  disabled={isViewMode}
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none"
                />
              </div>
              <label className="mt-3 flex items-start gap-2 text-sm text-gray-700">
                <Checkbox
                  checked={formData.consent}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, consent: Boolean(checked) }))
                  }
                  aria-invalid={showErrors && !formData.consent}
                  disabled={isViewMode}
                />
                I agree to be contacted regarding products, services, and future updates related to Nixel.
                <span className="text-red-600">*</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Interested Products
              </label>
              <div className="space-y-2">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center gap-2 group">
                    <Checkbox
                      id={product.id}
                      checked={formData.productIds.includes(product.id)}
                      onCheckedChange={() =>
                        setFormData(prev => ({
                          ...prev,
                          productIds: prev.productIds.includes(product.id)
                            ? prev.productIds.filter(id => id !== product.id)
                            : [...prev.productIds, product.id],
                        }))
                      }
                      disabled={isViewMode}
                    />
                    <label htmlFor={product.id} className="text-sm text-gray-700 flex-1">
                      {product.name}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (!product.attachment) return;

                        const ext = product.attachment.split('.').pop()?.toLowerCase();

                        const isPdf = ext === 'pdf';

                        setPreviewFile({
                          url: isPdf
                            ? `/api/products/preview/${product.attachment}#toolbar=0&navpanes=0&scrollbar=0`
                            : `/api/products/download/${product.attachment}`,
                          fileName: product.attachment,
                          type: ext || '',
                        });

                        setIsPreviewOpen(true);
                      }}
                      className="text-xs text-blue-600 hover:underline opacity-0 group-hover:opacity-100"
                      // disabled={isViewMode}
                    >
                      Preview
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FormModal>

        <ConfirmDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title="Delete Visitor"
          description="Are you sure you want to delete this visitor? This action cannot be undone."
          confirmText="Delete"
          isDangerous
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />

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
    </AdminLayout>
  );
}
