import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

/**
 * TaxCard - Land revenue, cess, Gram Panchayat property tax
 */
export const TaxCard = ({ tax, onPay, className = '' }) => {
  if (!tax) return null;

  return (
    <Card className={`parcel-tax ${className}`.trim()} header={<strong>Land Revenue & Local Taxes (Akar / Cess)</strong>}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Annual Assessment (Akar):</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ux4g-primary)' }}>
            ₹{tax.annualAssessment || '150'} / year
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', marginTop: '0.2rem' }}>
            Outstanding Dues: <strong>₹{tax.outstandingDues || '0'}</strong> &bull; Assessment Year: {tax.financialYear || '2025-26'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Badge variant={tax.outstandingDues > 0 ? 'warning' : 'success'}>
            {tax.outstandingDues > 0 ? 'Dues Pending' : 'Taxes Paid (NOC Valid)'}
          </Badge>
          {tax.outstandingDues > 0 && onPay && (
            <Button variant="primary" size="sm" onClick={onPay}>
              Pay Online (e-Challan)
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaxCard;
