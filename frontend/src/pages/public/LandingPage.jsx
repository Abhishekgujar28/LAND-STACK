import React, { useState, useEffect } from 'react';
import analyticsService from '../../services/analyticsService';
import './LandingPage.css';

// Landing components
import Hero from '../../components/landing/Hero';
import NationalStatsBar from '../../components/landing/NationalStatsBar';
import ProcessWorkflow from '../../components/landing/ProcessWorkflow';
import PlatformPillars from '../../components/landing/PlatformPillars';
import DepartmentPortals from '../../components/landing/DepartmentPortals';
import StateSpotlight from '../../components/landing/StateSpotlight';
import ExternalLinksCarousel from '../../components/landing/ExternalLinksCarousel';

// Fallback authoritative datasets
import {
  defaultNationalStats,
  defaultStateAnalytics,
} from '../../data/landingData';

/**
 * LandingPage - National Land Governance & Cadastral Intelligence Portal
 * An informational, structured government overview explaining platform architecture,
 * end-to-end citizen-to-official lifecycle, and institutional governance pillars.
 */
export const LandingPage = () => {
  const [nationalStats, setNationalStats] = useState(defaultNationalStats);
  const [stateAnalytics, setStateAnalytics] = useState(defaultStateAnalytics);

  useEffect(() => {
    let isMounted = true;

    // Fetch national analytics KPIs if available
    analyticsService
      .getNationalData()
      .then((data) => {
        if (isMounted && data && typeof data === 'object') {
          setNationalStats((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => {
        console.warn('Using default national stats dataset:', err.message);
      });

    // Fetch national benchmarks / state data if available
    analyticsService
      .getNationalBenchmarks()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setStateAnalytics(data);
        }
      })
      .catch((err) => {
        console.warn('Using default state analytics dataset:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = (query) => {
    console.log('Search query submitted:', query);
  };

  return (
    <div className="page-landing">
      {/* 1. Hero Section */}
      <Hero onSearch={handleSearch} />

      {/* 2. National Metrics Bar */}
      <NationalStatsBar stats={nationalStats} />

      {/* 3. End-to-End Governance Lifecycle (Citizen to Government Officials) */}
      <ProcessWorkflow />

      {/* 4. Core Capabilities & Technological Pillars of the Platform */}
      <PlatformPillars />

      {/* 5. Multi-Tier Administrative Governance Architecture & Official Cockpits */}
      <DepartmentPortals />

      {/* 6. State Cadastral Benchmark & Public Transparency Index */}
      <StateSpotlight stateAnalytics={stateAnalytics} />

      {/* 7. Related National Portals & Trust Framework */}
      <ExternalLinksCarousel />
    </div>
  );
};

export default LandingPage;
