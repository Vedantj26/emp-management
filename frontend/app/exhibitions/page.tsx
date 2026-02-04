'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import DataTable from '@/components/ui/DataTable';
import FormModal from '@/components/ui/FormModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, QrCode } from 'lucide-react';
import { getAuthUser } from "@/lib/auth";
import type { UserRole } from "@/lib/auth";
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  getExhibitions,
  createExhibition,
  updateExhibition,
  deleteExhibition,
} from "@/api/exhibitions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ExhibitionQR from '@/components/ExhibitionQR';


interface Exhibition {
  id: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  timing?: string;
  active?: boolean;
  // startTime: string;
  // endTime: string;
}

export default function ExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    timing: '',
    startTime: '',
    endTime: '',
    active: true,
  });
  const user = getAuthUser();
  const role: UserRole | undefined = user?.role;
  const isAdmin = role === "ADMIN";
  const [qrExhibitionId, setQrExhibitionId] = useState<number | null>(null);

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const fetchExhibitions = async () => {
    try {
      const res = await getExhibitions();
      setExhibitions(res.data);
    } catch (err) {
      console.error("Failed to fetch exhibitions", err);
    }
  };

  const handleAddClick = () => {
    if (!isAdmin) return;
    setEditingId(null);
    setFormData({
      name: '',
      location: '',
      startDate: '',
      endDate: '',
      timing: '',
      startTime: '',
      endTime: '',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (exhibition: Exhibition) => {
    if (!isAdmin) return;

    const [startTime = '', endTime = ''] =
      exhibition.timing?.split(' - ') || [];

    setEditingId(exhibition.id);
    setFormData({
      name: exhibition.name,
      location: exhibition.location,
      startDate: exhibition.startDate,
      endDate: exhibition.endDate,
      timing: exhibition.timing || '',
      startTime,
      endTime,
      active: exhibition.active ?? true,
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

    const payload = {
      name: formData.name,
      location: formData.location,
      startDate: formData.startDate,
      endDate: formData.endDate,
      timing: `${formData.startTime} - ${formData.endTime}`,
      active: formData.active,
    };

    try {
      const isEditing = Boolean(editingId);

      if (editingId) {
        await updateExhibition(editingId, payload);
      } else {
        await createExhibition(payload);
      }

      await fetchExhibitions();
      setIsModalOpen(false);
      setEditingId(null);
      toast({
        title: isEditing ? "Exhibition updated" : "Exhibition created",
        variant: "success",
      });
    } catch (err) {
      console.error("Failed to save exhibition", err);
      toast({
        title: "Failed to save exhibition",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      await deleteExhibition(deleteId);
      setExhibitions((prev) => prev.filter((e) => e.id !== deleteId));
      setIsConfirmOpen(false);
      setDeleteId(null);
      toast({
        title: "Exhibition deleted",
        variant: "success",
      });
    } catch (err) {
      console.error("Failed to delete exhibition", err);
      toast({
        title: "Failed to delete exhibition",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Exhibitions</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Manage events and exhibitions</p>
          </div>
          {isAdmin && (
            <Button onClick={handleAddClick} className="w-full md:w-auto">Add Exhibition</Button>
          )}
        </div>

        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'location', label: 'Location' },
            {
              key: 'startDate',
              label: 'Start Date',
            },
            {
              key: 'endDate',
              label: 'End Date',
            },
            {
              key: "timing",
              label: "Timing",
            },
            {
              key: "active",
              label: "Active Status",
              render: (value: unknown) => {
                return (value as boolean) ? "Active" : "Inactive";
              }
            },

            ...(isAdmin
              ? [{
                key: 'id',
                label: 'Actions',
                render: (_: any, row: any) => (
                  <div className="flex gap-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
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
                          onClick={() => handleDeleteClick(row.id)}
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setQrExhibitionId(row.id)}
                        >
                          <QrCode size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Show QR</TooltipContent>
                    </Tooltip>
                  </div>
                ),
              }]
              : []),
          ] as any}
          data={exhibitions}
        />

        <FormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title={editingId ? 'Edit Exhibition' : 'Add Exhibition'}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exhibition Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter exhibition name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="Enter location"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, startTime: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, endTime: e.target.value }))
                  }
                />
              </div>
            </div>
            {editingId !== null && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Active Status
                </label>

                <Select
                  value={formData.active ? "true" : "false"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      active: value === "true",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </FormModal>

        <ConfirmDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title="Delete Exhibition"
          description="Are you sure you want to delete this exhibition? This action cannot be undone."
          confirmText="Delete"
          isDangerous
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      </div>

      <FormModal
        open={qrExhibitionId !== null}
        onOpenChange={() => setQrExhibitionId(null)}
        title="Exhibition QR Code"
      >
        {qrExhibitionId && (
          <div className="flex justify-center py-6">
            <ExhibitionQR exhibitionId={qrExhibitionId} />
          </div>
        )}
      </FormModal>

    </AdminLayout>
  );
}
