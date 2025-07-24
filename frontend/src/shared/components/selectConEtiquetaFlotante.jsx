import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const SelectConEtiquetaFlotante = ({ value, onChange, name, label ,opciones = [] }) => {
  return (
    <div className="relative w-full">
      <Select value={value} onValueChange={(val) => onChange(name, val)}>
        <SelectTrigger
          id={name}
          className="peer w-full text-sm text-neutral-700 focus-visible:ring-0 "
        >
          <SelectValue placeholder="" />
        </SelectTrigger>

        <SelectContent>
           {opciones.map((opcion) => (
            <SelectItem key={opcion.value} value={opcion.value}>
              {opcion.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label
        htmlFor={name}
        className={`
          absolute left-2 bg-white text-sm text-neutral-500 px-1 transition-all duration-200 pointer-events-none
          top-[8px] scale-100
          peer-focus:top-[-10px] peer-focus:scale-90 peer-focus:text-neutral-600
          ${value ? "top-[-10px] scale-90 text-neutral-600" : ""}
        `}
      >
        {label}
      </Label>
    </div>
  );
};

export default SelectConEtiquetaFlotante;
