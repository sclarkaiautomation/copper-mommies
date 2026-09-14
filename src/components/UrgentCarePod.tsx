import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Heart, 
  Send, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  ShieldCheck, 
  Utensils, 
  Car, 
  Baby, 
  Wrench, 
  Sparkles,
  Filter
} from 'lucide-react';
import { UrgentCareAlert } from '../types';
import { INITIAL_URGENT_CARE_ALERTS } from '../data/phase1CommunityData';

interface UrgentCarePodProps {
  selectedState: string;
  userName: string;
  alerts: UrgentCareAlert[];
  onRespondAlert: (alertId: string, note: string) => void;
  onCreateAlert: (newAlert: Omit<UrgentCareAlert, 'id' | 'responders' | 'status' | 'createdAt'>) => void;
}

export default function UrgentCarePod({
  selectedState,
  userName,
  alerts,
  onRespondAlert,
  onCreateAlert
}: UrgentCarePodProps) {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // New SOS Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Postpartum Meals' | 'Emergency Childcare' | 'Ride Sharing / Logistics' | 'Homestead Repair / Help' | 'Herbal / Remedy Need'>('Postpartum Meals');
  const [newUrgency, setNewUrgency] = useState<'Immediate (Today)' | 'Within 24 Hours' | 'This Week'>('Immediate (Today)');
  const [newArea, setNewArea] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Responding state
  const [respondingAlertId, setRespondingAlertId] = useState<string | null>(null);
  const [responseNote, setResponseNote] = useState('');

  const filteredAlerts = alerts.filter(a => {
    if (filterCategory !== 'All' && a.category !== filterCategory) return false;
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    onCreateAlert({
      title: newTitle,
      postedBy: userName,
      category: newCategory,
      urgencyLevel: newUrgency,
      locationArea: newArea || `${selectedState} County Circle`,
      stateCode: selectedState || 'GA',
      description: newDesc,
      dietaryOrSafetyNotes: newNotes
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewNotes('');
    setNewArea('');
  };

  const handleSendResponse = (alertId: string) => {
    if (!responseNote.trim()) return;
    onRespondAlert(alertId, responseNote);
    setRespondingAlertId(null);
    setResponseNote('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Postpartum Meals': return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'Emergency Childcare': return <Baby className="w-4 h-4 text-pink-600" />;
      case 'Ride Sharing / Logistics': return <Car className="w-4 h-4 text-blue-600" />;
      case 'Homestead Repair / Help': return <Wrench className="w-4 h-4 text-emerald-600" />;
      default: return <Heart className="w-4 h-4 text-rose-600" />;
    }
  };

  return (
    <div className="bg-[#FAF5EE] border-2 border-rose-300/60 rounded-3xl p-5 shadow-lg space-y-4">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-200/60 pb-3">
        <div>
          <div className="flex items-center space-x-2 text-rose-700">
            <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />
            <h3 className="font-serif font-extrabold text-lg text-[#1F1813]">
              Local Pod Urgent Care Alerts (Village SOS)
            </h3>
          </div>
          <p className="text-xs text-soft-sage font-mono mt-0.5">
            Rapid local response for postpartum meals, urgent ride-sharing, and emergency co-care in the {selectedState} pod.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-mono text-[10px] font-bold uppercase rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center space-x-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post Village SOS Need</span>
        </button>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-mono font-bold">
        {(['All', 'Postpartum Meals', 'Emergency Childcare', 'Ride Sharing / Logistics', 'Homestead Repair / Help'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              filterCategory === cat
                ? 'bg-[#1F1813] text-[#D4AF37] shadow-xs'
                : 'bg-white text-[#1F1813] hover:bg-rose-50 border border-copper-penny/15'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 bg-white border border-dashed border-copper-penny/20 rounded-2xl text-xs text-soft-sage">
            <p>No active Village SOS alerts in this category right now.</p>
            <p className="text-[10px] font-mono mt-1">Our mothers are surrounded by peace and abundance!</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                alert.urgencyLevel === 'Immediate (Today)'
                  ? 'bg-rose-50/70 border-rose-300'
                  : 'bg-white border-copper-penny/20 hover:border-copper-penny/40'
              }`}
            >
              {/* Top Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-copper-penny/10 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-white rounded-lg border border-copper-penny/15 shadow-2xs">
                    {getCategoryIcon(alert.category)}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase font-bold text-soft-sage block">
                      {alert.category} • Posted by {alert.postedBy}
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#1F1813]">
                      {alert.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[9px] font-mono">
                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                    alert.urgencyLevel === 'Immediate (Today)'
                      ? 'bg-rose-700 text-white'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {alert.urgencyLevel}
                  </span>
                  <span className="text-soft-sage">{alert.createdAt}</span>
                </div>
              </div>

              {/* Body & Area */}
              <p className="text-xs text-[#2A221B]/85 leading-relaxed">{alert.description}</p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-white/70 p-2.5 rounded-xl border border-copper-penny/10">
                <span className="flex items-center space-x-1 text-soft-sage text-[10px] font-mono">
                  <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
                  <span>Area: <strong>{alert.locationArea}</strong></span>
                </span>

                {alert.dietaryOrSafetyNotes && (
                  <span className="text-[10px] text-amber-900 font-mono italic">
                    ⚠️ Notes: {alert.dietaryOrSafetyNotes}
                  </span>
                )}
              </div>

              {/* Responders List */}
              {alert.responders.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[9px] font-mono text-soft-sage uppercase font-bold block">
                    🕊️ Sisters Responding to this Need ({alert.responders.length}):
                  </span>
                  <div className="space-y-1">
                    {alert.responders.map((r, i) => (
                      <div key={i} className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-0.5">
                        <div className="flex items-center justify-between text-[9px] font-mono">
                          <span className="font-bold text-emerald-900">{r.sisterName}</span>
                          <span className="text-emerald-700">{r.respondedAt}</span>
                        </div>
                        <p className="text-[11px] text-emerald-950 font-medium">"{r.note}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-1 flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold ${
                  alert.status === 'Open SOS' ? 'text-rose-700' : 'text-emerald-700'
                }`}>
                  Status: {alert.status}
                </span>

                {respondingAlertId === alert.id ? (
                  <div className="flex items-center space-x-2 w-full max-w-md ml-2">
                    <input
                      type="text"
                      value={responseNote}
                      onChange={(e) => setResponseNote(e.target.value)}
                      placeholder="What can you drop off or offer?"
                      className="w-full bg-white border border-copper-penny/25 rounded-xl px-2.5 py-1 text-xs text-[#1F1813] focus:outline-none focus:border-[#B87333]"
                    />
                    <button
                      onClick={() => handleSendResponse(alert.id)}
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-mono font-bold rounded-xl cursor-pointer"
                    >
                      Send
                    </button>
                    <button
                      onClick={() => setRespondingAlertId(null)}
                      className="text-[10px] font-mono text-soft-sage hover:text-black"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setRespondingAlertId(alert.id)}
                    className="px-3.5 py-1.5 bg-[#B87333] hover:bg-[#A85138] text-white font-mono text-[10px] font-bold uppercase rounded-xl transition-all shadow-2xs active:scale-95 cursor-pointer flex items-center space-x-1"
                  >
                    <Heart className="w-3 h-3 fill-white" />
                    <span>I Can Help Sister</span>
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-rose-400 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-[#1F1813]">
            <div className="flex items-center justify-between border-b border-copper-penny/10 pb-2">
              <h4 className="font-serif font-bold text-lg text-rose-800 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Post Village SOS Urgent Need</span>
              </h4>
              <button onClick={() => setShowCreateModal(false)} className="text-soft-sage hover:text-black">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-[9px] font-mono text-soft-sage uppercase font-bold">Need Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Postpartum broth & rest drop for mother of newborn"
                  className="w-full bg-white border border-copper-penny/20 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-[9px] font-mono text-soft-sage uppercase font-bold">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-white border border-copper-penny/20 rounded-xl px-2.5 py-1.5 text-xs"
                  >
                    <option value="Postpartum Meals">Postpartum Meals</option>
                    <option value="Emergency Childcare">Emergency Childcare</option>
                    <option value="Ride Sharing / Logistics">Ride Sharing / Logistics</option>
                    <option value="Homestead Repair / Help">Homestead Repair / Help</option>
                    <option value="Herbal / Remedy Need">Herbal / Remedy Need</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-mono text-soft-sage uppercase font-bold">Urgency</label>
                  <select
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value as any)}
                    className="w-full bg-white border border-copper-penny/20 rounded-xl px-2.5 py-1.5 text-xs"
                  >
                    <option value="Immediate (Today)">Immediate (Today)</option>
                    <option value="Within 24 Hours">Within 24 Hours</option>
                    <option value="This Week">This Week</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-mono text-soft-sage uppercase font-bold">Neighborhood / Area</label>
                <input
                  type="text"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  placeholder="e.g. Decatur / Cascade Area, GA"
                  className="w-full bg-white border border-copper-penny/20 rounded-xl px-3 py-1.5 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-mono text-soft-sage uppercase font-bold">Description of Support Needed</label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Explain what is needed, porch drop-off instructions, or timing..."
                  className="w-full bg-white border border-copper-penny/20 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-mono text-soft-sage uppercase font-bold">Dietary or Safety Notes (Optional)</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Nut-free, dairy-free, infant car seats ready"
                  className="w-full bg-white border border-copper-penny/20 rounded-xl px-3 py-1.5 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-copper-penny/20 rounded-xl font-mono text-xs text-soft-sage"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Publish SOS to Village
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
