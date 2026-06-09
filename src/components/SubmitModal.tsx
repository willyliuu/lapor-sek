'use client';

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { X, Upload, MapPin, Send } from 'lucide-react';
import { useApp, IssueCategory } from '@/context/AppContext';
import { DynamicLocationPicker } from './DynamicLocationPicker';

const MOCK_PHOTOS: Record<string, string> = {
  road_damage: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800&auto=format&fit=crop&q=60',
  flooding: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=60',
  waste: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&auto=format&fit=crop&q=60',
  lighting: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=60',
  facility: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop&q=60',
  other: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=60',
};

export const SubmitModal: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { addIssue } = useApp();

  const isOpen = searchParams.get('submit') === 'true';

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory>('road_damage');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState(-6.2088);
  const [longitude, setLongitude] = useState(106.8456);
  const [address, setAddress] = useState('Jl. Jend. Sudirman, Jakarta');
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    // Navigate back to the same page without the query parameters
    const params = new URLSearchParams(searchParams);
    params.delete('submit');
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('road_damage');
    setIsPhotoSelected(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Use mock photo URL corresponding to chosen category if user simulated photo select
    const photoUrl = isPhotoSelected ? MOCK_PHOTOS[category] : undefined;

    addIssue({
      title,
      description,
      category,
      latitude,
      longitude,
      address: address || 'Custom pinned location',
      photo_url: photoUrl,
    });

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-inverse-surface/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative border border-outline-variant/30">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-on-surface">Report an Issue</h2>
            <p className="text-xs md:text-sm text-on-surface-variant mt-1">Provide details to help your community resolve the problem.</p>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-background">
          
          {/* Left Column: Details */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="title">
                Issue Title <span className="text-error">*</span>
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Pothole on Main St"
                className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="category">
                Category <span className="text-error">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as IssueCategory)}
                className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
              >
                <option value="road_damage">Road Damage</option>
                <option value="flooding">Flooding</option>
                <option value="waste">Waste Management</option>
                <option value="lighting">Street Lighting</option>
                <option value="facility">Public Facility</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="desc">
                Description
              </label>
              <textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about the issue..."
                rows={4}
                className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Simulated Photo upload */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">Add Photo</label>
              <div 
                onClick={() => setIsPhotoSelected(!isPhotoSelected)}
                className={`border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isPhotoSelected 
                    ? 'border-primary bg-primary-fixed/20' 
                    : 'border-outline-variant bg-surface-variant/20 hover:bg-surface-variant/40'
                }`}
              >
                <Upload className={`w-8 h-8 mb-2 ${isPhotoSelected ? 'text-primary' : 'text-on-surface-variant'}`} />
                <span className="text-xs font-semibold text-on-surface text-center">
                  {isPhotoSelected ? 'Photo Mock Connected' : 'Simulate Adding Photo (Click)'}
                </span>
                <span className="text-[10px] text-on-surface-variant mt-1 text-center">
                  {isPhotoSelected ? 'Will display category matching photo' : 'Auto-resolves appropriate mockup image'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Location Map picker */}
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">
                Location <span className="text-error">*</span>
              </label>
              <p className="text-xs text-on-surface-variant mb-2">Pinpoint the exact location of the issue.</p>
              
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address or coordinates description..."
                  className="w-full bg-white border border-outline-variant rounded-lg pl-9 pr-4 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <MapPin className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex-1 min-h-[220px] rounded-xl overflow-hidden border border-outline-variant relative">
              <DynamicLocationPicker
                initialLat={latitude}
                initialLng={longitude}
                onChange={(lat, lng) => {
                  setLatitude(lat);
                  setLongitude(lng);
                  // Update coordinates description
                  setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
                }}
              />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur px-3 py-1 rounded-full border border-outline-variant shadow-sm pointer-events-none">
                <span className="text-[10px] font-semibold text-on-surface">Click map to move pin</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="col-span-1 md:col-span-2 border-t border-outline-variant/30 pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-primary hover:bg-surface-variant/50 transition-colors border border-outline-variant"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/95 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>Submit Issue</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SubmitModal;
