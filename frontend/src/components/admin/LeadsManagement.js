import React, { useState, useEffect } from 'react';
import { Mail, Phone, Building, Calendar } from 'lucide-react';
import { Card } from '../ui/card';
import { api } from '../../utils/api';
import { toast } from 'sonner';
import LoadingSpinner from '../layout/LoadingSpinner';

const LeadsManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await api.getContactLeads();
      setLeads(response.data);
    } catch (error) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div data-testid="leads-management">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Contact Leads</h2>
        <p className="text-slate-600">Manage inquiries from your contact form</p>
      </div>

      {leads.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-600">No leads yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <Card key={lead.id} className="p-6" data-testid={`lead-item-${lead.id}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-3">{lead.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail size={16} />
                      <a href={`mailto:${lead.email}`} className="hover:text-cyan-600">{lead.email}</a>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone size={16} />
                        <a href={`tel:${lead.phone}`} className="hover:text-cyan-600">{lead.phone}</a>
                      </div>
                    )}
                    {lead.company && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Building size={16} />
                        <span>{lead.company}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar size={16} />
                      <span>{formatDate(lead.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Message:</h4>
                  <p className="text-sm text-slate-600">{lead.message}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadsManagement;
