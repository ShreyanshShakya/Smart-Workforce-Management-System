export default function Pagination({ page, totalPages, setPage }) {
    if (totalPages <= 1) return null;

    return (
        <div className="px-6 py-4 border-t border-slate-700/50 flex items-center justify-between bg-slate-800/30">
            <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Previous
            </button>
            <div className="flex space-x-2">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                            page === i 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );
}
