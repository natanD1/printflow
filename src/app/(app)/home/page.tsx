import { BillingIndicator } from "@/components/billing-indicator";
import { TotalFilamentIndicator } from "@/components/total-filament-indicator";
import { TotalHourPrintIndicator } from "@/components/total-hour-print-indicator";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <BillingIndicator value={0} />
        <TotalHourPrintIndicator hours={0} />
        <TotalFilamentIndicator grams={0} />
      </div>
    </main>
  );
}
