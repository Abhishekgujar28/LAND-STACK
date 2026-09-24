/**
 * Land Stack — Document Management Service (Database-Only)
 * 
 * Supports metadata tracking, secure storage uploads, and signed download URLs directly with Supabase.
 */

import { Errors } from '../../core/errors.js';
import { UserTypes } from '../../core/permissions.js';
import { getSupabaseAdmin, getSupabaseAnon } from '../../config/supabase.js';
import { AuditService } from '../audit/audit.service.js';
import { config } from '../../config/env.js';

export const DocumentService = {
  /**
   * List documents with filters from PostgreSQL
   */
  async getDocuments({ userId, parcelId, type, page = 1, limit = 20 } = {}, actor, client) {
    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    if (!db) throw Errors.internal('Database unavailable.');

    let query = db.from('documents').select('*', { count: 'exact' });

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

    if (error) {
      console.error('[DocumentService] Error fetching documents:', error.message);
      throw Errors.internal('Failed to fetch documents from database.');
    }

    return {
      items: data || [],
      total: count || 0,
      page,
      limit,
    };
  },

  /**
   * Get single document by ID
   */
  async getDocumentById(id, actor, client) {
    if (!id) throw Errors.badRequest('Document ID is required');
    const cleanId = id.trim();

    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    if (!db) throw Errors.internal('Database unavailable.');

    const { data: doc, error } = await db.from('documents').select('*').eq('id', cleanId).maybeSingle();

    if (error || !doc) {
      throw Errors.notFound(`Document '${cleanId}' not found in database.`);
    }

    // Citizen access check
    if (actor?.userType === UserTypes.CITIZEN) {
      const docOwner = doc.user_id;
      if (docOwner && docOwner !== actor.userId) {
        throw Errors.forbidden('Access denied to this document');
      }
    }

    return doc;
  },

  /**
   * Register or upload a document
   */
  async createDocument({ parcelId, parcelUlpin, type, title, certificateNumber, issuedBy, fileSize, fileUrl }, actor, client) {
    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    if (!db) throw Errors.internal('Database unavailable.');

    if (!actor || !actor.userId) {
      throw Errors.unauthenticated('Actor missing or invalid');
    }

    const docId = `DOC-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const record = {
      id: docId,
      user_id: actor.userId,
      parcel_ulpin: parcelUlpin || parcelId || null,
      title: title || `${type} Document`,
      type: type || 'Supporting Document',
      certificate_number: certificateNumber || null,
      issued_by: issuedBy || 'Sub-Registrar',
      file_url: fileUrl || `${config.storage.baseUrl}/docs/${docId}.pdf`,
      created_at: now,
    };

    const { data, error } = await db.from('documents').insert(record).select().single();

    if (error) {
      console.error('[DocumentService] Error creating document:', error.message);
      throw Errors.internal('Failed to register document in database: ' + error.message);
    }

    await AuditService.recordEvent({
      entityType: 'DOCUMENT',
      entityId: docId,
      action: 'DOCUMENT_UPLOADED',
      actor,
      payload: { parcelId: record.parcel_ulpin, type, title },
    });

    return data || record;
  },

  /**
   * Generate secure signed URL for document download
   */
  async getDownloadUrl(id, actor, client) {
    const doc = await this.getDocumentById(id, actor, client);

    if (doc.storage_path) {
      const db = client || getSupabaseAnon();
      if (db) {
        const { data, error } = await db.storage
          .from('documents')
          .createSignedUrl(doc.storage_path, 3600);

        if (!error && data?.signedUrl) {
          return {
            documentId: doc.id,
            url: data.signedUrl,
            expiresInSeconds: 3600,
          };
        }
      }
    }

    return {
      documentId: doc.id,
      url: doc.file_url || `${config.storage.baseUrl}/signed/${doc.id}.pdf`,
      expiresInSeconds: 3600,
    };
  },

  /**
   * Officer verification of document
   */
  async verifyDocument(id, { verified = true, remarks }, actor, client) {
    const doc = await this.getDocumentById(id, actor, client);

    const db = client || getSupabaseAnon();
    if (!db) throw Errors.internal('Database unavailable.');

    const now = new Date().toISOString();
    const { data, error } = await db
      .from('documents')
      .update({
        verified,
        verified_by: actor.userId,
        verified_at: now,
      })
      .eq('id', doc.id)
      .select()
      .single();

    if (error) {
      console.error('[DocumentService] Error verifying document:', error.message);
      throw Errors.internal('Failed to update document verification in database.');
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
      updatedAt: now,
    };
  },
};
