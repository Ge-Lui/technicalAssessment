import React, { useState, useEffect } from 'react';

export default function App() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [entries, setEntries] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // Fetch name entries
    const fetchEntries = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/names');
            if (!response.ok) {
                throw new Error('Failed to fetch entries');
            }
            const data = await response.json();
            setEntries(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Could not load entries from the server.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    // Handle form submission (Create or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!firstName.trim() || !lastName.trim()) {
            setError('Both First Name and Last Name are required.');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccessMsg('');

        const url = editingId ? `/api/names/${editingId}` : '/api/names';
        const method = editingId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to submit name entry');
            }

            setFirstName('');
            setLastName('');
            setSuccessMsg(editingId ? 'Name entry updated successfully!' : 'Name entry submitted successfully!');
            setEditingId(null);
            fetchEntries(); // Refresh table list
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to submit name. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Set form to edit mode
    const handleEdit = (entry) => {
        setEditingId(entry.id);
        setFirstName(entry.first_name);
        setLastName(entry.last_name);
        setError(null);
        setSuccessMsg('');
    };

    // Cancel edit mode
    const handleCancelEdit = () => {
        setEditingId(null);
        setFirstName('');
        setLastName('');
        setError(null);
    };

    // Trigger delete confirmation modal
    const handleDelete = (id) => {
        setDeleteConfirmId(id);
    };

    // Execute the deletion after user confirms in the custom modal
    const executeDelete = async () => {
        if (!deleteConfirmId) return;
        const id = deleteConfirmId;
        setDeleteConfirmId(null);
        setIsLoading(true);
        setError(null);
        setSuccessMsg('');
        try {
            const response = await fetch(`/api/names/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete entry');
            }
            setSuccessMsg('Name entry deleted successfully!');
            fetchEntries();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Failed to delete entry.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#EBF2EE] text-slate-800 flex flex-col items-center sm:justify-center pt-32 pb-12 px-6 sm:p-12 relative overflow-hidden font-sans">
            {/* Top decorative green bar mimicking CLI website header */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#4b8b2e]" />

            {/* Top Left Logo (Centered on Mobile, Top-Left on Desktop) */}
            <div className="absolute top-6 left-0 right-0 sm:right-auto sm:left-12 sm:top-10 z-20 flex justify-center sm:justify-start pointer-events-none">
                <img 
                    src="/clm.png" 
                    alt="Logo" 
                    className="h-28 sm:h-18 w-auto object-contain pointer-events-auto"
                />
            </div>

            {/* Background watermark */}
            <div 
                className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] bg-no-repeat bg-center bg-contain m-8 sm:m-16"
                style={{ backgroundImage: 'url("/cblm.png")' }}
            />

            {/* Bottom-Left Topographical Green Wave (Fixed to viewport corner) */}
            <div className="fixed bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 pointer-events-none z-0">
                <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Main Diagonal green band */}
                    <path d="M0 80 L120 200 H0 Z" fill="#4b8b2e" />
                    {/* Darker green overlay edge for depth */}
                    <path d="M0 80 L120 200 L95 200 L0 105 Z" fill="#3D7525" />
                    {/* Topographical contour lines */}
                    <path d="M0 95 C 30 120, 60 150, 85 200" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                    <path d="M0 115 C 25 135, 50 165, 70 200" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                    <path d="M0 135 C 20 150, 40 175, 55 200" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                    <path d="M0 155 C 15 165, 30 185, 40 200" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                    <path d="M0 175 C 10 180, 20 190, 25 200" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                    
                    <path d="M0 70 C 40 100, 80 135, 110 200" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <path d="M0 50 C 50 85, 100 120, 135 200" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                </svg>
            </div>

            {/* Bottom-Right Topographical Green Wave (Fixed to viewport corner) */}
            <div className="fixed bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 pointer-events-none z-0">
                <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Main Diagonal green band */}
                    <path d="M200 80 L80 200 H200 Z" fill="#4b8b2e" />
                    {/* Darker green overlay edge for depth */}
                    <path d="M200 80 L80 200 L105 200 L200 105 Z" fill="#3D7525" />
                    {/* Topographical contour lines */}
                    <path d="M200 95 C 170 120, 140 150, 115 200" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                    <path d="M200 115 C 175 135, 150 165, 130 200" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                    <path d="M200 135 C 180 150, 160 175, 145 200" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                    <path d="M200 155 C 185 165, 170 185, 160 200" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                    <path d="M200 175 C 190 180, 180 190, 175 200" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                    
                    <path d="M200 70 C 160 100, 120 135, 90 200" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <path d="M200 50 C 150 85, 100 120, 65 200" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                </svg>
            </div>

            <div className="w-full max-w-2xl z-10 space-y-8">
                {/* Form Card */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md">
                    <h2 className="text-xl font-bold mb-6 text-[#4b8b2e] flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0069B4] animate-pulse" />
                        {editingId ? 'Update Name Entry' : 'Submit Name Entry'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Fields Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    placeholder="e.g. Angelu"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full bg-[#F4F8F6] border border-slate-200 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0069B4]/20 focus:border-[#0069B4] transition-all duration-200 text-sm focus:bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="lastName" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    placeholder="e.g. Banogbanog"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full bg-[#F4F8F6] border border-slate-200 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0069B4]/20 focus:border-[#0069B4] transition-all duration-200 text-sm focus:bg-white"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-lg px-4 py-3 text-sm flex items-center gap-2 animate-fadeIn">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        {/* Submit & Cancel Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                            <div className="flex items-center gap-3 self-start sm:self-center">
                                {/* SVG Logo Waves mimicking Cebu Landmasters Logo */}
                                <svg className="w-16 h-8 select-none" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Top Blue Wave */}
                                    <path d="M35 15 C 55 5, 85 10, 105 18 C 85 14, 60 11, 35 15 Z" fill="#0069B4" />
                                    {/* Bottom Green Wave */}
                                    <path d="M15 25 C 45 13, 80 18, 110 27 C 80 22, 50 18, 15 25 Z" fill="#4b8b2e" />
                                </svg>
                                <div className="text-[#0069B4]/60 font-semibold italic text-xs sm:text-sm select-none border-l border-slate-200 pl-3 py-1">
                                    "Technical Assessment"
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 w-full sm:w-auto">
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="px-6 py-3 border border-slate-200 rounded-full hover:bg-slate-50 text-slate-600 font-semibold transition-all duration-200 text-sm cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto bg-[#0069B4] hover:bg-[#005594] text-white font-semibold px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        editingId ? 'Update Entry' : 'Submit Entry'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Table List Card */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#4b8b2e] flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#0069B4]" />
                            Submitted Name Entries
                        </h2>
                        <button
                            onClick={fetchEntries}
                            disabled={isLoading}
                            className="p-2 text-slate-400 hover:text-[#0069B4] transition-colors duration-200"
                            title="Refresh List"
                        >
                            <svg className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
                            </svg>
                        </button>
                    </div>

                    {/* Table View */}
                    <div className="overflow-hidden border border-slate-200 rounded-xl bg-white">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-[#F0F5F2] text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">First Name</th>
                                    <th className="px-6 py-4">Last Name</th>
                                    <th className="px-6 py-4 hidden sm:table-cell text-right">Submitted At</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && entries.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center gap-3">
                                                <svg className="animate-spin h-8 w-8 text-[#0069B4]" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Loading entries...
                                            </div>
                                        </td>
                                    </tr>
                                ) : entries.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-400 text-sm">
                                            No name entries found. Submit a name using the form above!
                                        </td>
                                    </tr>
                                ) : (
                                    entries.map((entry) => (
                                        <tr
                                            key={entry.id}
                                            className="border-b border-slate-100 hover:bg-[#EBF2EE]/50 transition-colors duration-150 text-sm text-slate-600"
                                        >
                                            <td className="px-6 py-4 font-semibold text-slate-800">{entry.first_name}</td>
                                            <td className="px-6 py-4 font-semibold text-slate-800">{entry.last_name}</td>
                                            <td className="px-6 py-4 hidden sm:table-cell text-right text-slate-400 text-xs">
                                                {new Date(entry.created_at).toLocaleString(undefined, {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(entry)}
                                                    className="p-1.5 text-[#0069B4] hover:text-[#005594] hover:bg-[#0069B4]/10 rounded-lg transition-colors cursor-pointer"
                                                    title="Edit Entry"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirmId(entry.id)}
                                                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Delete Entry"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Custom Confirm Delete Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 transform scale-100 transition-all duration-300 animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-600 text-xl font-bold mb-4">
                            ⚠️
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Entry</h3>
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                            Are you sure you want to delete this entry? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-all duration-200 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeDelete}
                                className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Success Modal */}
            {successMsg && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 flex flex-col items-center text-center transform scale-100 transition-all duration-300 animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-[#4b8b2e] text-3xl mb-4 animate-bounce">
                            ✓
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Success</h3>
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                            {successMsg}
                        </p>
                        <button
                            onClick={() => setSuccessMsg('')}
                            className="w-full py-2.5 rounded-full bg-[#0069B4] hover:bg-[#005594] text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
