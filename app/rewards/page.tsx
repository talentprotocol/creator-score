import { CACHE_KEYS, getQueryClient } from "@/lib/utils";
import { RewardsService } from "@/app/services/RewardsService";
import { GrantsExample } from "@/components/rewards/GrantsExample";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function RewardsPage() {
  const queryClient = getQueryClient();
  const rewardsService = new RewardsService();

  const defaultSponsor = "base";

  // Data is prefetched in the server component to hydrate the client
  const [sponsors] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: [CACHE_KEYS.REWARDS.SPONSORS_DATA],
      queryFn: () => rewardsService.getAllowedSponsors(),
    }),
    queryClient.fetchQuery({
      queryKey: [CACHE_KEYS.REWARDS.GRANTS_DATA, defaultSponsor],
      queryFn: () => rewardsService.getGrants(defaultSponsor),
    }),
  ]);

  const firstSponsor = sponsors.sponsors.find(
    (sponsor) => sponsor.slug === defaultSponsor
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GrantsExample defaultSelectedSponsor={firstSponsor || null} />
    </HydrationBoundary>
  );
}
