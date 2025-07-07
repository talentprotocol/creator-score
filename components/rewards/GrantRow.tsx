import { Grant } from "@/lib/types";

export function GrantRow({ grant }: { grant: Grant }) {
  return (
    <div key={grant.id}>
      <div>
        {grant.sponsor.name} - ID: {grant.id}
      </div>
      <div>
        {grant.start_date}, {grant.end_date}
      </div>
    </div>
  );
}
