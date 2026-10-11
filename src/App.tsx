import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { QuotationCalculator } from './components/QuotationCalculator';
import { ContactCard } from './components/ContactCard';
import { AdminPortal } from './components/AdminPortal';
import { MobileQuickBar } from './components/MobileQuickBar';
import { Footer } from './components/Footer';
import {
  INITIAL_COMPANY_PROFILE,
  INITIAL_SERVICES,
} from './data/initialData';
import {
  subscribeToCompanyInfo,
  subscribeToServices,
  testConnection,
} from './firebase';
import { CompanyProfile, ServiceItem, ServiceCategory } from './types';

export default function App() {
  const [companyInfo, setCompanyInfo] = useState<CompanyProfile>(INITIAL_COMPANY_PROFILE);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedQuoteCategory, setSelectedQuoteCategory] = useState<ServiceCategory>('AIR_CONDITIONING');

  // Test Firebase Firestore connection & subscribe to realtime updates
  useEffect(() => {
    testConnection();

    // Listen to company info from Firestore
    const unsubCompany = subscribeToCompanyInfo((remoteProfile) => {
      if (remoteProfile) {
        setCompanyInfo((prev) => ({
          ...prev,
          ...remoteProfile,
        }));
      }
    });

    // Listen to services catalog from Firestore
    const unsubServices = subscribeToServices((remoteServices) => {
      if (remoteServices && remoteServices.length > 0) {
        setServices(remoteServices);
      }
    });

    return () => {
      unsubCompany();
      unsubServices();
    };
  }, []);

  const handleSelectServiceForQuote = (category: ServiceCategory) => {
    setSelectedQuoteCategory(category);
    const element = document.getElementById('calculator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToQuote = () => {
    const element = document.getElementById('calculator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans antialiased">
      
      {/* Navigation Header */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigateToQuote={handleNavigateToQuote}
      />

      <main className="flex-1">
        {/* Simple & Clear Hero (No Images) */}
        <Hero
          companyInfo={companyInfo}
          onRequestQuote={handleNavigateToQuote}
          onExploreServices={() => {
            const el = document.getElementById('services');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 5 Core Services (Clean Text Cards, No Images) */}
        <ServicesSection
          services={services}
          onSelectServiceForQuote={handleSelectServiceForQuote}
        />

        {/* Easy Quotation / Site Visit Form */}
        <QuotationCalculator
          initialCategory={selectedQuoteCategory}
          phone={companyInfo.phone}
          lineId={companyInfo.lineId}
        />

        {/* Clear Contact Details & Office Location */}
        <ContactCard companyInfo={companyInfo} />
      </main>

      {/* Simple Footer */}
      <Footer
        companyInfo={companyInfo}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Mobile Floating Quick Action Dock */}
      <MobileQuickBar
        phone={companyInfo.phone}
        lineId={companyInfo.lineId}
        onRequestQuote={handleNavigateToQuote}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Admin Management Modal Portal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        services={services}
        companyInfo={companyInfo}
      />

    </div>
  );
}
