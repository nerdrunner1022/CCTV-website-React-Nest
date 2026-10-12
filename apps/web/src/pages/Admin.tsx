import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, Section, SectionHeading } from '../components/ui/Layout';
import { apiFetch } from '../lib/api';

interface LeadListResponse {
  items: Array<{
    id: string;
    name: string;
    phone: string;
    area: string;
    status: string;
    createdAt: string;
  }>;
  total: number;
}

/**
 * Admin shell. Real CRM tooling (pipeline board, assignment, metrics) lands in
 * Phase 2; this proves the guarded leads endpoint end to end.
 */
export function Admin(): React.ReactNode {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('cctv-token') : null;

  const leads = useQuery({
    queryKey: ['admin-leads'],
    queryFn: () =>
      apiFetch<LeadListResponse>('/admin/leads', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    enabled: Boolean(token),
  });

  if (!token) {
    return (
      <Section>
        <p className="text-slate-600">
          Staff only.{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">
            Log in
          </Link>
          .
        </p>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeading eyebrow="Admin" title="Leads" />
      <Card>
        {leads.isLoading ? (
          <p className="text-slate-500">Loading leads…</p>
        ) : leads.isError ? (
          <p className="text-red-600">
            Could not load leads (check your session or staff role).
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2">Name</th>
                <th className="py-2">Phone</th>
                <th className="py-2">Area</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {(leads.data?.items ?? []).map((lead) => (
                <tr key={lead.id} className="border-b border-slate-100">
                  <td className="py-2 font-medium text-slate-800">{lead.name}</td>
                  <td className="py-2 text-slate-600">{lead.phone}</td>
                  <td className="py-2 text-slate-600">{lead.area}</td>
                  <td className="py-2 text-slate-600">{lead.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </Section>
  );
}
