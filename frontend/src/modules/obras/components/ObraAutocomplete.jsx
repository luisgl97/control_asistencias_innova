import { Building2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function ObraAutocomplete({
    obras = [],
    obrasRegistradas = [],
    value,
    onChange,
    placeholder = "Escribe o selecciona una obra",
}) {
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
    const [activeIndex, setActiveIndex] = useState(-1);

    // ------------ helpers ------------
    const opciones = useMemo(() => {
        const texto = query.toLowerCase();
        return obras
            .filter((o) => !obrasRegistradas.includes(o.id))
            .filter((o) => o.nombre.toLowerCase().includes(texto));
    }, [obras, obrasRegistradas, query]);

    const currentNombre = useMemo(() => {
        if (!value) return "";
        if (String(value).startsWith("new:")) return String(value).slice(4);
        const o = obras.find((x) => String(x.id) === String(value));
        return o?.nombre || "";
    }, [value, obras]);

    const updatePosition = () => {
        const el = inputRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setPos({
            top: r.bottom + window.scrollY,
            left: r.left + window.scrollX,
            width: r.width,
        });
    };

    const openList = () => {
        setOpen(true);
        setActiveIndex(-1);
        requestAnimationFrame(updatePosition);
    };

    const closeList = () => {
        setOpen(false);
        setActiveIndex(-1);
    };

    const selectObra = (obra) => {
        onChange?.(String(obra.id));
        setQuery(obra.nombre);
        closeList();
    };

    const selectTyped = () => {
        const txt = query.trim();
        if (!txt) return;
        onChange?.(`new:${txt}`);
        closeList();
    };

    // ------------ effects ------------
    useEffect(() => {
        // sincroniza input visual con valor externo
        if (!open) setQuery(currentNombre || "");
    }, [currentNombre, open]);

    useEffect(() => {
        const onScrollOrResize = () => open && updatePosition();
        window.addEventListener("scroll", onScrollOrResize, true);
        window.addEventListener("resize", onScrollOrResize);
        return () => {
            window.removeEventListener("scroll", onScrollOrResize, true);
            window.removeEventListener("resize", onScrollOrResize);
        };
    }, [open]);

    useEffect(() => {
        const onDocMouseDown = (e) => {
            if (!open) return;
            const inputEl = inputRef.current;
            const listEl = listRef.current;
            if (
                inputEl &&
                (inputEl === e.target || inputEl.contains(e.target))
            ) return;
            if (listEl && (listEl === e.target || listEl.contains(e.target))) return;
            closeList();
        };
        document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, [open]);

    // ------------ keyboard ------------
    const onKeyDown = (e) => {
        if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
            openList();
            return;
        }
        if (!open) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) =>
                Math.min(i + 1, Math.max(opciones.length - 1, 0))
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, -1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeIndex >= 0 && opciones[activeIndex]) {
                selectObra(opciones[activeIndex]);
            } else {
                selectTyped();
            }
        } else if (e.key === "Escape") {
            closeList();
        }
    };

    // ------------ render ------------
    return (
        <>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 rounded-md"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!open) openList();
                    }}
                    onFocus={openList}
                    onKeyDown={onKeyDown}
                />
            </div>

            {open &&
                createPortal(
                    <div
                        ref={listRef}
                        className="z-[60] fixed bg-white border border-slate-300 rounded mt-1 shadow-xl max-h-72 overflow-auto"
                        style={{ top: pos.top, left: pos.left, width: pos.width }}
                    >
                        {opciones.length > 0 ? (
                            opciones.map((obra, idx) => (
                                <div
                                    key={obra.id}
                                    className={`flex items-center px-3 py-2 cursor-pointer ${idx === activeIndex ? "bg-slate-100" : "hover:bg-slate-50"
                                        }`}
                                    onMouseEnter={() => setActiveIndex(idx)}
                                    onClick={() => selectObra(obra)}
                                >
                                    <Building2 className="h-4 w-4 mr-2 text-slate-500" />
                                    <span className="truncate">{obra.nombre}</span>
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-slate-600">
                                No se encontraron resultados.
                                {query.trim() && (
                                    <div
                                        className="mt-1 text-blue-600 hover:underline cursor-pointer"
                                        onClick={selectTyped}
                                    >
                                        Usar “{query.trim()}”
                                    </div>
                                )}
                            </div>
                        )}
                    </div>,
                    document.body
                )}
        </>
    );
}
