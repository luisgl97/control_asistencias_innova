import "./loaderInnova.css";
import logotipo from "@/assets/png/logov1-removebg-preview.png";

const LoaderInnova = () => {
  return (
    <div className="bg-innova-blue w-full h-screen flex flex-col items-center justify-center">
      {/* Logo con animación */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6 animate-fade-in aspect-square">
        <img
          src={logotipo}
          alt="Logo Innova"
          className="w-32 md:w-48 drop-shadow-lg animate-scale-up"
        />
      </div>

      {/* Loader circular */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-white animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-[#00C6FF] animate-spin"></div>
      </div>

      {/* Texto opcional */}
      <p className="mt-6 text-white text-lg tracking-wide animate-pulse">
        Cargando sistema...
      </p>
    </div>
  );
};

export default LoaderInnova;