import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InputConEtiquetaFlotante = ({
   value,
   handleChange,
   name,
   label,
   icono: Icono,
}) => {
   const tieneIcono = !!Icono;

   return (
      <div className="relative w-full">
         <Input
            name={name}
            value={value}
            onChange={handleChange}
            className={`peer focus-visible:ring-0 focus-visible:ring-offset-0 text-sm text-neutral-700 ${
               tieneIcono ? "pl-6" : ""
            }`}
         />

         <Label
            htmlFor={name}
            className={`
               absolute bg-white text-sm text-neutral-500 transition-all duration-200 pointer-events-none
               left-2 top-[7px] scale-100
               peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-neutral-600 peer-focus:scale-90
                      ${tieneIcono ? "peer-focus:left-4" : ""}
               ${tieneIcono ? "left-6" : ""}
               ${value ? `top-[-10px] text-sm text-neutral-600 scale-90  ` : ""}
            `}
         >
            {label}
         </Label>
         {tieneIcono && (
            <Icono className="w-4 h-4 ml-1.5 absolute top-1/2  -translate-y-1/2 text-gray-500 " />
         )}
      </div>
   );
};

export default InputConEtiquetaFlotante;
