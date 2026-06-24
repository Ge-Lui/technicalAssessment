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
        <div className="min-h-screen bg-[#0D1F14] text-white flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden font-sans">
            <div className="w-full max-w-2xl z-10 space-y-8">
                {/* Form Card */}
                <div className="bg-[#112A1F] border border-[rgba(34,139,74,0.25)] rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-300">
                    <h2 className="text-xl font-bold mb-6 text-[#FFFFFF] flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#228B4A] animate-pulse" />
                        Submit Name Entry
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Fields Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="block text-[11px] font-bold uppercase tracking-wider text-[#7DB89A]">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    placeholder="e.g. John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full bg-[#0D2318] border border-[#1E5C35] rounded-[9px] px-4 py-3 text-[#FFFFFF] placeholder-[#3D7A55] focus:outline-none focus:ring-2 focus:ring-[#228B4A]/50 focus:border-[#228B4A] transition-all duration-200 text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="lastName" className="block text-[11px] font-bold uppercase tracking-wider text-[#7DB89A]">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    placeholder="e.g. Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full bg-[#0D2318] border border-[#1E5C35] rounded-[9px] px-4 py-3 text-[#FFFFFF] placeholder-[#3D7A55] focus:outline-none focus:ring-2 focus:ring-[#228B4A]/50 focus:border-[#228B4A] transition-all duration-200 text-sm"
                                />
                            </div>
                        </div>

                        {/* Error & Success Messages */}
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg px-4 py-3 text-sm flex items-center gap-2 animate-fadeIn">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        {successMsg && (
                            <div className="bg-[#228B4A]/10 border border-[#228B4A]/30 text-[#7DB89A] rounded-lg px-4 py-3 text-sm flex items-center gap-2 animate-fadeIn">
                                <span>✅</span> {successMsg}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto bg-[#228B4A] hover:bg-[#1A6B39] text-[#FFFFFF] font-bold px-6 py-3 rounded-[9px] shadow-lg active:scale-98 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                <div className="bg-[#112A1F] border border-[rgba(34,139,74,0.25)] rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#FFFFFF] flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#228B4A]" />
                            Submitted Name Entries
                        </h2>
                        <button
                            onClick={fetchEntries}
                            disabled={isLoading}
                            className="p-2 text-[#228B4A] hover:text-[#1A6B39] transition-colors duration-200"
                            title="Refresh List"
                        >
                            <svg className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
                            </svg>
                        </button>
                    </div>

                    {/* Table View */}
                    <div className="overflow-hidden border border-[#1E5C35] rounded-xl bg-[#0D2318]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#1E5C35] bg-[#0D2318] text-[#7DB89A] text-[11px] font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">First Name</th>
                                    <th className="px-6 py-4">Last Name</th>
                                    <th className="px-6 py-4 hidden sm:table-cell text-right">Submitted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && entries.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-[#7DB89A]">
                                            <div className="flex flex-col items-center gap-3">
                                                <svg className="animate-spin h-8 w-8 text-[#228B4A]" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Loading entries...
                                            </div>
                                        </td>
                                    </tr>
                                ) : entries.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-[#7DB89A] text-sm">
                                            No name entries found. Submit a name using the form above!
                                        </td>
                                    </tr>
                                ) : (
                                    entries.map((entry) => (
                                        <tr
                                            key={entry.id}
                                            className="border-b border-[#1A3D28] hover:bg-[#153426]/50 bg-[#112A1F] transition-colors duration-150 text-sm"
                                        >
                                            <td className="px-6 py-4 font-bold text-[#FFFFFF]">{entry.first_name}</td>
                                            <td className="px-6 py-4 text-[#C8E6D4]">{entry.last_name}</td>
                                            <td className="px-6 py-4 hidden sm:table-cell text-right text-[#7DB89A] text-xs">
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
