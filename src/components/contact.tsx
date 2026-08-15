'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Github, Linkedin } from '@/components/icons';

interface ContactProps {
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  location: string;
}

export function Contact({ email, githubUrl, linkedinUrl, location }: ContactProps) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [backupData, setBackupData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<'SUCCESS' | 'SMTP_NOT_CONFIGURED' | 'ERROR' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setBackupData({ ...formData });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('SUCCESS');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else if (result.error === 'SMTP_NOT_CONFIGURED') {
        setStatus('SMTP_NOT_CONFIGURED');
      } else {
        setStatus('ERROR');
        setErrorMessage(result.message || 'Failed to dispatch email.');
      }
    } catch (err: any) {
      console.error(err);
      setStatus('ERROR');
      setErrorMessage('A network connection error occurred. Could not connect to API.');
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const triggerMailtoFallback = () => {
    const subjectLine = backupData.subject || `Developer Portfolio Contact from ${backupData.name}`;
    const bodyContent = `Hello Bhavy,\n\nYou have received a message from a visitor on your Developer Portfolio:\n\n---\nVisitor Name: ${backupData.name}\nVisitor Email: ${backupData.email}\nSubject: ${subjectLine}\n\nMessage:\n${backupData.message}\n---`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(bodyContent)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <section id="contact" className="py-20 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-[#09090b]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Heading */}
        <div className="flex flex-col items-start space-y-3 mb-12">
          <h2 className="text-3xl font-bold tracking-tight font-mono">
            <span className="text-emerald-600 dark:text-emerald-500 mr-2">&gt;</span>Let's Connect
          </h2>
          <div className="h-1 w-12 bg-emerald-500 rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Side: Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-zinc-650 dark:text-zinc-400 leading-relaxed text-base">
              I am always interested in building useful applications, learning emerging software engineering stacks, 
              and connecting with professionals in the technology space.
            </p>

            <div className="space-y-4 pt-4">
              {/* Email */}
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Email</h4>
                  <a href={`mailto:${email}`} className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-emerald-500 hover:underline">
                    {email}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Location</h4>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{location}</p>
                </div>
              </div>

              {/* Github / Linkedin */}
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">
                  <Github className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">GitHub</h4>
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-emerald-500 hover:underline">
                    {githubUrl.replace('https://', '')}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">
                  <Linkedin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">LinkedIn</h4>
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-emerald-500 hover:underline">
                    {linkedinUrl.replace('https://', '')}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Message Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="space-y-4">
                {status === 'SUCCESS' && (
                  <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-400 flex items-start space-x-4">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <h3 className="font-bold text-base">Message Sent Successfully!</h3>
                      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        Thank you for reaching out! Your message was sent successfully to <strong>{email}</strong>.
                      </p>
                      <button
                        onClick={() => { setSubmitted(false); setStatus(null); }}
                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        Send another message
                      </button>
                    </div>
                  </div>
                )}

                {status === 'SMTP_NOT_CONFIGURED' && (
                  <div className="p-6 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-800 dark:text-amber-400 flex flex-col space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5 font-bold font-mono">⚠️</div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-base">Email Delivery Configuration Needed</h3>
                        <p className="text-sm leading-relaxed text-zinc-650 dark:text-zinc-450">
                          The backend API endpoint `/api/contact` is ready, but **SMTP credentials** are missing from your `.env.local` file.
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-zinc-950 text-amber-300 rounded font-mono text-[10px] space-y-1">
                      <p className="text-zinc-500"># Add this to your .env.local file to enable background sending:</p>
                      <p>SMTP_USER="{email}"</p>
                      <p>SMTP_PASS="your-16-character-gmail-app-password"</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={triggerMailtoFallback}
                        className="inline-flex items-center justify-center px-4 py-2 text-xs font-mono font-bold text-white bg-amber-600 hover:bg-amber-550 rounded cursor-pointer"
                      >
                        Send via Mail App (Fallback)
                      </button>
                      <button
                        onClick={() => { setSubmitted(false); setStatus(null); }}
                        className="inline-flex items-center justify-center px-4 py-2 text-xs font-mono border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-450 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded cursor-pointer"
                      >
                        Modify Message
                      </button>
                    </div>
                  </div>
                )}

                {status === 'ERROR' && (
                  <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5 text-red-800 dark:text-red-400 flex flex-col space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5 font-bold font-mono">❌</div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-base">Sending Failed</h3>
                        <p className="text-sm leading-relaxed text-zinc-655 dark:text-zinc-400">
                          Error details: {errorMessage || 'An unknown error occurred.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={triggerMailtoFallback}
                        className="inline-flex items-center justify-center px-4 py-2 text-xs font-mono font-bold text-white bg-red-605 hover:bg-red-550 rounded cursor-pointer"
                      >
                        Send via Mail App (Fallback)
                      </button>
                      <button
                        onClick={() => { setSubmitted(false); setStatus(null); }}
                        className="inline-flex items-center justify-center px-4 py-2 text-xs font-mono border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-450 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded cursor-pointer"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-mono text-zinc-500">Name *</label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-mono text-zinc-500">Email *</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-mono text-zinc-500">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-mono text-zinc-500">Message *</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 font-medium text-white bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
