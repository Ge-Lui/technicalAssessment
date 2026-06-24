import React, { useState, useEffect } from 'react';

export default function App() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

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

    // Handle form submission
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

        try {
            const response = await fetch('/api/names', {
                method: 'POST',
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
            setSuccessMsg('Name entry submitted successfully!');
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

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden font-sans">
            {/* Top decorative green bar mimicking CLI website header */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#4b8b2e]" />

            <div className="w-full max-w-2xl z-10 space-y-8">
                {/* Form Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md">
                    <h2 className="text-xl font-bold mb-6 text-[#4b8b2e] flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0069B4] animate-pulse" />
                        Submit Name Entry
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
                                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0069B4]/20 focus:border-[#0069B4] transition-all duration-200 text-sm focus:bg-white"
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
                                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0069B4]/20 focus:border-[#0069B4] transition-all duration-200 text-sm focus:bg-white"
                                />
                            </div>
                        </div>

                        {/* Error & Success Messages */}
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-lg px-4 py-3 text-sm flex items-center gap-2 animate-fadeIn">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        {successMsg && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-[#4b8b2e] rounded-lg px-4 py-3 text-sm flex items-center gap-2 animate-fadeIn">
                                <span>✅</span> {successMsg}
                            </div>
                        )}

                        {/* Submit Button (Pill shaped, official CLI blue) */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto bg-[#0069B4] hover:bg-[#005594] text-white font-semibold px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-98"
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
                                    'Submit Entry'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table List Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md">
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
                    <div className="overflow-hidden border border-slate-100 rounded-xl bg-white">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-[#F8FAFC] text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">First Name</th>
                                    <th className="px-6 py-4">Last Name</th>
                                    <th className="px-6 py-4 hidden sm:table-cell text-right">Submitted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && entries.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-slate-400">
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
                                        <td colSpan="3" className="px-6 py-12 text-center text-slate-400 text-sm">
                                            No name entries found. Submit a name using the form above!
                                        </td>
                                    </tr>
                                ) : (
                                    entries.map((entry) => (
                                        <tr
                                            key={entry.id}
                                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150 text-sm text-slate-600"
                                        >
                                            <td className="px-6 py-4 font-semibold text-slate-800">{entry.first_name}</td>
                                            <td className="px-6 py-4">{entry.last_name}</td>
                                            <td className="px-6 py-4 hidden sm:table-cell text-right text-slate-400 text-xs">
                                                {new Date(entry.created_at).toLocaleString(undefined, {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
