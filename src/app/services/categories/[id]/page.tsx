"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit2, ArrowLeft, Trash2 } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ServiceCategoryDialog } from "@/components/services/service-category-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  services: Service[];
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function ServiceCategoryDetailsPage({ params }: PageProps) {
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/services/categories/${params.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/services/categories");
          return;
        }
        throw new Error("Failed to fetch category");
      }
      const data = await response.json();
      setCategory(data);
    } catch (error) {
      console.error("Error fetching category:", error);
      toast({
        title: "Error",
        description: "Failed to load category details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [params.id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/services/categories/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete category");
      }

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });

      router.push("/services/categories");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <PageLayout
        title="Category Details"
        description="Loading category details..."
        backButton
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-5 w-2/3" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2 mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <PageLayout
      title="Category Details"
      description="View and manage category details"
      backButton
      actions={
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Category
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Category
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Category Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <CardTitle>{category.name}</CardTitle>
              {category.color && (
                <div
                  className="h-6 w-6 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              )}
            </div>
            {category.description && (
              <CardDescription>{category.description}</CardDescription>
            )}
          </CardHeader>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle>Services in this Category</CardTitle>
          </CardHeader>
          <CardContent>
            {category.services && category.services.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.services.map((service) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      {service.description && (
                        <CardDescription>{service.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm">
                        <p>Duration: {service.duration} minutes</p>
                        <p>Price: ${service.price}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No services in this category yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <ServiceCategoryDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        categoryId={params.id}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
} 