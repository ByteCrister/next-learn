// lib/hooks/useBatches.ts
import { useBatchesStore } from "@/store/useBatchesStore";
import { useEffect } from "react";

export function useBatches() {
  const {
    fetchBatches,
    fetchBatchById,
    createBatch,
    updateBatch,
    deleteBatch,
    batches,
    currentBatch,
    loading,
    error,
  } = useBatchesStore();

  useEffect(() => {
    if (!batches.length) fetchBatches().catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    batches,
    currentBatch,
    loading,
    error,
    fetchBatchById,
    createBatch,
    updateBatch,
    deleteBatch,
  };
}
