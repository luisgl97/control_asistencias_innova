import { Skeleton } from "@/components/ui/skeleton";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

export function SkeletonTabla() {
   return (
      <Card>
         <CardHeader>
            <CardTitle>
               <Skeleton className="h-6 w-48" />
            </CardTitle>
            <CardDescription>
               <Skeleton className="h-4 w-96" />
            </CardDescription>
         </CardHeader>
         <CardContent>
            <div className="overflow-x-auto">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>
                           <Skeleton className="h-4 w-24" />
                        </TableHead>
                        <TableHead>
                           <Skeleton className="h-4 w-20" />
                        </TableHead>
                        <TableHead>
                           <Skeleton className="h-4 w-20" />
                        </TableHead>
                        <TableHead>
                           <Skeleton className="h-4 w-20" />
                        </TableHead>
                        <TableHead>
                           <Skeleton className="h-4 w-16" />
                        </TableHead>
                        <TableHead>
                           <Skeleton className="h-4 w-16" />
                        </TableHead>
                        <TableHead>
                           <Skeleton className="h-4 w-16" />
                        </TableHead>
                        <TableHead>
                           <Skeleton className="h-4 w-20" />
                        </TableHead>
                        <TableHead>
                           <Skeleton className="h-4 w-16" />
                        </TableHead>
                        <TableHead>
                           <Skeleton className="h-4 w-16" />
                        </TableHead>
                        <TableHead>
                           <Skeleton className="h-4 w-16" />
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {Array.from({ length: 3 }).map((_, indice) => (
                        <TableRow key={indice}>
                           <TableCell>
                              <Skeleton className="h-4 w-32" />
                           </TableCell>
                           <TableCell>
                              <Skeleton className="h-6 w-8 mx-auto" />
                           </TableCell>
                           <TableCell>
                              <Skeleton className="h-6 w-8 mx-auto" />
                           </TableCell>
                           <TableCell>
                              <Skeleton className="h-6 w-8 mx-auto" />
                           </TableCell>
                           <TableCell>
                              <Skeleton className="h-6 w-8 mx-auto" />
                           </TableCell>
                           <TableCell>
                              <Skeleton className="h-12 w-20 mx-auto" />
                           </TableCell>
                           <TableCell>
                              <Skeleton className="h-12 w-20 mx-auto" />
                           </TableCell>
                           <TableCell>
                              <Skeleton className="h-12 w-20 mx-auto" />
                           </TableCell>
                           <TableCell>
                              <Skeleton className="h-12 w-20 mx-auto" />
                           </TableCell>
                           <TableCell>
                              <Skeleton className="h-12 w-20 mx-auto" />
                           </TableCell>
                           <TableCell>
                              <Skeleton className="h-12 w-20 mx-auto" />
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
         </CardContent>
      </Card>
   );
}
