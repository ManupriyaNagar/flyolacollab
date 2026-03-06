import {
    ChevronRight,
    ArrowRight,
    Info,
    Plus,
    User,
    Armchair,
    ChevronDown,
    MapPin,
    Utensils,
    Coffee,
    MonitorPlay,
    LayoutGrid,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";
export function Passenger({ passengers = [], onAdd, onUpdate, onRemove, onSelectSeat }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 px-10 py-12 space-y-8">

            {/* Title */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-medium text-gray-900">
                    Passenger Details & Seat
                </h2>
                <button
                    onClick={onAdd}
                    className="bg-[#0133EA] text-white px-5 py-2 rounded-full flex items-center gap-3 text-xs font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                    <Plus size={20} />
                    Add New
                </button>
            </div>

            {passengers.map((passenger, index) => (
                <div key={passenger.id} className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 p-6 rounded-2xl border border-gray-50 bg-gray-50/30 transition-all hover:border-gray-200 group">
                    {/* LEFT SIDE - Passenger */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {passenger.name ? passenger.name[0].toUpperCase() : (index + 1)}
                            </div>

                            {/* Name + ID */}
                            <div className="space-y-1">
                                <input
                                    type="text"
                                    value={passenger.name}
                                    onChange={(e) => onUpdate(passenger.id, { name: e.target.value })}
                                    placeholder="Enter full name"
                                    className="text-sm font-medium text-gray-900 bg-transparent border-b border-transparent focus:border-blue-400 focus:outline-none w-full"
                                />
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Info size={14} className="text-gray-400" />
                                    <input
                                        type="text"
                                        value={passenger.idNumber}
                                        onChange={(e) => onUpdate(passenger.id, { idNumber: e.target.value })}
                                        placeholder="ID Number"
                                        className="text-[10px] tracking-wide bg-transparent border-b border-transparent focus:border-blue-400 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {passengers.length > 1 && (
                                <button
                                    onClick={() => onRemove(passenger.id)}
                                    className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Plus className="rotate-45" size={20} />
                                </button>
                            )}
                            <ChevronRight size={24} className="text-gray-300" />
                        </div>
                    </div>

                    {/* RIGHT SIDE - Seat */}
                    <div
                        onClick={() => onSelectSeat(passenger.id)}
                        className="flex items-center justify-between cursor-pointer group/seat"
                    >
                        <div className="flex items-center gap-4">
                            {/* Seat Icon Circle */}
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                passenger.seat ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400 group-hover/seat:bg-blue-100 group-hover/seat:text-blue-600"
                            )}>
                                <Armchair size={20} className={cn(passenger.seat && "fill-green-600/20")} />
                            </div>

                            {/* Seat Text */}
                            <div>
                                <div className="text-sm font-medium text-gray-900">
                                    {passenger.seat ? `Seat ${passenger.seat}` : "Select Seat"}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {passenger.seat ? "Change selection" : "Choose your preferred seat"}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-100 p-1 rounded-lg group-hover/seat:bg-blue-600 transition-all">
                            <ChevronRight
                                size={20}
                                className="text-gray-400 group-hover/seat:text-white"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}