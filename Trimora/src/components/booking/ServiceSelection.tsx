import React, { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart, Clock, IndianRupee } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  category: string;
  employee: {
    name: string;
    profileImage?: string;
    rating: number;
  };
}

interface CartItem extends Service {
  quantity: number;
}

interface ServiceSelectionProps {
  salonId: string;
  onContinue: (selectedServices: CartItem[]) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ salonId, onContinue }) => {
  const [services, setServices] = useState<{ [category: string]: Service[] }>({});
  const [, setFlatServices] = useState<Service[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, [salonId]);

  // Debug cart changes
  useEffect(() => {
    console.log('Cart updated:', cart);
  }, [cart]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://tromora-v1-b8fdk67zz-tousifhassana-8941s-projects.vercel.app/api/v1/employee-service/salon/${salonId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Service API Response:', data);
      
      if (data.status === 'success') {
        // Group services by category
        const groupedServices: { [category: string]: Service[] } = {};
        data.services.forEach((service: Service) => {
          if (!groupedServices[service.category]) {
            groupedServices[service.category] = [];
          }
          groupedServices[service.category].push(service);
        });
        
        setServices(groupedServices);
        setFlatServices(data.services);
      } else {
        setError('Failed to load services');
      }
    } catch (err) {
      setError('Failed to load services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (service: Service) => {
    console.log('Adding service to cart:', service);
    setCart(prev => {
      const existingItem = prev.find(item => item.id === service.id);
      if (existingItem) {
        const newCart = prev.map(item =>
          item.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        console.log('Updated cart (existing item):', newCart);
        return newCart;
      }
      const newCart = [...prev, { ...service, quantity: 1 }];
      console.log('Updated cart (new item):', newCart);
      return newCart;
    });
  };

  const removeFromCart = (serviceId: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === serviceId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item =>
          item.id === serviceId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.id !== serviceId);
    });
  };

  const getServiceQuantity = (serviceId: string) => {
    const item = cart.find(item => item.id === serviceId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalDuration = () => {
    return cart.reduce((total, item) => total + (item.duration * item.quantity), 0);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchServices}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Services List */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Services</h2>
              
              {Object.entries(services).map(([category, categoryServices]) => (
                <div key={category} className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">
                    {category}
                  </h3>
                  
                  <div className="space-y-4">
                    {categoryServices.map((service) => (
                      <div
                        key={service.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{service.name}</h4>
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatDuration(service.duration)}
                              </span>
                            </div>
                            
                            {service.description && (
                              <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                            )}
                            
                            <div className="flex items-center gap-4">
                              <span className="font-semibold text-lg flex items-center">
                                <IndianRupee className="w-4 h-4" />
                                {service.price}
                              </span>
                              
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <img
                                  src={service.employee.profileImage || '/default-avatar.svg'}
                                  alt={service.employee.name}
                                  className="w-6 h-6 rounded-full"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/default-avatar.svg';
                                  }}
                                />
                                <span>{service.employee.name}</span>
                                <span className="text-yellow-500">★ {service.employee.rating}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {getServiceQuantity(service.id) > 0 ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => removeFromCart(service.id)}
                                  className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                
                                <span className="w-8 text-center font-semibold">
                                  {getServiceQuantity(service.id)}
                                </span>
                                
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Plus button clicked (existing item) for service:', service.name);
                                    addToCart(service);
                                  }}
                                  className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log('Plus button clicked for service:', service.name);
                                  addToCart(service);
                                }}
                                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Cart Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Your Booking</h3>
              </div>
              
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Select services to add them to your booking
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Qty: {item.quantity}</span>
                            <span>•</span>
                            <span>{formatDuration(item.duration * item.quantity)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold flex items-center">
                            <IndianRupee className="w-4 h-4" />
                            {item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Total Duration:</span>
                      <span className="font-semibold">{formatDuration(getTotalDuration())}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-semibold">Total Price:</span>
                      <span className="text-xl font-bold flex items-center">
                        <IndianRupee className="w-5 h-5" />
                        {getTotalPrice()}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onContinue(cart)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Continue
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;
