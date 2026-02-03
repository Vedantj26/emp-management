'use client';

import { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export type FieldType = 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'file' | 'number';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  rows?: number;
  className?: string;
  renderCustom?: (value: any, onChange: (val: any) => void) => ReactNode;
}

interface FormBuilderProps {
  fields: FormField[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onFieldChange?: (values: Record<string, any>) => void;
  scrollable?: boolean;
}

export default function FormBuilder({
  fields,
  values,
  onChange,
  scrollable = false,
}: FormBuilderProps) {
  const renderField = (field: FormField) => {
    const value = values[field.name];

    if (field.renderCustom) {
      return (
        <div key={field.name} className={field.className}>
          {field.label && (
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {field.renderCustom(value, (val) => onChange(field.name, val))}
        </div>
      );
    }

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className={field.className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Textarea
              value={value}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={field.rows || 4}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className={field.className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Select value={value} onValueChange={(val) => onChange(field.name, val)}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className={`${field.className} flex items-center gap-2`}>
            <Checkbox
              id={field.name}
              checked={value}
              onCheckedChange={(checked) => onChange(field.name, checked)}
            />
            <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
              {field.label}
            </label>
          </div>
        );

      case 'file':
        return (
          <div key={field.name} className={field.className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              type="file"
              onChange={(e) => onChange(field.name, e.target.files?.[0]?.name || '')}
              className="cursor-pointer"
            />
          </div>
        );

      case 'number':
        return (
          <div key={field.name} className={field.className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              type="number"
              value={value}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.placeholder}
            />
          </div>
        );

      case 'password':
      case 'email':
      case 'text':
      default:
        return (
          <div key={field.name} className={field.className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              type={field.type}
              value={value}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.placeholder}
            />
          </div>
        );
    }
  };

  const containerClass = scrollable ? 'max-h-96 overflow-y-auto' : '';

  return (
    <div className={`space-y-4 ${containerClass}`}>
      {fields.map((field) => renderField(field))}
    </div>
  );
}
