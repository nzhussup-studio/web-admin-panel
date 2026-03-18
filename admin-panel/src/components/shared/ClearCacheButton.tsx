import { useState } from "react";
import { CacheService } from "@/lib/api/client";

const ClearCacheButton = ({
  triggerAlertHandler,
}: {
  triggerAlertHandler: (error: unknown) => void;
}) => {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      await CacheService.deleteV1AlbumCache();
      triggerAlertHandler(null);
    } catch (error) {
      triggerAlertHandler(error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <button
      onClick={handleClearCache}
      className='btn btn-outline-danger'
      disabled={isClearing}
      data-testid='clear-cache-button'
    >
      {isClearing ? "Clearing Cache..." : "Clear Cache"}
    </button>
  );
};

export default ClearCacheButton;
