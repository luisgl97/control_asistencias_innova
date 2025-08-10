import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
   Search,
   UserPlus,
   Edit,
   Trash2,
   Mail,
   UserCheck2Icon,
} from "lucide-react";
import usuarioService from "../services/usuarioService";
import { useNavigate } from "react-router-dom";
import ModalEliminarUsuario from "../components/ModalEliminarUsuario";
import { toast } from "sonner";

// Tipo para el usuario basado en la estructura proporcionada

const GestionUsuarios = () => {
   const [usuarios, setUsuarios] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [searchTerm, setSearchTerm] = useState("");
   const [filteredUsuarios, setFilteredUsuarios] = useState([]);
   const navigate = useNavigate();

   const fetchUsuarios = async () => {
      try {
         setLoading(true);
         setError(null);
         const res = await usuarioService.getUsuariosAll();
         const usuariosData = res.data.datos || [];
         setUsuarios(usuariosData);
         setFilteredUsuarios(usuariosData);
      } catch (error) {
         console.error("Error al obtener usuarios:", error);
         setError(
            "Error al cargar los usuarios. Por favor, intenta nuevamente."
         );
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchUsuarios();
   }, []);

   // Filtrar usuarios basado en el término de búsqueda
   useEffect(() => {
      const filtered = usuarios.filter(
         (usuario) =>
            usuario.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.apellidos
               .toLowerCase()
               .includes(searchTerm.toLowerCase()) ||
            usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.dni.includes(searchTerm) ||
            usuario.rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (usuario.cargo &&
               usuario.cargo.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsuarios(filtered);
   }, [searchTerm, usuarios]);

   const activarUsuario = async (id) => {
      setLoading(true);
      try {
         const res = await usuarioService.activarUsuario(id);
         await fetchUsuarios();
         toast.success("Usuario Activado");
      } catch (error) {
         toast.error("Error al activar usuario");
      } finally {
         setLoading(false);
      }
   };

   const getRoleBadgeVariant = (rol) => {
      switch (rol) {
         case "GERENTE":
            return "default";
         case "ADMINISTRADOR":
            return "secondary";
         case "TRABAJADOR":
            return "outline";
         case "LIDER TRABAJADOR":
            return "outline";

         default:
            return "outline";
      }
   };

   if (loading) {
      return (
         <Card className="w-full max-w-7xl mx-auto space-y-6 shadow-none outline-none border-none">
            <CardHeader>
               <CardTitle className="text-2xl font-bold">
                  Gestión de Usuarios
               </CardTitle>
               <CardDescription>Cargando usuarios...</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                     <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-[200px]" />
                           <Skeleton className="h-4 w-[150px]" />
                        </div>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      );
   }

   if (error) {
      return (
         <Card className="w-full max-w-7xl mx-auto space-y-6 shadow-none outline-none border-non">
            <CardHeader>
               <CardTitle className="text-2xl font-bold">
                  Gestión de Usuarios
               </CardTitle>
            </CardHeader>
            <CardContent>
               <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
               </Alert>
               <Button onClick={fetchUsuarios} className="mt-4">
                  Reintentar
               </Button>
            </CardContent>
         </Card>
      );
   }

   return (
      <div className="w-full max-w-7xl mx-auto space-y-6 mt-2">
         <Card className="shadow-none outline-none border-none">
            <CardHeader>
               <div className="flex flex-col items-start md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                     <CardTitle className="text-2xl font-bold text-left">
                        Gestión de Usuarios
                     </CardTitle>
                     <CardDescription className="text-left">
                        Administra los usuarios del sistema ({usuarios.length}{" "}
                        usuarios registrados)
                     </CardDescription>
                  </div>
                  <div className="flex justify-end ">
                     <Button
                        className="gap-2 bg-innova-blue hover:bg-innova-blue/90"
                        onClick={() => navigate("/usuarios/registrar")}
                     >
                        <UserPlus className="h-4 w-4" />
                        Nuevo Usuario
                     </Button>
                  </div>
               </div>
            </CardHeader>
            <CardContent>
               {/* Barra de búsqueda */}
               <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-sm">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                     <Input
                        placeholder="Buscar usuarios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                     />
                  </div>
                  <div className="text-sm text-muted-foreground">
                     {filteredUsuarios.length} de {usuarios.length} usuarios
                  </div>
               </div>

               {/* Tabla de usuarios */}
               <div className="rounded-md border">
                  <Table className={"rounded-md overflow-hidden"}>
                     <TableHeader className="bg-innova-blue">
                        <TableRow>
                           <TableHead className={"text-white"}>
                              Usuario
                           </TableHead>
                           <TableHead className={"text-white"}>DNI/CE</TableHead>
                           <TableHead className={"text-white"}>Email</TableHead>
                           <TableHead className={"text-white"}>Rol</TableHead>
                           <TableHead className={"text-white"}>Cargo</TableHead>
                           <TableHead className={"text-white"}>
                              Estado
                           </TableHead>
                           <TableHead className={"text-white"}>
                              Acciones
                           </TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {filteredUsuarios.length === 0 ? (
                           <TableRow>
                              <TableCell
                                 colSpan={8}
                                 className="text-center py-8 text-muted-foreground"
                              >
                                 {searchTerm
                                    ? "No se encontraron usuarios que coincidan con la búsqueda"
                                    : "No hay usuarios registrados"}
                              </TableCell>
                           </TableRow>
                        ) : (
                           filteredUsuarios.map((usuario) => (
                              <TableRow key={usuario.id}>
                                 <TableCell>
                                    <div className="flex flex-col">
                                       <span className="font-medium">
                                          {usuario.nombres} {usuario.apellidos}
                                       </span>
                                    </div>
                                 </TableCell>
                                 <TableCell className="font-mono">
                                    {usuario.dni}
                                 </TableCell>
                                 <TableCell>
                                    <div className="flex items-center gap-2">
                                       <Mail className="h-4 w-4 text-muted-foreground" />
                                       <span className="text-sm">
                                          {usuario.email}
                                       </span>
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    <Badge
                                       variant={getRoleBadgeVariant(
                                          usuario.rol
                                       )}
                                    >
                                       {usuario.rol}
                                    </Badge>
                                 </TableCell>
                                 <TableCell>
                                    {usuario.cargo ? (
                                       <span className="text-sm bg-muted px-2 py-1 rounded">
                                          {usuario.cargo}
                                       </span>
                                    ) : (
                                       <span className="text-sm bg-muted px-2 py-1 rounded">
                                          ----
                                       </span>
                                    )}
                                 </TableCell>
                                 <TableCell>
                                    <span className="text-sm bg-muted px-2 py-1 rounded">
                                       {usuario.estado ? "Activo" : "Inactivo"}
                                    </span>
                                 </TableCell>
                                 <TableCell className={"flex gap-3"}>
                                    <Button
                                       variant="outline"
                                       size={"icon"}
                                       className="size-7"
                                       onClick={() =>
                                          navigate(
                                             `/usuarios/registrar?id=${usuario.id}`
                                          )
                                       }
                                    >
                                       <Edit className="size-3.5 text-innova-orange" />
                                    </Button>
                                    {usuario.estado ? (
                                       <ModalEliminarUsuario
                                          id={usuario.id}
                                          nombres={`${usuario.nombres} ${usuario.apellidos}`}
                                          cargarDatos={fetchUsuarios}
                                       />
                                    ) : (
                                       <Button
                                          variant="outline"
                                          size={"icon"}
                                          className="size-7"
                                          onClick={() =>
                                             activarUsuario(usuario.id)
                                          }
                                       >
                                          <UserCheck2Icon className="size-3.5 text-green-700" />
                                       </Button>
                                    )}
                                 </TableCell>
                              </TableRow>
                           ))
                        )}
                     </TableBody>
                  </Table>
               </div>
            </CardContent>
         </Card>
      </div>
   );
};

export default GestionUsuarios;
