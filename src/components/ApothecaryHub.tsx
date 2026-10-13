import React, { useState } from 'react';
import { Sprout, Heart, Sparkles, ArrowRight, BookOpen, Trash2, CheckCircle, Info, Baby, ShieldCheck, Sun, Droplets, Wheat, ShoppingBag } from 'lucide-react';
import { BotanicalLog, PageSpotlightBanner, ScholarshipEntry } from '../types';
import SpotlightBanner from './SpotlightBanner';
import AHealthyAddictionSection from './AHealthyAddictionSection';

interface ApothecaryHubProps {
  onConsult: (prompt: string, category: 'healing') => void;
  aiLoading: boolean;
  aiResponse: string | null;
  getLoadingNote: () => string;
  selectedState: string;
  spotlightBanner?: PageSpotlightBanner;
  banners?: PageSpotlightBanner[];
  onEnterContest?: (entry: ScholarshipEntry) => void;
}

export default function ApothecaryHub({ onConsult, aiLoading, aiResponse, getLoadingNote, selectedState, spotlightBanner, banners }: ApothecaryHubProps) {
  const [aiPrompt, setAiPrompt] = useState('');
  
  // Interactive Botanical logs
  const [logs, setLogs] = useState<BotanicalLog[]>([
    { id: '1', activityName: 'Nourishing Raspberry-Leaf Infusion', category: 'intake', details: 'Brewed 1 quart for maternal iron & uterus toning support', date: 'Today' },
    { id: '2', activityName: 'Hand-Whipping Raw Mango & Lavender Butter', category: 'skincare', details: 'Softened unrefined butter with organic jojoba oil', date: 'Yesterday' },
    { id: '3', activityName: 'Turning Clay Compost on Balcony Garden', category: 'homestead', details: 'Added worm casings to support cherry tomatoes & kale', date: '2 days ago' },
  ]);

  const [newActivity, setNewActivity] = useState('');
  const [newCat, setNewCat] = useState<'intake' | 'homestead' | 'skincare'>('intake');
  const [newDetails, setNewDetails] = useState('');

  // Interactive filters for American homesteading and holistic health sections
  const [apothecaryTab, setApothecaryTab] = useState<'soil-homestead' | 'a-healthy-addiction'>('soil-homestead');
  const [homesteadSeason, setHomesteadSeason] = useState<'spring' | 'summer' | 'fall' | 'winter'>('spring');
  const [activeHolisticTab, setActiveHolisticTab] = useState<'all' | 'herbalism' | 'doula' | 'wellness'>('all');

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.trim()) return;

    const newLog: BotanicalLog = {
      id: Date.now().toString(),
      activityName: newActivity,
      category: newCat,
      details: newDetails || 'Logged under daily ancestral routine',
      date: 'Just now',
    };

    setLogs([newLog, ...logs]);
    setNewActivity('');
    setNewDetails('');
  };

  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  const handleAdvisorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    onConsult(aiPrompt, 'healing');
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto my-2">
      {/* Header */}
      <div className="border-b border-soft-sage/30 pb-3">
        <div className="flex items-center space-x-2.5 text-soft-sage mb-1">
          <Sprout className="w-5 h-5 text-[#93A28B]" />
          <span className="font-mono text-xs uppercase tracking-widest font-semibold text-soft-sage">District 2</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F1813]">
          The Earth &amp; Healing Hub
        </h2>
        <p className="text-xs sm:text-sm text-[#2A221B]/80 max-w-2xl mt-0.5 leading-relaxed">
          Relearning traditional American agricultural heritage. Exchange organic heirloom seeds, review maternal respiratory infusions, and document clean, raw body butters completely free of industrial synthetic chemicals.
        </p>
      </div>

      {/* Featured Spotlight Section */}
      <SpotlightBanner banners={banners} banner={spotlightBanner} selectedState={selectedState} />

      {/* Apothecary Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-copper-penny/20 pb-2 text-xs font-mono font-bold">
        <button
          onClick={() => setApothecaryTab('soil-homestead')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            apothecaryTab === 'soil-homestead'
              ? 'bg-[#2E4F32] text-white shadow-md'
              : 'bg-white text-[#1F1813] hover:bg-emerald-50/50 border border-copper-penny/20'
          }`}
          title="Soil Stewardship, Homestead & Botanical Logs"
        >
          <Sprout className="w-4 h-4 text-emerald-400" />
          <span>Soil Stewardship, Homestead &amp; Botanical Logs</span>
        </button>

        <button
          onClick={() => setApothecaryTab('a-healthy-addiction')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            apothecaryTab === 'a-healthy-addiction'
              ? 'bg-[#1C271E] text-emerald-300 shadow-md border-2 border-emerald-500/40'
              : 'bg-white text-[#1F1813] hover:bg-emerald-50/50 border border-copper-penny/20'
          }`}
          title="A Healthy Addiction (Remedy Alternatives & Amazon Affiliate)"
        >
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>A Healthy Addiction (Remedy Alternatives &amp; Amazon Affiliate)</span>
        </button>
      </div>

      {apothecaryTab === 'a-healthy-addiction' && (
        <div className="space-y-6 animate-fade-in">
          <AHealthyAddictionSection onShowToast={(msg) => alert(msg)} />
        </div>
      )}

      {apothecaryTab === 'soil-homestead' && (
        <div className="space-y-6 animate-fade-in">
      {/* Ancestral Gardening & Earth Stewardship Showcase */}
      <div className="bg-gradient-to-br from-[#FAF5EE] via-[#F6EFE6] to-[#EAE0D3] border border-[#B87333]/25 rounded-3xl p-5 sm:p-6 lg:p-7 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-8">
          {/* Framed & Sized Photograph */}
          <div className="w-full md:w-5/12 lg:w-4/12 flex-shrink-0 flex justify-center">
            <div className="relative group overflow-hidden rounded-2xl border-2 border-[#D4AF37]/35 shadow-lg bg-[#1F140E] w-full max-w-[340px]">
              <img 
                src="/CopperMommiegardening-cmc.jpg" 
                alt="Copper Mommie gardening and tending living soil" 
                className="w-full h-auto max-h-[380px] sm:max-h-[420px] object-cover object-center transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F140E]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-[#1F140E]/85 border border-[#D4AF37]/40 text-[#FAF5EE] font-serif text-[11px] font-semibold backdrop-blur-xs">
                  🌱 Home Gardening &amp; Natural Living
                </span>
              </div>
            </div>
          </div>

          {/* Accompanying Sanctuary Text and Core Homesteading Tenets */}
          <div className="w-full md:w-7/12 lg:w-8/12 space-y-4 text-[#1F1813]">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 text-soft-sage">
                <span className="w-2 h-2 rounded-full bg-soft-sage" />
                <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-soft-sage">
                  Soil Stewardship • {selectedState} Circle
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1F1813] tracking-tight">
                Tending the Soil &amp; Nourishing Our Homes
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#2A221B]/85 leading-relaxed">
              Our foremothers knew that family health and calm start with good food and clean soil. By planting heirloom seeds, composting naturally, and gathering fresh herbs and vegetables with our children, we cultivate resilience, health, and peace.
            </p>

            {/* Three Pillar Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-white/85 border border-copper-penny/15 rounded-xl p-3 space-y-1 shadow-xs">
                <p className="font-serif font-bold text-xs text-[#A85138]">🌾 Heirloom Seeds</p>
                <p className="text-[11px] text-[#2A221B]/75 leading-snug">Preserving open-pollinated varieties that thrive without synthetic pesticides.</p>
              </div>
              <div className="bg-white/85 border border-copper-penny/15 rounded-xl p-3 space-y-1 shadow-xs">
                <p className="font-serif font-bold text-xs text-soft-sage">🌿 Living Compost</p>
                <p className="text-[11px] text-[#2A221B]/75 leading-snug">Nurturing microbial soil health for nutrient-dense homegrown vegetables.</p>
              </div>
              <div className="bg-white/85 border border-copper-penny/15 rounded-xl p-3 space-y-1 shadow-xs">
                <p className="font-serif font-bold text-xs text-[#B87333]">🍯 Home Apothecary</p>
                <p className="text-[11px] text-[#2A221B]/75 leading-snug">Hand-harvested botanicals for calming teas, respiratory syrups, and pure balms.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FAF5EE]/30 border border-copper-penny/15 rounded-3xl p-4 sm:p-5 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Content Area: Left 8 columns */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section: American Heritage Gardening & Ancestral Homesteading */}
          <div className="bg-[#FAF5EE] border border-copper-penny/20 rounded-3xl p-5 sm:p-6 shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-copper-penny/15 pb-3.5">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#B87333]/15 text-[#B87333] flex items-center justify-center border border-[#B87333]/30">
                  <Wheat className="w-5 h-5 text-[#B87333]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#1F1813]">
                    American Heritage Gardening &amp; Ancestral Homesteading
                  </h3>
                  <p className="text-[10px] font-mono text-soft-sage uppercase tracking-wider font-bold">
                    Time-Honored Soil Stewardship, Heritage Seeds &amp; Self-Sustaining Family Living
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-[#B87333]/10 text-copper-penny border border-[#B87333]/20 self-start sm:self-auto">
                American Homestead Traditions
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#2A221B]/85 leading-relaxed">
              Our American homesteading lineage represents centuries of matriarchal self-reliance. Rooted in the ancient agricultural wisdom of melanated American Indians—the original copper-skinned stewards native to and born of the land of America—alongside generational southern kitchen gardens and heirloom seed-saving traditions, we cultivate sovereign abundance directly from the living soil of our forebears.
            </p>

            {/* Interactive Seasonal Homesteading Almanac */}
            <div className="bg-white/80 border border-copper-penny/15 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-copper-penny/10 pb-2">
                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-serif font-bold text-xs text-[#1F1813]">Seasonal American Homestead Almanac</span>
                </div>
                <div className="flex items-center space-x-1">
                  {(['spring', 'summer', 'fall', 'winter'] as const).map((season) => (
                    <button
                      key={season}
                      type="button"
                      onClick={() => setHomesteadSeason(season)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold capitalize transition-all cursor-pointer ${
                        homesteadSeason === season
                          ? 'bg-[#B87333] text-white shadow-xs'
                          : 'bg-[#FAF5EE] text-[#1F1813]/70 hover:bg-[#FAF5EE]/80'
                      }`}
                    >
                      {season}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Season Content */}
              {homesteadSeason === 'spring' && (
                <div className="text-xs text-[#2A221B]/85 space-y-2">
                  <p className="font-serif font-bold text-soft-sage flex items-center space-x-1.5">
                    <span>🌱 Spring Soil Awakening &amp; Cold-Frame Starts</span>
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Remineralize garden plots with seasoned hardwood ash and rich worm castings. Sow cool-weather heirlooms directly into the soil—heritage Georgia Southern collards, black-seeded Simpson lettuce, and sweet snap peas. Start Cherokee Purple tomatoes and Seminole pumpkins indoors on warm windowsills.
                  </p>
                </div>
              )}
              {homesteadSeason === 'summer' && (
                <div className="text-xs text-[#2A221B]/85 space-y-2">
                  <p className="font-serif font-bold text-[#D4AF37] flex items-center space-x-1.5">
                    <span>☀️ Summer Pollination, Herb Drying &amp; Rain Harvesting</span>
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Mound soil around American Indian Three Sisters guilds as sweet corn stalks reach knee height. Harvest morning herbs (mint, lemon balm, yarrow) while essential oils peak; bundle and hang in airy porch shade. Direct rain barrel overflow into deep mulch furrows to sustain squash and okra through July heat.
                  </p>
                </div>
              )}
              {homesteadSeason === 'fall' && (
                <div className="text-xs text-[#2A221B]/85 space-y-2">
                  <p className="font-serif font-bold text-[#A85138] flex items-center space-x-1.5">
                    <span>🍂 Autumn Harvest, Seed Gathering &amp; Cellar Stacking</span>
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Gather open-pollinated seed pods and heirloom bean husks; sun-dry on cotton cloths and label in paper envelopes for spring trading. Pack cured sweet potatoes and winter squash into dry pine shavings in a cool, dark larder. Fill stoneware crocks with salted cabbage for winter lacto-fermentation.
                  </p>
                </div>
              )}
              {homesteadSeason === 'winter' && (
                <div className="text-xs text-[#2A221B]/85 space-y-2">
                  <p className="font-serif font-bold text-copper-penny flex items-center space-x-1.5">
                    <span>❄️ Winter Soil Regeneration &amp; Artisan Sourdough Craft</span>
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Blanket empty garden beds with shredded autumn leaves, straw, and well-rotted manure to feed earthworms during frost. Clean and condition forged carbon steel garden hoes and shears with boiled linseed oil. Bake wild yeast artisan sourdough loaves and host cozy evening seed-swapping circles.
                  </p>
                </div>
              )}
            </div>

            {/* Four Heritage Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Pillar 1 */}
              <div className="bg-white border border-copper-penny/15 rounded-2xl p-4 space-y-2.5 shadow-xs hover:border-copper-penny/30 transition-all">
                <div className="flex items-center space-x-2">
                  <span className="text-base">🌽</span>
                  <h4 className="font-serif font-bold text-sm text-[#1F1813]">The Three Sisters Guild (American Indian)</h4>
                </div>
                <p className="text-[11px] text-[#2A221B]/80 leading-relaxed">
                  Cultivated by melanated American Indians native to and born of the land of America, this ancient companion guild interplants tall field corn, climbing pole beans, and spreading winter squash. The corn provides living trellis; beans fix biological nitrogen into the root bed; wide prickly squash leaves carpet the earth to suppress weeds and retain soil moisture under the hot sun.
                </p>
                <span className="inline-block text-[9px] font-mono text-soft-sage font-bold bg-soft-sage/10 px-2 py-0.5 rounded">
                  Indigenous American Indian Soil Symbiosis
                </span>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white border border-copper-penny/15 rounded-2xl p-4 space-y-2.5 shadow-xs hover:border-copper-penny/30 transition-all">
                <div className="flex items-center space-x-2">
                  <span className="text-base">🌱</span>
                  <h4 className="font-serif font-bold text-sm text-[#1F1813]">Heirloom Seeds &amp; Family Food Security</h4>
                </div>
                <p className="text-[11px] text-[#2A221B]/80 leading-relaxed">
                  Saving true-to-type, open-pollinated seed varieties that have sustained American families across centuries—Georgia Southern collards, Cherokee Purple tomatoes, Carolina Gold rice, Clemson spineless okra, and Seminole pumpkin—protecting our lineage from commercial seed dependency.
                </p>
                <span className="inline-block text-[9px] font-mono text-[#B87333] font-bold bg-[#B87333]/10 px-2 py-0.5 rounded">
                  100% Non-Hybridized Open-Pollinated
                </span>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white border border-copper-penny/15 rounded-2xl p-4 space-y-2.5 shadow-xs hover:border-copper-penny/30 transition-all">
                <div className="flex items-center space-x-2">
                  <span className="text-base">🧺</span>
                  <h4 className="font-serif font-bold text-sm text-[#1F1813]">Root Cellaring, Ferments &amp; Larder Keeping</h4>
                </div>
                <p className="text-[11px] text-[#2A221B]/80 leading-relaxed">
                  Traditional cold storage in dry subterranean cellars alongside stoneware crock lacto-fermentation (raw sauerkrauts, green tomato relishes, and fermented peppers) preserving natural vitamin C and gut-restoring enzymes without electricity.
                </p>
                <span className="inline-block text-[9px] font-mono text-soft-sage font-bold bg-soft-sage/10 px-2 py-0.5 rounded">
                  Grid-Independent Food Preservation
                </span>
              </div>

              {/* Pillar 4 */}
              <div className="bg-white border border-copper-penny/15 rounded-2xl p-4 space-y-2.5 shadow-xs hover:border-copper-penny/30 transition-all">
                <div className="flex items-center space-x-2">
                  <span className="text-base">🏡</span>
                  <h4 className="font-serif font-bold text-sm text-[#1F1813]">Porch Stoop &amp; Kitchen Apothecary Bed</h4>
                </div>
                <p className="text-[11px] text-[#2A221B]/80 leading-relaxed">
                  Cultivating native American Indian healing flora within five paces of the kitchen stoop—Echinacea purpurea (purple coneflower), American elderberry, soothing peppermint, yarrow, and sweetgrass—for immediate family infusions, poultices, and chest rubs.
                </p>
                <span className="inline-block text-[9px] font-mono text-copper-penny font-bold bg-copper-penny/10 px-2 py-0.5 rounded">
                  Instant Household Healing Flora
                </span>
              </div>
            </div>

            {/* Homesteading Guide Download Banner */}
            <div className="p-3 bg-white border-l-4 border-[#B87333] rounded-r-xl border border-copper-penny/10 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow-xs">
              <div>
                <span className="font-bold text-[#1F1813] block">American Homesteading Almanac &amp; Companion Planting Guide</span>
                <span className="text-[10px] text-[#2A221B]/70">Includes state-by-state planting calendars and heirloom seed-saving worksheets</span>
              </div>
              <button 
                type="button"
                className="text-xs font-bold text-copper-penny font-mono px-3.5 py-1.5 rounded-lg bg-[#B87333]/10 hover:bg-[#B87333] hover:text-white transition-colors cursor-pointer flex-shrink-0" 
                onClick={() => alert("American Homesteading Almanac saved to your private sanctuary bookshelf!")}
              >
                Download Guide
              </button>
            </div>
          </div>

          {/* Interactive Daily Botanical Logger */}
          <div className="bg-[#FAF5EE] border-2 border-[#1F1813]/5 rounded-3xl p-5 shadow-lg space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-soft-sage/15 text-soft-sage flex items-center justify-center border border-soft-sage/30">
                <Heart className="w-4.5 h-4.5 text-soft-sage" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1F1813]">Daily Botanical Intake &amp; Activity Tracker</h3>
                <p className="text-[10px] font-mono text-soft-sage uppercase tracking-wider font-bold">Maternal Wellness Logs</p>
              </div>
            </div>

            <p className="text-xs text-[#2A221B]/80 leading-relaxed">
              Log your botanical ingestions, organic skincare preparations, and balcony gardening steps. Keeping a physical-digital ledger of maternal self-determination honors the legacy of our great-great-grandmothers.
            </p>

            <form onSubmit={handleAddLog} className="bg-white border border-copper-penny/10 rounded-2xl p-4 space-y-3 shadow-sm">
              <h4 className="font-serif font-bold text-xs text-copper-penny uppercase tracking-wider">Log Healing Activity</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] font-mono text-soft-sage uppercase font-bold tracking-wider">Activity Title</label>
                  <input 
                    type="text"
                    required
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    placeholder="e.g. Elderberry Syrup dosage"
                    className="w-full bg-[#FAF5EE]/30 border border-copper-penny/20 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-1.5 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-mono text-soft-sage uppercase font-bold tracking-wider">Category</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as any)}
                    className="w-full bg-[#FAF5EE]/30 border border-copper-penny/20 focus:border-copper-penny rounded-xl px-3 py-1.5 text-xs text-[#1F1813] focus:outline-none transition-colors"
                  >
                    <option value="intake">Herbal / Ingestion</option>
                    <option value="skincare">Skincare / Beauty</option>
                    <option value="homestead">Homestead / Gardening</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-mono text-soft-sage uppercase font-bold tracking-wider">Quick Details</label>
                  <input 
                    type="text"
                    value={newDetails}
                    onChange={(e) => setNewDetails(e.target.value)}
                    placeholder="e.g. steep 15m, soothe cough"
                    className="w-full bg-[#FAF5EE]/30 border border-copper-penny/20 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-1.5 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-[#B87333] hover:bg-[#A85138] border border-[#96551d]/30 text-white text-xs font-bold rounded-xl transition-all uppercase tracking-widest cursor-pointer shadow-[0_4px_12px_rgba(184,115,51,0.2)] hover:shadow-[0_6px_18px_rgba(184,115,51,0.3)] active:scale-95"
              >
                Log Botanical Activity
              </button>
            </form>

            <div className="space-y-3 pt-1">
              <h4 className="font-serif font-bold text-sm text-[#1F1813]">Today's Ancestral Wellness Timeline</h4>
              
              <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3.5 rounded-xl border border-copper-penny/10 bg-white hover:border-copper-penny/25 transition-colors text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2.5">
                        <span className={`w-2 h-2 rounded-full ${
                          log.category === 'intake' ? 'bg-[#A85138]' :
                          log.category === 'skincare' ? 'bg-[#93A28B]' :
                          'bg-[#B87333]'
                        }`} />
                        <span className="font-bold text-[#1F1813]">{log.activityName}</span>
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-white text-soft-sage border border-copper-penny/5">{log.category}</span>
                      </div>
                      <p className="text-[#2A221B]/75 leading-relaxed text-[11px] pl-4.5">{log.details}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] text-soft-sage font-mono">{log.date}</span>
                      <button 
                        onClick={() => handleDeleteLog(log.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer"
                        title="Delete log entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Natural Skincare & Therapeutics - Dedicated Horizontal Section */}
          <div className="bg-[#FAF5EE] border border-copper-penny/20 rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-copper-penny/15 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/15 text-[#B87333] flex items-center justify-center border border-[#D4AF37]/30">
                  <Sparkles className="w-4 h-4 text-[#B87333]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#1F1813]">Natural Skincare &amp; Therapeutics</h4>
                  <p className="text-[10px] font-mono text-soft-sage uppercase tracking-wider font-bold">Sacred Self-Love &amp; Pure Botanical Formulations</p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-[#B87333]/10 text-copper-penny border border-[#B87333]/20 self-start sm:self-auto">
                100% Non-Toxic &amp; Chemical Free
              </span>
            </div>

            {/* Horizontal Layout: Self-Love Image alongside Whipped Skincare Formula */}
            <div className="flex flex-col md:flex-row items-center gap-5 lg:gap-6">
              {/* Sized & Framed Self-Love Image */}
              <div className="w-full md:w-5/12 flex-shrink-0 flex justify-center">
                <div className="relative group overflow-hidden rounded-2xl border-2 border-[#D4AF37]/35 shadow-md bg-[#1F140E] w-full max-w-[280px]">
                  <img 
                    src="/coppermommies-selflove1-cmc.jpg" 
                    alt="Copper Mommie practicing natural skincare and self-love" 
                    className="w-full h-auto max-h-[320px] object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F140E]/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#1F140E]/85 border border-[#D4AF37]/40 text-[#FAF5EE] font-serif text-[10px] font-semibold backdrop-blur-xs">
                      ✨ Maternal Self-Love Ritual
                    </span>
                  </div>
                </div>
              </div>

              {/* Whipped Skincare Formula Content */}
              <div className="w-full md:w-7/12 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#93A28B]" />
                    <h5 className="font-serif font-bold text-base sm:text-lg text-[#1F1813]">
                      Whipped Skincare Formula
                    </h5>
                  </div>
                  <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                    Our ancestors rejected synthetic chemicals because clean, luminous skin is our birthright. Whipping 70% unrefined cold-pressed shea butter with 30% organic cold-pressed jojoba or avocado oil creates an ultra-nourishing, cloud-like cream perfect for dry skin, maternal stretch marks, and gentle baby massage.
                  </p>
                </div>

                {/* Botanical Ingredients Pills */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className="px-2.5 py-0.5 rounded-lg bg-white border border-copper-penny/15 text-[10px] font-serif font-medium text-[#1F1813] shadow-2xs">
                    🧈 Unrefined Ivory Shea
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-white border border-copper-penny/15 text-[10px] font-serif font-medium text-[#1F1813] shadow-2xs">
                    🥑 Cold-Pressed Avocado Oil
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-white border border-copper-penny/15 text-[10px] font-serif font-medium text-[#1F1813] shadow-2xs">
                    🌼 Calendula Infusion
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-white border border-copper-penny/15 text-[10px] font-serif font-medium text-[#1F1813] shadow-2xs">
                    🌿 Roman Chamomile
                  </span>
                </div>

                {/* Recipe Download / Action Card */}
                <div className="p-3 bg-white border-l-4 border-[#B87333] rounded-r-xl border border-copper-penny/10 text-xs flex justify-between items-center shadow-xs">
                  <div>
                    <span className="font-bold text-[#1F1813] block">Mango &amp; Shea Butter Recipe PDF</span>
                    <span className="text-[10px] text-[#2A221B]/70">Step-by-step small batch whipping guide for radiant skin</span>
                  </div>
                  <button 
                    type="button"
                    className="text-xs font-bold text-copper-penny font-mono px-3 py-1.5 rounded-lg bg-[#B87333]/10 hover:bg-[#B87333] hover:text-white transition-colors cursor-pointer flex-shrink-0" 
                    onClick={() => alert("Skincare recipe saved to your private bookshelf!")}
                  >
                    Get Recipe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Holistic Health & Generational Remedies - Dedicated Sanctuary */}
          <div className="bg-[#FAF5EE] border border-copper-penny/20 rounded-3xl p-5 sm:p-6 shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-copper-penny/15 pb-3.5">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-soft-sage/15 text-soft-sage flex items-center justify-center border border-soft-sage/30">
                  <Heart className="w-5 h-5 text-soft-sage" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xl text-[#1F1813]">Holistic Health &amp; Generational Remedies</h4>
                  <p className="text-[10px] font-mono text-soft-sage uppercase tracking-wider font-bold">
                    Community Resources for Traditional Wellness, Herbalism &amp; Natural Birth Care (Doula)
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-soft-sage/15 text-soft-sage border border-soft-sage/25 self-start sm:self-auto">
                Doula &amp; Apothecary Care
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#2A221B]/85 leading-relaxed">
              Holistic wellness connects natural herbalism, calm birth support, and restorative rest. Guided by certified doulas, herbalists, and experienced mothers, this space offers practical wisdom for mother, womb, and baby.
            </p>

            {/* Filter Pills for the 3 Pillars */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setActiveHolisticTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeHolisticTab === 'all'
                    ? 'bg-[#B87333] text-white shadow-xs'
                    : 'bg-white text-[#1F1813]/75 border border-copper-penny/15 hover:bg-[#FAF5EE]'
                }`}
              >
                All Offerings ({activeHolisticTab === 'all' ? '6' : '6'})
              </button>
              <button
                type="button"
                onClick={() => setActiveHolisticTab('herbalism')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeHolisticTab === 'herbalism'
                    ? 'bg-copper-penny text-white shadow-xs'
                    : 'bg-white text-[#1F1813]/75 border border-copper-penny/15 hover:bg-[#FAF5EE]'
                }`}
              >
                <span>🌿 Traditional Herbalism</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveHolisticTab('doula')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeHolisticTab === 'doula'
                    ? 'bg-soft-sage text-white shadow-xs'
                    : 'bg-white text-[#1F1813]/75 border border-copper-penny/15 hover:bg-[#FAF5EE]'
                }`}
              >
                <span>🕊️ Natural Birth Education (Doula)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveHolisticTab('wellness')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeHolisticTab === 'wellness'
                    ? 'bg-[#D4AF37] text-[#1F1813] shadow-xs'
                    : 'bg-white text-[#1F1813]/75 border border-copper-penny/15 hover:bg-[#FAF5EE]'
                }`}
              >
                <span>✨ Traditional Wellness</span>
              </button>
            </div>

            {/* Holistic Health Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Card 1: The Respiratory Infusion (Herbalism) */}
              {(activeHolisticTab === 'all' || activeHolisticTab === 'herbalism') && (
                <div className="bg-white border border-copper-penny/15 rounded-2xl p-4.5 space-y-3 hover:border-copper-penny/30 transition-all duration-300 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-copper-penny" />
                        <h5 className="font-serif font-bold text-base text-[#1F1813]">The Respiratory Infusion</h5>
                      </div>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#FAF5EE] text-copper-penny font-bold border border-copper-penny/10">
                        Herbalism
                      </span>
                    </div>
                    <p className="text-xs text-[#2A221B]/80 leading-relaxed">
                      Combine equal parts organic dried mullein leaf, marshmallow root, and local elderberries in boiling glass-jar water. Let steep covered for 20 minutes. Highly supportive of children's upper respiratory strength and mucosal soothing during seasonal climate shifts.
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-2 py-0.5 rounded bg-[#FAF5EE] border border-copper-penny/10 text-[9px] font-mono text-copper-penny font-semibold">Mullein Leaf</span>
                      <span className="px-2 py-0.5 rounded bg-[#FAF5EE] border border-copper-penny/10 text-[9px] font-mono text-copper-penny font-semibold">Marshmallow Root</span>
                      <span className="px-2 py-0.5 rounded bg-[#FAF5EE] border border-copper-penny/10 text-[9px] font-mono text-copper-penny font-semibold">Elderberry</span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-[#FAF5EE] border-l-4 border-soft-sage rounded-r-xl text-xs flex justify-between items-center mt-2">
                    <span className="font-medium text-[#1F1813]">Lung Health infusion dosage</span>
                    <button 
                      type="button"
                      className="text-xs font-bold text-soft-sage font-mono hover:underline cursor-pointer" 
                      onClick={() => alert("Respiratory infusion dosage guide saved to your private bookshelf!")}
                    >
                      Get Dosage
                    </button>
                  </div>
                </div>
              )}

              {/* Card 2: Maternal Rest & Nettle Mineral Tonic (Herbalism) */}
              {(activeHolisticTab === 'all' || activeHolisticTab === 'herbalism') && (
                <div className="bg-white border border-copper-penny/15 rounded-2xl p-4.5 space-y-3 hover:border-copper-penny/30 transition-all duration-300 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-soft-sage" />
                        <h5 className="font-serif font-bold text-base text-[#1F1813]">Maternal Rest &amp; Nettle Mineral Tonic</h5>
                      </div>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#FAF5EE] text-soft-sage font-bold border border-soft-sage/20">
                        Herbalism
                      </span>
                    </div>
                    <p className="text-xs text-[#2A221B]/80 leading-relaxed">
                      An overnight long-steep of dried stinging nettle, red raspberry leaf, oatstraw, and German chamomile blossoms. Packed with bioavailable iron, magnesium, and calcium to replenish maternal blood volume, tone uterine muscle, and calm the nervous system.
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-2 py-0.5 rounded bg-[#FAF5EE] border border-copper-penny/10 text-[9px] font-mono text-soft-sage font-semibold">Stinging Nettle</span>
                      <span className="px-2 py-0.5 rounded bg-[#FAF5EE] border border-copper-penny/10 text-[9px] font-mono text-soft-sage font-semibold">Red Raspberry Leaf</span>
                      <span className="px-2 py-0.5 rounded bg-[#FAF5EE] border border-copper-penny/10 text-[9px] font-mono text-soft-sage font-semibold">Chamomile</span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-[#FAF5EE] border-l-4 border-[#B87333] rounded-r-xl text-xs flex justify-between items-center mt-2">
                    <span className="font-medium text-[#1F1813]">Restorative mineral steep guide</span>
                    <button 
                      type="button"
                      className="text-xs font-bold text-copper-penny font-mono hover:underline cursor-pointer" 
                      onClick={() => alert("Restorative tonic protocol saved to your private bookshelf!")}
                    >
                      Get Protocol
                    </button>
                  </div>
                </div>
              )}

              {/* Card 3: Physiological Birth & Sacred Labor Support (Doula Education) */}
              {(activeHolisticTab === 'all' || activeHolisticTab === 'doula') && (
                <div className="bg-white border border-copper-penny/15 rounded-2xl p-4.5 space-y-3 hover:border-copper-penny/30 transition-all duration-300 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                        <h5 className="font-serif font-bold text-base text-[#1F1813]">Physiological Birth &amp; Labor Support</h5>
                      </div>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#FAF5EE] text-[#B87333] font-bold border border-[#B87333]/20">
                        Doula Wisdom
                      </span>
                    </div>
                    <p className="text-xs text-[#2A221B]/80 leading-relaxed">
                      Doula-guided wisdom honoring the mother's intuitive body rhythms: gravity-assisted labor positions (hands-and-knees, pelvic circles, deep side-lying), sacral double-hip squeeze counter-pressure, and creating a low-light sanctuary where oxytocin flows uninterrupted.
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-2 py-0.5 rounded bg-[#FAF5EE] border border-copper-penny/10 text-[9px] font-mono text-[#B87333] font-semibold">Pelvic Mobility</span>
                      <span className="px-2 py-0.5 rounded bg-[#FAF5EE] border border-copper-penny/10 text-[9px] font-mono text-[#B87333] font-semibold">Oxytocin Safeguards</span>
                      <span className="px-2 py-0.5 rounded bg-[#FAF5EE] border border-copper-penny/10 text-[9px] font-mono text-[#B87333] font-semibold">Vocal Toning</span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-[#FAF5EE] border-l-4 border-[#D4AF37] rounded-r-xl text-xs flex justify-between items-center mt-2">
                    <span className="font-medium text-[#1F1813]">Doula birth sanctuary guide</span>
                    <button 
                      type="button"
                      className="text-xs font-bold text-copper-penny font-mono hover:underline cursor-pointer" 
                      onClick={() => alert("Natural birth & doula comfort measures guide saved to your private bookshelf!")}
                    >
                      Get Doula Guide
                    </button>
                  </div>
                </div>
              )}

              {/* Card 4: The Sacred First 40 Days: Postpartum Doula Care (Doula Education) */}
              {(activeHolisticTab === 'all' || activeHolisticTab === 'doula') && (
                <div className="bg-white border border-copper-penny/15 rounded-2xl p-4.5 space-y-3 hover:border-copper-penny/30 transition-all duration-300 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-soft-sage" />
                        <h5 className="font-serif font-bold text-base text-[#1F1813]">The First 40 Days: Postpartum Rest &amp; Care</h5>
                      </div>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#FAF5EE] text-soft-sage font-bold border border-soft-sage/20">
                        Doula Wisdom
                      </span>
                    </div>
                    <p className="text-xs text-[#2A221B]/80 leading-relaxed">
                      Postpartum lying-in traditions honoring complete maternal rest: gentle warming belly binding, continuous skin-to-skin newborn bonding, nutrient-rich warming broths, and communal sisterhood caretaking.
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-2 py-0.5 rounded bg-[#FAF5EE] border border-copper-penny/10 text-[9px] font-mono text-soft-sage font-semibold">Belly Binding</span>
                      <span className="px-2 py-0.5 rounded bg-[#FAF5EE] border border-copper-penny/10 text-[9px] font-mono text-soft-sage font-semibold">Warming Broths</span>
                      <span className="px-2 py-0.5 rounded bg-[#FAF5EE] border border-copper-penny/10 text-[9px] font-mono text-soft-sage font-semibold">Mother Care</span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-[#FAF5EE] border-l-4 border-soft-sage rounded-r-xl text-xs flex justify-between items-center mt-2">
                    <span className="font-medium text-[#1F1813]">First 40 days lying-in plan</span>
                    <button 
                      type="button"
                      className="text-xs font-bold text-soft-sage font-mono hover:underline cursor-pointer" 
                      onClick={() => alert("Postpartum First 40 Days care plan saved to your private bookshelf!")}
                    >
                      Get Care Plan
                    </button>
                  </div>
                </div>
              )}

              {/* Card 5: Postpartum Herbal Sitz Bath & Perineal Restoration (Doula & Herbalism) */}
              {(activeHolisticTab === 'all' || activeHolisticTab === 'doula' || activeHolisticTab === 'herbalism') && (
                <div className="bg-white border border-copper-penny/15 rounded-2xl p-4.5 space-y-3 hover:border-copper-penny/30 transition-all duration-300 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-[#A85138]" />
                        <h5 className="font-serif font-bold text-base text-[#1F1813]">Herbal Sitz Bath &amp; Perineal Care</h5>
                      </div>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#FAF5EE] text-[#A85138] font-bold border border-[#A85138]/20">
                        Doula &amp; Herb
                      </span>
                    </div>
                    <p className="text-xs text-[#2A221B]/80 leading-relaxed">
                      A soothing, restorative warm soak prepared from organic whole calendula flowers, comfrey leaf, witch hazel bark, lavender buds, and mineral sea salt. Reduces perineal swelling, accelerates tissue repair, and supports tender maternal comfort postpartum.
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-2 py-0.5 rounded bg-[#FAF5EE] border border-copper-penny/10 text-[9px] font-mono text-[#A85138] font-semibold">Calendula Blossoms</span>
                      <span className="px-2 py-0.5 rounded bg-[#FAF5EE] border border-copper-penny/10 text-[9px] font-mono text-[#A85138] font-semibold">Witch Hazel Bark</span>
                      <span className="px-2 py-0.5 rounded bg-[#FAF5EE] border border-copper-penny/10 text-[9px] font-mono text-[#A85138] font-semibold">Comfrey Leaf</span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-[#FAF5EE] border-l-4 border-[#A85138] rounded-r-xl text-xs flex justify-between items-center mt-2">
                    <span className="font-medium text-[#1F1813]">Herbal sitz brew recipe</span>
                    <button 
                      type="button"
                      className="text-xs font-bold text-copper-penny font-mono hover:underline cursor-pointer" 
                      onClick={() => alert("Herbal Sitz Bath soak recipe saved to your private bookshelf!")}
                    >
                      Get Recipe
                    </button>
                  </div>
                </div>
              )}

              {/* Card 6: Thermal Hydrotherapy & Castor Oil Restorative Packs (Traditional Wellness) */}
              {(activeHolisticTab === 'all' || activeHolisticTab === 'wellness') && (
                <div className="bg-white border border-copper-penny/15 rounded-2xl p-4.5 space-y-3 hover:border-copper-penny/30 transition-all duration-300 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-[#B87333]" />
                        <h5 className="font-serif font-bold text-base text-[#1F1813]">Warm Compresses &amp; Castor Oil Packs</h5>
                      </div>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#FAF5EE] text-[#B87333] font-bold border border-[#B87333]/20">
                        Wellness
                      </span>
                    </div>
                    <p className="text-xs text-[#2A221B]/80 leading-relaxed">
                      Time-tested comfort care: warm cold-pressed castor oil soaked into organic wool flannel, laid over the lower abdomen with gentle warmth to encourage deep uterine tone, digestive ease, and relaxation, alongside calming warm ginger foot soaks.
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-2 py-0.5 rounded bg-[#FAF5EE] border border-copper-penny/10 text-[9px] font-mono text-[#B87333] font-semibold">Castor Flannel</span>
                      <span className="px-2 py-0.5 rounded bg-[#FAF5EE] border border-copper-penny/10 text-[9px] font-mono text-[#B87333] font-semibold">Lymphatic Flow</span>
                      <span className="px-2 py-0.5 rounded bg-[#FAF5EE] border border-copper-penny/10 text-[9px] font-mono text-[#B87333] font-semibold">Ginger Foot Soaks</span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-[#FAF5EE] border-l-4 border-[#B87333] rounded-r-xl text-xs flex justify-between items-center mt-2">
                    <span className="font-medium text-[#1F1813]">Castor pack application steps</span>
                    <button 
                      type="button"
                      className="text-xs font-bold text-copper-penny font-mono hover:underline cursor-pointer" 
                      onClick={() => alert("Castor oil pack and thermal compress guide saved to your private bookshelf!")}
                    >
                      Get Protocol
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Sidebar Panel: Right 4 columns */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* AI Botanical Advisor Widget */}
          <div className="bg-[#1F1813] border-2 border-[#D4AF37]/35 rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center space-x-2 text-[#D4AF37]">
              <Sparkles className="w-4.5 h-4.5 text-[#D4AF37]" />
              <h4 className="font-serif font-bold text-lg text-[#D4AF37] glow-gold-text">Herbal &amp; Wellness Advisor</h4>
            </div>

            <p className="text-xs text-[#FAF5EE]/90 leading-relaxed">
              Ask questions about calming herbal teas, home gardening tips, or gentle, chemical-free body care ideas for you and your family.
            </p>

            <form onSubmit={handleAdvisorSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[9px] uppercase font-mono text-[#D4AF37]/75 font-bold tracking-wider">Your Question</label>
                <input 
                  type="text"
                  required
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. natural teas for restful sleep"
                  className="w-full bg-white border border-[#D4AF37]/25 rounded-xl px-3.5 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <button 
                type="submit"
                disabled={aiLoading || !aiPrompt.trim()}
                className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#B87333] hover:text-white text-[#1F1813] disabled:bg-gray-700 disabled:text-gray-500 border border-[#B87333]/40 font-black text-xs rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-[0_4px_14px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_18px_rgba(212,175,55,0.35)] active:scale-95"
              >
                {aiLoading ? (
                  <span>Gathering Ideas...</span>
                ) : (
                  <>
                    <span>Get Wellness Ideas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Advisory loading notice */}
            {aiLoading && (
              <div className="p-3 bg-[#FAF5EE]/10 rounded-xl border border-[#D4AF37]/20 text-center space-y-1.5 shadow-sm">
                <Sprout className="w-4 h-4 text-[#D4AF37] mx-auto opacity-80" />
                <p className="text-[10px] font-mono text-[#D4AF37] italic">{getLoadingNote()}</p>
              </div>
            )}

            {/* Response Area */}
            {aiResponse && !aiLoading && (
              <div className="p-3.5 bg-white border border-[#D4AF37]/30 rounded-xl space-y-2 shadow-inner max-h-64 overflow-y-auto scrollbar-thin text-[#1F1813]">
                <span className="inline-block text-[9px] font-mono font-bold uppercase text-white bg-[#B87333] px-2 py-0.5 rounded">
                  Council botanical Advice
                </span>
                <div className="text-xs text-[#2A221B]/95 leading-relaxed font-sans space-y-1.5">
                  {aiResponse.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botanical safety disclosure */}
          <div className="flex items-start space-x-2 p-3 bg-white border border-copper-penny/15 rounded-2xl text-[10px] text-soft-sage leading-relaxed">
            <Info className="w-4 h-4 text-copper-penny flex-shrink-0 mt-0.5" />
            <span>
              Disclaimer: Our botanical advice does not substitute for licensed obstetric care. We encourage mothers to blend ancestral wisdom with their trusted local wellness partners.
            </span>
          </div>

        </div>
      </div>
      </div>
      )}
    </div>
  );
}
