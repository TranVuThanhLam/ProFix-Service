import { useEffect, useState, useCallback } from "react";
import useApi from "../api/useAPI";
import useMe from "../useMe";

export default function useProviderStats() {
  const { me, loading: meLoading } = useMe();
  const { callApi, loading: apiLoading, error } = useApi();
  const [stats, setStats] = useState(null);

  const fetchStats = useCallback(async () => {
    if (!me || meLoading) return; // Đảm bảo đã có me
    try {
      const res = await callApi({ url: `/provider/${me.id}/stats` });
      setStats(res);
    } catch (err) {
      console.error("Failed to fetch provider stats:", err);
    }
  }, [me?.id, meLoading, callApi]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading: apiLoading || meLoading,
    error,
    refetch: fetchStats, // ✅ thêm refetch
  };
}
