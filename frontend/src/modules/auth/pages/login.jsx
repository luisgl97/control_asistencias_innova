import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   Clock,
   Building2,
   Timer,
   Users,
   AlertCircle,
   Eye,
   EyeClosed,
   User2Icon,
   Lock,
} from "lucide-react";
import { toast } from "sonner";
import { loginSchema } from "../schemas/usuarioSchema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

import logotipo from "../../../assets/png/logov1-removebg-preview.png"

export default function LoginPage() {
   const navigate = useNavigate();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrores] = useState(null);
   const [showPassword, setShowPassword] = useState(false);
   const { login } = useAuth();

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         setIsLoading(true);
         await loginSchema.validate(
            { email, password },
            {
               abortEarly: false,
            }
         );
         setErrores(null);
         const res = await login(email, password);
         if (!res.estado) {
            throw new Error("Fallo el inicio de sessión");
         }
         if (res.rol === "GERENTE" || res.rol === "ADMINISTRADOR") {
            navigate("/asistencias");
         }
         if (res.rol === "TRABAJADOR"||res.rol=== "LIDER TRABAJADOR") {
            navigate("/");
         }
         toast.success("Inicio de sessión exitóso.");
      } catch (err) {
         if (err.inner) {
            const nuevosErrores = {};
            err.inner.forEach((e) => {
               nuevosErrores[e.path] = e.message;
            });

            setErrores(nuevosErrores);
         }
         toast.error("Inicio de sessión fallido.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-[#1b274a] to-[#1b274a] flex flex-col">
         {/* Main content */}
         <div className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-0 bg-white backdrop-blur-sm">
               <CardHeader className="text-center space-y-3 pb-4 relative">
                  <div className="relative mx-auto">
                     <div className="">
                           <img src={logotipo} className="w-30 h-30 relative" alt="logo" />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Márcate
                     </CardTitle>
                     <CardDescription className="text-gray-600 text-base">
                        Ingresa tus credenciales para acceder
                     </CardDescription>
                  </div>
               </CardHeader>

               <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="space-y-2">
                        <Label
                           htmlFor="email"
                           className="text-sm font-medium text-gray-700"
                        >
                           <User2Icon className="h-4 w-4" />
                           <p>
                              Email
                           </p>
                        </Label>
                        <div className="relative">
                           <Input
                              id="email"
                              type="email"
                              placeholder="usuario@grupoinnova.pe"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              //  required
                              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pl-3"
                           />
                        </div>

                        {errors?.email && (
                           <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              {errors.email}
                           </p>
                        )}
                     </div>

                     <div className="space-y-2">
                        <Label
                           htmlFor="password"
                           className="text-sm font-medium text-gray-700"
                        >
                           <Lock className="w-4 h-4" />
                           Contraseña
                        </Label>
                        <div className="relative">
                           <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              //  required
                              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pl-3"
                           />
                           <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                           >
                              {showPassword ? <EyeClosed /> : <Eye />}
                           </Button>
                        </div>
                        {errors?.password && (
                           <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              {errors.password}
                           </p>
                        )}
                     </div>

                     <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r bg-orange-500  hover:bg-orange-550 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                        disabled={isLoading}
                     >
                        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                     </Button>

                     {/* <div className="text-center">
                        <button className="text-sm text-gray-500 hover:text-orange-600 transition-colors duration-200 font-medium">
                           ¿Olvidaste tu contraseña?
                        </button>
                     </div> */}
                  </form>

                  <div className="text-center">
                     <button className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                        © 2025 Grupo Innova. Todos los derechos reservados.
                     </button>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
