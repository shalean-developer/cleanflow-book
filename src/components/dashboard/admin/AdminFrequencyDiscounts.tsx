import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Default frequency discounts from pricing.ts
const DEFAULT_DISCOUNTS = {
  'one-time': 0,
  'weekly': 15,
  'bi-weekly': 10,
  'monthly': 5,
};

export function AdminFrequencyDiscounts() {
  const { toast } = useToast();
  const [discounts, setDiscounts] = useState(DEFAULT_DISCOUNTS);

  const handleSave = () => {
    // For now, this is informational only
    // To make these truly dynamic, you'd need to:
    // 1. Create a frequency_discounts table in the database
    // 2. Update the pricing calculation to read from the database
    // 3. Implement the actual save functionality
    
    toast({
      title: "Information",
      description: "Frequency discount changes require code deployment to take effect. These are currently configured in the application code.",
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Frequency Discount Configuration</h3>
        <p className="text-sm text-gray-600 mb-4">
          Configure discount percentages for recurring booking frequencies.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Discount Rates</CardTitle>
          <CardDescription>
            These discounts are applied to the subtotal based on booking frequency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="one-time">One-Time Booking (%)</Label>
              <Input
                id="one-time"
                type="number"
                step="1"
                min="0"
                max="100"
                value={discounts['one-time']}
                onChange={(e) => setDiscounts({ ...discounts, 'one-time': parseFloat(e.target.value) || 0 })}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">No discount for one-time bookings</p>
            </div>

            <div>
              <Label htmlFor="weekly">Weekly Frequency (%)</Label>
              <Input
                id="weekly"
                type="number"
                step="1"
                min="0"
                max="100"
                value={discounts['weekly']}
                onChange={(e) => setDiscounts({ ...discounts, 'weekly': parseFloat(e.target.value) || 0 })}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Current: {discounts['weekly']}% discount</p>
            </div>

            <div>
              <Label htmlFor="bi-weekly">Bi-Weekly Frequency (%)</Label>
              <Input
                id="bi-weekly"
                type="number"
                step="1"
                min="0"
                max="100"
                value={discounts['bi-weekly']}
                onChange={(e) => setDiscounts({ ...discounts, 'bi-weekly': parseFloat(e.target.value) || 0 })}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Current: {discounts['bi-weekly']}% discount</p>
            </div>

            <div>
              <Label htmlFor="monthly">Monthly Frequency (%)</Label>
              <Input
                id="monthly"
                type="number"
                step="1"
                min="0"
                max="100"
                value={discounts['monthly']}
                onChange={(e) => setDiscounts({ ...discounts, 'monthly': parseFloat(e.target.value) || 0 })}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Current: {discounts['monthly']}% discount</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <h4 className="font-semibold text-sm mb-2">Implementation Note</h4>
              <p className="text-sm text-gray-700">
                Frequency discounts are currently hardcoded in the application for consistency and performance. 
                To make these fully editable:
              </p>
              <ol className="text-sm text-gray-700 list-decimal list-inside mt-2 space-y-1">
                <li>Create a database table for frequency discounts</li>
                <li>Update the pricing calculation logic to read from the database</li>
                <li>Implement proper caching for performance</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="font-semibold text-sm mb-2">How Discounts Are Applied</h4>
        <ol className="text-sm text-gray-700 space-y-2">
          <li><strong>Step 1:</strong> Calculate subtotal (base + rooms + extras)</li>
          <li><strong>Step 2:</strong> Apply frequency discount to subtotal</li>
          <li><strong>Step 3:</strong> Apply any promo code discount</li>
          <li><strong>Step 4:</strong> Add service fee to final amount</li>
        </ol>
      </div>
    </div>
  );
}

