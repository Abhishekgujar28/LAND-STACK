/**
 * Land Stack — Document Management Service
 * 
 * Supports metadata tracking, secure storage uploads, and signed download URLs.
 */

import { v4 as uuidv4 } from 'uuid';
import { Errors } from '../../core/errors.js';
import { UserTypes } from '../../core/permissions.js';
import { getSupabaseAdmin, isSupabaseMode } from '../../config/supabase.js';
import { mockStore } from '../../data/mockStore.js';
import { AuditService } from '../audit/audit.service.js';

export const DocumentService = {
  /**
   * List documents with filters
   */
  async getDocuments({ userId, parcelId, type, page = 1, limit = 20 } = {}, actor) {
    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        let query = admin.from('documents').select('*', { count: 'exact' });

        if (actor?.userType === UserTypes.CITIZEN) {
          query = query.eq('user_id', actor.userId);
        } else if (userId) {
          query = query.eq('user_id', userId);
        }

        if (parcelId) query = query.ilike('parcel_ulpin', parcelId);
        if (type) query = query.eq('type', type);

        const offset = (page - 1) * limit;
        const { data, count, error } = await query
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (!error && data) {
          return { items: data, total: count || 0, page, limit };
        }
      }
    }

    let list = mockStore.documents || [];

    if (actor?.userType === UserTypes.CITIZEN) {
      list = list.filter((d) => (d.userId || d.user_id) === actor.userId);
    } else if (userId) {
      list = list.filter((d) => (d.userId || d.user_id) === userId);
    }

    if (parcelId) {
      const pLower = parcelId.toLowerCase();
      list = list.filter((d) => (d.parcelId || d.parcel_ulpin || '').toLowerCase() === pLower);
    }

    if (type) {
      list = list.filter((d) => (d.type || '').toLowerCase() === type.toLowerCase());
    }

    const offset = (page - 1) * limit;
    return {
      items: list.slice(offset, offset + limit),
      total: list.length,
      page,
      limit,
    };
  },

  /**
   * Get single document by ID
   */
  async getDocumentById(id, actor) {
    if (!id) throw Errors.badRequest('Document ID is required');
    const cleanId = id.trim();

    let doc = null;
    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        const { data } = await admin.from('documents').select('*').eq('id', cleanId).maybeSingle();
        doc = data;
      }
    }

    if (!doc) {
      doc = (mockStore.documents || []).find((d) => d.id === cleanId);
    }

    if (!doc) {
      throw Errors.notFound(`Document '${cleanId}' not found`);
    }

    // Citizen access check
    if (actor?.userType === UserTypes.CITIZEN) {
      const docOwner = doc.userId || doc.user_id;
      if (docOwner && docOwner !== actor.userId) {
        throw Errors.forbidden('Access denied to this document');
      }
    }

    return doc;
  },

  /**
   * Register or upload a document
   */
  async createDocument({ parcelId, type, title, fileSize, fileUrl, mimeType }, actor) {
    const docId = `DOC-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const record = {
      id: docId,
      userId: actor?.userId || 'CIT-001',
      user_id: actor?.userId || 'CIT-001',
      parcelId: parcelId || null,
      parcel_ulpin: parcelId || null,
      title: title || `${type} Document`,
      type: type || 'Supporting Document',
      date: now.split('T')[0],
      fileSize: fileSize || '250 KB',
      file_size_bytes: 256000,
      mime_type: mimeType || 'application/pdf',
      file_url: fileUrl || `https://storage.landstack.gov.in/docs/${docId}.pdf`,
      verified: false,
      created_at: now,
    };

    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        await admin.from('documents').insert({
          id: record.id,
          user_id: record.user_id,
          parcel_ulpin: record.parcel_ulpin,
          title: record.title,
          type: record.type,
          file_url: record.file_url,
          mime_type: record.mime_type,
          verified: record.verified,
        });
      }
    } else {
      if (mockStore.documents) {
        mockStore.documents.unshift(record);
      }
    }

    await AuditService.recordEvent({
      entityType: 'DOCUMENT',
      entityId: docId,
      action: 'DOCUMENT_UPLOADED',
      actor,
      payload: { parcelId, type, title },
    });

    return record;
  },

  /**
   * Generate secure signed URL for document download
   */
  async getDownloadUrl(id, actor) {
    const doc = await this.getDocumentById(id, actor);

    if (isSupabaseMode() && doc.storage_path) {
      const admin = getSupabaseAdmin();
      if (admin) {
        const { data, error } = await admin.storage
          .from('documents')
          .createSignedUrl(doc.storage_path, 3600); // 1 hour validity

        if (!error && data?.signedUrl) {
          return {
            documentId: doc.id,
            url: data.signedUrl,
            expiresInSeconds: 3600,
          };
        }
      }
    }

    // Fallback signed mock URL
    return {
      documentId: doc.id,
      url: doc.file_url || doc.url || `https://storage.landstack.gov.in/signed/${doc.id}.pdf?token=sec-${Date.now()}`,
      expiresInSeconds: 3600,
    };
  },

  /**
   * Officer verification of document
   */
  async verifyDocument(id, { verified = true, remarks }, actor) {
    const doc = await this.getDocumentById(id, actor);

    if (isSupabaseMode()) {
      const admin = getSupabaseAdmin();
      if (admin) {
        await admin
          .from('documents')
          .update({
            verified,
            verified_by: actor.userId,
            verified_at: new Date().toISOString(),
          })
          .eq('id', doc.id);
      }
    } else {
      doc.verified = verified;
      doc.verifiedBy = `${actor.role} (${actor.name})`;
      doc.verifiedAt = new Date().toISOString();
    }

    await AuditService.recordEvent({
      entityType: 'DOCUMENT',
      entityId: doc.id,
      action: verified ? 'DOCUMENT_VERIFIED' : 'DOCUMENT_REJECTED',
      actor,
      payload: { remarks },
    });

    return {
      id: doc.id,
      verified,
      verifiedBy: actor.name,
      updatedAt: new Date().toISOString(),
    };
  },
};
