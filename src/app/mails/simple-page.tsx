"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Upload, 
  Send, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Users
} from 'lucide-react';

interface EmailEntry {
  id: string;
  email: string;
  name?: string;
  batch?: number;
  status?: string;
  sentCount?: number;
  createdAt: string;
}

export default function SimpleEmailDashboard() {
  const { toast } = useToast();
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [importText, setImportText] = useState('');
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState<any>({});
  const [batches, setBatches] = useState<Record<number, EmailEntry[]>>({});
  const [activeBatch, setActiveBatch] = useState<string | 'ALL'>('ALL');

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/emails');
      const data = await response.json();
      
      if (response.ok) {
        setEmails(data.emails || []);
        setStats(data.stats || {});
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch emails",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch emails",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchBatches = async () => {
    try {
      const response = await fetch('/api/emails/assign-batches');
      const data = await response.json();
      if (response.ok) {
        setBatches(data);
      }
    } catch (error) {
      console.error("Failed to fetch batches:", error);
    }
  };

  useEffect(() => {
    fetchEmails();
    fetchBatches();
  }, [fetchEmails]);

  const handleCreateBatches = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/emails/assign-batches', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        });
        fetchEmails();
        fetchBatches();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create batches",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create batches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImport = async () => {
    if (!importText.trim()) {
      toast({
        title: "Error",
        description: "Please enter email addresses",
        variant: "destructive",
      });
      return;
    }

    const lines = importText.split('\n').filter(line => line.trim());
    const emailList = lines.map(line => {
      const parts = line.split(/[,\t]/);
      const email = parts[0]?.trim();
      const name = parts[1]?.trim();
      return { email, name };
    }).filter(item => item.email);

    console.log('Adding emails:', emailList);

    setLoading(true);
    try {
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: emailList }),
      });

      const data = await response.json();
      console.log('Response:', data);
      
      if (response.ok) {
        const addedCount = data.added?.length || 0;
        const skippedCount = data.skipped?.length || 0;
        const errorCount = data.errors?.length || 0;
        
        if (addedCount > 0) {
          toast({
            title: "✅ Success!",
            description: `Added ${addedCount} new emails to the database.${skippedCount > 0 ? ` Skipped ${skippedCount} duplicates.` : ''}${errorCount > 0 ? ` ${errorCount} invalid emails.` : ''}`,
          });
          setImportText('');
        } else if (skippedCount > 0) {
          toast({
            title: "ℹ️ All emails already exist",
            description: `All ${skippedCount} emails are already in the database.`,
          });
        } else {
          toast({
            title: "⚠️ No valid emails",
            description: "No valid email addresses were found in your input.",
            variant: "destructive",
          });
        }
        
        await fetchEmails();
      } else {
        console.error('API Error:', data);
        toast({
          title: "Error",
          description: data.error || "Failed to import emails. Check console for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      toast({
        title: "Network Error",
        description: "Failed to connect to server. Check if the server is running.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendCampaign = async () => {
    const idsToSend = Array.from(selectedEmails);
    if (activeBatch !== 'ALL') {
      const allowed = new Set(
        emails.filter((e) => e.batch === Number(activeBatch)).map((e) => e.id)
      );
      for (let i = idsToSend.length - 1; i >= 0; i--) {
        if (!allowed.has(idsToSend[i])) idsToSend.splice(i, 1);
      }
    }

    if (idsToSend.length === 0) {
      toast({ title: 'Nothing selected', description: 'Select at least one email (or switch batch).' });
      return;
    }

    toast({ title: 'Sending…', description: `Sending ${idsToSend.length} invite(s)…` });
    if (selectedEmails.size === 0) {
      toast({
        title: "Error",
        description: "Please select emails to send",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    try {
      const response = await fetch('/api/emails/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Batch ${activeBatch === 'ALL' ? 'Mixed' : activeBatch} • ${new Date().toLocaleDateString()}`,
          emailIds: idsToSend,
          batchSize: 50,
          dryRun: false,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "✅ Campaign Complete!",
          description: `Sent ${data.result.successCount} emails successfully. ${data.result.failureCount} failed.`,
        });
        setSelectedEmails(new Set());
        fetchEmails();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send campaign",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send campaign",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (selectedEmails.size === 0) return;

    if (!confirm(`Delete ${selectedEmails.size} emails?`)) return;

    setLoading(true);
    try {
      const response = await fetch('/api/emails', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedEmails) }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: `Deleted ${data.deleted} emails`,
        });
        setSelectedEmails(new Set());
        fetchEmails();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete emails",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEmailSelection = (id: string) => {
    const newSelection = new Set(selectedEmails);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedEmails(newSelection);
  };

  const selectAll = () => {
    if (activeBatch === 'ALL') {
      setSelectedEmails(new Set(emails.map(e => e.id)));
    } else {
      const batchEmails = emails.filter(e => e.batch === Number(activeBatch));
      setSelectedEmails(new Set(batchEmails.map(e => e.id)));
    }
  };

  const deselectAll = () => {
    setSelectedEmails(new Set());
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-pink-600 mb-2">✨ Spilled Email Manager</h1>
        <p className="text-gray-600">Send invites to join Spilled - The gossip app for queens 👑</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total || 0}</p>
              </div>
              <Users className="w-7 h-7 text-zinc-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.byStatus?.pending || 0}</p>
              </div>
              <Clock className="w-7 h-7 text-zinc-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sent</p>
                <p className="text-2xl font-bold">{stats.byStatus?.sent || 0}</p>
              </div>
              <CheckCircle className="w-7 h-7 text-zinc-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">{stats.byStatus?.failed || 0}</p>
              </div>
              <XCircle className="w-7 h-7 text-zinc-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border border-zinc-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Add Emails
            </CardTitle>
            <CardDescription>Paste emails below (one per line)</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <Textarea
              placeholder="email1@example.com
email2@example.com, Jane Doe
email3@example.com"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleBulkImport();
                }
              }}
              rows={10}
              className="font-mono text-sm border-2 focus:border-pink-300 transition-colors"
              disabled={loading}
            />
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mt-2">
              <p className="text-sm text-muted-foreground">
                {importText.split('\n').filter(l => l.trim()).length} emails detected • Press Ctrl+Enter to add
              </p>
              <div className="flex gap-2">
                <Button 
                  type="button"
                  onClick={handleBulkImport}
                  disabled={loading || !importText.trim()}
                  className="px-4"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Add to List
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setImportText("")}
                  disabled={loading || !importText}
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Send Invites
            </CardTitle>
            <CardDescription>Select emails and send (batches of 50)</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2 mb-4 items-center">
              <div className="flex gap-2">
                <Button type="button" onClick={selectAll} variant="outline" size="sm">
                  Select All ({activeBatch === 'ALL' ? emails.length : emails.filter(e => e.batch === Number(activeBatch)).length})
                </Button>
                <Button type="button" onClick={deselectAll} variant="outline" size="sm">
                  Deselect All
                </Button>
                <Button type="button" onClick={() => { fetchEmails(); fetchBatches(); }} variant="outline" size="sm" disabled={loading}>
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <Button type="button" onClick={handleCreateBatches} variant="outline" size="sm" disabled={loading}>
                  Create Batches
                </Button>
              </div>

              <div className="flex gap-2 ml-auto items-center">
                <span className="text-sm text-muted-foreground">Batch:</span>
                <select
                  value={activeBatch}
                  onChange={(e) => setActiveBatch(e.target.value as any)}
                  className="px-2 py-1 border rounded-md text-sm"
                >
                  <option value="ALL">ALL</option>
                  {Object.keys(batches).map((batchNumber) => (
                    <option key={batchNumber} value={batchNumber}>
                      Batch {batchNumber}
                    </option>
                  ))}
                </select>
                <div className="text-sm text-muted-foreground">
                  {selectedEmails.size} selected
                </div>
              </div>

            {/* Email List */}
            <div className="border-2 border-gray-200 rounded-lg mb-4">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-700">
                  {activeBatch === 'ALL' 
                    ? `All Emails (${emails.length})`
                    : `Batch ${activeBatch} (${emails.filter(e => e.batch === Number(activeBatch)).length} emails)`
                  }
                </p>
              </div>
              <div className="h-96 overflow-y-auto">
                {loading && emails.length === 0 ? (
                  <div className="p-8 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-500" />
                    <p className="text-gray-500">Loading emails...</p>
                  </div>
                ) : emails.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="font-semibold">No emails in database yet</p>
                    <p className="text-sm mt-1">Add some emails on the left 👈</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {(activeBatch === 'ALL' ? emails : emails.filter(e => e.batch === Number(activeBatch))).map((email) => (
                      <div 
                        key={email.id} 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <Checkbox
                          checked={selectedEmails.has(email.id)}
                          onCheckedChange={() => toggleEmailSelection(email.id)}
                          className="flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{email.email}</p>
                          {email.name && (
                            <p className="text-xs text-gray-500 truncate">{email.name}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {email.batch && (
                            <Badge variant="outline" className="text-xs">
                              Batch {email.batch}
                            </Badge>
                          )}
                          {getStatusIcon(email.status)}
                          {(email.sentCount ?? 0) > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {email.sentCount}x
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            </div>

            <div className="sticky bottom-0 left-0 right-0 z-20 mt-4 border-t bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 rounded-b-md pointer-events-auto">
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground flex-1">
                  {selectedEmails.size} selected
                </div>
                {selectedEmails.size > 0 && (
                  <Button type="button" onClick={handleDelete} variant="outline" disabled={loading}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={handleSendCampaign}
                  disabled={sending || selectedEmails.size === 0}
                >
                  {sending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
