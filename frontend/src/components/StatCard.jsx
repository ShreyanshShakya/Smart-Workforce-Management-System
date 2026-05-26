
const colorStyles = {
  indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  sky: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
};

const iconBackgrounds = {
  indigo: 'bg-indigo-500/20 text-indigo-400',
  emerald: 'bg-emerald-500/20 text-emerald-400',
  rose: 'bg-rose-500/20 text-rose-400',
  amber: 'bg-amber-500/20 text-amber-400',
  sky: 'bg-sky-500/20 text-sky-400',
};

export default function StatCard({ title, value, icon, color = 'indigo' }) {
  const containerClass = colorStyles[color] || colorStyles.indigo;
  const iconClass = iconBackgrounds[color] || iconBackgrounds.indigo;

  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-transform hover:scale-[1.02] ${containerClass}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner ${iconClass}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
