import { db } from '@/server/db/connection';
import { emailList, emailCampaigns, emailCampaignRecipients, type EmailListEntry, type EmailCampaign } from '@/server/db/schema';
import { eq, desc, and, inArray, sql, or, ilike } from 'drizzle-orm';

export class EmailRepository {
  // Email List Operations
  async getAllEmails(limit = 1000, offset = 0) {
    return await db
      .select()
      .from(emailList)
      .orderBy(desc(emailList.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async searchEmails(query: string) {
    return await db
      .select()
      .from(emailList)
      .where(
        or(
          ilike(emailList.email, `%${query}%`),
          ilike(emailList.name, `%${query}%`),
          ilike(emailList.notes, `%${query}%`)
        )
      )
      .orderBy(desc(emailList.createdAt));
  }

  async getEmailsByStatus(status: string) {
    return await db
      .select()
      .from(emailList)
      .where(eq(emailList.status, status))
      .orderBy(desc(emailList.createdAt));
  }

  async getBatches() {
    // Returns list of batches with counts and sent stats
    const rows = await db
      .select({
        batch: emailList.batch,
        total: sql<number>`count(*)`,
        sent: sql<number>`sum(case when ${emailList.sentCount} > 0 then 1 else 0 end)`,
      })
      .from(emailList)
      .groupBy(emailList.batch)
      .orderBy(emailList.batch);

    return rows.filter((r) => r.batch != null);
  }

  async getEmailsByBatch(batch: number | string) {
    const batchNumber = typeof batch === 'string' ? Number(batch) : batch;
    if (Number.isNaN(batchNumber)) return [];
    return await db
      .select()
      .from(emailList)
      .where(eq(emailList.batch, batchNumber))
      .orderBy(desc(emailList.createdAt));
  }

  async getEmailById(id: string) {
    const results = await db
      .select()
      .from(emailList)
      .where(eq(emailList.id, id))
      .limit(1);
    return results[0];
  }

  async getEmailByAddress(email: string) {
    const results = await db
      .select()
      .from(emailList)
      .where(eq(emailList.email, email.toLowerCase()))
      .limit(1);
    return results[0];
  }

  async addEmail(email: string, name?: string, notes?: string, addedBy?: string) {
    try {
      const existing = await this.getEmailByAddress(email);
      if (existing) {
        return { success: false, error: 'Email already exists', data: existing };
      }

      const [result] = await db
        .insert(emailList)
        .values({
          email: email.toLowerCase(),
          name,
          notes,
          addedBy,
          status: 'pending',
          sentCount: 0,
        })
        .returning();

      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async bulkAddEmails(emails: Array<{ email: string; name?: string }>, addedBy?: string) {
    const results = {
      added: [] as EmailListEntry[],
      skipped: [] as string[],
      errors: [] as string[],
    };

    for (const entry of emails) {
      const email = (entry.email || '').toLowerCase().trim();
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        results.errors.push(email);
        continue;
      }

      const existing = await this.getEmailByAddress(email);
      if (existing) {
        results.skipped.push(email);
        continue;
      }

      try {
        const [result] = await db
          .insert(emailList)
          .values({
            email,
            name: entry.name,
            addedBy,
            status: 'pending',
            sentCount: 0,
          })
          .returning();
        results.added.push(result);
      } catch (error) {
        results.errors.push(email);
      }
    }

    return results;
  }

  async updateEmailStatus(id: string, status: string) {
    const [result] = await db
      .update(emailList)
      .set({ 
        status, 
        updatedAt: new Date(),
        lastSentAt: status === 'sent' ? new Date() : undefined,
        sentCount: status === 'sent' ? sql`${emailList.sentCount} + 1` : undefined,
      })
      .where(eq(emailList.id, id))
      .returning();
    return result;
  }

  async updateEmail(id: string, data: Partial<EmailListEntry>) {
    const [result] = await db
      .update(emailList)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(emailList.id, id))
      .returning();
    return result;
  }

  async deleteEmail(id: string) {
    const [result] = await db
      .delete(emailList)
      .where(eq(emailList.id, id))
      .returning();
    return result;
  }

  async deleteMultipleEmails(ids: string[]) {
    if (ids.length === 0) return [];
    
    const results = await db
      .delete(emailList)
      .where(inArray(emailList.id, ids))
      .returning();
    return results;
  }

  // Campaign Operations
  async getAllCampaigns() {
    return await db
      .select()
      .from(emailCampaigns)
      .orderBy(desc(emailCampaigns.createdAt));
  }

  async getCampaignById(id: string) {
    const results = await db
      .select()
      .from(emailCampaigns)
      .where(eq(emailCampaigns.id, id))
      .limit(1);
    return results[0];
  }

  async createCampaign(data: {
    name: string;
    subject: string;
    template?: string;
    createdBy?: string;
  }) {
    const [result] = await db
      .insert(emailCampaigns)
      .values({
        ...data,
        status: 'draft',
        totalEmails: 0,
        sentEmails: 0,
        failedEmails: 0,
      })
      .returning();
    return result;
  }

  async updateCampaign(id: string, data: Partial<EmailCampaign>) {
    const [result] = await db
      .update(emailCampaigns)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(emailCampaigns.id, id))
      .returning();
    return result;
  }

  async startCampaign(id: string, totalEmails: number) {
    const [result] = await db
      .update(emailCampaigns)
      .set({ 
        status: 'sending',
        startedAt: new Date(),
        totalEmails,
        updatedAt: new Date(),
      })
      .where(eq(emailCampaigns.id, id))
      .returning();
    return result;
  }

  async completeCampaign(id: string, sentEmails: number, failedEmails: number) {
    const [result] = await db
      .update(emailCampaigns)
      .set({ 
        status: 'completed',
        completedAt: new Date(),
        sentEmails,
        failedEmails,
        updatedAt: new Date(),
      })
      .where(eq(emailCampaigns.id, id))
      .returning();
    return result;
  }

  async addCampaignRecipient(campaignId: string, emailId: string) {
    const [result] = await db
      .insert(emailCampaignRecipients)
      .values({
        campaignId,
        emailId,
        status: 'pending',
      })
      .returning();
    return result;
  }

  async updateCampaignRecipient(
    campaignId: string,
    emailId: string,
    status: string,
    messageId?: string,
    error?: string
  ) {
    const [result] = await db
      .update(emailCampaignRecipients)
      .set({
        status,
        messageId,
        error,
        sentAt: status === 'sent' ? new Date() : undefined,
      })
      .where(
        and(
          eq(emailCampaignRecipients.campaignId, campaignId),
          eq(emailCampaignRecipients.emailId, emailId)
        )
      )
      .returning();
    return result;
  }

  async getCampaignRecipients(campaignId: string) {
    return await db
      .select({
        recipient: emailCampaignRecipients,
        email: emailList,
      })
      .from(emailCampaignRecipients)
      .leftJoin(emailList, eq(emailCampaignRecipients.emailId, emailList.id))
      .where(eq(emailCampaignRecipients.campaignId, campaignId));
  }

  // Statistics
  async getEmailStats() {
    const total = await db.select({ count: sql<number>`count(*)` }).from(emailList);
    const byStatus = await db
      .select({
        status: emailList.status,
        count: sql<number>`count(*)`,
      })
      .from(emailList)
      .groupBy(emailList.status);

    return {
      total: total[0]?.count || 0,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status || 'unknown'] = item.count;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  async getCampaignStats() {
    const total = await db.select({ count: sql<number>`count(*)` }).from(emailCampaigns);
    const byStatus = await db
      .select({
        status: emailCampaigns.status,
        count: sql<number>`count(*)`,
      })
      .from(emailCampaigns)
      .groupBy(emailCampaigns.status);

    return {
      total: total[0]?.count || 0,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status || 'unknown'] = item.count;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}

export const emailRepository = new EmailRepository();
