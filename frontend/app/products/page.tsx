'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import DataTable from '@/components/ui/DataTable';
import FormModal from '@/components/ui/FormModal';
import FormBuilder, { type FormField } from '@/components/ui/FormBuilder';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import FilePreviewModal from '@/components/ui/FilePreviewModal';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, FileText } from 'lucide-react';
import { useEffect } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/products";
import { getAuthUser } from "@/lib/auth";
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Product extends Record<string, unknown> {
  id: number;
  name: string;
  description: string;
  attachment?: string;
}

const productFormFields: FormField[] = [
  {
    name: "name",
    label: "Product Name",
    type: "text",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    rows: 4,
    required: true,
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    fileName: string;
    type: string;
  } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    attachment: File | null;
  }>({
    name: "",
    description: "",
    attachment: null,
  });
  const user = getAuthUser();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const handleAttachmentClick = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
    setPreviewFile({
      fileName: filename,
      type: ext || "unknown",
      url:
        ext === "pdf"
          ? `${apiBase}/api/products/preview/${filename}#toolbar=0&navpanes=0&scrollbar=0`
          : `${apiBase}/api/products/download/${filename}`,
    });

    setIsPreviewOpen(true);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', attachment: null });
    setIsModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    if (!isAdmin) return;

    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      attachment: null,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleSubmit = async () => {
    if (!isAdmin) return;
    if (isSubmitting) return;
    setIsSubmitting(true);

    const productPayload = {
      name: formData.name,
      description: formData.description,
    };

    const form = new FormData();

    form.append("product", JSON.stringify(productPayload));

    if (formData.attachment) {
      form.append("file", formData.attachment);
    }

    try {
      const isEditing = Boolean(editingId);

      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        await createProduct(form);
      }

      await fetchProducts();
      setIsModalOpen(false);
      setEditingId(null);
      toast({
        title: isEditing ? "Product updated" : "Product created",
        variant: "success",
      });
    } catch (err) {
      console.error("Failed to save product", err);
      toast({
        title: "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId || !isAdmin) return;
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      await deleteProduct(deleteId);
      await fetchProducts();
      toast({
        title: "Product deleted",
        variant: "success",
      });
    } catch (err) {
      console.error("Failed to delete product", err);
      toast({
        title: "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Manage exhibition products</p>
          </div>
          <Button onClick={handleAddClick} className="w-full md:w-auto">Add Product</Button>
        </div>

        <DataTable
          columns={[
            { key: 'name', label: 'Product Name' },
            { key: 'description', label: 'Description', hideOnMobile: true },
            {
              key: 'attachment',
              label: 'Attachment',
              hideOnMobile: true,
              render: (value: any) =>
                value ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleAttachmentClick(value)}
                        className="flex items-center gap-2 hover:opacity-75 transition-opacity"
                      >
                        <FileText size={16} className="text-blue-600" />
                        <span className="text-sm text-blue-600 hover:underline">
                          {value}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Preview</TooltipContent>
                  </Tooltip>
                ) : (
                  <span className="text-gray-400">-</span>
                ),
            },
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
                        onClick={() => handleAttachmentClick(row.attachment!)}
                      >
                        <FileText size={16} className="text-blue-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Preview</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 md:h-9 md:w-9"
                        onClick={() => handleEditClick(row)}
                      >
                        <Edit size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
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
          data={products}
        />

        <FormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title={editingId ? 'Edit Product' : 'Add Product'}
          submitText={editingId ? 'Update' : 'Create'}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        >
          <FormBuilder
            fields={productFormFields}
            values={formData}
            onChange={(name, value) =>
              setFormData((prev) => ({ ...prev, [name]: value }))
            }
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Attachment
            </label>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  attachment: e.target.files?.[0] || null,
                }))
              }
              className="block w-full text-sm"
            />
          </div>
        </FormModal>

        <ConfirmDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title="Delete Product"
          description="Are you sure you want to delete this product? This action cannot be undone."
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
