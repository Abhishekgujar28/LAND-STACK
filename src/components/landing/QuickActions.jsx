import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Fingerprint,
  Map,
  ArrowLeftRight,
  ShieldCheck,
  Headphones,
} from 'lucide-react';

/**
 * QuickActions - 6 Compact Government Quick Access Service Cards
 * Replicating exact reference UI with clean white cards, colored icons, and concise service labels.
 */
export const QuickActions = ({ className = '' }) => {
  const actions = [
    {
      id: 'ror',
      title: 'View Record of Rights',
      subtitle: '',
      icon: <FileText size={26} color="#EA580C" strokeWidth={2} />,
      to: '/services',
    },
    {
      id: 'ulpin',
      title: 'Search by Bhu-Aadhaar',
      subtitle: '(ULPIN)',
      icon: <Fingerprint size={26} color="#8C532B" strokeWidth={2} />,
      to: '/citizen/search',
    },
    {
      id: 'naksha',
      title: 'View Cadastral Map',
      subtitle: '(Bhu-Naksha)',
      icon: <Map size={26} color="#16A34A" strokeWidth={2} />,
      to: '/citizen/search',
    },
    {
      id: 'mutation',
      title: 'Online Mutation',
      subtitle: '(e-Ferfar)',
      icon: <ArrowLeftRight size={26} color="#F97316" strokeWidth={2.2} />,
      to: '/citizen/mutations',
    },
    {
      id: 'verify',
      title: 'Verify Land Documents',
      subtitle: '',
      icon: <ShieldCheck size={26} color="#16A34A" strokeWidth={2} />,
      to: '/citizen/due-diligence',
    },
    {
      id: 'helpdesk',
      title: 'Grievance / Helpdesk',
      subtitle: '',
      icon: <Headphones size={26} color="#EA580C" strokeWidth={2} />,
      to: '/contact',
    },
  ];

  return (
    <div className={`quick-actions-strip ${className}`.trim()}>
      <div className="quick-actions-cards-grid">
        {actions.map((act) => (
          <Link
            key={act.id}
            to={act.to}
            className="quick-action-card"
            title={`${act.title} ${act.subtitle}`.trim()}
          >
            <div className="quick-action-icon">
              {act.icon}
            </div>
            <div className="quick-action-labels">
              <span className="quick-action-title">{act.title}</span>
              {act.subtitle && (
                <span className="quick-action-subtitle">{act.subtitle}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
