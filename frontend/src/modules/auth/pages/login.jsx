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
} from "lucide-react";
import { toast } from "sonner";
import { loginSchema } from "../schemas/usuarioSchema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

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
         const res=await login(email,password);
         console.log('Res: ',res);
         navigate("/"); // Te lleva a la ruta raíz

         toast.success("Inicio de sessión exitóso.");
      } catch (err) {
         console.log(err);
         
         const nuevosErrores = {};
         err.inner.forEach((e) => {
            nuevosErrores[e.path] = e.message;
         });

         setErrores(nuevosErrores);
         console.log(nuevosErrores);

         toast.error("Inicio de sessión fallido.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-slate-200 flex flex-col">
         {/* Main content */}
         <div className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
               <CardHeader className="text-center space-y-4 pb-8">
                  <div className="mx-auto w-16 h-16 bg-innova-blue rounded-full flex items-center justify-center shadow-lg">
                     <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-2">
                     <CardTitle className="text-2xl font-bold text-gray-900">
                        Sistema de Asistencias
                     </CardTitle>
                     <CardDescription className="text-gray-600">
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
                           Email
                        </Label>
                        <div className="relative">
                           <Input
                              id="email"
                              type="email"
                              placeholder="usuario@grupoinnova.pe"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              //  required
                              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pl-9"
                           />
                           <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-1/2 -translate-y-1/2"
                           >
                              <User2Icon />
                           </Button>
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
                           Contraseña
                        </Label>
                        <div className="relative">
                           <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              //  required
                              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pl-9"
                           />
                           <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-1/2 -translate-y-1/2"
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
                        className="w-full h-11 bg-innova-blue hover:bg-innova-blue/90 text-white font-medium transition-colors"
                        disabled={isLoading}
                     >
                        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                     </Button>
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
