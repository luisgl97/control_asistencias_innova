import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { isPathActive } from "../utils/isPathActive";

const SubHeaderTrabajador = () => {
   const location = useLocation();
   const navigate = useNavigate();
   return (
      <>
         <header className="max-w-7xl mx-auto flex space-x-8 pt-4 px-4 lg:px-0 ">
            <ButtonGroup>
               <Button
                  variant="outline"
                  className={`font-semibold text-base ${
                     isPathActive(location.pathname, "/")
                        ? "text-neutral-800"
                        : "text-neutral-400"
                  }  hover:text-neutral-800`}
                  onClick={() => {
                     navigate("/");
                  }}
               >
                  Asistencia
               </Button>
               <Button
                  variant="outline"
                  className={`font-semibold text-base ${
                     isPathActive(location.pathname, "/solicitudes")
                        ? "text-neutral-800"
                        : "text-neutral-400"
                  } `}
                  onClick={() => {
                     navigate("/solicitudes");
                  }}
               >
                  Solicitud de equipos
               </Button>
            </ButtonGroup>
         </header>
         <Outlet />
      </>
   );
};
export default SubHeaderTrabajador;
