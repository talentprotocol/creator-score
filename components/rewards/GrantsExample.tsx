"use client";

import { SponsorSelect } from "@/components/rewards/SponsorSelect";
import { useGrantsData } from "@/hooks/api/useRewardsData";
import { useState } from "react";
import { Sponsor } from "@/lib/types";
import { GrantRow } from "@/components/rewards/GrantRow";

interface GrantsExampleProps {
  defaultSelectedSponsor: Sponsor | null;
}

export function GrantsExample({ defaultSelectedSponsor }: GrantsExampleProps) {
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(
    defaultSelectedSponsor
  );

  // Data is loaded from the server if it exists in the cache,
  // otherwise it's loaded again, this time from the API
  const { data: grants } = useGrantsData(selectedSponsor?.slug || "");

  return (
    <div>
      <SponsorSelect
        selectedSponsor={selectedSponsor}
        onSelect={setSelectedSponsor}
      />

      <div>
        {grants && grants.grants.length > 0 ? (
          grants.grants.map((grant) => (
            <GrantRow key={grant.id} grant={grant} />
          ))
        ) : (
          <div>No grants found</div>
        )}
      </div>
    </div>
  );
}
