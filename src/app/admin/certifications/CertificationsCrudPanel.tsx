'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Certification } from '@/types';
import { Plus, Edit3, Trash2, ArrowLeft, Save, CheckCircle, Award } from 'lucide-react';
import { FileUploadInput } from '@/components/admin/FileUploadInput';

interface CertificationsCrudPanelProps {
  initialCertifications: Certification[];
}

const EMPTY_CERT: Omit<Certification, 'id'> = {
  name: '',
  issuingOrganization: '',
  date: '',
  credentialId: '',
  credentialUrl: '',
  image: '',
};

export function CertificationsCrudPanel({ initialCertifications }: CertificationsCrudPanelProps) {
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [currentCert, setCurrentCert] = useState<Certification | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Omit<Certification, 'id'>>(EMPTY_CERT);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add') {
      handleAddClick();
    }
  }, [searchParams]);

  const handleAddClick = () => {
    setFormData(EMPTY_CERT);
    setView('add');
  };

  const handleEditClick = (cert: Certification) => {
    setCurrentCert(cert);
    setFormData({
      name: cert.name,
      issuingOrganization: cert.issuingOrganization,
      date: cert.date,
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      image: cert.image || '',
    });
    setView('edit');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Remove this certification entry?')) return;
    setCertifications((prev) => prev.filter((c) => c.id !== id));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedCert: Certification = {
      ...formData,
      id: view === 'add' ? 'cert-' + Date.now().toString() : currentCert!.id,
    };

    if (view === 'add') {
      setCertifications((prev) => [...prev, formattedCert]);
    } else {
      setCertifications((prev) => prev.map((c) => (c.id === formattedCert.id ? formattedCert : c)));
    }
    setView('list');
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certifications),
      });

      if (res.ok) {
        setSaveSuccess(true);
        router.refresh();
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Failed to save certifications list.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  if (view === 'list') {
    return (
      <div className="space-y-6 text-sm">
        {saveSuccess && (
          <div className="p-3.5 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-400 flex items-center space-x-2 font-mono text-xs">
            <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
            <span>Credentials logs successfully updated on drive storage!</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xs font-mono text-zinc-450">Credentials ({certifications.length})</h2>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors cursor-pointer text-xs font-mono"
          >
            <Plus className="h-4 w-4" />
            <span>ADD CERTIFICATION</span>
          </button>
        </div>

        {certifications.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/20 dark:bg-zinc-950/20">
            <Award className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
            <p className="text-zinc-450 dark:text-zinc-505 font-mono text-xs">No certification documents uploaded. Display placeholder state.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-left font-mono text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">CERTIFICATION</th>
                  <th className="px-4 py-3 font-semibold">ORGANIZATION</th>
                  <th className="px-4 py-3 font-semibold">DATE</th>
                  <th className="px-4 py-3 font-semibold">CREDENTIAL ID</th>
                  <th className="px-4 py-3 text-right font-semibold">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900/10">
                {certifications.map((cert) => (
                  <tr key={cert.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-955/30 text-zinc-750 dark:text-zinc-350">
                    <td className="px-4 py-3 font-semibold font-sans text-sm text-zinc-900 dark:text-zinc-100">{cert.name}</td>
                    <td className="px-4 py-3">{cert.issuingOrganization}</td>
                    <td className="px-4 py-3">{cert.date}</td>
                    <td className="px-4 py-3 font-mono text-[10px]">{cert.credentialId || '-'}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(cert)}
                        className="p-1 text-zinc-500 hover:text-emerald-500 cursor-pointer"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cert.id)}
                        className="p-1 text-zinc-500 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="inline-flex items-center space-x-2 px-5 py-2.5 font-bold text-white bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 rounded-lg transition-all disabled:opacity-50 cursor-pointer text-xs font-mono"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'PERSISTING DATA...' : 'SAVE DATA CHANGES'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Form Panel
  return (
    <div className="space-y-6 text-sm">
      <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <button
          onClick={() => setView('list')}
          className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded text-zinc-500 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="font-bold text-sm font-mono tracking-tight text-zinc-850 dark:text-zinc-205">
          {view === 'add' ? 'ADD CERTIFICATION RECORD' : 'EDIT CERTIFICATION DETAILS'}
        </h2>
      </div>

      <form onSubmit={handleSubmitForm} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Certification Name *</label>
            <input
              type="text"
              id="name"
              required
              placeholder="e.g. AWS Certified Cloud Practitioner"
              value={formData.name}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="issuingOrganization" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Issuing Organization *</label>
            <input
              type="text"
              id="issuingOrganization"
              required
              placeholder="e.g. Amazon Web Services (AWS)"
              value={formData.issuingOrganization}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="date" className="text-xs font-mono text-zinc-400 dark:text-zinc-555">Date Earned (YYYY-MM) *</label>
            <input
              type="text"
              id="date"
              required
              placeholder="e.g. 2026-07"
              value={formData.date}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="credentialId" className="text-xs font-mono text-zinc-400 dark:text-zinc-555">Credential ID</label>
            <input
              type="text"
              id="credentialId"
              value={formData.credentialId || ''}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="credentialUrl" className="text-xs font-mono text-zinc-400 dark:text-zinc-555">Verification URL</label>
            <input
              type="url"
              id="credentialUrl"
              placeholder="e.g. URL to verify credentials"
              value={formData.credentialUrl || ''}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="md:col-span-2">
            <FileUploadInput
              id="image"
              label="Certificate Document / Image"
              value={formData.image || ''}
              onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
              accept="image/*,.pdf"
              fileType="any"
              description="Click to select & upload certificate document or image from disk"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-5 py-2 text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer text-xs font-mono font-bold"
          >
            <span>CONFIRM CREDENTIAL</span>
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            className="inline-flex items-center space-x-2 px-5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-all cursor-pointer text-xs font-mono text-zinc-500"
          >
            <span>CANCEL</span>
          </button>
        </div>
      </form>
    </div>
  );
}
