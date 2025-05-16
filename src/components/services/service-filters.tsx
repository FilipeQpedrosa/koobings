"use client";

import { useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useServiceFilters, type ServiceFiltersState } from "@/hooks/useServiceFilters";

interface ServiceFiltersProps {
  onFiltersChange: (filters: ServiceFiltersState) => void;
  initialFilters?: Partial<ServiceFiltersState>;
  disabled?: boolean;
}

export function ServiceFilters({
  onFiltersChange,
  initialFilters,
  disabled = false,
}: ServiceFiltersProps) {
  const {
    filters,
    debouncedSearch,
    updateSearch,
    updateSort,
    updatePriceRange,
    updateDuration,
    resetFilters,
  } = useServiceFilters(initialFilters);

  // Notify parent component when filters change
  useEffect(() => {
    onFiltersChange(filters);
  }, [debouncedSearch, filters.sort, filters.priceRange, filters.duration]);

  const activeFilterCount = [
    filters.search,
    filters.priceRange.min > 0 || filters.priceRange.max < Infinity,
    filters.duration !== null,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            className="pl-8"
            value={filters.search}
            onChange={(e) => updateSearch(e.target.value)}
            disabled={disabled}
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 h-5 w-5 p-0"
              onClick={() => updateSearch("")}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        <Select
          value={filters.sort}
          onValueChange={(value) => updateSort(value as ServiceFiltersState['sort'])}
          disabled={disabled}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="duration">Duration</SelectItem>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative" disabled={disabled}>
              <SlidersHorizontal className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
              <span className="sr-only">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center justify-between">
              Filters
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={resetFilters}
                  disabled={disabled}
                >
                  Reset all
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-2">
              <p className="mb-2 text-sm font-medium">Price Range</p>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  className="w-20"
                  value={filters.priceRange.min || ""}
                  onChange={(e) =>
                    updatePriceRange({
                      ...filters.priceRange,
                      min: Number(e.target.value) || 0,
                    })
                  }
                  disabled={disabled}
                />
                <span>to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  className="w-20"
                  value={
                    filters.priceRange.max === Infinity
                      ? ""
                      : filters.priceRange.max
                  }
                  onChange={(e) =>
                    updatePriceRange({
                      ...filters.priceRange,
                      max: Number(e.target.value) || Infinity,
                    })
                  }
                  disabled={disabled}
                />
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Duration (minutes)</DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={() => updateDuration(30)}
              disabled={disabled}
            >
              30 minutes {filters.duration === 30 && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => updateDuration(60)}
              disabled={disabled}
            >
              1 hour {filters.duration === 60 && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => updateDuration(90)}
              disabled={disabled}
            >
              1.5 hours {filters.duration === 90 && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => updateDuration(120)}
              disabled={disabled}
            >
              2 hours {filters.duration === 120 && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => updateDuration(null)}
              disabled={disabled}
            >
              Any duration {filters.duration === null && "✓"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {filters.search}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto -mr-2 p-0"
                onClick={() => updateSearch("")}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove search filter</span>
              </Button>
            </Badge>
          )}
          {(filters.priceRange.min > 0 || filters.priceRange.max < Infinity) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Price: ${filters.priceRange.min} - $
              {filters.priceRange.max === Infinity
                ? "∞"
                : filters.priceRange.max}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto -mr-2 p-0"
                onClick={() =>
                  updatePriceRange({ min: 0, max: Infinity })
                }
                disabled={disabled}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove price filter</span>
              </Button>
            </Badge>
          )}
          {filters.duration !== null && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Duration: {filters.duration} minutes
              <Button
                variant="ghost"
                size="sm"
                className="h-auto -mr-2 p-0"
                onClick={() => updateDuration(null)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove duration filter</span>
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
} 