"use client";

import { ProfileCard } from "@/components/profile-card";
import { SettingsForm } from "@/components/settings-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/hooks/use-settings";

export function SettingsOverview() {
  const { error, isLoading, settings, updateSettings } = useSettings();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ProfileCard />

      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      {isLoading || !settings ? (
        <Skeleton className="h-80 w-full" />
      ) : (
        <SettingsForm onSubmit={updateSettings} settings={settings} />
      )}
    </div>
  );
}
