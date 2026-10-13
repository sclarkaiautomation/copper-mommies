import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  User, 
  Tag, 
  Trash2, 
  Edit3, 
  Eye, 
  Heart, 
  ShieldCheck, 
  Check, 
  X,
  Droplet,
  Coffee,
  PackageCheck,
  Send
} from 'lucide-react';

export interface HerbalRemedy {
  id: string;
  name: string;
  latinName: string;
  category: 'Tincture' | 'Tea / Infusion' | 'Salve / Balm' | 'Syrup' | 'Essential Oil Blend' | 'Powder / Capsule';
  primaryBenefits: string[];
  ingredients: string;
  preparationInstructions: string;
  recommendedDosage: string;
  safetyWarnings: string[];
  isContraindicatedPregnancy: boolean;
  pregnancyNotes?: string;
  isNursingSafe: boolean;
  isPediatricSafe: boolean;
  pediatricDosage?: string;
  status: 'active' | 'seasonal' | 'out_of_stock';
  imageUrl: string;
}

export interface MotherHerbalIntake {
  id: string;
  motherName: string;
  stateCircle: string;
  contactEmail: string;
  phone: string;
  stage: 'Pregnant (1st Tri)' | 'Pregnant (2nd Tri)' | 'Pregnant (3rd Tri)' | 'Immediate Postpartum (0-40 Days)' | 'Nursing Mother' | 'Elder Matriarch' | 'Child Wellness';
  healthGoals: string;
  allergies: string;
  currentMedications: string;
  assignedHerbalist: string;
  status: 'new_intake' | 'formulating' | 'compound_ready' | 'dispatched';
  practitionerNotes: string;
  submittedAt: string;
}

const INITIAL_REMEDIES: HerbalRemedy[] = [
  {
    id: 'rem-1',
    name: 'Ancestral Mullein & Marshmallow Root Lung Elixir',
    latinName: 'Verbascum thapsus & Althaea officinalis',
    category: 'Syrup',
    primaryBenefits: ['Deep Bronchial Soothing', 'Mucous Membrane Coating', 'Seasonal Cough Relief'],
    ingredients: 'Wildcrafted Georgia Mullein leaf, Organic Marshmallow root, Wildflower Raw Honey, Organic Vegetable Glycerin, Ceylon Cinnamon.',
    preparationInstructions: 'Cold decoction of marshmallow root steeped 8 hours, combined with hot mullein infusion and simmered down with raw honey.',
    recommendedDosage: '1-2 tablespoons 3 times daily or as needed for respiratory tightness.',
    safetyWarnings: ['Contains raw honey: do not administer to infants under 12 months.'],
    isContraindicatedPregnancy: false,
    pregnancyNotes: 'Safe in 2nd and 3rd trimester for gentle respiratory support.',
    isNursingSafe: true,
    isPediatricSafe: true,
    pediatricDosage: '1 teaspoon for children age 3 and older.',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rem-2',
    name: 'Red Raspberry Leaf & Nettle Womb Tonic',
    latinName: 'Rubus idaeus & Urtica dioica',
    category: 'Tea / Infusion',
    primaryBenefits: ['Uterine Tone & Mineral Infusion', 'Iron & Calcium Bioavailability', 'Postpartum Tissue Recovery'],
    ingredients: 'Dried organic Red Raspberry Leaf, Mountain Nettle Leaf, Oatstraw tops, Rosehips, Alfalfa leaf.',
    preparationInstructions: 'Steep 2 heaping tablespoons per quart of boiling mountain spring water covered for minimum 30-45 minutes.',
    recommendedDosage: '1 to 3 cups daily warm or iced.',
    safetyWarnings: ['Gentle uterine toner: avoid heavy doses in the first 12 weeks of pregnancy.'],
    isContraindicatedPregnancy: true,
    pregnancyNotes: 'Avoid in 1st trimester; highly recommended in 2nd and 3rd trimester and immediate postpartum.',
    isNursingSafe: true,
    isPediatricSafe: false,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rem-3',
    name: 'Elderberry, Ginger & Clove Family Immune Defense',
    latinName: 'Sambucus nigra & Zingiber officinale',
    category: 'Syrup',
    primaryBenefits: ['Immune System Fortification', 'Antioxidant Cell Protection', 'Warming Circulatory Aid'],
    ingredients: 'Wild harvested Black Elderberries, Organic Ginger root, Sweet Cloves, Star Anise, Raw Local Honey.',
    preparationInstructions: 'Slow simmer elderberries with aromatics for 45 minutes, press pulp, cool to warm, blend with raw honey.',
    recommendedDosage: '1 tablespoon daily for maintenance, 1 tablespoon every 3 hours if feeling run down.',
    safetyWarnings: ['Raw honey restriction for infants under 1 year.'],
    isContraindicatedPregnancy: false,
    pregnancyNotes: 'Safe in moderate culinary amounts throughout pregnancy.',
    isNursingSafe: true,
    isPediatricSafe: true,
    pediatricDosage: '1/2 teaspoon for children 2-5, 1 teaspoon for children 6+.',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rem-4',
    name: 'Postpartum Motherwort & Cramp Bark Sacred Drop',
    latinName: 'Leonurus cardiaca & Viburnum opulus',
    category: 'Tincture',
    primaryBenefits: ['Postpartum After-Pains Soothing', 'Maternal Nervous System Calming', 'Gentle Uterine Involution'],
    ingredients: 'Fresh organic Motherwort aerial parts, Cramp Bark, organic non-GMO cane alcohol (1:2 ratio), spring water.',
    preparationInstructions: 'Macerated for 6 full lunar cycles in amber glass with reverence and ancestral rhythm.',
    recommendedDosage: '20-30 drops in warm water or tea 2-3 times daily during postpartum cramping.',
    safetyWarnings: ['Strong uterine action: strictly prohibited during active pregnancy.'],
    isContraindicatedPregnancy: true,
    pregnancyNotes: 'DO NOT USE during pregnancy. Reserved exclusively for postpartum recovery.',
    isNursingSafe: true,
    isPediatricSafe: false,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  }
];

const INITIAL_INTAKES: MotherHerbalIntake[] = [
  {
    id: 'intake-1',
    motherName: 'Sister Ebony Robinson',
    stateCircle: 'GA (Atlanta Circle)',
    contactEmail: 'ebony.r@example.com',
    phone: '(404) 555-0198',
    stage: 'Pregnant (3rd Tri)',
    healthGoals: 'Experiencing intense leg cramps at night, mild Braxton-Hicks fatigue, and looking for safe labor preparation tea and mineral tonics.',
    allergies: 'Mild reaction to Chamomile pollen.',
    currentMedications: 'Food-based prenatal vitamin, iron bisglycinate.',
    assignedHerbalist: 'Mama Shantrece (Atlanta)',
    status: 'formulating',
    practitionerNotes: 'Preparing customized Red Raspberry + Nettle + Oatstraw mineral infusion without chamomile. Recommending topical magnesium lotion with lavender.',
    submittedAt: '2026-09-24 14:32'
  },
  {
    id: 'intake-2',
    motherName: 'Mama Keisha Vance',
    stateCircle: 'SC (Charleston Circle)',
    contactEmail: 'keisha.v@example.com',
    phone: '(843) 555-0142',
    stage: 'Immediate Postpartum (0-40 Days)',
    healthGoals: 'Baby boy arrived 6 days ago. Need nourishing postpartum sitz bath herbs, restorative womb warming blend, and lactation support.',
    allergies: 'None.',
    currentMedications: 'None. Exclusive breastfeeding.',
    assignedHerbalist: 'Mama Keisha & Sister Tamara',
    status: 'compound_ready',
    practitionerNotes: 'Packed: 1 jar Calendula & Comfrey Sitz Bath blend + 1 tin Golden Milk warming spice + Purified Milk thistle tincture.',
    submittedAt: '2026-09-25 09:15'
  },
  {
    id: 'intake-3',
    motherName: 'Sister Nia Washington',
    stateCircle: 'NC (Charlotte Circle)',
    contactEmail: 'nia.w@example.com',
    phone: '(704) 555-0177',
    stage: 'Child Wellness',
    healthGoals: '4-year-old daughter catching seasonal preschool sniffles. Looking for gentle elderberry and chest rub balm suitable for toddlers.',
    allergies: 'None known.',
    currentMedications: 'None.',
    assignedHerbalist: 'Sister Maya (NC)',
    status: 'new_intake',
    practitionerNotes: 'New inquiry. Need to verify child age and confirm no honey allergies before dispatching Elderberry defense.',
    submittedAt: '2026-09-26 07:45'
  }
];

export default function AdminApothecaryManager() {
  const [activeSubTab, setActiveSubTab] = useState<'remedies' | 'contraindications' | 'intakes'>('remedies');
  const [remedies, setRemedies] = useState<HerbalRemedy[]>(INITIAL_REMEDIES);
  const [intakes, setIntakes] = useState<MotherHerbalIntake[]>(INITIAL_INTAKES);
  
  // Remedy search and filter
  const [remedySearch, setRemedySearch] = useState('');
  const [remedyCategoryFilter, setRemedyCategoryFilter] = useState<string>('all');
  
  // Modal for new remedy
  const [showAddRemedyModal, setShowAddRemedyModal] = useState(false);
  const [editingRemedy, setEditingRemedy] = useState<HerbalRemedy | null>(null);
  const [newRemedy, setNewRemedy] = useState<Partial<HerbalRemedy>>({
    name: '',
    latinName: '',
    category: 'Tea / Infusion',
    primaryBenefits: [],
    ingredients: '',
    preparationInstructions: '',
    recommendedDosage: '',
    safetyWarnings: [],
    isContraindicatedPregnancy: false,
    pregnancyNotes: '',
    isNursingSafe: true,
    isPediatricSafe: false,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
  });

  // Selected intake for detail view/edit
  const [selectedIntake, setSelectedIntake] = useState<MotherHerbalIntake | null>(null);
  const [editNotes, setEditNotes] = useState('');

  // Filtered remedies
  const filteredRemedies = remedies.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(remedySearch.toLowerCase()) || 
                          r.latinName.toLowerCase().includes(remedySearch.toLowerCase()) ||
                          r.ingredients.toLowerCase().includes(remedySearch.toLowerCase());
    const matchesCat = remedyCategoryFilter === 'all' || r.category === remedyCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleSaveRemedy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRemedy.name || !newRemedy.ingredients) {
      alert('Please fill out the remedy name and ingredients.');
      return;
    }

    if (editingRemedy) {
      setRemedies(prev => prev.map(r => r.id === editingRemedy.id ? { ...r, ...newRemedy } as HerbalRemedy : r));
      alert(`🌿 Remedy "${newRemedy.name}" updated successfully!`);
    } else {
      const created: HerbalRemedy = {
        id: `rem-${Date.now()}`,
        name: newRemedy.name || 'Untitled Formulation',
        latinName: newRemedy.latinName || '',
        category: (newRemedy.category as any) || 'Tea / Infusion',
        primaryBenefits: typeof newRemedy.primaryBenefits === 'string' 
          ? (newRemedy.primaryBenefits as string).split(',').map(s => s.trim()) 
          : (newRemedy.primaryBenefits || ['Herbal Wellness']),
        ingredients: newRemedy.ingredients || '',
        preparationInstructions: newRemedy.preparationInstructions || '',
        recommendedDosage: newRemedy.recommendedDosage || 'Use as directed by herbalist.',
        safetyWarnings: typeof newRemedy.safetyWarnings === 'string'
          ? (newRemedy.safetyWarnings as string).split(',').map(s => s.trim())
          : (newRemedy.safetyWarnings || []),
        isContraindicatedPregnancy: !!newRemedy.isContraindicatedPregnancy,
        pregnancyNotes: newRemedy.pregnancyNotes || '',
        isNursingSafe: !!newRemedy.isNursingSafe,
        isPediatricSafe: !!newRemedy.isPediatricSafe,
        pediatricDosage: newRemedy.pediatricDosage || '',
        status: (newRemedy.status as any) || 'active',
        imageUrl: newRemedy.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
      };
      setRemedies(prev => [created, ...prev]);
      alert(`🌿 New formulation "${created.name}" added to the Village Apothecary!`);
    }
    setShowAddRemedyModal(false);
    setEditingRemedy(null);
  };

  const handleUpdateIntakeStatus = (id: string, newStatus: MotherHerbalIntake['status']) => {
    setIntakes(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
    if (selectedIntake && selectedIntake.id === id) {
      setSelectedIntake(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleSavePractitionerNotes = (id: string) => {
    setIntakes(prev => prev.map(i => i.id === id ? { ...i, practitionerNotes: editNotes } : i));
    if (selectedIntake) {
      setSelectedIntake(prev => prev ? { ...prev, practitionerNotes: editNotes } : null);
    }
    alert('✅ Confidential practitioner formulation notes saved.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1E261D] via-[#2A3728] to-[#162015] text-[#FAF5EE] p-6 rounded-3xl border-2 border-emerald-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase font-extrabold mb-1">
            <Droplet className="w-4 h-4" />
            <span>Maternal Dispensary &amp; Sacred Formulary</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FAF5EE]">
            Apothecary &amp; Botanical Medicine Back Office
          </h3>
          <p className="text-xs sm:text-sm text-[#FAF5EE]/80 mt-1 max-w-2xl">
            Curate traditional herbal monographs, enforce strict maternal contraindication warnings, and arbitrate mother intake consultation requests.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => {
              setEditingRemedy(null);
              setNewRemedy({
                name: '',
                latinName: '',
                category: 'Tea / Infusion',
                primaryBenefits: [],
                ingredients: '',
                preparationInstructions: '',
                recommendedDosage: '',
                safetyWarnings: [],
                isContraindicatedPregnancy: false,
                pregnancyNotes: '',
                isNursingSafe: true,
                isPediatricSafe: false,
                status: 'active',
                imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
              });
              setShowAddRemedyModal(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Formulation</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-copper-penny/20 pb-3">
        <button
          onClick={() => setActiveSubTab('remedies')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSubTab === 'remedies'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white/80 text-[#2A221B] hover:bg-white border border-copper-penny/20'
          }`}
        >
          🌿 Formulations &amp; Monographs ({remedies.length})
        </button>

        <button
          onClick={() => setActiveSubTab('contraindications')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSubTab === 'contraindications'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white/80 text-[#2A221B] hover:bg-white border border-copper-penny/20'
          }`}
        >
          ⚠️ Maternal Safety Matrix ({remedies.filter(r => r.isContraindicatedPregnancy).length} Pregnancy Warnings)
        </button>

        <button
          onClick={() => setActiveSubTab('intakes')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSubTab === 'intakes'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white/80 text-[#2A221B] hover:bg-white border border-copper-penny/20'
          }`}
        >
          📋 Mother Consultation Intakes ({intakes.filter(i => i.status === 'new_intake' || i.status === 'formulating').length} Pending)
        </button>
      </div>

      {/* SUB-TAB 1: REMEDIES & MONOGRAPHS */}
      {activeSubTab === 'remedies' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#2A221B]/40" />
              <input
                type="text"
                placeholder="Search herbs, botanical names, ingredients..."
                value={remedySearch}
                onChange={e => setRemedySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-xl border border-copper-penny/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-[#2A221B]/60" />
              <select
                value={remedyCategoryFilter}
                onChange={e => setRemedyCategoryFilter(e.target.value)}
                className="text-xs bg-white rounded-xl border border-copper-penny/20 px-3 py-2 font-mono"
              >
                <option value="all">All Formulation Categories</option>
                <option value="Tea / Infusion">Teas &amp; Infusions</option>
                <option value="Tincture">Tinctures &amp; Extracts</option>
                <option value="Syrup">Syrups &amp; Oxymels</option>
                <option value="Salve / Balm">Salves &amp; Balms</option>
                <option value="Essential Oil Blend">Essential Oil Blends</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRemedies.map(remedy => (
              <div 
                key={remedy.id}
                className="bg-white rounded-2xl p-5 border border-copper-penny/20 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-md text-[10px] font-mono font-bold">
                        {remedy.category}
                      </span>
                      <h4 className="font-serif font-bold text-base text-[#1F1813] mt-1.5">{remedy.name}</h4>
                      <p className="text-[11px] font-serif italic text-emerald-800">{remedy.latinName}</p>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      remedy.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {remedy.status === 'active' ? '● In Dispensary' : 'Seasonal'}
                    </span>
                  </div>

                  <p className="text-xs text-[#2A221B]/80 font-sans leading-relaxed line-clamp-2">
                    <strong className="text-[#1F1813]">Ingredients:</strong> {remedy.ingredients}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {remedy.isContraindicatedPregnancy ? (
                      <span className="text-[10px] font-mono bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-md flex items-center space-x-1 font-semibold">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        <span>Pregnancy Warning</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center space-x-1 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Pregnancy Safe</span>
                      </span>
                    )}

                    {remedy.isNursingSafe && (
                      <span className="text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md font-semibold">
                        🍼 Nursing Safe
                      </span>
                    )}

                    {remedy.isPediatricSafe && (
                      <span className="text-[10px] font-mono bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md font-semibold">
                        🧒 Pediatric Safe
                      </span>
                    )}
                  </div>

                  <div className="bg-[#FAF5EE] p-2.5 rounded-xl text-[11px] space-y-1 font-sans border border-copper-penny/10">
                    <p><strong className="text-[#1F1813]">Dosage:</strong> {remedy.recommendedDosage}</p>
                    {remedy.pregnancyNotes && (
                      <p className="text-amber-900"><strong className="text-amber-950">Maternal Note:</strong> {remedy.pregnancyNotes}</p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-copper-penny/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#2A221B]/60">ID: {remedy.id}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingRemedy(remedy);
                        setNewRemedy({ ...remedy });
                        setShowAddRemedyModal(true);
                      }}
                      className="px-2.5 py-1 bg-[#FAF5EE] hover:bg-[#F0E6D8] text-[#1F1813] border border-copper-penny/20 rounded-lg text-xs font-mono font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Archive remedy "${remedy.name}" from public apothecary?`)) {
                          setRemedies(prev => prev.filter(r => r.id !== remedy.id));
                        }
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MATERNAL SAFETY MATRIX */}
      {activeSubTab === 'contraindications' && (
        <div className="bg-white rounded-3xl p-6 border border-copper-penny/20 shadow-sm space-y-5">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#1F1813] flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Maternal Botanical Safety &amp; Contraindication Matrix</span>
            </h4>
            <p className="text-xs text-[#2A221B]/70 mt-1">
              Strict herbal protocols protecting expectant mothers, nursing babies, and children across our village dispensary.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5EE] text-[#1F1813] font-mono uppercase text-[10px] border-b border-copper-penny/20">
                <tr>
                  <th className="p-3">Botanical Formulation</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Pregnancy Protocol</th>
                  <th className="p-3">Nursing Status</th>
                  <th className="p-3">Pediatric Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-copper-penny/10">
                {remedies.map(r => (
                  <tr key={r.id} className="hover:bg-amber-50/40">
                    <td className="p-3">
                      <p className="font-bold text-[#1F1813]">{r.name}</p>
                      <p className="font-serif italic text-[11px] text-emerald-800">{r.latinName}</p>
                    </td>
                    <td className="p-3 font-mono text-[11px]">{r.category}</td>
                    <td className="p-3">
                      {r.isContraindicatedPregnancy ? (
                        <div className="space-y-0.5">
                          <span className="bg-red-100 text-red-800 border border-red-300 font-mono text-[10px] px-2 py-0.5 rounded font-bold inline-block">
                            ⚠️ CONTRAINDICATED
                          </span>
                          <p className="text-[10px] text-red-900 font-sans">{r.pregnancyNotes}</p>
                        </div>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                          ✓ Safe with Guidance
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono">
                      {r.isNursingSafe ? (
                        <span className="text-emerald-700 font-bold">● Compatible</span>
                      ) : (
                        <span className="text-amber-700 font-bold">○ Exercise Caution</span>
                      )}
                    </td>
                    <td className="p-3 font-mono">
                      {r.isPediatricSafe ? (
                        <span className="text-emerald-700 font-bold">● Safe ({r.pediatricDosage || 'Half dose'})</span>
                      ) : (
                        <span className="text-neutral-500 font-bold">○ Adults Only</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setRemedies(prev => prev.map(rem => rem.id === r.id ? { ...rem, isContraindicatedPregnancy: !rem.isContraindicatedPregnancy } : rem));
                        }}
                        className="px-2.5 py-1 text-[10px] font-mono font-bold bg-[#FAF5EE] hover:bg-[#F0E6D8] border border-copper-penny/20 rounded-md cursor-pointer"
                      >
                        Toggle Warning
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MOTHER CONSULTATION INTAKES */}
      {activeSubTab === 'intakes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of Intakes */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between pb-2">
              <h4 className="font-serif text-base font-bold text-[#1F1813]">
                Confidential Mother Health Inquiries
              </h4>
              <span className="text-xs font-mono text-[#2A221B]/70">
                {intakes.length} Total Intakes Recorded
              </span>
            </div>

            <div className="space-y-3">
              {intakes.map(intake => (
                <div
                  key={intake.id}
                  onClick={() => {
                    setSelectedIntake(intake);
                    setEditNotes(intake.practitionerNotes);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                    selectedIntake?.id === intake.id 
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md' 
                      : 'border-copper-penny/20 hover:border-copper-penny/40 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-[#1F1813]">{intake.motherName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                          {intake.stateCircle}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-800 font-medium mt-0.5 font-sans">
                        Status Stage: <strong>{intake.stage}</strong>
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        intake.status === 'new_intake' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        intake.status === 'formulating' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                        intake.status === 'compound_ready' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {intake.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#2A221B]/80 font-sans mt-2 line-clamp-2 bg-[#FAF5EE] p-2 rounded-xl border border-copper-penny/10">
                    "{intake.healthGoals}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#2A221B]/60 font-mono mt-2 pt-2 border-t border-copper-penny/10">
                    <span>Herbalist: <strong className="text-[#1F1813]">{intake.assignedHerbalist}</strong></span>
                    <span>{intake.submittedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details & Practitioner Formulation Drawer */}
          <div className="bg-white rounded-3xl p-5 border border-copper-penny/20 shadow-sm space-y-4 h-fit">
            {selectedIntake ? (
              <div className="space-y-4">
                <div className="border-b border-copper-penny/10 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                      Herbal Case Details
                    </span>
                    <span className="text-[10px] font-mono text-[#2A221B]/50">
                      ID: {selectedIntake.id}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-lg text-[#1F1813] mt-1">
                    {selectedIntake.motherName}
                  </h4>
                  <p className="text-xs text-[#2A221B]/70 font-sans">
                    {selectedIntake.phone} • {selectedIntake.contactEmail}
                  </p>
                </div>

                <div className="space-y-2 text-xs font-sans">
                  <div>
                    <span className="font-bold text-[#1F1813] block">Life Stage &amp; Context:</span>
                    <span className="text-emerald-900 font-medium">{selectedIntake.stage} ({selectedIntake.stateCircle})</span>
                  </div>

                  <div>
                    <span className="font-bold text-[#1F1813] block">Primary Health Goals:</span>
                    <p className="bg-[#FAF5EE] p-2.5 rounded-xl border border-copper-penny/15 text-[#2A221B]">
                      {selectedIntake.healthGoals}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-bold text-red-900 block text-[11px]">Allergies:</span>
                      <span className="text-[11px] text-[#2A221B]">{selectedIntake.allergies}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#1F1813] block text-[11px]">Medications:</span>
                      <span className="text-[11px] text-[#2A221B]">{selectedIntake.currentMedications}</span>
                    </div>
                  </div>
                </div>

                {/* Workflow Status Buttons */}
                <div className="space-y-1.5 pt-2 border-t border-copper-penny/10">
                  <span className="text-[11px] font-mono font-bold text-[#1F1813] block">Update Status:</span>
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                    <button
                      onClick={() => handleUpdateIntakeStatus(selectedIntake.id, 'new_intake')}
                      className={`p-1.5 rounded-lg border text-center font-bold cursor-pointer ${
                        selectedIntake.status === 'new_intake' ? 'bg-amber-600 text-white' : 'bg-[#FAF5EE]'
                      }`}
                    >
                      1. New Intake
                    </button>
                    <button
                      onClick={() => handleUpdateIntakeStatus(selectedIntake.id, 'formulating')}
                      className={`p-1.5 rounded-lg border text-center font-bold cursor-pointer ${
                        selectedIntake.status === 'formulating' ? 'bg-blue-600 text-white' : 'bg-[#FAF5EE]'
                      }`}
                    >
                      2. Formulating Blend
                    </button>
                    <button
                      onClick={() => handleUpdateIntakeStatus(selectedIntake.id, 'compound_ready')}
                      className={`p-1.5 rounded-lg border text-center font-bold cursor-pointer ${
                        selectedIntake.status === 'compound_ready' ? 'bg-purple-600 text-white' : 'bg-[#FAF5EE]'
                      }`}
                    >
                      3. Compound Ready
                    </button>
                    <button
                      onClick={() => handleUpdateIntakeStatus(selectedIntake.id, 'dispatched')}
                      className={`p-1.5 rounded-lg border text-center font-bold cursor-pointer ${
                        selectedIntake.status === 'dispatched' ? 'bg-emerald-600 text-white' : 'bg-[#FAF5EE]'
                      }`}
                    >
                      4. Dispatched / Done
                    </button>
                  </div>
                </div>

                {/* Practitioner Formulation Notes */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-mono font-bold text-[#1F1813] flex items-center justify-between">
                    <span>Practitioner Prescription Notes:</span>
                    <span className="text-emerald-700 font-normal">Confidential</span>
                  </span>
                  <textarea
                    rows={4}
                    value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                    placeholder="Enter customized botanical proportions, dosage warnings, or delivery notes..."
                    className="w-full text-xs p-2.5 rounded-xl border border-copper-penny/20 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans"
                  />
                  <button
                    onClick={() => handleSavePractitionerNotes(selectedIntake.id)}
                    className="w-full bg-emerald-700 hover:bg-emerald-600 text-white py-2 rounded-xl text-xs font-mono font-bold shadow-md cursor-pointer transition-all"
                  >
                    Save Formulation Notes
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-[#2A221B]/60 space-y-2">
                <Coffee className="w-8 h-8 mx-auto text-emerald-800/40" />
                <p className="text-xs font-sans">Select a mother consultation intake from the left to review confidential notes and update formulation status.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Remedy */}
      {showAddRemedyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF5EE] border-2 border-emerald-600 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <h3 className="font-serif text-xl font-bold text-[#1F1813]">
                {editingRemedy ? 'Edit Botanical Formulation' : 'Create New Botanical Formulation'}
              </h3>
              <button 
                onClick={() => setShowAddRemedyModal(false)}
                className="p-1 rounded-full hover:bg-black/10 cursor-pointer"
              >
                <X className="w-5 h-5 text-[#1F1813]" />
              </button>
            </div>

            <form onSubmit={handleSaveRemedy} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1F1813] block mb-1">Formulation Common Name *</label>
                  <input
                    type="text"
                    required
                    value={newRemedy.name || ''}
                    onChange={e => setNewRemedy({ ...newRemedy, name: e.target.value })}
                    placeholder="e.g. Red Raspberry Leaf Mineral Infusion"
                    className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1F1813] block mb-1">Botanical Latin Name</label>
                  <input
                    type="text"
                    value={newRemedy.latinName || ''}
                    onChange={e => setNewRemedy({ ...newRemedy, latinName: e.target.value })}
                    placeholder="e.g. Rubus idaeus"
                    className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl font-serif italic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1F1813] block mb-1">Formulation Category</label>
                  <select
                    value={newRemedy.category || 'Tea / Infusion'}
                    onChange={e => setNewRemedy({ ...newRemedy, category: e.target.value as any })}
                    className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl font-mono"
                  >
                    <option value="Tea / Infusion">Tea / Infusion</option>
                    <option value="Tincture">Tincture</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Salve / Balm">Salve / Balm</option>
                    <option value="Essential Oil Blend">Essential Oil Blend</option>
                    <option value="Powder / Capsule">Powder / Capsule</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#1F1813] block mb-1">Dispensary Stock Status</label>
                  <select
                    value={newRemedy.status || 'active'}
                    onChange={e => setNewRemedy({ ...newRemedy, status: e.target.value as any })}
                    className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl font-mono"
                  >
                    <option value="active">Active &amp; Ready</option>
                    <option value="seasonal">Seasonal Reserve</option>
                    <option value="out_of_stock">Temporarily Harvest Rest</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1F1813] block mb-1">Herbal Ingredients &amp; Herbs Used *</label>
                <textarea
                  rows={2}
                  required
                  value={newRemedy.ingredients || ''}
                  onChange={e => setNewRemedy({ ...newRemedy, ingredients: e.target.value })}
                  placeholder="e.g. Red Raspberry leaf, Nettle, Oatstraw tops, Rosehips, Raw honey"
                  className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1F1813] block mb-1">Recommended Adult Dosage</label>
                  <input
                    type="text"
                    value={newRemedy.recommendedDosage || ''}
                    onChange={e => setNewRemedy({ ...newRemedy, recommendedDosage: e.target.value })}
                    placeholder="e.g. 1-2 cups daily warm, or 20-30 drops in water"
                    className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1F1813] block mb-1">Preparation Instructions</label>
                  <input
                    type="text"
                    value={newRemedy.preparationInstructions || ''}
                    onChange={e => setNewRemedy({ ...newRemedy, preparationInstructions: e.target.value })}
                    placeholder="e.g. Long 30-min covered steep in spring water"
                    className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl"
                  />
                </div>
              </div>

              {/* Maternal Safety Flags */}
              <div className="bg-white p-3.5 rounded-2xl border border-copper-penny/20 space-y-3">
                <span className="font-mono text-xs uppercase font-extrabold text-emerald-800 block">
                  Maternal Safety Protocols
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="flex items-center space-x-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!newRemedy.isContraindicatedPregnancy}
                      onChange={e => setNewRemedy({ ...newRemedy, isContraindicatedPregnancy: e.target.checked })}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span className="font-bold text-red-800">Pregnancy Warning</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!newRemedy.isNursingSafe}
                      onChange={e => setNewRemedy({ ...newRemedy, isNursingSafe: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span className="font-bold text-emerald-800">Nursing Safe</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!newRemedy.isPediatricSafe}
                      onChange={e => setNewRemedy({ ...newRemedy, isPediatricSafe: e.target.checked })}
                      className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                    />
                    <span className="font-bold text-purple-800">Pediatric Safe</span>
                  </label>
                </div>

                {newRemedy.isContraindicatedPregnancy && (
                  <div>
                    <label className="font-bold text-red-900 block mb-1">Pregnancy Warning Details</label>
                    <input
                      type="text"
                      value={newRemedy.pregnancyNotes || ''}
                      onChange={e => setNewRemedy({ ...newRemedy, pregnancyNotes: e.target.value })}
                      placeholder="e.g. Avoid in 1st trimester; uterine toner."
                      className="w-full p-2 bg-red-50 border border-red-200 rounded-xl text-red-900"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-copper-penny/20">
                <button
                  type="button"
                  onClick={() => setShowAddRemedyModal(false)}
                  className="px-4 py-2 border border-copper-penny/30 rounded-xl text-xs font-mono font-bold hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-mono font-bold shadow-md cursor-pointer transition-all"
                >
                  {editingRemedy ? 'Update Formulation' : 'Publish Formulation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
