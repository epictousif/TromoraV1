import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  MapPin, Phone, Clock, Upload, Loader2, Building, FileText, Wifi, Car, Coffee, Snowflake, X, ImageIcon, Star, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { useSalon } from '../hooks/useSalon';
import { useAuthStore } from '../store/authStore';
import type { Salon, SalonService, Amenity } from '../types/salon';

const MAX_IMAGES = 5;

// Validation schema
const salonSchema = z.object({
  name: z.string().min(2, 'Salon name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
  latitude: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= -90 && Number(val) <= 90, 'Invalid latitude'),
  longitude: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= -180 && Number(val) <= 180, 'Invalid longitude'),
  mapUrl: z.string().url('Please enter a valid map URL'),
  images: z.any().optional(),

  badge: z.enum(['Premium', 'Popular', 'Top Rated', '', 'none']).optional(),
  services: z.array(z.string()).min(1, 'Please select at least one service'),
  amenities: z.array(z.string()),
  openTime: z.string().min(1, 'Opening time is required'),
  closingTime: z.string().min(1, 'Closing time is required'),
  availability: z.enum(['Available Now', 'Busy']),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  featured: z.boolean()
});

type SalonFormData = z.infer<typeof salonSchema>;

interface SalonFormProps {
  salon?: Salon | null;
  onSuccess?: (salon: Salon) => void;
  onCancel?: () => void;
}

// Service options
const serviceOptions: SalonService[] = [
  'Haircut', 'Hair Styling', 'Hair Wash', 'Hair Coloring', 'Hair Treatment',
  'Beard Trim', 'Shaving', 'Mustache Styling', 'Facial', 'Face Cleanup',
  'Head Massage', 'Hair Spa', 'Eyebrow Threading', 'Manicure', 'Pedicure',
  'Waxing', 'Bleaching', 'Bridal Makeup', 'Party Makeup', 'Hair Straightening',
  'Hair Curling', 'Keratin Treatment', 'Scalp Treatment'
];

// Amenity options
const amenityOptions: { value: Amenity; label: string; icon: any }[] = [
  { value: 'AC', label: 'Air Conditioning', icon: Snowflake },
  { value: 'Parking', label: 'Parking', icon: Car },
  { value: 'WiFi', label: 'WiFi', icon: Wifi },
  { value: 'Coffee', label: 'Coffee', icon: Coffee }
];

export const SalonForm = ({ salon, onSuccess, onCancel }: SalonFormProps) => {
  const { createSalon, updateSalon, isLoading, error, clearError } = useSalon();
  const { user } = useAuthStore(); // Direct access to auth store
  const [selectedServices, setSelectedServices] = useState<SalonService[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [dragActive] = useState(false);

  const { register, handleSubmit, control, formState: { errors, isValid }, reset, setValue, watch } = useForm<SalonFormData>({
    resolver: zodResolver(salonSchema),
    mode: 'onChange',
    defaultValues: {
      services: [],
      amenities: [],
      featured: false,
      availability: 'Available Now',
      badge: 'none'
    }
  });
  const descValue = watch('description') || '';

  // Initialize form with salon data if editing
  useEffect(() => {
    if (salon) {
      reset({
        name: salon.name,
        address: salon.location.address,
        city: salon.location.city,
        state: salon.location.state,
        pincode: salon.location.pincode,
        latitude: salon.location.coordinates.latitude.toString(),
        longitude: salon.location.coordinates.longitude.toString(),
        mapUrl: salon.location.mapUrl,
        badge: salon.badge || 'none',
        services: salon.services,
        amenities: salon.amenities,
        openTime: salon.openTime,
        closingTime: salon.closingTime,
        availability: salon.availability,
        phone: salon.phone,
        description: salon.description,
        featured: salon.featured
      });
      setSelectedServices(salon.services);
      setSelectedAmenities(salon.amenities);
      setImagePreview(salon.image);
    }
  }, [salon, reset]);

  // Handle files
  const handleFiles = useCallback((files: File[]) => {
    const remainingSlots = MAX_IMAGES - imageFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);
    
    if (files.length > remainingSlots) {
      alert(`Maximum ${MAX_IMAGES} images allowed.`);
    }
    
    const newFiles = [...imageFiles, ...filesToAdd];
    const newPreviews = [...imagePreview, ...filesToAdd.map(file => URL.createObjectURL(file))];
    
    setImageFiles(newFiles);
    setImagePreview(newPreviews);
    setValue('images', newFiles);
  }, [imageFiles, imagePreview, setValue]);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  // Remove image
  const removeImage = useCallback((index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    
    setImageFiles(newFiles);
    setImagePreview(newPreviews);
    setValue('images', newFiles);
  }, [imageFiles, imagePreview, setValue]);

  // Handle service selection
  const handleServiceToggle = (service: SalonService) => {
    const updatedServices = selectedServices.includes(service)
      ? selectedServices.filter(s => s !== service)
      : [...selectedServices, service];
    
    setSelectedServices(updatedServices);
    setValue('services', updatedServices);
  };

  // Handle amenity selection
  const handleAmenityToggle = (amenity: Amenity) => {
    const updatedAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    
    setSelectedAmenities(updatedAmenities);
    setValue('amenities', updatedAmenities);
  };

  const onSubmit = async (data: SalonFormData) => {
    clearError();
    
    try {
      // Get user ID from auth store or localStorage as fallback
      let userId = user?.id; // Use id field as per API response
      console.log('User from store:', user);
      
      // If not in store, try to get from localStorage
      if (!userId) {
        try {
          const storedUser = localStorage.getItem('salon_user');
          console.log('Stored user data:', storedUser);
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            console.log('Parsed user:', parsedUser);
            userId = parsedUser.id; // Use id field as per API response
          }
        } catch (error) {
          console.error('Error parsing stored user:', error);
        }
      }
      
      if (!userId) {
        console.error('User not authenticated - no user ID found');
        alert('Please login first to create a salon');
        return;
      }
      
      console.log('Using user ID:', userId);

      const salonData = {
        ...data,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        owner: userId, // Add owner ID from authenticated user
        image: imageFiles.length > 0 ? imageFiles : (salon?.image || [] as string[]),
        badge: data.badge === '' || data.badge === 'none' ? undefined : data.badge,
        services: selectedServices,
        amenities: selectedAmenities
      };

      let result;
      if (salon) {
        // Update existing salon
        result = await updateSalon({
          _id: salon._id,
          ...salonData
        });
      } else {
        // Create new salon
        result = await createSalon(salonData);
      }

      if (result.success && result.data) {
        onSuccess?.(result.data);
        if (!salon) {
          reset();
          setSelectedServices([]);
          setSelectedAmenities([]);
          setImageFiles([]);
          setImagePreview([]);
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-red-700">
            <Building className="h-6 w-6" />
            {salon ? 'Edit Salon Details' : 'Create New Salon'}
          </CardTitle>
        </CardHeader>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </CardContent>
        </Card>
      )}

      {Object.keys(errors).length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <p className="text-amber-700 text-sm font-medium">
              {Object.keys(errors).length} field(s) need your attention. Please fix the highlighted inputs below.
            </p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Salon Name *</Label>
              <Input
                id="name"
                placeholder="Enter salon name"
                {...register('name')}
                className="h-10"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  placeholder="10-digit phone number"
                  className="pl-10 h-10"
                  {...register('phone')}
                />
              </div>
              <p className="text-[11px] text-gray-500">Digits only. Example: 9876543210</p>
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location Details
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                placeholder="Enter complete address"
                className="min-h-[60px]"
                {...register('address')}
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="City"
                  {...register('city')}
                  className="h-10"
                />
                {errors.city && (
                  <p className="text-xs text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  placeholder="State"
                  {...register('state')}
                  className="h-10"
                />
                {errors.state && (
                  <p className="text-xs text-red-500">{errors.state.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  placeholder="6-digit pincode"
                  {...register('pincode')}
                  className="h-10"
                />
                {errors.pincode && (
                  <p className="text-xs text-red-500">{errors.pincode.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  placeholder="e.g., 28.6139"
                  {...register('latitude')}
                  className="h-10"
                />
                {errors.latitude && (
                  <p className="text-xs text-red-500">{errors.latitude.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  placeholder="e.g., 77.2090"
                  {...register('longitude')}
                  className="h-10"
                />
                {errors.longitude && (
                  <p className="text-xs text-red-500">{errors.longitude.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mapUrl">Map URL *</Label>
              <Input
                id="mapUrl"
                placeholder="Google Maps URL"
                {...register('mapUrl')}
                className="h-10"
              />
              {errors.mapUrl && (
                <p className="text-xs text-red-500">{errors.mapUrl.message}</p>
              )}
            </div>
          </div>

        {/* Images Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-5 w-5 text-red-600" />
              Salon Images
              <Badge variant="secondary" className="ml-2">{imageFiles.length}/{MAX_IMAGES}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drag and Drop Area */}
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer",
                dragActive ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-red-400 hover:bg-red-50",
                imageFiles.length >= MAX_IMAGES && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => imageFiles.length < MAX_IMAGES && document.getElementById('images')?.click()}
            >
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-700">
                  {imageFiles.length >= MAX_IMAGES ? 'Maximum images reached' : 'Click to upload images'}
                </p>
                <p className="text-sm text-gray-500">
                  {imageFiles.length < MAX_IMAGES ? `Max ${MAX_IMAGES} images allowed` : `${imageFiles.length}/${MAX_IMAGES} images uploaded`}
                </p>
              </div>
            </div>
            
            <Input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Image Previews */}
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                {imagePreview.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Services Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-red-600" />
              Services Offered *
              <Badge variant="secondary" className="ml-2">{selectedServices.length} selected</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {serviceOptions.map((service) => (
                <Badge
                  key={service}
                  variant={selectedServices.includes(service) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer py-2 px-4 text-sm transition-all hover:scale-105",
                    selectedServices.includes(service) 
                      ? "bg-red-600 hover:bg-red-700 text-white" 
                      : "hover:bg-red-50 hover:border-red-300"
                  )}
                  onClick={() => handleServiceToggle(service)}
                >
                  {service}
                </Badge>
              ))}
            </div>
            {errors.services && (
              <p className="text-xs text-red-500 font-medium">{errors.services.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Amenities Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-red-600" />
              Amenities
              <Badge variant="secondary" className="ml-2">{selectedAmenities.length} selected</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {amenityOptions.map(({ value, label, icon: Icon }) => (
                <div
                  key={value}
                  onClick={() => handleAmenityToggle(value)}
                  className={cn(
                    "flex items-center gap-3 border rounded-full px-6 py-3 cursor-pointer transition-all hover:scale-105",
                    selectedAmenities.includes(value)
                      ? "bg-red-600 text-white border-red-600 shadow-lg"
                      : "hover:bg-red-50 hover:border-red-300 border-gray-300"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Business Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-red-600" />
              Business Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openTime" className="text-sm font-semibold">Opening Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="openTime"
                    type="time"
                    className="pl-10 h-11 border-2 focus:border-red-400"
                    {...register('openTime')}
                  />
                </div>
                {errors.openTime && (
                  <p className="text-xs text-red-500 font-medium">{errors.openTime.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="closingTime" className="text-sm font-semibold">Closing Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="closingTime"
                    type="time"
                    className="pl-10 h-11 border-2 focus:border-red-400"
                    {...register('closingTime')}
                  />
                </div>
                {errors.closingTime && (
                  <p className="text-xs text-red-500 font-medium">{errors.closingTime.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availability" className="text-sm font-semibold">Availability *</Label>
                <Controller
                  name="availability"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11 border-2 focus:border-red-400">
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available Now">Available Now</SelectItem>
                        <SelectItem value="Busy">Busy</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.availability && (
                  <p className="text-xs text-red-500 font-medium">{errors.availability.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="badge" className="text-sm font-semibold">Badge (Optional)</Label>
                <Controller
                  name="badge"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11 border-2 focus:border-red-400">
                        <SelectValue placeholder="Select badge" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Badge</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="Popular">Popular</SelectItem>
                        <SelectItem value="Top Rated">Top Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex items-center space-x-3 pt-8">
                <Controller
                  name="featured"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="featured"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="w-5 h-5"
                    />
                  )}
                />
                <Label htmlFor="featured" className="cursor-pointer font-medium">
                  Mark as Featured Salon
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">Description *</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  id="description"
                  placeholder="Describe your salon, services, and what makes it special..."
                  className="pl-10 min-h-[120px] border-2 focus:border-red-400 pr-14"
                  maxLength={1000}
                  {...register('description')}
                />
                <span className="absolute right-3 bottom-3 text-[11px] text-gray-500">
                  {descValue.length}/1000
                </span>
              </div>
              {errors.description && (
                <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Form Actions Card */}
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-black hover:bg-black text-white h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isLoading || !isValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {salon ? 'Updating Salon...' : 'Creating Salon...'}
                  </>
                ) : (
                  <>
                    <Building className="mr-2 h-5 w-5" />
                    {salon ? 'Update Salon' : 'Create Salon'}
                  </>
                )}
              </Button>
              
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 h-12 text-lg font-semibold border-2 hover:bg-black hover:text-white hover:border-black"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        </form>
    </div>
  );
};
