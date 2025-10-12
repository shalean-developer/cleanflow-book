import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminServicesPricing } from "./AdminServicesPricing";
import { AdminExtrasPricing } from "./AdminExtrasPricing";
import { AdminFrequencyDiscounts } from "./AdminFrequencyDiscounts";

export function AdminPricingManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Management</CardTitle>
        <CardDescription>Configure service prices, extras, and discount rates</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="extras">Extras</TabsTrigger>
            <TabsTrigger value="discounts">Frequency Discounts</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <AdminServicesPricing />
          </TabsContent>

          <TabsContent value="extras">
            <AdminExtrasPricing />
          </TabsContent>

          <TabsContent value="discounts">
            <AdminFrequencyDiscounts />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

