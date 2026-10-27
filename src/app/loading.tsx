export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
      <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-4">
        <span className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-slate-400 text-sm font-medium animate-pulse">
        Đang tải dữ liệu Class Deadline Hub...
      </p>
    </div>
  );
}
