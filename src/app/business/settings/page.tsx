import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { prisma } from "@/lib/prisma";
import BusinessHoursForm from "@/components/business/BusinessHoursForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/components/layout/page-layout";

export const metadata: Metadata = {
  title: "Business Settings",
  description: "Manage your business settings",
};

async function getBusinessHours(businessId: string) {
  const hours = await prisma.businessHours.findMany({
    where: { businessId },
    orderBy: { dayOfWeek: 'asc' },
  });

  return hours.map(hour => ({
    day: hour.dayOfWeek,
    isOpen: !hour.isClosed,
    start: hour.startTime,
    end: hour.endTime,
  }));
}

export default async function BusinessSettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return null;
  }

  const businessHours = await getBusinessHours(session.user.id);

  return (
    <PageLayout
      title="Business Settings"
      description="Manage your business hours and other settings"
    >
      <Tabs defaultValue="hours" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hours">Business Hours</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hours" className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <h2 className="text-xl font-semibold tracking-tight">
                Business Hours
              </h2>
              <p className="text-muted-foreground">
                Set your regular business hours for each day of the week.
              </p>
            </div>
            <BusinessHoursForm
              initialData={{
                hours: businessHours
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <h2 className="text-xl font-semibold tracking-tight">
                Notification Settings
              </h2>
              <p className="text-muted-foreground">
                Configure how and when you receive notifications.
              </p>
            </div>
            {/* Add notification settings form here */}
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <h2 className="text-xl font-semibold tracking-tight">
                Security Settings
              </h2>
              <p className="text-muted-foreground">
                Manage your security preferences and access controls.
              </p>
            </div>
            {/* Add security settings form here */}
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
} 