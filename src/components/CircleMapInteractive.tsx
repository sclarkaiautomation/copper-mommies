import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Filter, 
  Search, 
  Users, 
  Sparkles, 
  Calendar, 
  MessageSquare, 
  ChevronRight,
  Compass,
  Home,
  Sprout,
  BookOpen,
  Info,
  CheckCircle2,
  X,
  Globe,
  Layers,
  ArrowLeftRight
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface CircleLocationSpot {
  id: string;
  title: string;
  hostName: string;
  hostRole: string;
  category: 'homeschool' | 'botanical' | 'barter' | 'gathering' | 'housing';
  city: string;
  stateCode: string;
  stateName: string;
  addressOrVenue: string;
  lat: number;
  lng: number;
  mapX: number; // percentage from left for stylized canvas
  mapY: number; // percentage from top for stylized canvas
  description: string;
  schedule: string;
  attendeesCount: number;
  imageUrl?: string;
}

const INITIAL_CIRCLE_SPOTS: CircleLocationSpot[] = [
  {
    id: 'spot-ga-1',
    title: 'Atlanta West End Homeschool & Manipulative Swap',
    hostName: 'Mama Shantrece',
    hostRole: 'Founding Circle Lead',
    category: 'homeschool',
    city: 'Atlanta',
    stateCode: 'GA',
    stateName: 'Georgia',
    addressOrVenue: 'Cascade Springs Nature Preserve & Pavilion, Atlanta, GA 30311',
    lat: 33.722,
    lng: -84.475,
    mapX: 74,
    mapY: 66,
    description: 'Weekly NestBright elementary homeschool co-op, hands-on geometry manipulative swaps, and outdoor nature study circle.',
    schedule: 'Every Saturday • 11:00 AM EST',
    attendeesCount: 42,
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-ga-2',
    title: 'Stone Mountain Botanical Herbal Guild',
    hostName: 'Sister Clara',
    hostRole: 'Master Herbal Practitioner',
    category: 'botanical',
    city: 'Stone Mountain',
    stateCode: 'GA',
    stateName: 'Georgia',
    addressOrVenue: 'Stone Mountain Heritage Botanical Garden, GA 30083',
    lat: 33.808,
    lng: -84.170,
    mapX: 75.5,
    mapY: 65,
    description: 'Ancestral botanical oxymels, calendula sitz bath tinctures, and seasonal medicinal garden cultivation workshops.',
    schedule: 'Mon–Fri • 10:00 AM – 5:00 PM',
    attendeesCount: 28,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-ga-3',
    title: 'Cascade & Atlanta Sister Barter Exchange',
    hostName: 'Sister Nia',
    hostRole: 'Atlanta Barter Custodian',
    category: 'barter',
    city: 'Atlanta',
    stateCode: 'GA',
    stateName: 'Georgia',
    addressOrVenue: 'West End Community Garden & Exchange Board, Atlanta, GA 30310',
    lat: 33.738,
    lng: -84.417,
    mapX: 73.8,
    mapY: 66.5,
    description: 'Direct time-credit banking, organic garden produce trades, handmade soaps, sourdough starters, and childcare swaps.',
    schedule: 'Wednesdays • 4:00 PM EST',
    attendeesCount: 36,
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-ca-1',
    title: 'Oakland Redwood Sanctuary Circle',
    hostName: 'Sister Keisha',
    hostRole: 'Bay Area Circle Spearhead',
    category: 'gathering',
    city: 'Oakland',
    stateCode: 'CA',
    stateName: 'California',
    addressOrVenue: 'Reinhardt Redwood Regional Park, Oakland, CA 94619',
    lat: 37.810,
    lng: -122.170,
    mapX: 13,
    mapY: 42,
    description: 'West Coast maternal healing circle, redwoods meditation, and fireside ancestral storytelling.',
    schedule: 'Bi-Weekly Sundays • 1:00 PM PST',
    attendeesCount: 35,
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-ca-2',
    title: 'Bay Area Botanical & Herbal Guild',
    hostName: 'Sister Maya',
    hostRole: 'Pacific Botanical Specialist',
    category: 'botanical',
    city: 'Oakland',
    stateCode: 'CA',
    stateName: 'California',
    addressOrVenue: 'East Bay Urban Farm & Botanical Center, Oakland, CA 94607',
    lat: 37.804,
    lng: -122.271,
    mapX: 12.5,
    mapY: 42.5,
    description: 'Urban herbalism guild, elderberry tonic brewing, and native California heirloom seed vault exchanges.',
    schedule: 'Thursdays • 3:00 PM PST',
    attendeesCount: 22,
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-tx-1',
    title: 'Houston Bayou Homeschool Learning Co-op',
    hostName: 'Sister Nia',
    hostRole: 'Texas Regional Representative',
    category: 'homeschool',
    city: 'Houston',
    stateCode: 'TX',
    stateName: 'Texas',
    addressOrVenue: 'Third Ward Community Garden & Learning Center, Houston, TX 77004',
    lat: 29.721,
    lng: -95.362,
    mapX: 52,
    mapY: 79,
    description: 'Elementary geometry manipulative swaps, family garden learning plots, and co-care swaps.',
    schedule: 'Every 2nd & 4th Tuesday • 3:30 PM CST',
    attendeesCount: 31,
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-tx-2',
    title: 'Dallas & Third Ward Barter Exchange',
    hostName: 'Sister Zola',
    hostRole: 'Dallas Trade Coordinator',
    category: 'barter',
    city: 'Dallas',
    stateCode: 'TX',
    stateName: 'Texas',
    addressOrVenue: 'Oak Cliff Community Farmers Market, Dallas, TX 75208',
    lat: 32.747,
    lng: -96.823,
    mapX: 51,
    mapY: 72,
    description: 'Time-credit barter board, organic fresh egg swaps, hand-stitched quilt trades, and family tool sharing.',
    schedule: 'Saturdays • 10:00 AM CST',
    attendeesCount: 29,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-ny-1',
    title: 'Brooklyn Artisan Barter & Produce Exchange',
    hostName: 'Sister Aisha',
    hostRole: 'Tri-State Circle Lead',
    category: 'barter',
    city: 'Brooklyn',
    stateCode: 'NY',
    stateName: 'New York',
    addressOrVenue: 'Prospect Park Audubon Pavilion, Brooklyn, NY 11225',
    lat: 40.660,
    lng: -73.968,
    mapX: 86,
    mapY: 28,
    description: 'Northeast sisterhood barter market for handmade quilt trades, artisan preserves, and urban farm swaps.',
    schedule: 'Saturdays • 12:00 PM EST',
    attendeesCount: 50,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-ny-2',
    title: 'New York Tri-State Homeschool Focus Guild',
    hostName: 'Sister Clara',
    hostRole: 'Northeast Education Coordinator',
    category: 'homeschool',
    city: 'Brooklyn',
    stateCode: 'NY',
    stateName: 'New York',
    addressOrVenue: 'Brooklyn Public Library Heritage Learning Suite, NY 11238',
    lat: 40.672,
    lng: -73.968,
    mapX: 86.5,
    mapY: 27.5,
    description: 'NestBright elementary study groups, science experiment kit swaps, and family field trips.',
    schedule: 'Thursdays • 1:00 PM EST',
    attendeesCount: 27,
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-md-1',
    title: 'Baltimore & PG County Maternity Sanctuary',
    hostName: 'Mama Keisha',
    hostRole: 'Mid-Atlantic Elder Elder',
    category: 'housing',
    city: 'Baltimore',
    stateCode: 'MD',
    stateName: 'Maryland',
    addressOrVenue: 'Druid Hill Park Botanical Conservatory, Baltimore, MD 21217',
    lat: 39.318,
    lng: -76.645,
    mapX: 82,
    mapY: 38,
    description: 'Verified private family suites, holistic maternal support, rest havens, and wellness care.',
    schedule: 'Daily Access • Open Circle Appointments',
    attendeesCount: 22,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-md-2',
    title: 'Mid-Atlantic Botanical & Doula Guild',
    hostName: 'Sister Yaa',
    hostRole: 'Mid-Atlantic Botanical Specialist',
    category: 'botanical',
    city: 'Baltimore',
    stateCode: 'MD',
    stateName: 'Maryland',
    addressOrVenue: 'Patterson Park Botanical Pavilion, Baltimore, MD 21224',
    lat: 39.290,
    lng: -76.580,
    mapX: 82.5,
    mapY: 38.5,
    description: 'Maternal tea blends, raspberry leaf infusions, and herbal recovery kits for mothers and growing families.',
    schedule: 'Fridays • 2:00 PM EST',
    attendeesCount: 25,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-fl-1',
    title: 'Miami Citrus Garden Botanical Guild',
    hostName: 'Sister Yaa',
    hostRole: 'South Florida Circle Lead',
    category: 'botanical',
    city: 'Miami',
    stateCode: 'FL',
    stateName: 'Florida',
    addressOrVenue: 'Little Haiti Cultural Center Botanical Pavilion, Miami, FL 33138',
    lat: 25.820,
    lng: -80.190,
    mapX: 82,
    mapY: 92,
    description: 'Fresh citrus oxymels, tropical elderberry syrups, and coastal botanical remedy workshops.',
    schedule: 'Fridays • 4:00 PM EST',
    attendeesCount: 19,
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-nc-1',
    title: 'Charlotte Blue Ridge Homeschool Co-op',
    hostName: 'Sister Maya',
    hostRole: 'Carolinas Circle Spearhead',
    category: 'homeschool',
    city: 'Charlotte',
    stateCode: 'NC',
    stateName: 'North Carolina',
    addressOrVenue: 'Freedom Park Botanical Center, Charlotte, NC 28209',
    lat: 35.195,
    lng: -80.843,
    mapX: 78,
    mapY: 55,
    description: 'Heirloom seed library, nature study field days, and co-care childcare swap networks.',
    schedule: 'Sundays • 2:00 PM EST',
    attendeesCount: 26,
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-sc-1',
    title: 'Charleston Lowcountry Gullah Heritage Barter',
    hostName: 'Mama Keisha',
    hostRole: 'Lowcountry Cultural Custodian',
    category: 'barter',
    city: 'Charleston',
    stateCode: 'SC',
    stateName: 'South Carolina',
    addressOrVenue: 'Hampton Park Pavilion, Charleston, SC 29403',
    lat: 32.795,
    lng: -79.950,
    mapX: 79,
    mapY: 61,
    description: 'Sweetgrass basketry trades, traditional quilt exchanges, and ancestral kitchen garden seed swaps.',
    schedule: 'Bi-Weekly Saturdays • 10:30 AM EST',
    attendeesCount: 38,
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-la-1',
    title: 'New Orleans Delta Herbal & Botanical Guild',
    hostName: 'Sister Zola',
    hostRole: 'Delta Circle Representative',
    category: 'botanical',
    city: 'New Orleans',
    stateCode: 'LA',
    stateName: 'Louisiana',
    addressOrVenue: 'City Park Botanical Gardens, New Orleans, LA 70124',
    lat: 29.985,
    lng: -90.080,
    mapX: 62,
    mapY: 82,
    description: 'Ancestral tonic preparations, local tea blends, and southern herbal tradition guild meetings.',
    schedule: 'Thursdays • 5:00 PM CST',
    attendeesCount: 24,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-il-1',
    title: 'Chicago Lakeside Homeschool Focus Circle',
    hostName: 'Sister Amara',
    hostRole: 'Midwest Circle Lead',
    category: 'homeschool',
    city: 'Chicago',
    stateCode: 'IL',
    stateName: 'Illinois',
    addressOrVenue: 'Jackson Park Japanese Garden & Pavilion, Chicago, IL 60637',
    lat: 41.786,
    lng: -87.580,
    mapX: 65,
    mapY: 34,
    description: 'Midwest elementary curriculum sharing, indoor winter storytelling circles, and family time-credit swaps.',
    schedule: 'Saturdays • 1:00 PM CST',
    attendeesCount: 33,
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'
  }
];

const STATE_CIRCLES = [
  { code: 'ALL', name: 'All US Circle Locations', center: [39.5, -98.35] as [number, number], zoom: 4 },
  { code: 'GA', name: 'Georgia (Atlanta Circle)', center: [33.749, -84.388] as [number, number], zoom: 8 },
  { code: 'CA', name: 'California (Oakland Circle)', center: [37.804, -122.271] as [number, number], zoom: 8 },
  { code: 'TX', name: 'Texas (Houston/Dallas Circle)', center: [29.760, -95.369] as [number, number], zoom: 7 },
  { code: 'NY', name: 'New York (Brooklyn Circle)', center: [40.678, -73.944] as [number, number], zoom: 9 },
  { code: 'MD', name: 'Maryland (Baltimore/PG Circle)', center: [39.290, -76.612] as [number, number], zoom: 9 },
  { code: 'FL', name: 'Florida (Miami Circle)', center: [25.761, -80.191] as [number, number], zoom: 8 },
  { code: 'NC', name: 'North Carolina (Charlotte Circle)', center: [35.227, -80.843] as [number, number], zoom: 8 },
  { code: 'SC', name: 'South Carolina (Charleston Circle)', center: [32.776, -79.931] as [number, number], zoom: 8 },
  { code: 'LA', name: 'Louisiana (New Orleans Circle)', center: [29.951, -90.071] as [number, number], zoom: 9 },
  { code: 'IL', name: 'Illinois (Chicago Circle)', center: [41.878, -87.629] as [number, number], zoom: 9 }
];

const CATEGORY_TOGGLES = [
  { id: 'all', label: 'All Circle Types', icon: '🌎', color: 'bg-[#1F140E] text-[#D4AF37] border-[#D4AF37]' },
  { id: 'homeschool', label: 'Homeschooling Focus', icon: '📚', color: 'bg-blue-900 text-blue-100 border-blue-700' },
  { id: 'botanical', label: 'Botanical/Herbal Guilds', icon: '🌿', color: 'bg-emerald-800 text-emerald-100 border-emerald-700' },
  { id: 'barter', label: 'Barter Exchanges', icon: '🤝', color: 'bg-amber-800 text-amber-100 border-amber-700' },
  { id: 'gathering', label: 'Sisterhood Gatherings', icon: '✨', color: 'bg-[#D4AF37] text-[#1F140E] border-[#B87333]' },
  { id: 'housing', label: 'Sanctuary Housing', icon: '🏡', color: 'bg-rose-950 text-rose-100 border-rose-800' }
];

interface CircleMapInteractiveProps {
  selectedState?: string;
  onOpenDirectChat?: (recipientName: string, contextTitle: string, initialNote?: string) => void;
  showToast?: (msg: string) => void;
}

export default function CircleMapInteractive({
  selectedState = 'GA',
  onOpenDirectChat,
  showToast
}: CircleMapInteractiveProps) {
  const [activeStateFilter, setActiveStateFilter] = useState<string>('ALL');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpotId, setSelectedSpotId] = useState<string>(
    INITIAL_CIRCLE_SPOTS.find(s => s.stateCode === selectedState)?.id || INITIAL_CIRCLE_SPOTS[0].id
  );
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
  const [mapTileStyle, setMapTileStyle] = useState<'osm' | 'vector'>('osm');

  // Leaflet Map Ref
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // User RSVPs State
  const [userRsvps, setUserRsvps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('copper_mommies_circle_rsvps');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Count spots per category for active state
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: 0,
      homeschool: 0,
      botanical: 0,
      barter: 0,
      gathering: 0,
      housing: 0
    };

    INITIAL_CIRCLE_SPOTS.forEach(spot => {
      const matchesState = activeStateFilter === 'ALL' || spot.stateCode === activeStateFilter;
      if (matchesState) {
        counts.all += 1;
        if (counts[spot.category] !== undefined) {
          counts[spot.category] += 1;
        }
      }
    });

    return counts;
  }, [activeStateFilter]);

  const filteredSpots = useMemo(() => {
    return INITIAL_CIRCLE_SPOTS.filter(spot => {
      const matchesState = activeStateFilter === 'ALL' || spot.stateCode === activeStateFilter;
      const matchesCategory = activeCategoryFilter === 'all' || spot.category === activeCategoryFilter;
      const matchesSearch = searchQuery === '' || 
        spot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesState && matchesCategory && matchesSearch;
    });
  }, [activeStateFilter, activeCategoryFilter, searchQuery]);

  const selectedSpot = useMemo(() => {
    return INITIAL_CIRCLE_SPOTS.find(s => s.id === selectedSpotId) || filteredSpots[0] || INITIAL_CIRCLE_SPOTS[0];
  }, [selectedSpotId, filteredSpots]);

  const getCategoryBadge = (category: CircleLocationSpot['category']) => {
    switch (category) {
      case 'homeschool':
        return { label: 'Homeschooling Focus', color: 'bg-blue-900 text-blue-100 border-blue-700', icon: '📚' };
      case 'botanical':
        return { label: 'Botanical/Herbal Guild', color: 'bg-emerald-800 text-emerald-100 border-emerald-700', icon: '🌿' };
      case 'barter':
        return { label: 'Barter Exchange', color: 'bg-amber-800 text-amber-100 border-amber-700', icon: '🤝' };
      case 'gathering':
        return { label: 'Sisterhood Gathering', color: 'bg-[#D4AF37] text-[#1F140E] border-[#B87333]', icon: '✨' };
      case 'housing':
        return { label: 'Sanctuary Housing', color: 'bg-rose-950 text-rose-100 border-rose-800', icon: '🏡' };
    }
  };

  // INITIALIZE / UPDATE LEAFLET MAP WITH OPENSTREETMAP TILES (100% FREE & NO API KEY NEEDED)
  useEffect(() => {
    if (viewMode !== 'map' || mapTileStyle !== 'osm' || !mapContainerRef.current) return;

    // Initialize Map if not already created
    if (!leafletMapRef.current) {
      const targetStateConfig = STATE_CIRCLES.find(sc => sc.code === activeStateFilter) || STATE_CIRCLES[0];
      const map = L.map(mapContainerRef.current, {
        center: targetStateConfig.center,
        zoom: targetStateConfig.zoom,
        zoomControl: true,
        scrollWheelZoom: false
      });

      // Free OpenStreetMap Tile Layer (No API Key Required)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors • Copper Mommies Circle Map'
      }).addTo(map);

      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;

    // Fly to center when state filter changes
    const stateConfig = STATE_CIRCLES.find(sc => sc.code === activeStateFilter) || STATE_CIRCLES[0];
    map.flyTo(stateConfig.center, stateConfig.zoom, { duration: 1.2 });

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add Markers for filtered spots
    filteredSpots.forEach(spot => {
      const badge = getCategoryBadge(spot.category);
      const isSelected = spot.id === selectedSpot.id;

      // Custom HTML DivIcon for Copper Pin
      const customIcon = L.divIcon({
        className: 'custom-copper-pin',
        html: `
          <div style="
            background: ${isSelected ? '#D4AF37' : '#1F140E'};
            color: ${isSelected ? '#1F140E' : '#FAF5EE'};
            border: 2px solid ${isSelected ? '#FFFFFF' : '#D4AF37'};
            border-radius: 12px;
            padding: 4px 8px;
            font-family: monospace;
            font-size: 10px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            white-space: nowrap;
            transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
            transition: all 0.3s ease;
          ">
            <span>${badge.icon}</span>
            <span>${spot.city}</span>
            <span style="opacity: 0.8; font-size: 9px;">(${spot.stateCode})</span>
          </div>
        `,
        iconSize: [120, 32],
        iconAnchor: [60, 16]
      });

      const marker = L.marker([spot.lat, spot.lng], { icon: customIcon }).addTo(map);

      // Bind Popup
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #1F140E; max-width: 230px; padding: 2px;">
          <strong style="color: #B87333; font-size: 13px; font-family: serif; display: block; margin-bottom: 2px;">${spot.title}</strong>
          <div style="font-size: 11px; margin-bottom: 4px;">Host: <strong>${spot.hostName}</strong> (${spot.hostRole})</div>
          <div style="font-size: 10px; color: #666; margin-bottom: 6px;">📍 ${spot.addressOrVenue}</div>
          <button id="pop-select-${spot.id}" style="
            width: 100%;
            background: #1F140E;
            color: #D4AF37;
            border: 1px solid #D4AF37;
            padding: 5px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
          ">Inspect Circle Details →</button>
        </div>
      `);

      marker.on('click', () => {
        setSelectedSpotId(spot.id);
        if (showToast) showToast(`📍 Selected ${spot.title}`);
      });

      markersRef.current.push(marker);
    });

  }, [viewMode, mapTileStyle, activeStateFilter, filteredSpots, selectedSpot.id]);

  return (
    <div className="bg-[#FAF5EE] border-2 border-[#B87333]/30 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6 text-[#1F140E]">
      
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#B87333]/20 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 uppercase tracking-widest flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Interactive OpenStreetMap Integration</span>
            </span>
            <span className="text-xs font-mono text-[#B87333] font-bold">
              {filteredSpots.length} Active Circle Spots Listed
            </span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#1F140E] tracking-tight">
            Explore Regional Sister Circles &amp; Specialty Guilds
          </h2>
          <p className="text-xs text-[#2A221B]/80 font-sans leading-relaxed max-w-2xl">
            Locate specialized sister circles across America — filter dynamically by <strong>Homeschooling Focus</strong>, <strong>Botanical/Herbal Guilds</strong>, <strong>Barter Exchanges</strong>, or <strong>Sanctuary Housing</strong>.
          </p>
        </div>

        {/* View Switcher & Tile Style Buttons */}
        <div className="flex items-center space-x-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              viewMode === 'map'
                ? 'bg-[#1F140E] text-[#D4AF37] shadow-md border border-[#D4AF37]/50'
                : 'bg-white text-[#1F140E]/80 border border-copper-penny/20 hover:bg-[#FAF5EE]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Map View</span>
          </button>

          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#1F140E] text-[#D4AF37] shadow-md border border-[#D4AF37]/50'
                : 'bg-white text-[#1F140E]/80 border border-copper-penny/20 hover:bg-[#FAF5EE]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Circle Directory</span>
          </button>

          {viewMode === 'map' && (
            <button
              onClick={() => setMapTileStyle(mapTileStyle === 'osm' ? 'vector' : 'osm')}
              className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#1F140E] border border-[#D4AF37]/40 transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Toggle between real OpenStreetMap tile view and stylized artistic vector canvas"
            >
              <Layers className="w-4 h-4 text-[#B87333]" />
              <span className="hidden sm:inline">{mapTileStyle === 'osm' ? 'OpenStreetMap' : 'Vector Canvas'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. DYNAMIC CIRCLE TYPE FILTER TOGGLES */}
      <div className="space-y-2 bg-white p-4 rounded-2xl border border-copper-penny/20 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#B87333] uppercase tracking-wider flex items-center space-x-1.5">
            <Filter className="w-4 h-4" />
            <span>Dynamic Circle Focus Toggles:</span>
          </span>
          <span className="text-[11px] font-mono text-soft-sage">
            Showing <strong>{filteredSpots.length}</strong> spots
          </span>
        </div>

        {/* Dynamic Category Toggle Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TOGGLES.map(cat => {
            const isSelected = activeCategoryFilter === cat.id;
            const spotCount = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategoryFilter(cat.id);
                  if (showToast) {
                    showToast(`🔍 Filtered map by: ${cat.label} (${spotCount} spots)`);
                  }
                }}
                className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold shrink-0 transition-all duration-200 cursor-pointer flex items-center space-x-2 border ${
                  isSelected
                    ? `${cat.color} shadow-md ring-2 ring-[#D4AF37]/40 scale-102 font-extrabold`
                    : 'bg-[#FAF5EE] text-[#1F140E]/80 border-gray-200 hover:bg-white hover:text-[#1F140E]'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-black ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-800'
                }`}>
                  {spotCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SEARCH & STATE CIRCLE CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 bg-white p-3.5 rounded-2xl border border-copper-penny/20 shadow-sm">
        
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city, state, host sister, or spot title..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* State Circle Dropdown */}
        <div className="md:col-span-6 flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-[#B87333] shrink-0" />
          <select
            value={activeStateFilter}
            onChange={(e) => setActiveStateFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold text-[#1F140E] bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
          >
            {STATE_CIRCLES.map(sc => (
              <option key={sc.code} value={sc.code}>{sc.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* QUICK STATE CHIPS */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-[11px]">
        <span className="text-[#B87333] font-bold uppercase tracking-wider text-[10px] mr-1 shrink-0">Quick State Filter:</span>
        {STATE_CIRCLES.map(sc => (
          <button
            key={sc.code}
            onClick={() => setActiveStateFilter(sc.code)}
            className={`px-3 py-1 rounded-xl font-bold shrink-0 transition-all cursor-pointer ${
              activeStateFilter === sc.code
                ? 'bg-[#1F140E] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm'
                : 'bg-white text-[#1F140E]/80 border border-copper-penny/20 hover:bg-[#FAF5EE]'
            }`}
          >
            {sc.code === 'ALL' ? '🌎 All US' : sc.code}
          </button>
        ))}
      </div>

      {/* 4. MAIN MAP OR DIRECTORY DISPLAY */}
      {viewMode === 'map' ? (
        <div className="flex flex-col gap-6">
          
          {/* INTERACTIVE MAP CONTAINER (TOP FULL WIDTH) */}
          <div className="w-full bg-[#1F140E] border-2 border-[#D4AF37]/50 rounded-3xl p-5 shadow-2xl relative overflow-hidden min-h-[440px] sm:min-h-[500px] flex flex-col justify-between">
            
            {/* Map Header Overlay */}
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3 mb-4 z-10">
              <div className="flex items-center space-x-2 text-[#D4AF37]">
                <Compass className="w-5 h-5 animate-pulse" />
                <span className="font-serif font-bold text-sm tracking-wide">
                  {activeStateFilter === 'ALL' ? 'United States Regional Circle Map' : `${activeStateFilter} State Sister Circle Locations`}
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-200/80 bg-black/50 px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
                {mapTileStyle === 'osm' ? 'OpenStreetMap Active' : 'Vector Canvas Active'}
              </span>
            </div>

            {/* REAL OPENSTREETMAP OR VECTOR CANVAS RENDERING */}
            {mapTileStyle === 'osm' ? (
              <div className="relative w-full h-[380px] sm:h-[420px] rounded-2xl border border-[#D4AF37]/30 overflow-hidden z-0">
                <div ref={mapContainerRef} className="w-full h-full" />
              </div>
            ) : (
              <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-[#18110B] via-[#241810] to-[#120B07] rounded-2xl border border-[#D4AF37]/25 overflow-hidden flex items-center justify-center p-2">
                <svg 
                  className="w-full h-full opacity-30 text-[#D4AF37]" 
                  viewBox="0 0 1000 600" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                >
                  <path d="M0 100 H1000 M0 200 H1000 M0 300 H1000 M0 400 H1000 M0 500 H1000" strokeDasharray="4 8" opacity="0.3" />
                  <path d="M100 0 V600 M200 0 V600 M300 0 V600 M400 0 V600 M500 0 V600 M600 0 V600 M700 0 V600 M800 0 V600 M900 0 V600" strokeDasharray="4 8" opacity="0.3" />
                  <path 
                    d="M 120 120 L 250 110 L 380 120 L 520 100 L 680 90 L 850 100 L 920 180 L 880 260 L 940 320 L 910 420 L 830 520 L 780 500 L 740 420 L 650 480 L 550 510 L 480 450 L 380 430 L 280 460 L 180 380 L 110 280 Z" 
                    fill="#D4AF37" 
                    fillOpacity="0.06" 
                    stroke="#D4AF37" 
                    strokeWidth="2.5" 
                  />
                </svg>

                {filteredSpots.map(spot => {
                  const isSelected = spot.id === selectedSpot.id;
                  const badge = getCategoryBadge(spot.category);

                  return (
                    <button
                      key={spot.id}
                      onClick={() => {
                        setSelectedSpotId(spot.id);
                        if (showToast) showToast(`📍 Selected ${spot.title}`);
                      }}
                      style={{ left: `${spot.mapX}%`, top: `${spot.mapY}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-20 cursor-pointer ${
                        isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                      }`}
                      title={`${spot.title} (${spot.city}, ${spot.stateCode})`}
                    >
                      {isSelected && (
                        <span className="absolute -inset-2.5 rounded-full bg-[#D4AF37]/40 animate-ping" />
                      )}

                      <div className={`relative px-2.5 py-1.5 rounded-xl font-mono text-[10px] font-extrabold flex items-center space-x-1 border shadow-2xl transition-all ${
                        isSelected
                          ? 'bg-[#D4AF37] text-[#1F140E] border-white ring-2 ring-[#D4AF37]'
                          : 'bg-[#1F140E]/90 text-[#FAF5EE] border-[#D4AF37]/60 hover:bg-[#D4AF37] hover:text-[#1F140E]'
                      }`}>
                        <span>{badge.icon}</span>
                        <span className="hidden sm:inline font-bold">{spot.city}</span>
                        <span className="text-[9px] opacity-80">({spot.stateCode})</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Map Legend */}
            <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-amber-200/90 z-10">
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1"><span>📚</span><span>Homeschool Focus</span></span>
                <span className="flex items-center space-x-1"><span>🌿</span><span>Botanical Guild</span></span>
                <span className="flex items-center space-x-1"><span>🤝</span><span>Barter Exchange</span></span>
                <span className="flex items-center space-x-1"><span>✨</span><span>Gathering</span></span>
              </div>
              <span>Click pin to inspect details</span>
            </div>

          </div>

          {/* SELECTED SPOT DETAILED CARD (BOTTOM FULL WIDTH) */}
          <div className="w-full bg-white border-2 border-copper-penny/30 rounded-3xl p-5 sm:p-6 shadow-lg space-y-4 font-sans">
            
            {/* Spot Header Image & Badge */}
            <div className="relative rounded-2xl overflow-hidden h-40 bg-[#1F140E]">
              <img 
                src={selectedSpot.imageUrl || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80'} 
                alt={selectedSpot.title}
                className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border shadow-sm flex items-center space-x-1 ${getCategoryBadge(selectedSpot.category).color}`}>
                  <span>{getCategoryBadge(selectedSpot.category).icon}</span>
                  <span>{getCategoryBadge(selectedSpot.category).label}</span>
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider block">
                  📍 {selectedSpot.city}, {selectedSpot.stateName} ({selectedSpot.stateCode})
                </span>
                <h3 className="font-serif font-black text-lg text-white leading-tight">
                  {selectedSpot.title}
                </h3>
              </div>
            </div>

            {/* Host Sister Details */}
            <div className="bg-[#FAF5EE] p-3.5 rounded-2xl border border-copper-penny/20 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-[#1F140E] text-[#D4AF37] font-serif font-bold text-sm flex items-center justify-center border border-[#D4AF37]/50">
                  {selectedSpot.hostName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-serif font-extrabold text-xs text-[#1F140E]">{selectedSpot.hostName}</h4>
                  <p className="text-[10px] font-mono text-[#B87333] font-bold">{selectedSpot.hostRole}</p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-1 rounded-full font-bold">
                👥 {selectedSpot.attendeesCount} Sisters Attending
              </span>
            </div>

            {/* Venue & Schedule Info */}
            <div className="space-y-2 text-xs text-[#1F140E]/85">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#B87333] shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-[10px] text-gray-500 uppercase block font-bold">Venue Location:</span>
                  <p className="font-medium text-[#1F140E]">{selectedSpot.addressOrVenue}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Calendar className="w-4 h-4 text-[#B87333] shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-[10px] text-gray-500 uppercase block font-bold">Gathering Schedule:</span>
                  <p className="font-medium text-[#1F140E]">{selectedSpot.schedule}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#FAF5EE]/60 p-3.5 rounded-2xl border border-copper-penny/15 text-xs text-[#2A221B]/90 leading-relaxed font-sans">
              <span className="font-mono text-[10px] text-[#B87333] uppercase font-bold block mb-1">Spot Description:</span>
              {selectedSpot.description}
            </div>

            {/* Action Buttons */}
            {(() => {
              const isSpotRsvped = !!userRsvps[selectedSpot.id];

              const handleToggleRsvp = () => {
                const newStatus = !isSpotRsvped;
                const newRsvps = { ...userRsvps, [selectedSpot.id]: newStatus };
                setUserRsvps(newRsvps);
                try {
                  localStorage.setItem('copper_mommies_circle_rsvps', JSON.stringify(newRsvps));
                  
                  const rsvpListRaw = localStorage.getItem('copper_mommies_circle_rsvps_list');
                  let rsvpList = rsvpListRaw ? JSON.parse(rsvpListRaw) : [];
                  if (newStatus) {
                    if (!rsvpList.some((e: any) => e.id === selectedSpot.id)) {
                      rsvpList = [
                        {
                          id: selectedSpot.id,
                          title: selectedSpot.title,
                          date: selectedSpot.schedule,
                          location: `${selectedSpot.city}, ${selectedSpot.stateCode} (${selectedSpot.addressOrVenue})`,
                          status: 'Attending (RSVP Confirmed)',
                          badge: getCategoryBadge(selectedSpot.category).label
                        },
                        ...rsvpList
                      ];
                    }
                  } else {
                    rsvpList = rsvpList.filter((e: any) => e.id !== selectedSpot.id);
                  }
                  localStorage.setItem('copper_mommies_circle_rsvps_list', JSON.stringify(rsvpList));
                } catch (e) {
                  // ignore
                }

                if (newStatus) {
                  if (showToast) showToast(`✅ RSVP Confirmed for "${selectedSpot.title}"! Saved to your Profile RSVPs & Calendar.`);
                } else {
                  if (showToast) showToast(`RSVP removed for "${selectedSpot.title}".`);
                }
              };

              return (
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    onClick={() => {
                      if (onOpenDirectChat) {
                        onOpenDirectChat(
                          selectedSpot.hostName, 
                          selectedSpot.title, 
                          `Peace sister ${selectedSpot.hostName}! Reaching out regarding ${selectedSpot.title} in ${selectedSpot.city}, ${selectedSpot.stateCode}.`
                        );
                      }
                      if (showToast) {
                        showToast(`💬 Direct chat opened with ${selectedSpot.hostName}! Click "↩️ Return to Circle Map" anytime to go back.`);
                      }
                    }}
                    className="w-full sm:w-1/2 py-2.5 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] rounded-xl font-mono text-xs font-bold border border-[#D4AF37]/50 shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                    <span>Message Host</span>
                  </button>

                  <button
                    onClick={handleToggleRsvp}
                    className={`w-full sm:w-1/2 py-2.5 rounded-xl font-mono text-xs font-extrabold shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer border ${
                      isSpotRsvped 
                        ? 'bg-emerald-800 text-white border-emerald-400 shadow-emerald-900/30'
                        : 'bg-[#D4AF37] hover:bg-[#C5A02E] text-[#1F140E] border-[#B87333]'
                    }`}
                  >
                    {isSpotRsvped ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300 animate-bounce" />
                        <span>✅ RSVP Confirmed (Attending)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#1F140E]" />
                        <span>RSVP to Circle</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })()}

          </div>

        </div>
      ) : (
        /* DIRECTORY GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredSpots.map(spot => {
            const badge = getCategoryBadge(spot.category);
            const isSelected = spot.id === selectedSpot.id;

            return (
              <div 
                key={spot.id}
                onClick={() => setSelectedSpotId(spot.id)}
                className={`group bg-white border-2 rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-all space-y-3 relative overflow-hidden ${
                  isSelected ? 'border-[#D4AF37] bg-[#FAF5EE]/50 shadow-lg' : 'border-copper-penny/20 hover:border-copper-penny/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${badge.color}`}>
                    {badge.icon} {badge.label}
                  </span>
                  <span className="text-[10px] font-mono font-extrabold text-[#B87333] uppercase">
                    {spot.city}, {spot.stateCode}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-extrabold text-base text-[#1F140E] group-hover:text-copper-penny transition-colors">
                    {spot.title}
                  </h3>
                  <p className="text-xs text-[#2A221B]/80 font-sans line-clamp-2 mt-1">
                    {spot.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-mono text-gray-500">
                  <span>Host: <strong className="text-[#1F140E]">{spot.hostName}</strong></span>
                  <span className="text-[#B87333] font-bold flex items-center space-x-1">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
