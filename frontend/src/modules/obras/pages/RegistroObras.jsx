import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Loader2, Loader2Icon, LocateFixed, Map } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import InputConEtiquetaFlotante from "../../../shared/components/InputConEtiquetaFlotante";

// !! Necesario para que los íconos de Leaflet se muestren correctamente
import { Circle, MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { toast } from "sonner";
import { getCoordsFromAddress } from "../services/getCoordsFromAddress";
import AgregarObraForm from "../components/AgregarObraForm";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// ?? modelo obra
const claves = {
    id: null,
    nombre: "",
    direccion: "",
    latitud: null,
    longitud: null
}

// ?? Componente para manejar los clics en el mapa y la posición del marcador
const MapClickHandler = ({ setForm, position, setPosition }) => {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            setForm(prevForm => ({ ...prevForm, latitud: lat, longitud: lng }));
            setPosition([lat, lng]);
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>
                Coordenadas seleccionadas: <br />
                Latitud: {position[0]} <br />
                Longitud: {position[1]}
            </Popup>
        </Marker>
    );
};


const RegistroObras = () => {
    // ?? Para obtener el id de la obra
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    // ?? Navegacion
    const navigate = useNavigate();

    // ?? Formulario
    const [form, setForm] = useState({ ...claves });
    const [latitudIncial, setLatitudIncial] = useState([-12.046374, -77.042793]);


    // ?? Errores
    const [errores, setErrores] = useState({ ...claves });

    // ?? Mapa
    const [zoom, setZoom] = useState(13); // ** Zoom inicial
    const [showRadio, setShowRadio] = useState(false); // ** Muestra el radio
    const [position, setPosition] = useState(null); // ** Posicion en el map

    // ?? Loading
    const [isLoading, setIsLoading] = useState(false); // ** Guarada el estado de carga
    const [isLoadingMap, setIsLoadingMap] = useState(false); // ** Render del Mapa despues de buscar

    const mapRef = useRef();


    const fetchObra = async () => {
        try {
            // Lógica para obtener la obra y actualizar el formulario
            // setForm({ ...obra_obtenida });
            // setPosition([obra_obtenida.latitud, obra_obtenida.longitud]);
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }


    const buscarUbicacion = async (e) => {
        e.preventDefault();
        if (!form.direccion || form.direccion.trim() === "") {
            toast.error("No se ha ingresado una dirección.");
            return;
        }
        setIsLoading(true);
        try {
            setIsLoadingMap(true);
            const result = await getCoordsFromAddress(form.direccion);

            if (result && result.lat && result.lng) {
                const coords = [result.lat, result.lng];

                setLatitudIncial(coords); // actualiza centro
                setForm((prevForm) => ({
                    ...prevForm,
                    latitud: result.lat,
                    longitud: result.lng,
                }));
                setPosition(coords);

                // ** CENTRAR el mapa
                if (mapRef.current) {
                mapRef.current.setView(coords, 16); // ** zoom
                }
                setZoom(20);
            } else {
                toast.error("No se pudo localizar la dirección.");
            }
        } catch (error) {
            toast.error("Hubo un error al buscar la ubicación.");
        } finally {
            setIsLoading(false);
            setIsLoadingMap(false);
        }
    };


    const handleRadioChange = (e) => {
        e.preventDefault();
        setShowRadio(!showRadio);
    }

    const handleChange = (e) => {
        setForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value }));
    };

    const renderDegradadoZona = (centro, radioBase, capas = 4) => {
        const degradado = [];
        for (let i = capas; i >= 1; i--) {
            const r = radioBase * (i / capas);
            // Ajustamos la opacidad para un degradado más sutil
            const opacidad = 0.01 + (i / capas) * 0.1;
            degradado.push(
                <Circle
                    key={`${centro}-${r}`}
                    center={centro}
                    radius={r}
                    pathOptions={{
                        // color: "#1AED1D",
                        fillColor: "blue",
                        fillOpacity: opacidad * 1.5,
                        stroke: false,
                        borderColor: "black",
                        weight: 0,
                        opacity: 0.7,
                    }}
                />
            );
        }
        return degradado;
    }

    const RenderMap = () => {
        return (
            <MapContainer
                center={latitudIncial}
                zoom={zoom}
                scrollWheelZoom={true}
                style={{ height: "70dvh", width: "100%" }}
                whenCreated={(mapInstance) => {
                    mapRef.current = mapInstance;
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    form.latitud && form.longitud && showRadio &&
                    renderDegradadoZona([form.latitud, form.longitud], 50, 4)
                }
                <MapClickHandler setForm={setForm} position={position} setPosition={setPosition} />
            </MapContainer>
        )
    }


    return (
        <div className="max-w-7xl mx-auto flex pb-[100px] md:pb-0  flex-col md:flex-row  items-start">
            <div className="w-full  md:w-5/12  flex p-5 md:p-0 items-end justify-end">
                <AgregarObraForm
                    handleChange={handleChange}
                    form={form}
                    errores={errores}
                    isLoading={isLoading}
                    buscarUbicacion={buscarUbicacion}
                    handleRadioChange={handleRadioChange}
                    showRadio={showRadio}
                />
            </div>

            <div className="w-10/12 md:w-7/12 z-0 max-w-5xl mx-auto md:my-8">
                <h3 className="text-lg font-semibold mb-2 sm:mb-4 md:text-xl md:mb-8">Selecciona la ubicación en el mapa</h3>
                {
                    isLoadingMap ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2Icon className="animate-spin h-10 w-10" />
                        </div>
                    ) :
                        RenderMap()
                }

            </div>
        </div>
    );
};

export default RegistroObras;