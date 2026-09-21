import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoBanner } from './components/DemoBanner';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TouristDashboard } from './pages/TouristDashboard';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { ServiceDetailsPage } from './pages/ServiceDetailsPage';
import { TripPlannerPage } from './pages/TripPlannerPage';
import { PriceCheckPage } from './pages/PriceCheckPage';
import { ReviewIntelligencePage } from './pages/ReviewIntelligencePage';
import { TrustNetworkPage } from './pages/TrustNetworkPage';
import { HeatmapPage } from './pages/HeatmapPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { BusinessDashboard } from './pages/BusinessDashboard';
import { BusinessInsightsPage } from './pages/BusinessInsightsPage';
import { BusinessServicesPage } from './pages/BusinessServicesPage';
import { BusinessReviewsPage } from './pages/BusinessReviewsPage';
import { AuthorityDashboard } from './pages/AuthorityDashboard';

const MainLayout = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('landing');
  const [selectedServiceId, setSelectedServiceId] = useState(1);

  const handleViewServiceDetails = (serviceId) => {
    setSelectedServiceId(serviceId);
    setActiveTab('details');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage onNavigate={setActiveTab} />;

      case 'login':
        return <LoginPage onNavigate={setActiveTab} />;

      case 'register':
        return <RegisterPage onNavigate={setActiveTab} />;

      case 'tourist-dashboard':
        return <TouristDashboard onNavigate={setActiveTab} onViewDetails={handleViewServiceDetails} />;

      case 'discovery':
        return <DiscoveryPage onViewDetails={handleViewServiceDetails} />;

      case 'details':
        return (
          <ServiceDetailsPage
            serviceId={selectedServiceId}
            onBack={() => setActiveTab('discovery')}
            onViewDetails={handleViewServiceDetails}
          />
        );

      case 'planner':
        return <TripPlannerPage onViewDetails={handleViewServiceDetails} />;

      case 'price-check':
        return <PriceCheckPage />;

      case 'review-intelligence':
        return <ReviewIntelligencePage />;

      case 'trust-network':
        return <TrustNetworkPage onViewDetails={handleViewServiceDetails} />;

      case 'heatmap':
        return <HeatmapPage onViewDetails={handleViewServiceDetails} />;

      case 'feedback':
        return <FeedbackPage />;

      case 'business-dashboard':
        return (
          <ProtectedRoute allowedRoles={['BUSINESS']}>
            <BusinessDashboard onNavigate={setActiveTab} />
          </ProtectedRoute>
        );

      case 'business-insights':
        return (
          <ProtectedRoute allowedRoles={['BUSINESS']}>
            <BusinessInsightsPage />
          </ProtectedRoute>
        );

      case 'business-services':
        return (
          <ProtectedRoute allowedRoles={['BUSINESS']}>
            <BusinessServicesPage onViewDetails={handleViewServiceDetails} />
          </ProtectedRoute>
        );

      case 'business-reviews':
        return (
          <ProtectedRoute allowedRoles={['BUSINESS']}>
            <BusinessReviewsPage />
          </ProtectedRoute>
        );

      case 'authority-dashboard':
        return (
          <ProtectedRoute allowedRoles={['AUTHORITY']}>
            <AuthorityDashboard onNavigate={setActiveTab} />
          </ProtectedRoute>
        );

      default:
        return <LandingPage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <DemoBanner />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ flexGrow: 1 }}>
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
