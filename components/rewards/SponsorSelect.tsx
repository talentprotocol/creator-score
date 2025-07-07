import { useSponsorsData } from "@/hooks/api/useRewardsData";
import { Sponsor } from "@/lib/types";

export function SponsorSelect({
  selectedSponsor,
  onSelect,
}: {
  selectedSponsor: Sponsor | null;
  onSelect: (sponsor: Sponsor) => void;
}) {
  // Data is loaded from the server if it exists in the cache,
  // otherwise it's loaded again, this time from the API
  const { data: sponsors } = useSponsorsData();

  return (
    <select
      value={selectedSponsor?.id}
      onChange={(e) => {
        const sponsor = sponsors?.sponsors.find(
          (s) => s.id === Number(e.target.value)
        );
        if (sponsor) {
          onSelect(sponsor);
        }
      }}
    >
      <option value="">Select a sponsor</option>
      {sponsors?.sponsors.map((sponsor) => (
        <option key={sponsor.id} value={sponsor.id}>
          {sponsor.name}
        </option>
      ))}
    </select>
  );
}
