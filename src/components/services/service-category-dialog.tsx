"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HexColorPicker } from "react-colorful";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
});

type FormValues = z.infer<typeof formSchema>;

interface ServiceCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId?: string;
}

export function ServiceCategoryDialog({
  open,
  onOpenChange,
  categoryId,
}: ServiceCategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#6366f1", // Default indigo color
    },
  });

  // Fetch category data if editing
  const fetchCategoryData = async (id: string) => {
    try {
      const response = await fetch(`/api/services/categories/${id}`);
      if (!response.ok) throw new Error("Failed to fetch category");
      const data = await response.json();
      
      form.reset({
        name: data.name,
        description: data.description || "",
        color: data.color || "#6366f1",
      });
    } catch (error) {
      console.error("Error fetching category:", error);
      toast({
        title: "Error",
        description: "Failed to load category data",
        variant: "destructive",
      });
      onOpenChange(false);
    }
  };

  // Fetch category data on mount if editing
  useEffect(() => {
    if (categoryId) {
      fetchCategoryData(categoryId);
    }
  }, [categoryId]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const url = categoryId
        ? `/api/services/categories/${categoryId}`
        : "/api/services/categories";
      
      const response = await fetch(url, {
        method: categoryId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to save category");

      toast({
        title: "Success",
        description: `Category ${categoryId ? "updated" : "created"} successfully`,
      });

      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {categoryId ? "Edit Category" : "Create Category"}
          </DialogTitle>
          <DialogDescription>
            {categoryId
              ? "Edit your service category details below"
              : "Add a new service category to organize your services"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the category"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Popover
                        open={isColorPickerOpen}
                        onOpenChange={setIsColorPickerOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-[100px] h-[35px] p-0"
                            style={{
                              backgroundColor: field.value,
                              border: "2px solid white",
                            }}
                          >
                            <span className="sr-only">Pick a color</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <HexColorPicker
                            color={field.value}
                            onChange={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="#000000"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Saving..." : categoryId ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 