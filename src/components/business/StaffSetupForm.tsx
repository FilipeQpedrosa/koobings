'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { StaffRole } from '@prisma/client';

interface StaffMember {
  name: string;
  email: string;
  role: StaffRole;
}

const DEFAULT_STAFF: StaffMember = {
  name: '',
  email: '',
  role: StaffRole.ADMIN,
};

export default function StaffSetupForm() {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>([{ ...DEFAULT_STAFF }]);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddStaff = () => {
    setStaff([...staff, { ...DEFAULT_STAFF }]);
  };

  const handleRemoveStaff = (index: number) => {
    setStaff(staff.filter((_, i) => i !== index));
  };

  const handleStaffChange = (index: number, field: keyof StaffMember, value: string) => {
    const newStaff = [...staff];
    newStaff[index] = {
      ...newStaff[index],
      [field]: value,
    };
    setStaff(newStaff);
  };

  const handleSave = async () => {
    if (staff.some(member => !member.name || !member.email)) {
      toast({
        title: 'Error',
        description: 'Please fill in all staff member details',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/business/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ staff }),
      });

      if (!response.ok) {
        throw new Error('Failed to save staff members');
      }

      toast({
        title: 'Success',
        description: 'Staff members saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save staff members',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">
        Add your staff members. They will receive an email invitation to join.
      </div>

      <div className="space-y-4">
        {staff.map((member, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Staff Member {index + 1}</h3>
              {staff.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveStaff(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor={`name-${index}`}>Full Name</Label>
                <Input
                  id={`name-${index}`}
                  value={member.name}
                  onChange={(e) => handleStaffChange(index, 'name', e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor={`email-${index}`}>Email</Label>
                <Input
                  id={`email-${index}`}
                  type="email"
                  value={member.email}
                  onChange={(e) => handleStaffChange(index, 'email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label htmlFor={`role-${index}`}>Role</Label>
                <Select
                  value={member.role}
                  onValueChange={(value) => handleStaffChange(index, 'role', value as StaffRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={StaffRole.ADMIN}>Administrator</SelectItem>
                    <SelectItem value={StaffRole.ADMIN}>Staff Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={handleAddStaff}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Staff Member
        </Button>
      </div>
    </div>
  );
} 