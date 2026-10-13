import React, { useState } from 'react';
import { 
  Heart, 
  Plus, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Coffee, 
  DollarSign, 
  Sparkles, 
  Edit3, 
  Trash2, 
  X,
  Phone,
  Mail,
  Send,
  HeartHandshake
} from 'lucide-react';

export interface MealTrainSlot {
  id: string;
  date: string;
  assignedSisterName: string;
  assignedSisterState: string;
  mealDescription: string;
  deliveryStatus: 'delivered' | 'scheduled_today' | 'open_slot';
}

export interface CarePod {
  id: string;
  motherName: string;
  babyNameOrDue: string;
  type: 'postpartum_care' | 'bedrest_emergency' | 'bereavement_comfort' | 'new_twin_mothers';
  city: string;
  state: string;
  coordinatorSister: string;
  phone: string;
  dietaryRestrictions: string;
  dropoffInstructions: string;
  status: 'active_train' | 'bedrest_urgent' | 'fully_supported' | 'completed';
  startDate: string;
  endDate: string;
  slotsNeeded: number;
  slotsFilled: number;
  slots: MealTrainSlot[];
}

export interface MutualAidDisbursement {
  id: string;
  carePodId: string;
  recipientMother: string;
  amount: number;
  category: 'Fresh Groceries & Broths' | 'Postpartum Herbal Supplies' | 'Emergency Childcare Co-op' | 'Diaper & Cotton Wash Aid';
  date: string;
  notes: string;
  approvedBy: string;
}

const INITIAL_CARE_PODS: CarePod[] = [
  {
    id: 'pod-1',
    motherName: 'Mama Keisha Vance',
    babyNameOrDue: 'Baby Noah (Born 8 Days Ago)',
    type: 'postpartum_care',
    city: 'Charleston',
    state: 'SC',
    coordinatorSister: 'Sister Tamara (SC Lead)',
    phone: '(843) 555-0142',
    dietaryRestrictions: 'Strictly warming foods: bone broths, brown rice, cooked greens, ginger tea. Gluten-free, dairy-free. No iced drinks or cold raw salads.',
    dropoffInstructions: 'Leave cooler on screened front porch. Ring bell gently and text coordinator.',
    status: 'active_train',
    startDate: '2026-09-18',
    endDate: '2026-10-08',
    slotsNeeded: 14,
    slotsFilled: 11,
    slots: [
      {
        id: 'slot-1',
        date: '2026-09-24',
        assignedSisterName: 'Sister Brenda M.',
        assignedSisterState: 'SC',
        mealDescription: 'Slow-simmered herbal oxtail bone broth with ginger and collard greens + sweet potato mash.',
        deliveryStatus: 'delivered'
      },
      {
        id: 'slot-2',
        date: '2026-09-25',
        assignedSisterName: 'Mama Danielle',
        assignedSisterState: 'NC',
        mealDescription: 'Golden turmeric butternut squash soup, steamed quinoa, and fresh lactation cookies.',
        deliveryStatus: 'delivered'
      },
      {
        id: 'slot-3',
        date: '2026-09-26',
        assignedSisterName: 'Sister Tamara',
        assignedSisterState: 'SC',
        mealDescription: 'Roasted pasture chicken with ginger root rice and steamed mineral broth.',
        deliveryStatus: 'scheduled_today'
      },
      {
        id: 'slot-4',
        date: '2026-09-27',
        assignedSisterName: 'Awaiting Sister Volunteer',
        assignedSisterState: 'SC',
        mealDescription: 'Warm comforting dinner for family of 4.',
        deliveryStatus: 'open_slot'
      }
    ]
  },
  {
    id: 'pod-2',
    motherName: 'Sister Joy Adebayo',
    babyNameOrDue: 'Expecting Twins (Week 31 Bedrest)',
    type: 'bedrest_emergency',
    city: 'Atlanta',
    state: 'GA',
    coordinatorSister: 'Mama Shantrece (GA)',
    phone: '(404) 555-0129',
    dietaryRestrictions: 'Nutritious high-iron meals, gluten-conscious, plenty of fresh cooked leafy greens and lentil stews.',
    dropoffInstructions: 'Side porch bin near garden gate. Husband Brother Marcus will receive between 4-6 PM.',
    status: 'bedrest_urgent',
    startDate: '2026-09-20',
    endDate: '2026-10-15',
    slotsNeeded: 20,
    slotsFilled: 14,
    slots: [
      {
        id: 'slot-201',
        date: '2026-09-26',
        assignedSisterName: 'Sister Aaliyah',
        assignedSisterState: 'GA',
        mealDescription: 'Lentil shepherd’s pie and stewed blackberry elderberry compote.',
        deliveryStatus: 'scheduled_today'
      },
      {
        id: 'slot-202',
        date: '2026-09-28',
        assignedSisterName: 'Awaiting Sister Volunteer',
        assignedSisterState: 'GA',
        mealDescription: 'Hearty dinner & family nourishment.',
        deliveryStatus: 'open_slot'
      }
    ]
  }
];

const INITIAL_DISBURSEMENTS: MutualAidDisbursement[] = [
  {
    id: 'aid-1',
    carePodId: 'pod-1',
    recipientMother: 'Mama Keisha Vance (SC)',
    amount: 100,
    category: 'Fresh Groceries & Broths',
    date: '2026-09-18',
    notes: 'Organic grass-fed bone marrow and pasture-raised chicken delivery from Charleston Co-op.',
    approvedBy: 'Matriarch Desk Dispatch'
  },
  {
    id: 'aid-2',
    carePodId: 'pod-2',
    recipientMother: 'Sister Joy Adebayo (GA)',
    amount: 150,
    category: 'Postpartum Herbal Supplies',
    date: '2026-09-21',
    notes: 'Emergency twin bedrest pantry restock & organic cold-pressed castor oils.',
    approvedBy: 'Grandmother Council Emergency Quorum'
  }
];

export default function AdminCarePodsManager() {
  const [carePods, setCarePods] = useState<CarePod[]>(INITIAL_CARE_PODS);
  const [disbursements, setDisbursements] = useState<MutualAidDisbursement[]>(INITIAL_DISBURSEMENTS);
  const [selectedPodId, setSelectedPodId] = useState<string>(INITIAL_CARE_PODS[0].id);
  const [showAddPodModal, setShowAddPodModal] = useState(false);
  const [showDisburseModal, setShowDisburseModal] = useState(false);

  // New Pod form
  const [newPod, setNewPod] = useState<Partial<CarePod>>({
    motherName: '',
    babyNameOrDue: '',
    type: 'postpartum_care',
    city: '',
    state: 'GA',
    coordinatorSister: 'Mama Shantrece',
    phone: '',
    dietaryRestrictions: '',
    dropoffInstructions: '',
    status: 'active_train',
    startDate: '2026-09-26',
    endDate: '2026-10-10',
    slotsNeeded: 14,
    slotsFilled: 0
  });

  // Disbursement form
  const [newDisbursement, setNewDisbursement] = useState<{
    recipientMother: string;
    amount: number;
    category: MutualAidDisbursement['category'];
    notes: string;
  }>({
    recipientMother: INITIAL_CARE_PODS[0].motherName,
    amount: 75,
    category: 'Fresh Groceries & Broths',
    notes: ''
  });

  const selectedPod = carePods.find(p => p.id === selectedPodId) || carePods[0];

  const handleCreatePod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPod.motherName || !newPod.city) {
      alert('Please fill out the mother’s name and location.');
      return;
    }

    const created: CarePod = {
      id: `pod-${Date.now()}`,
      motherName: newPod.motherName || '',
      babyNameOrDue: newPod.babyNameOrDue || 'Newborn Care',
      type: newPod.type || 'postpartum_care',
      city: newPod.city || '',
      state: newPod.state || 'GA',
      coordinatorSister: newPod.coordinatorSister || 'Designated Lead',
      phone: newPod.phone || '',
      dietaryRestrictions: newPod.dietaryRestrictions || 'Standard nourishing postpartum meals.',
      dropoffInstructions: newPod.dropoffInstructions || 'Contact coordinator before arrival.',
      status: newPod.status || 'active_train',
      startDate: newPod.startDate || '2026-09-26',
      endDate: newPod.endDate || '2026-10-10',
      slotsNeeded: Number(newPod.slotsNeeded) || 14,
      slotsFilled: 0,
      slots: [
        {
          id: `slot-${Date.now()}-1`,
          date: newPod.startDate || '2026-09-26',
          assignedSisterName: 'Awaiting Sister Volunteer',
          assignedSisterState: newPod.state || 'GA',
          mealDescription: 'First night welcome meal.',
          deliveryStatus: 'open_slot'
        }
      ]
    };

    setCarePods(prev => [created, ...prev]);
    setSelectedPodId(created.id);
    setShowAddPodModal(false);
    alert(`🍲 Care Pod & Meal Train for ${created.motherName} activated across the village!`);
  };

  const handleAddSlot = (podId: string) => {
    const slotDate = prompt('Enter date for new meal slot (e.g. 2026-09-29):', '2026-09-29');
    if (!slotDate) return;
    const sister = prompt('Assign volunteer sister name (or leave as Awaiting Volunteer):', 'Awaiting Sister Volunteer');

    setCarePods(prev => prev.map(p => {
      if (p.id !== podId) return p;
      const newSlot: MealTrainSlot = {
        id: `slot-${Date.now()}`,
        date: slotDate,
        assignedSisterName: sister || 'Awaiting Sister Volunteer',
        assignedSisterState: p.state,
        mealDescription: 'Fresh hot dinner and soothing infusion.',
        deliveryStatus: (sister && sister !== 'Awaiting Sister Volunteer') ? 'scheduled_today' : 'open_slot'
      };
      return {
        ...p,
        slots: [...p.slots, newSlot],
        slotsFilled: (sister && sister !== 'Awaiting Sister Volunteer') ? p.slotsFilled + 1 : p.slotsFilled
      };
    }));
  };

  const handleToggleSlotStatus = (podId: string, slotId: string) => {
    setCarePods(prev => prev.map(p => {
      if (p.id !== podId) return p;
      return {
        ...p,
        slots: p.slots.map(s => {
          if (s.id !== slotId) return s;
          const nextStatus = s.deliveryStatus === 'open_slot' ? 'scheduled_today' :
                             s.deliveryStatus === 'scheduled_today' ? 'delivered' : 'open_slot';
          return { ...s, deliveryStatus: nextStatus };
        })
      };
    }));
  };

  const handleDisburseAid = (e: React.FormEvent) => {
    e.preventDefault();
    const created: MutualAidDisbursement = {
      id: `aid-${Date.now()}`,
      carePodId: selectedPod.id,
      recipientMother: newDisbursement.recipientMother,
      amount: Number(newDisbursement.amount) || 50,
      category: newDisbursement.category,
      date: '2026-09-26',
      notes: newDisbursement.notes || 'Emergency food stipend disbursed.',
      approvedBy: 'Matriarch Back Office Dispatch'
    };

    setDisbursements(prev => [created, ...prev]);
    setShowDisburseModal(false);
    alert(`💳 $${created.amount}.00 emergency mutual aid stipend dispatched to ${created.recipientMother}!`);
  };

  const totalAidDisbursed = disbursements.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#2B1B17] via-[#3B2520] to-[#201512] text-[#FAF5EE] p-6 rounded-3xl border-2 border-rose-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs uppercase font-extrabold mb-1">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Maternal Village Mutual Aid &amp; 4th Trimester Care</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FAF5EE]">
            Postpartum Care Pods &amp; Emergency Meal Trains
          </h3>
          <p className="text-xs sm:text-sm text-[#FAF5EE]/80 mt-1 max-w-2xl">
            Dispatch postpartum meal trains, track nourishing food deliveries, coordinate bedrest assistance, and release emergency mutual aid stipends.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setShowDisburseModal(true)}
            className="bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
          >
            <DollarSign className="w-4 h-4" />
            <span>Dispatch Mutual Aid</span>
          </button>

          <button
            onClick={() => setShowAddPodModal(true)}
            className="bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Activate Care Pod</span>
          </button>
        </div>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-copper-penny/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-[#2A221B]/70 font-bold block">Active Care Trains</span>
            <span className="font-serif text-2xl font-black text-[#1F1813]">{carePods.length} Mothers Supported</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-copper-penny/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-[#2A221B]/70 font-bold block">Filled Meal Slots</span>
            <span className="font-serif text-2xl font-black text-emerald-800">
              {carePods.reduce((sum, p) => sum + p.slotsFilled, 0)} / {carePods.reduce((sum, p) => sum + p.slotsNeeded, 0)} Meals
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Coffee className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-copper-penny/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-[#2A221B]/70 font-bold block">Emergency Aid Released</span>
            <span className="font-serif text-2xl font-black text-[#B87333]">${totalAidDisbursed}.00 Dispatched</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Care Pods Selection Roster */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-base text-[#1F1813]">Village Care Pods</h4>
            <span className="text-xs font-mono text-[#2A221B]/70">{carePods.length} Active</span>
          </div>

          <div className="space-y-3">
            {carePods.map(pod => (
              <div
                key={pod.id}
                onClick={() => setSelectedPodId(pod.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                  selectedPod.id === pod.id 
                    ? 'border-rose-600 ring-2 ring-rose-500/20 shadow-md' 
                    : 'border-copper-penny/20 hover:border-copper-penny/40 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    pod.type === 'bedrest_emergency' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                    pod.type === 'postpartum_care' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                    'bg-purple-100 text-purple-900 border border-purple-300'
                  }`}>
                    {pod.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#1F1813] flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-copper-penny" />
                    <span>{pod.city}, {pod.state}</span>
                  </span>
                </div>

                <h5 className="font-serif font-bold text-base text-[#1F1813] mt-2">{pod.motherName}</h5>
                <p className="text-xs text-rose-800 font-medium font-sans">{pod.babyNameOrDue}</p>

                {/* Progress bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#2A221B]/70">Support Covered</span>
                    <span className="font-bold text-[#1F1813]">{pod.slotsFilled}/{pod.slotsNeeded} Slots</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-500 to-emerald-500 rounded-full"
                      style={{ width: `${Math.min(100, Math.round((pod.slotsFilled / pod.slotsNeeded) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#2A221B]/60 mt-3 pt-2 border-t border-copper-penny/10">
                  <span>Lead: {pod.coordinatorSister}</span>
                  <span className="text-emerald-700 font-bold">{pod.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Selected Care Pod Details & Meal Slot Board */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header Card for Selected Pod */}
          <div className="bg-white rounded-3xl p-6 border border-copper-penny/20 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-copper-penny/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-700 font-bold">
                  Care Pod Command File
                </span>
                <h4 className="font-serif font-bold text-2xl text-[#1F1813] mt-0.5">
                  {selectedPod.motherName}
                </h4>
                <p className="text-xs text-[#2A221B]/75 font-sans mt-0.5">
                  {selectedPod.babyNameOrDue} • {selectedPod.city}, {selectedPod.state} • Phone: {selectedPod.phone}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAddSlot(selectedPod.id)}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Meal Slot</span>
                </button>
              </div>
            </div>

            {/* Special Instructions & Food Restrictions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
              <div className="bg-[#FAF5EE] p-3.5 rounded-2xl border border-copper-penny/15 space-y-1">
                <span className="font-bold text-[#1F1813] block font-mono text-[11px] uppercase text-rose-900">
                  🍲 Dietary Directives &amp; Nourishment Rules:
                </span>
                <p className="text-[#2A221B]/90 leading-relaxed">{selectedPod.dietaryRestrictions}</p>
              </div>

              <div className="bg-[#FAF5EE] p-3.5 rounded-2xl border border-copper-penny/15 space-y-1">
                <span className="font-bold text-[#1F1813] block font-mono text-[11px] uppercase text-emerald-900">
                  🏡 Drop-off Instructions &amp; Family Privacy:
                </span>
                <p className="text-[#2A221B]/90 leading-relaxed">{selectedPod.dropoffInstructions}</p>
              </div>
            </div>

            {/* Meal Slots Table */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h5 className="font-serif font-bold text-sm text-[#1F1813]">
                  Scheduled Village Meal Deliveries
                </h5>
                <span className="text-[11px] font-mono text-[#2A221B]/60">
                  Click status to cycle (Open → Scheduled → Delivered)
                </span>
              </div>

              <div className="divide-y divide-copper-penny/10 border border-copper-penny/20 rounded-2xl overflow-hidden bg-[#FAF5EE]/50">
                {selectedPod.slots.map(slot => (
                  <div key={slot.id} className="p-3.5 bg-white hover:bg-amber-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs text-[#1F1813]">{slot.date}</span>
                        <span className="text-soft-sage text-[11px] font-mono">• {slot.assignedSisterState}</span>
                      </div>
                      <p className="font-sans font-medium text-[#1F1813]">{slot.assignedSisterName}</p>
                      <p className="text-[11px] text-[#2A221B]/75 italic font-sans">"{slot.mealDescription}"</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleToggleSlotStatus(selectedPod.id, slot.id)}
                        className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold border cursor-pointer transition-all ${
                          slot.deliveryStatus === 'delivered' 
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                            : slot.deliveryStatus === 'scheduled_today'
                            ? 'bg-blue-100 text-blue-900 border-blue-300 animate-pulse'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}
                      >
                        {slot.deliveryStatus === 'delivered' && '✓ Confirmed Delivered'}
                        {slot.deliveryStatus === 'scheduled_today' && '⏳ Scheduled Today'}
                        {slot.deliveryStatus === 'open_slot' && '⚠️ Open Slot - Need Sister'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mutual Aid Disbursed Log */}
          <div className="bg-white rounded-3xl p-6 border border-copper-penny/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-copper-penny/10 pb-3">
              <h5 className="font-serif font-bold text-base text-[#1F1813] flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-emerald-700" />
                <span>Emergency Maternal Mutual Aid Dispatched Ledger</span>
              </h5>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ${totalAidDisbursed}.00 Total Disbursed
              </span>
            </div>

            <div className="divide-y divide-copper-penny/10 text-xs">
              {disbursements.map(d => (
                <div key={d.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-[#1F1813]">{d.recipientMother}</span>
                    <span className="text-[10px] font-mono text-emerald-800 ml-2 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                      {d.category}
                    </span>
                    <p className="text-[11px] text-[#2A221B]/75 italic mt-0.5">"{d.notes}"</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-sm text-emerald-700 block">+${d.amount}.00</span>
                    <span className="text-[10px] font-mono text-[#2A221B]/50">{d.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Activate New Care Pod */}
      {showAddPodModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF5EE] border-2 border-rose-500 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <h4 className="font-serif text-lg font-bold text-[#1F1813]">
                Activate Postpartum Care Pod &amp; Meal Train
              </h4>
              <button onClick={() => setShowAddPodModal(false)} className="p-1 rounded-full hover:bg-black/10 cursor-pointer">
                <X className="w-5 h-5 text-[#1F1813]" />
              </button>
            </div>

            <form onSubmit={handleCreatePod} className="space-y-3 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1F1813] block mb-1">Mother's Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newPod.motherName || ''}
                    onChange={e => setNewPod({ ...newPod, motherName: e.target.value })}
                    placeholder="e.g. Mama Ebony Robinson"
                    className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1F1813] block mb-1">Baby Name or Due Date</label>
                  <input
                    type="text"
                    value={newPod.babyNameOrDue || ''}
                    onChange={e => setNewPod({ ...newPod, babyNameOrDue: e.target.value })}
                    placeholder="e.g. Baby Amari (Due Oct 5) or Born 3 Days Ago"
                    className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#1F1813] block mb-1">Care Type</label>
                  <select
                    value={newPod.type || 'postpartum_care'}
                    onChange={e => setNewPod({ ...newPod, type: e.target.value as any })}
                    className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl font-mono"
                  >
                    <option value="postpartum_care">Postpartum 4th Tri</option>
                    <option value="bedrest_emergency">Emergency Bedrest</option>
                    <option value="new_twin_mothers">Twin/Multiples Mother</option>
                    <option value="bereavement_comfort">Bereavement Comfort</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#1F1813] block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newPod.city || ''}
                    onChange={e => setNewPod({ ...newPod, city: e.target.value })}
                    placeholder="e.g. Atlanta"
                    className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1F1813] block mb-1">State Circle</label>
                  <select
                    value={newPod.state || 'GA'}
                    onChange={e => setNewPod({ ...newPod, state: e.target.value })}
                    className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl font-mono"
                  >
                    <option value="GA">Georgia (GA)</option>
                    <option value="SC">South Carolina (SC)</option>
                    <option value="NC">North Carolina (NC)</option>
                    <option value="CA">California (CA)</option>
                    <option value="TX">Texas (TX)</option>
                    <option value="NY">New York (NY)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1F1813] block mb-1">Dietary Restrictions &amp; Healing Food Guidelines *</label>
                <textarea
                  rows={2}
                  required
                  value={newPod.dietaryRestrictions || ''}
                  onChange={e => setNewPod({ ...newPod, dietaryRestrictions: e.target.value })}
                  placeholder="e.g. Strictly warming meals, bone broths, gluten-free, organic only."
                  className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-[#1F1813] block mb-1">Drop-off &amp; Delivery Instructions</label>
                <input
                  type="text"
                  value={newPod.dropoffInstructions || ''}
                  onChange={e => setNewPod({ ...newPod, dropoffInstructions: e.target.value })}
                  placeholder="e.g. Cooler on porch, text coordinator when delivered."
                  className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-copper-penny/20">
                <button
                  type="button"
                  onClick={() => setShowAddPodModal(false)}
                  className="px-4 py-2 border border-copper-penny/30 rounded-xl text-xs font-mono font-bold hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-mono font-bold shadow-md cursor-pointer transition-all"
                >
                  Activate Train
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Dispatch Mutual Aid */}
      {showDisburseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-emerald-600 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <h4 className="font-serif text-lg font-bold text-[#1F1813]">
                Dispatch Emergency Mutual Aid Stipend
              </h4>
              <button onClick={() => setShowDisburseModal(false)} className="p-1 rounded-full hover:bg-black/10 cursor-pointer">
                <X className="w-5 h-5 text-[#1F1813]" />
              </button>
            </div>

            <form onSubmit={handleDisburseAid} className="space-y-3 text-xs font-sans">
              <div>
                <label className="font-bold text-[#1F1813] block mb-1">Recipient Mother</label>
                <input
                  type="text"
                  required
                  value={newDisbursement.recipientMother}
                  onChange={e => setNewDisbursement({ ...newDisbursement, recipientMother: e.target.value })}
                  className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1F1813] block mb-1">Stipend Amount ($)</label>
                  <select
                    value={newDisbursement.amount}
                    onChange={e => setNewDisbursement({ ...newDisbursement, amount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl font-mono"
                  >
                    <option value={50}>$50.00 Micro-Grant</option>
                    <option value={75}>$75.00 Grocery Aid</option>
                    <option value={100}>$100.00 Nourishment Pool</option>
                    <option value={150}>$150.00 Emergency Relief</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#1F1813] block mb-1">Category</label>
                  <select
                    value={newDisbursement.category}
                    onChange={e => setNewDisbursement({ ...newDisbursement, category: e.target.value as any })}
                    className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl font-mono"
                  >
                    <option value="Fresh Groceries & Broths">Fresh Groceries</option>
                    <option value="Postpartum Herbal Supplies">Herbal Supplies</option>
                    <option value="Emergency Childcare Co-op">Childcare Co-op</option>
                    <option value="Diaper & Cotton Wash Aid">Cotton & Diapers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1F1813] block mb-1">Purpose / Notes</label>
                <input
                  type="text"
                  required
                  value={newDisbursement.notes}
                  onChange={e => setNewDisbursement({ ...newDisbursement, notes: e.target.value })}
                  placeholder="e.g. Grass-fed bone broth and organic vegetables"
                  className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-copper-penny/20">
                <button
                  type="button"
                  onClick={() => setShowDisburseModal(false)}
                  className="px-4 py-2 border border-copper-penny/30 rounded-xl text-xs font-mono font-bold hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-mono font-bold shadow-md cursor-pointer transition-all"
                >
                  Authorize Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
