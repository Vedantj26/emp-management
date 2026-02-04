'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import DataTable from '@/components/ui/DataTable';
import FormModal from '@/components/ui/FormModal';
import FormBuilder, { type FormField } from '@/components/ui/FormBuilder';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { createUser, deleteUser, getUsers, updateUser } from '@/api/users';

interface User extends Record<string, unknown> {
  id: number;
  username: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'USER' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (err instanceof Error ? err.message : "Failed to fetch users");
      console.error("Failed to fetch users", err);
      toast({
        title: message,
        variant: "destructive",
      });
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ username: '', password: '', role: 'USER' });
    setIsModalOpen(true);
  };

  const handleEditClick = (user: User) => {
    setEditingId(user.id);
    setFormData({ username: user.username, password: '', role: user.role });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    const isEditing = Boolean(editingId);

    if (!formData.username || !formData.role || (!isEditing && !formData.password)) {
      toast({
        title: "Please fill all required fields",
        variant: "warning",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && editingId) {
        await updateUser(editingId, { username: formData.username, role: formData.role });
      } else {
        await createUser({
          username: formData.username,
          password: formData.password,
          role: formData.role,
        });
      }

      await fetchUsers();
      setIsModalOpen(false);
      toast({
        title: isEditing ? "User updated" : "User created",
        variant: "success",
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (err instanceof Error ? err.message : "Failed to save user");
      console.error("Failed to save user", err);
      toast({
        title: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      if (deleteId) {
        await deleteUser(deleteId);
        await fetchUsers();
        setIsConfirmOpen(false);
        toast({
          title: "User deleted",
          variant: "success",
        });
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (err instanceof Error ? err.message : "Failed to delete user");
      console.error("Failed to delete user", err);
      toast({
        title: message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const userFormFields: FormField[] = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter username',
      required: true,
    },
    ...(editingId
      ? []
      : [
          {
            name: 'password',
            label: 'Password',
            type: 'password',
            placeholder: 'Enter password',
            required: true,
          } as FormField,
        ]),
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'ADMIN' },
        { label: 'User', value: 'USER' },
      ],
      required: true,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Manage system users and access control</p>
          </div>
          <Button onClick={handleAddClick} className="w-full md:w-auto">Add User</Button>
        </div>
        <DataTable
          columns={[
            { key: 'username', label: 'Username' },
            { key: 'role', label: 'Role', hideOnMobile: true },
            {
              key: 'id',
              label: 'Actions',
              render: (_, row: any) => (
                <div className="flex gap-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 md:h-9 md:w-9"
                    onClick={() => handleEditClick(row)}
                  >
                    <Edit size={16} />
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
          data={users}
        />
        <FormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title={editingId ? 'Edit User' : 'Add User'}
          submitText={editingId ? 'Update' : 'Create'}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        >
          <FormBuilder
            fields={userFormFields}
            values={formData}
            onChange={(name, value) =>
              setFormData((prev) => ({ ...prev, [name]: value }))
            }
          />
        </FormModal>
        <ConfirmDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title="Delete User"
          description="Are you sure you want to delete this user? This action cannot be undone."
          confirmText="Delete"
          isDangerous
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      </div>
    </AdminLayout>
  );
}
