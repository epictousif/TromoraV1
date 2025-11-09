import { useState } from 'react';
import { ArrowLeft, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SalonForm } from '../components/SalonForm';
import { SalonList } from '../components/SalonList';
import type { Salon } from '../types/salon';

type ViewMode = 'list' | 'add' | 'edit' | 'view';

export const SalonManagement = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);

  const handleAddSalon = () => {
    setSelectedSalon(null);
    setViewMode('add');
  };

  const handleEditSalon = (salon: Salon) => {
    setSelectedSalon(salon);
    setViewMode('edit');
  };

  const handleViewSalon = (salon: Salon) => {
    setSelectedSalon(salon);
    setViewMode('view');
  };

  const handleFormSuccess = (salon: Salon) => {
    setViewMode('list');
    setSelectedSalon(null);
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedSalon(null);
  };

  const getPageTitle = () => {
    switch (viewMode) {
      case 'add': return 'Add New Salon';
      case 'edit': return 'Edit Salon';
      case 'view': return 'Salon Details';
      default: return 'Salon Management';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          {viewMode !== 'list' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building className="h-8 w-8" />
            {getPageTitle()}
          </h1>
        </div>
        
        <p className="text-muted-foreground">
          {viewMode === 'list' && 'Manage your salon listings, add new salons, and update existing ones.'}
          {viewMode === 'add' && 'Fill in the details below to add a new salon to your listings.'}
          {viewMode === 'edit' && 'Update the salon information below.'}
          {viewMode === 'view' && 'View detailed information about your salon.'}
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {viewMode === 'list' && (
          <SalonList
            onAddSalon={handleAddSalon}
            onEditSalon={handleEditSalon}
            onViewSalon={handleViewSalon}
          />
        )}

        {(viewMode === 'add' || viewMode === 'edit') && (
          <SalonForm
            salon={selectedSalon}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        )}

        {viewMode === 'view' && selectedSalon && (
          <SalonDetailView
            salon={selectedSalon}
            onEdit={() => handleEditSalon(selectedSalon)}
            onBack={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

// Salon Detail View Component
interface SalonDetailViewProps {
  salon: Salon;
  onEdit: () => void;
  onBack: () => void;
}

const SalonDetailView = ({ salon, onEdit, onBack }: SalonDetailViewProps) => {
  return (
    <div className="space-y-6">
      {/* Salon Images */}
      {salon.image && salon.image.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {salon.image.map((img, index) => (
            <div key={index} className="aspect-video rounded-lg overflow-hidden">
              <img
                src={img}
                alt={`${salon.name} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Salon Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Name:</span> {salon.name}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {salon.phone}
              </div>
              <div>
                <span className="font-medium">Rating:</span> {salon.rating}/5 ({salon.reviews} reviews)
              </div>
              <div>
                <span className="font-medium">Status:</span> {salon.availability}
              </div>
              {salon.badge && (
                <div>
                  <span className="font-medium">Badge:</span> {salon.badge}
                </div>
              )}
              <div>
                <span className="font-medium">Featured:</span> {salon.featured ? 'Yes' : 'No'}
              </div>
            </div>
          </div>

          {/* Timing */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
            <div>
              <span className="font-medium">Open:</span> {salon.openTime} - {salon.closingTime}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Location</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Address:</span> {salon.location.address}
              </div>
              <div>
                <span className="font-medium">City:</span> {salon.location.city}
              </div>
              <div>
                <span className="font-medium">State:</span> {salon.location.state}
              </div>
              <div>
                <span className="font-medium">Pincode:</span> {salon.location.pincode}
              </div>
              <div>
                <span className="font-medium">Coordinates:</span> {salon.location.coordinates.latitude}, {salon.location.coordinates.longitude}
              </div>
              <div>
                <a 
                  href={salon.location.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View on Map
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Services Offered</h3>
        <div className="flex flex-wrap gap-2">
          {salon.services.map((service) => (
            <span
              key={service}
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Amenities */}
      {salon.amenities && salon.amenities.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {salon.amenities.map((amenity) => (
              <span
                key={amenity}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-700 leading-relaxed">{salon.description}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button onClick={onEdit} className="bg-red-600 hover:bg-red-700 text-white">
          Edit Salon
        </Button>
        <Button variant="outline" onClick={onBack}>
          Back to List
        </Button>
      </div>
    </div>
  );
};
