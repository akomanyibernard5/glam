const cn = (...classes) => classes.filter(Boolean).join(" ");

export function NavLink({ active, icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm cursor-pointer transition-all duration-200",
        active
          ? "bg-white text-black shadow-md"
          : "text-zinc-300 hover:bg-zinc-700 hover:text-white hover:shadow-sm"
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="font-medium">{label}</span>
    </button>
  );
}