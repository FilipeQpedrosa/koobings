"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { ServiceCategoryList } from "@/components/services/service-category-list";
import { ServiceCategoryDialog } from "@/components/services/service-category-dialog";

export default function ServiceCategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <PageLayout
      title="Service Categories"
      description="Manage your service categories"
      actions={
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      }
    >
      <ServiceCategoryList />
      <ServiceCategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </PageLayout>
  );
} 