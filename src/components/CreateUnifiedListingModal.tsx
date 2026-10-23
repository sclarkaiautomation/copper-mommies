/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Star, 
  Check, 
  Plus, 
  Sparkles, 
  Briefcase, 
  Repeat, 
  Home, 
  Calendar, 
  Store,
  DollarSign,
  Clock,
  MapPin,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { 
  UnifiedListing, 
  MarketplaceCategoryType, 
  addUnifiedListing 
} from '../data/unifiedMarketplaceStore';

interface CreateUnifiedListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  selectedState: string;
  initialCategory?: MarketplaceCategoryType;
  onListingCreated?: (listing: UnifiedListing) => void;
  showToast?: (message: string) => void;
}

export default function CreateUnifiedListingModal({
  isOpen,
  onClose,
  userName,
  selectedState,
  initialCategory = 'gig',
  onListingCreated,
  showToast
}: CreateUnifiedListingModalProps) {
  const [categoryType, setCategoryType] = useState<MarketplaceCategoryType>(initialCategory);

  // Sync categoryType with initialCategory prop whenever modal opens
  React.useEffect(() => {
    if (initialCategory && isOpen) {
      setCategoryType(initialCategory);
    }
  }, [initialCategory, isOpen]);

  // Common Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [primaryCoverIndex, setPrimaryCoverIndex] = useState(0);
  const [crossPostedToHub, setCrossPostedToHub] = useState(true);

  // 1. Gig Specifics
  const [employmentType, setEmploymentType] = useState<'Contract' | 'Part-time' | 'Full-time' | 'Micro-Gig'>('Contract');
  const [compensation, setCompensation] = useState('');
  const [compensationType, setCompensationType] = useState<'cash' | 'time_credit' | 'hybrid'>('hybrid');
  const [remoteOrInPerson, setRemoteOrInPerson] = useState<'Remote' | 'On-Site' | 'Hybrid'>('On-Site');
  const [requirementsInput, setRequirementsInput] = useState('');
  const [dutiesInput, setDutiesInput] = useState('');

  // 2. Barter Specifics
  const [barterType, setBarterType] = useState<'Service Exchange' | 'Item Swap' | 'Copper Trade' | 'Copper Gift'>('Item Swap');
  const [tradeForWishlist, setTradeForWishlist] = useState('');
  const [itemCondition, setItemCondition] = useState<'New / Unopened' | 'Artisanal / Handmade' | 'Gently Used' | 'Heirloom'>('Artisanal / Handmade');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [deliveryOrPickup, setDeliveryOrPickup] = useState<'Pick-up only' | 'Sister Drop-off' | 'Shipping Available' | 'Flexible'>('Flexible');
  const [timeCreditEquivalent, setTimeCreditEquivalent] = useState<number>(3);

  // 3. Housing Specifics
  const [housingType, setHousingType] = useState<'Private Room' | 'Maternity Suite' | 'Homestead Acreage' | 'Shared Home'>('Private Room');
  const [bedrooms, setBedrooms] = useState<number>(1);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [squareFootage, setSquareFootage] = useState<string>('');
  const [monthlyTerms, setMonthlyTerms] = useState('');
  const [availableDate, setAvailableDate] = useState('Immediate / Flexible');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Air Conditioning',
    'Washer/Dryer Access',
    'Off-Street Parking'
  ]);
  const [petPolicy, setPetPolicy] = useState<'Pets welcome' | 'Cats only' | 'No pets' | 'Case-by-case'>('Pets welcome');

  // 4. Workshop / Event Specifics
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [locationType, setLocationType] = useState<'in-person' | 'virtual' | 'hybrid'>('in-person');
  const [venueOrCity, setVenueOrCity] = useState('');
  const [virtualLink, setVirtualLink] = useState('');
  const [participantCap, setParticipantCap] = useState<string>('20');
  const [suppliesInput, setSuppliesInput] = useState('');

  // 5. Sister Business Specifics
  const [industry, setIndustry] = useState('Artisan & Crafting');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [communityOffer, setCommunityOffer] = useState('');
  const [servicesInput, setServicesInput] = useState('');

  // Handle Photo File Upload (Multi-Select)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotos(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file as Blob);
    });

    if (showToast) showToast('📸 Photo added to listing gallery!');
  };

  const handleAddPhotoUrl = () => {
    if (!newPhotoUrl.trim()) return;
    setPhotos(prev => [...prev, newPhotoUrl.trim()]);
    setNewPhotoUrl('');
    if (showToast) showToast('🔗 Photo URL attached!');
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    if (primaryCoverIndex >= index && primaryCoverIndex > 0) {
      setPrimaryCoverIndex(prev => prev - 1);
    }
  };

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(prev => prev.filter(a => a !== item));
    } else {
      setSelectedAmenities(prev => [...prev, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please provide a listing title and description.');
      return;
    }

    // Default cover photo if none uploaded
    const defaultCover = categoryType === 'gig'
      ? 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'
      : categoryType === 'housing'
      ? 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
      : categoryType === 'barter'
      ? 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'
      : categoryType === 'event'
      ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80';

    const finalPhotos = photos.length > 0 ? photos : [defaultCover];
    const primaryCover = finalPhotos[primaryCoverIndex] || finalPhotos[0];

    const newListing: UnifiedListing = {
      id: `${categoryType}-${Date.now()}`,
      categoryType,
      title: title.trim(),
      description: description.trim(),
      authorName: userName,
      authorRole: 'Verified Mother',
      authorState: selectedState,
      authorCity: city.trim() || `${selectedState} Regional Circle`,
      authorAvatar: categoryType === 'gig' ? '💼' : categoryType === 'housing' ? '🏡' : categoryType === 'event' ? '📅' : '🤝',
      createdAt: 'Just now',
      status: 'open',
      photos: finalPhotos,
      primaryCoverImage: primaryCover,
      crossPostedToHub,
      originHub: 'commons',
      details: {
        // Gigs
        employmentType: categoryType === 'gig' ? employmentType : undefined,
        compensation: categoryType === 'gig' ? (compensation.trim() || '$25 - $35/hr or Barter Split') : undefined,
        compensationType: categoryType === 'gig' ? compensationType : undefined,
        remoteOrInPerson: categoryType === 'gig' ? remoteOrInPerson : undefined,
        requirements: categoryType === 'gig' && requirementsInput.trim() 
          ? requirementsInput.split('\n').map(r => r.trim()).filter(Boolean)
          : undefined,
        duties: categoryType === 'gig' && dutiesInput.trim()
          ? dutiesInput.split('\n').map(d => d.trim()).filter(Boolean)
          : undefined,

        // Barter
        barterType: categoryType === 'barter' ? barterType : undefined,
        tradeForWishlist: categoryType === 'barter' ? tradeForWishlist.trim() : undefined,
        itemCondition: categoryType === 'barter' ? itemCondition : undefined,
        estimatedValue: categoryType === 'barter' ? estimatedValue.trim() : undefined,
        deliveryOrPickup: categoryType === 'barter' ? deliveryOrPickup : undefined,
        timeCreditEquivalent: categoryType === 'barter' ? timeCreditEquivalent : undefined,

        // Housing
        housingType: categoryType === 'housing' ? housingType : undefined,
        bedrooms: categoryType === 'housing' ? bedrooms : undefined,
        bathrooms: categoryType === 'housing' ? bathrooms : undefined,
        squareFootage: categoryType === 'housing' && squareFootage ? parseInt(squareFootage, 10) : undefined,
        monthlyTerms: categoryType === 'housing' ? monthlyTerms.trim() : undefined,
        availableDate: categoryType === 'housing' ? availableDate.trim() : undefined,
        amenities: categoryType === 'housing' ? selectedAmenities : undefined,
        petPolicy: categoryType === 'housing' ? petPolicy : undefined,

        // Events
        eventDate: categoryType === 'event' ? eventDate.trim() : undefined,
        eventTime: categoryType === 'event' ? eventTime.trim() : undefined,
        locationType: categoryType === 'event' ? locationType : undefined,
        venueOrCity: categoryType === 'event' ? venueOrCity.trim() : undefined,
        virtualLink: categoryType === 'event' ? virtualLink.trim() : undefined,
        participantCap: categoryType === 'event' && participantCap ? parseInt(participantCap, 10) : undefined,
        suppliesNeeded: categoryType === 'event' && suppliesInput.trim()
          ? suppliesInput.split('\n').map(s => s.trim()).filter(Boolean)
          : undefined,
        rsvps: categoryType === 'event' ? { [userName]: 'going' } : undefined,

        // Business
        industry: categoryType === 'business' ? industry : undefined,
        websiteUrl: categoryType === 'business' ? websiteUrl.trim() : undefined,
        contactEmail: categoryType === 'business' ? contactEmail.trim() : undefined,
        communityOffer: categoryType === 'business' ? communityOffer.trim() : undefined,
        servicesList: categoryType === 'business' && servicesInput.trim()
          ? servicesInput.split('\n').map(s => s.trim()).filter(Boolean)
          : undefined
      }
    };

    // Save to unified store and trigger dual-sync event
    addUnifiedListing(newListing);

    if (onListingCreated) {
      onListingCreated(newListing);
    }

    if (showToast) {
      showToast(`✨ Listing "${newListing.title}" published with live dual-hub sync!`);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-[#180E08] border-2 border-[#D4AF37]/80 rounded-3xl max-w-3xl w-full p-5 sm:p-8 text-[#FAF5EE] shadow-[0_25px_70px_rgba(0,0,0,0.9)] space-y-6 max-h-[92vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#D4AF37]/25 pb-4">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-inner text-xl">
              ✨
            </span>
            <div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-[#FAF5EE]">
                Create Marketplace Listing
              </h2>
              <p className="text-xs font-mono text-soft-sage">
                Multi-photo gallery &bull; Structured attributes &bull; Dual-hub sync
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Selector Tabs */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
            Select Listing Category:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'gig', label: 'Opportunities & Gigs', icon: Briefcase },
              { id: 'barter', label: 'Goods & Barter', icon: Repeat },
              { id: 'housing', label: 'Sanctuary Housing', icon: Home },
              { id: 'event', label: 'Workshops & Events', icon: Calendar },
              { id: 'business', label: 'Sister Business', icon: Store }
            ].map(cat => {
              const IconComp = cat.icon;
              const isSelected = categoryType === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryType(cat.id as MarketplaceCategoryType)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                    isSelected
                      ? 'bg-[#2A1D16] border-[#D4AF37] text-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]/50'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span className="text-[11px] font-mono font-bold leading-tight">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Title & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-mono font-bold text-[#D4AF37]">
                Listing Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  categoryType === 'gig'
                    ? 'e.g. Property Preservation & Homestead Caregiver'
                    : categoryType === 'housing'
                    ? 'e.g. Peaceful 2BR / 1BA Garden Apartment in Stone Mountain'
                    : categoryType === 'barter'
                    ? 'e.g. Siena Split King Adjustable Bed Frame (New in Box)'
                    : categoryType === 'event'
                    ? 'e.g. Elderberry Oxymel & Cold-Frame Herb Workshop'
                    : 'e.g. Indigo & Copper Natural Fiber Baby Wraps'
                }
                className="w-full bg-[#2A1D16] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-xs text-[#FAF5EE] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono font-bold text-[#D4AF37]">
                City / Location
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Atlanta, Savannah, Mobile"
                className="w-full bg-[#2A1D16] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-xs text-[#FAF5EE] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-mono font-bold text-[#D4AF37]">
              Detailed Description &amp; Sisterhood Notes *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you are offering, any exchange details, co-care opportunities, or specific requirements..."
              className="w-full bg-[#2A1D16] border border-[#D4AF37]/30 rounded-xl p-3 text-xs text-[#FAF5EE] focus:outline-none focus:border-[#D4AF37] leading-relaxed"
            />
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* MULTI-PHOTO GALLERY UPLOADER (From Craigslist reference upgrade)   */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-2 border border-[#D4AF37]/25 rounded-2xl p-4 bg-black/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-mono font-bold text-[#D4AF37]">
                  Photo Gallery ({photos.length} photos attached)
                </span>
              </div>
              <span className="text-[10px] font-mono text-soft-sage">
                Upload image files or paste image URLs
              </span>
            </div>

            {/* Photo Input Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label className="w-full sm:w-auto px-4 py-2 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/40 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-2 cursor-pointer transition-all shrink-0">
                <Upload className="w-4 h-4" />
                <span>Upload Photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              <div className="flex-1 flex items-center space-x-1.5 w-full">
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="Or paste an image link (e.g. https://...)"
                  className="flex-1 bg-[#2A1D16] border border-[#D4AF37]/30 rounded-xl px-3 py-1.5 text-xs text-[#FAF5EE] focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={handleAddPhotoUrl}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#FAF5EE] rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors shrink-0"
                >
                  + Add URL
                </button>
              </div>
            </div>

            {/* Thumbnails Gallery Strip */}
            {photos.length > 0 && (
              <div className="pt-2 grid grid-cols-3 sm:grid-cols-6 gap-2">
                {photos.map((photo, index) => {
                  const isPrimary = primaryCoverIndex === index;
                  return (
                    <div 
                      key={`photo-${index}`}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 group transition-all ${
                        isPrimary ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50' : 'border-white/20 hover:border-white/50'
                      }`}
                    >
                      <img 
                        src={photo} 
                        alt={`Attachment ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Set Primary Button */}
                      <button
                        type="button"
                        onClick={() => setPrimaryCoverIndex(index)}
                        className={`absolute top-1 left-1 p-1 rounded-md text-[9px] font-mono font-bold flex items-center space-x-0.5 cursor-pointer shadow-sm ${
                          isPrimary 
                            ? 'bg-[#D4AF37] text-[#1F140E]' 
                            : 'bg-black/60 text-white/80 hover:bg-[#D4AF37] hover:text-[#1F140E]'
                        }`}
                        title="Set as main cover image"
                      >
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>{isPrimary ? 'Cover' : 'Set'}</span>
                      </button>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute bottom-1 right-1 p-1 bg-black/75 hover:bg-rose-900 text-rose-300 rounded-md cursor-pointer transition-colors shadow-sm"
                        title="Remove photo"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* CATEGORY-SPECIFIC STRUCTURED ATTRIBUTES                            */}
          {/* ------------------------------------------------------------------ */}

          {/* 1. GIG ATTRIBUTES */}
          {categoryType === 'gig' && (
            <div className="p-4 rounded-2xl bg-[#2A1D16]/70 border border-[#D4AF37]/30 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold block">
                💼 Job &amp; Opportunity Specifications
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Compensation Terms</label>
                  <input
                    type="text"
                    value={compensation}
                    onChange={(e) => setCompensation(e.target.value)}
                    placeholder="e.g. $35 - $45/hr or 2 Time Credits"
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Compensation Type</label>
                  <select
                    value={compensationType}
                    onChange={(e) => setCompensationType(e.target.value as any)}
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE] font-mono"
                  >
                    <option value="hybrid">Hybrid (Cash + Time Credit)</option>
                    <option value="cash">USD Cash / Direct Contract</option>
                    <option value="time_credit">100% Time Credit Barter</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as any)}
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE] font-mono"
                  >
                    <option value="Contract">Independent Contract</option>
                    <option value="Micro-Gig">Short-Term Micro-Gig</option>
                    <option value="Part-time">Part-Time Ongoing</option>
                    <option value="Full-time">Full-Time Cooperative Role</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-soft-sage">
                    Requirements Checklist (1 per line)
                  </label>
                  <textarea
                    rows={2}
                    value={requirementsInput}
                    onChange={(e) => setRequirementsInput(e.target.value)}
                    placeholder="Own pickup truck or tools&#10;Valid driver license&#10;Commitment to before/after photos"
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl p-2 text-xs text-[#FAF5EE]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-soft-sage">
                    Primary Duties (1 per line)
                  </label>
                  <textarea
                    rows={2}
                    value={dutiesInput}
                    onChange={(e) => setDutiesInput(e.target.value)}
                    placeholder="Mow and edge acre perimeter&#10;Haul branches to mulch station&#10;Inspect door latches"
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl p-2 text-xs text-[#FAF5EE]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. BARTER ATTRIBUTES */}
          {categoryType === 'barter' && (
            <div className="p-4 rounded-2xl bg-[#2A1D16]/70 border border-[#D4AF37]/30 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold block">
                🤝 Goods, Produce &amp; Barter Specifications
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Trade / Barter Type</label>
                  <select
                    value={barterType}
                    onChange={(e) => setBarterType(e.target.value as any)}
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE] font-mono"
                  >
                    <option value="Item Swap">Physical Item Swap</option>
                    <option value="Service Exchange">Service for Service Swap</option>
                    <option value="Copper Trade">Time-Credit Trade</option>
                    <option value="Copper Gift">Generous Gift (Free)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Item Condition</label>
                  <select
                    value={itemCondition}
                    onChange={(e) => setItemCondition(e.target.value as any)}
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE] font-mono"
                  >
                    <option value="New / Unopened">Brand New / In-Box</option>
                    <option value="Artisanal / Handmade">Artisanal / Handcrafted</option>
                    <option value="Gently Used">Gently Loved / Great Condition</option>
                    <option value="Heirloom">Heirloom / Antique</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Time Credit Value</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={timeCreditEquivalent}
                    onChange={(e) => setTimeCreditEquivalent(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">What are you seeking in return? (Wishlist)</label>
                  <input
                    type="text"
                    value={tradeForWishlist}
                    onChange={(e) => setTradeForWishlist(e.target.value)}
                    placeholder="e.g. Commuter e-bike, raw sourwood honey, or garden tilling help"
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Delivery / Pick-up</label>
                  <select
                    value={deliveryOrPickup}
                    onChange={(e) => setDeliveryOrPickup(e.target.value as any)}
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE] font-mono"
                  >
                    <option value="Flexible">Flexible (Meet at Circle or Pickup)</option>
                    <option value="Pick-up only">Pick-up only (Bring truck/SUV)</option>
                    <option value="Sister Drop-off">Sister Drop-off within 20 miles</option>
                    <option value="Shipping Available">Shipping Available</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 3. HOUSING ATTRIBUTES */}
          {categoryType === 'housing' && (
            <div className="p-4 rounded-2xl bg-[#2A1D16]/70 border border-[#D4AF37]/30 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold block">
                🏡 Sanctuary Housing &amp; Co-Living Specifications
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Bedrooms</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={bedrooms}
                    onChange={(e) => setBedrooms(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Bathrooms</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={bathrooms}
                    onChange={(e) => setBathrooms(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Square Feet</label>
                  <input
                    type="number"
                    value={squareFootage}
                    onChange={(e) => setSquareFootage(e.target.value)}
                    placeholder="e.g. 1019"
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Pet Policy</label>
                  <select
                    value={petPolicy}
                    onChange={(e) => setPetPolicy(e.target.value as any)}
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE] font-mono"
                  >
                    <option value="Pets welcome">Pets welcome (Cats & Dogs)</option>
                    <option value="Cats only">Cats only</option>
                    <option value="Case-by-case">Case-by-case approval</option>
                    <option value="No pets">No pets</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Monthly Terms / Barter Offset</label>
                  <input
                    type="text"
                    value={monthlyTerms}
                    onChange={(e) => setMonthlyTerms(e.target.value)}
                    placeholder="e.g. $1,023/mo (or $850 + 6 hrs coop garden hours)"
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Move-in Availability</label>
                  <input
                    type="text"
                    value={availableDate}
                    onChange={(e) => setAvailableDate(e.target.value)}
                    placeholder="e.g. Immediate / Nov 1, 2026"
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE]"
                  />
                </div>
              </div>

              {/* Amenities Checkbox Pills */}
              <div className="space-y-1 pt-1">
                <label className="block text-[11px] font-mono text-soft-sage">Included Amenities:</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Air Conditioning',
                    'In-Unit Washer/Dryer',
                    'Off-Street Parking',
                    'Cooperative Garden Access',
                    'High-Speed Wi-Fi',
                    'Private Bathroom',
                    'Wheelchair Accessible',
                    'Fenced Yard for Children'
                  ].map(amenity => {
                    const isChecked = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                          isChecked 
                            ? 'bg-[#D4AF37] text-[#1F140E] border border-[#D4AF37]' 
                            : 'bg-white/5 text-white/70 border border-white/10 hover:border-white/30'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                        <span>{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 4. WORKSHOP & EVENT ATTRIBUTES */}
          {categoryType === 'event' && (
            <div className="p-4 rounded-2xl bg-[#2A1D16]/70 border border-[#D4AF37]/30 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold block">
                📅 Workshop &amp; Gathering Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Event Date</label>
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="e.g. Saturday, Nov 14, 2026"
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Time Window</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="e.g. 11:00 AM - 2:00 PM EST"
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Format</label>
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value as any)}
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE] font-mono"
                  >
                    <option value="in-person">In-Person Circle Ground</option>
                    <option value="virtual">Virtual Video Sanctuary</option>
                    <option value="hybrid">Hybrid (Both)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Venue / Address / Link</label>
                  <input
                    type="text"
                    value={venueOrCity}
                    onChange={(e) => setVenueOrCity(e.target.value)}
                    placeholder="e.g. Regional Sanctuary Grove or Zoom link"
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Supplies Needed (1 per line)</label>
                  <textarea
                    rows={2}
                    value={suppliesInput}
                    onChange={(e) => setSuppliesInput(e.target.value)}
                    placeholder="Clean 16 oz amber mason jar&#10;Pair of clean garden shears"
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl p-2 text-xs text-[#FAF5EE]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. SISTER BUSINESS ATTRIBUTES */}
          {categoryType === 'business' && (
            <div className="p-4 rounded-2xl bg-[#2A1D16]/70 border border-[#D4AF37]/30 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold block">
                🏢 Sister Business Directory Attributes
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Industry / Sector</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE] font-mono"
                  >
                    <option value="Artisan & Crafting">Artisan & Crafting</option>
                    <option value="Holistic Health">Holistic Health & Doula</option>
                    <option value="Agriculture & Farming">Agriculture & Farming</option>
                    <option value="Professional Services">Professional & Legal Services</option>
                    <option value="Childcare & Education">Childcare & Education</option>
                    <option value="Culinary & Pantry">Culinary & Pantry</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Website / Social</label>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-soft-sage">Contact Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="sister@coop.internal"
                    className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE]"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="block text-xs font-mono text-soft-sage">Cooperative Member Perk / Barter Discount</label>
                <input
                  type="text"
                  value={communityOffer}
                  onChange={(e) => setCommunityOffer(e.target.value)}
                  placeholder="e.g. 20% discount on first consultation + accepts 50% Time Credit barter"
                  className="w-full bg-[#180E08] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE]"
                />
              </div>
            </div>
          )}

          {/* DUAL-SYNC CROSS-POSTING TOGGLE */}
          <div className="p-3.5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div>
                <span className="font-serif font-bold text-xs text-[#FAF5EE] block leading-tight">
                  Dual-Sync Across Village Commons &amp; Respective Hub
                </span>
                <span className="text-[10px] font-mono text-soft-sage">
                  Keeps listings synchronized whether sisters browse the Commons feed or the specialized Hub.
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
              <input
                type="checkbox"
                checked={crossPostedToHub}
                onChange={(e) => setCrossPostedToHub(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
            </label>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white/80 font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B87333] hover:from-[#c5a02e] hover:to-[#9e622b] text-[#1F140E] font-mono text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-[#1F140E]" />
              <span>Publish Listing to Sanctuary</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
