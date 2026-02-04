'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import DataTable from '@/components/ui/DataTable';
import FormModal from '@/components/ui/FormModal';
import FormBuilder, { type FormField } from '@/components/ui/FormBuilder';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Employee extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
}

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '555-0101',
    department: 'Operations',
    position: 'Manager',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    phone: '555-0102',
    department: 'Marketing',
    position: 'Coordinator',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    phone: '555-0103',
    department: 'Sales',
    position: 'Executive',
  },
  {
    id: 4,
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    phone: '555-0104',
    department: 'IT',
    position: 'Developer',
  },
];

const employeeFormFields: FormField[] = [
  {
    name: 'name',
    label: 'Employee Name',
    type: 'text',
    placeholder: 'Enter employee name',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter email address',
    required: true,
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'text',
    placeholder: 'Enter phone number',
  },
  {
    name: 'department',
    label: 'Department',
    type: 'select',
    options: [
      { label: 'Operations', value: 'Operations' },
      { label: 'Marketing', value: 'Marketing' },
      { label: 'Sales', value: 'Sales' },
      { label: 'IT', value: 'IT' },
      { label: 'HR', value: 'HR' },
    ],
    required: true,
  },
  {
    name: 'position',
    label: 'Position',
    type: 'select',
    options: [
      { label: 'Manager', value: 'Manager' },
      { label: 'Coordinator', value: 'Coordinator' },
      { label: 'Executive', value: 'Executive' },
      { label: 'Developer', value: 'Developer' },
      { label: 'Intern', value: 'Intern' },
    ],
    required: true,
  },
];

const departments = ['Operations', 'Marketing', 'Sales', 'HR', 'IT', 'Finance'];
const positions = ['Manager', 'Coordinator', 'Executive', 'Specialist', 'Assistant'];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
  });

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      position: '',
    });
    setShowErrors(false);
    setIsModalOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
    });
    setShowErrors(false);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    if (!formData.name || !formData.email || !formData.department || !formData.position) {
      setShowErrors(true);
      toast({
        title: "Please fill all required fields",
        variant: "warning",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const isEditing = Boolean(editingId);

      if (editingId) {
        setEmployees((prev) =>
          prev.map((e) =>
            e.id === editingId
              ? { ...e, ...formData }
              : e
          )
        );
      } else {
        setEmployees((prev) => [
          ...prev,
          { id: Math.max(...prev.map((e) => e.id), 0) + 1, ...formData },
        ]);
      }
      setIsModalOpen(false);
      setShowErrors(false);
      toast({
        title: isEditing ? "Employee updated" : "Employee created",
        variant: "success",
      });
    } catch (err) {
      console.error("Failed to save employee", err);
      toast({
        title: "Failed to save employee",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      if (deleteId) {
        setEmployees((prev) => prev.filter((e) => e.id !== deleteId));
        setIsConfirmOpen(false);
        toast({
          title: "Employee deleted",
          variant: "success",
        });
      }
    } catch (err) {
      console.error("Failed to delete employee", err);
      toast({
        title: "Failed to delete employee",
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Employees</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Manage exhibition staff and employees</p>
          </div>
          <Button onClick={handleAddClick} className="w-full md:w-auto">Add Employee</Button>
        </div>

        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email', hideOnMobile: true },
            { key: 'phone', label: 'Phone', hideOnMobile: true },
            { key: 'department', label: 'Department', hideOnMobile: true },
            { key: 'position', label: 'Position', hideOnMobile: true },
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
          data={employees}
        />

        <FormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title={editingId ? 'Edit Employee' : 'Add Employee'}
          submitText={editingId ? 'Update' : 'Create'}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        >
        <FormBuilder
          fields={employeeFormFields}
          values={formData}
          onChange={(name, value) =>
            setFormData((prev) => ({ ...prev, [name]: value }))
          }
          showErrors={showErrors}
        />
        </FormModal>

        <ConfirmDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title="Delete Employee"
          description="Are you sure you want to delete this employee? This action cannot be undone."
          confirmText="Delete"
          isDangerous
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      </div>
    </AdminLayout>
  );
}
