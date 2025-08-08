import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";

const startOfDay = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
};
const isBeforeDay = (a, b) => startOfDay(a).getTime() < startOfDay(b).getTime();

// ✅ Parse seguro para "YYYY-MM-DD" o "DD-MM-YYYY" en LOCAL (no UTC)
const parseLocalDate = (v) => {
    if (!v) return null;
    if (v instanceof Date) return new Date(v.getFullYear(), v.getMonth(), v.getDate());
    if (typeof v === "string") {
        const parts = v.split("-");
        if (parts.length === 3) {
            // detecta formato
            if (parts[0].length === 4) {
                // YYYY-MM-DD
                const [y, m, d] = parts.map(Number);
                return new Date(y, m - 1, d);
            } else {
                // DD-MM-YYYY
                const [d, m, y] = parts.map(Number);
                return new Date(y, m - 1, d);
            }
        }
    }
    // último recurso
    const n = new Date(v);
    return isNaN(n) ? null : new Date(n.getFullYear(), n.getMonth(), n.getDate());
};

export function Calendar22({ value, onChange, minDate, blockPast = false }) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(parseLocalDate(value));

    const minDay = useMemo(() => startOfDay(minDate || new Date()), [minDate]);

    useEffect(() => {
        setDate(parseLocalDate(value));
    }, [value]);

    const handleDateChange = (selectedDate) => {
        if (!selectedDate) return;
        // normaliza a inicio de día local
        const local = startOfDay(selectedDate);
        setDate(local);
        onChange && onChange(local); // <-- pasa Date local (no string)
        setOpen(false);
    };

    const disabledFn = blockPast ? (d) => isBeforeDay(d, minDay) : undefined;

    return (
        <div className="flex flex-col gap-3">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="w-full justify-between font-normal border border-gray-400"
                    >
                        {date ? date.toLocaleDateString() : "Seleccione una fecha"}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date || undefined}
                        onSelect={handleDateChange}
                        disabled={disabledFn}
                        fromDate={blockPast ? minDay : undefined}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
