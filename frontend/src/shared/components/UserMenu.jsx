import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Settings2, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserMenu = ({ nombre,logout }) => {
   const letter = nombre.charAt(0);
   const navigate = useNavigate();

   return (
      <DropdownMenu>
         <DropdownMenuTrigger className="flex items-center gap-1" asChild>
            <Button
               variant={"outline"}
               size={"icon"}
               className="uppercase rounded-full"
            >
               {letter}
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end" className="min-w-32">
            {/* <DropdownMenuGroup>
               <DropdownMenuItem>
                  <UserCircle />
                  Account
               </DropdownMenuItem>
               <DropdownMenuItem>
                  <Settings2 />
                  Setings
               </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem>
               <div
                  className="w-full flex gap-3"
                  onClick={() => {
                     logout();
                     navigate("/login", { replace: true });
                  }}
               >
                  <LogOut className="" />
                  <span>Log out</span>
               </div>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};
export default UserMenu;
