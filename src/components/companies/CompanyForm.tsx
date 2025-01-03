import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Company } from '../../types';
import { Trash2, Plus } from 'lucide-react';

const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  location: z.string().min(1, 'Location is required'),
  linkedinProfile: z.string().url('Invalid LinkedIn URL').optional(),
  emails: z.array(z.string().email('Invalid email')).min(1, 'At least one email is required'),
  phoneNumbers: z.array(z.string()).min(1, 'At least one phone number is required'),
  comments: z.string().optional(),
  communicationPeriodicity: z.number().min(1, 'Periodicity must be at least 1 day'),
});

interface CompanyFormProps {
  initialData?: Company;
  onSubmit: (data: Company) => void;
  onCancel: () => void;
}

export default function CompanyForm({ initialData, onSubmit, onCancel }: CompanyFormProps) {
  const { 
    register, 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: initialData || {
      name: '',
      location: '',
      linkedinProfile: '',
      emails: [''],
      phoneNumbers: [''],
      comments: '',
      communicationPeriodicity: 7,
    },
  });

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail
  } = useFieldArray({
    control,
    name: 'emails',
  });

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone
  } = useFieldArray({
    control,
    name: 'phoneNumbers',
  });

  const handleFormSubmit = (data: any) => {
    // Generate a new ID if not editing an existing company
    const companyData: Company = {
      ...data,
      id: initialData?.id || uuidv4(),
    };
    onSubmit(companyData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Company Name</label>
        <input
          type="text"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          {...register('location')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
        <input
          type="url"
          {...register('linkedinProfile')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.linkedinProfile && (
          <p className="mt-1 text-sm text-red-600">{errors.linkedinProfile.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Emails</label>
        {emailFields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2 mt-2">
            <input
              type="email"
              {...register(`emails.${index}`)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {emailFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeEmail(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendEmail('')}
          className="mt-2 inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <Plus className="h-5 w-5 mr-1" /> Add Email
        </button>
        {errors.emails && (
          <p className="mt-1 text-sm text-red-600">{errors.emails.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Numbers</label>
        {phoneFields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2 mt-2">
            <input
              type="tel"
              {...register(`phoneNumbers.${index}`)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {phoneFields.length > 1 && (
              <button
                type="button"
                onClick={() => removePhone(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendPhone('')}
          className="mt-2 inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <Plus className="h-5 w-5 mr-1" /> Add Phone Number
        </button>
        {errors.phoneNumbers && (
          <p className="mt-1 text-sm text-red-600">{errors.phoneNumbers.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Comments</label>
        <textarea
          {...register('comments')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Communication Periodicity (days)</label>
        <input
          type="number"
          {...register('communicationPeriodicity', { 
            valueAsNumber: true 
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.communicationPeriodicity && (
          <p className="mt-1 text-sm text-red-600">
            {errors.communicationPeriodicity.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}