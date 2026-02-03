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
import { Edit, Trash2 } from 'lucide-react';
import { getExhibitions } from '@/api/exhibitions';
import { getProducts } from '@/api/products';
import { createVisitor, getVisitorsByExhibition } from '@/api/visitors';

interface Visitor {
  id: number;
  name: string;
  email: string;
  phone: string;
  companyName: string;

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

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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
      exhibitionId: 0,
      productIds: [],
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (visitor: Visitor) => {
    setEditingId(visitor.id);

    setFormData({
      name: visitor.name,
      email: visitor.email,
      phone: visitor.phone,
      companyName: visitor.companyName,

      exhibitionId: visitor.exhibition.id,

      productIds: visitor.visitorProducts.map(
        (vp) => vp.product.id
      ),
    });

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

  const handleSubmit = async () => {
    try {
      await createVisitor(formData);

      if (selectedExhibitionId) {
        fetchVisitorsByExhibition(selectedExhibitionId);
      }

      setIsModalOpen(false);
      setEditingId(null);
    } catch (err) {
      console.error("Failed to save visitor", err);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setVisitors((prev) => prev.filter((v) => v.id !== deleteId));
      setIsConfirmOpen(false);
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
                <div className="flex gap-1 md:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 md:h-9 md:w-9"
                    onClick={() => handleEditClick(row)}
                  >
                    👁
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 md:h-9 md:w-9"
                    onClick={() => handleDeleteClick(row.id)}
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </Button>
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
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visitor Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter visitor name"
                disabled={isViewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter email"
                disabled={isViewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="Enter phone"
                maxLength={10}
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
                Exhibition
              </label>
              <Select
                value={formData.exhibitionId ? String(formData.exhibitionId) : ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, exhibitionId: Number(value) }))
                }
                disabled={isViewMode}
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
                            ? `http://localhost:8080/api/products/preview/${product.attachment}#toolbar=0&navpanes=0&scrollbar=0`
                            : `http://localhost:8080/api/products/download/${product.attachment}`,
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
