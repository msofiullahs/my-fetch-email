import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getServerSideProps } from "@/shared/getData";
import { Contact } from '@/shared/config'

export default async function List() {
  const data = await getServerSideProps();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Source</TableHead>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>LinkedIn</TableHead>
          <TableHead>Date Added</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          JSON.parse(data).map((d: Contact) => (
            <TableRow key={d.id}>
              <TableCell>{d.source}</TableCell>
              <TableCell>{d.first_name}</TableCell>
              <TableCell>{d.last_name}</TableCell>
              <TableCell>{d.title}</TableCell>
              <TableCell>{d.linkedin}</TableCell>
              <TableCell>{d.date_added}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
}
