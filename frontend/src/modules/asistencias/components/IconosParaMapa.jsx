import { MapPinCheckInside, MapPinHouse, MapPinXInside } from "lucide-react";

export const crearIconoLucide = (color, nombre, tipo = "entrada") => {
    const Icono = tipo === "entrada" ? MapPinHouse : MapPinXInside;
    const iconoReact = (
        <div className="flex flex-col items-center">
            <Icono color="white" fill={color} size={36} strokeWidth={2.5} />
            <div className="text-xs font-semibold text-gray-800 -mt-1">
                {nombre}
            </div>
        </div>
    );
    return new L.DivIcon({
        html: ReactDOMServer.renderToString(iconoReact),
        className: "",
        iconSize: [36, 48],
        iconAnchor: [18, 48],
        popupAnchor: [0, -48],
    });
};

export const crearIconoCombinado = (color, nombre) => {
    const iconoReact = (
        <div className="flex flex-col items-center">
            <MapPinCheckInside
                color="white"
                fill={color}
                size={36}
                strokeWidth={2.5}
            />
            <div className="text-xs font-semibold text-gray-800 -mt-1">
                {nombre}
            </div>
        </div>
    );
    return new L.DivIcon({
        html: ReactDOMServer.renderToString(iconoReact),
        className: "",
        iconSize: [36, 48],
        iconAnchor: [18, 48],
        popupAnchor: [0, -48],
    });
};
