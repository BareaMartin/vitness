import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "vitness.onboarded.v1";

/**
 * First-launch onboarding gate. `seen` is undefined until the stored flag is
 * read (avoids a flash of the intro on every launch), then true/false. Calling
 * `dismiss` persists the flag and hides the intro for good.
 */
export function useOnboarding() {
  const [seen, setSeen] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(KEY)
      .then((v) => {
        if (active) setSeen(v === "1");
      })
      .catch(() => {
        if (active) setSeen(true); // storage unavailable → don't trap the user
      });
    return () => {
      active = false;
    };
  }, []);

  const dismiss = useCallback(() => {
    setSeen(true);
    AsyncStorage.setItem(KEY, "1").catch(() => {});
  }, []);

  return { ready: seen !== undefined, seen: seen === true, dismiss };
}
