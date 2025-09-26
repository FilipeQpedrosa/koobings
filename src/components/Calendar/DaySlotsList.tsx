"use client";

import React from 'react';
import { Clock, Users, UserCheck, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  serviceName: string;
  staffName: string;
  capacity: number;
  booked: number;
  available: boolean;
  serviceId: string;
  price: number;
  duration: number;
}

interface DaySlotsListProps {
  selectedDate: string;
  slots: Slot[];
  businessSlug: string;
  onSlotSelect?: (slot: Slot) => void;
}

export default function DaySlotsList({ 
  selectedDate, 
  slots, 
  businessSlug, 
  onSlotSelect 
}: DaySlotsListProps) {
  const { user } = useAuth();
  const router = useRouter();
  const isStaff = user?.role === 'STAFF' || user?.role === 'BUSINESS_OWNER' || user?.isAdmin;

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isSlotTimePassed = (slot: Slot) => {
    if (!selectedDate) return false;
    const slotDateTime = new Date(`${selectedDate}T${slot.startTime}:00`);
    const now = new Date();
    return now >= slotDateTime;
  };

  const handleSlotClick = (slot: Slot) => {
    if (isStaff) {
      // Staff: Navigate to slot details page
      router.push(`/${businessSlug}/slots/${slot.id}/${selectedDate}`);
    } else {
      // Client: Check if slot time has passed
      if (isSlotTimePassed(slot)) {
        alert('Este horário já passou e não está mais disponível para inscrição.');
        return;
      }
      
      // Client: Call onSlotSelect for direct enrollment
      if (onSlotSelect) {
        onSlotSelect(slot);
      }
    }
  };

  if (!selectedDate) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl mx-auto">
        <div className="text-center text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Selecione um dia no calendário</p>
          <p className="text-sm">para ver os horários disponíveis</p>
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl mx-auto">
        <div className="text-center text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold mb-2">
            {formatDate(selectedDate)}
          </h3>
          <p className="text-sm">Nenhum horário disponível para este dia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {formatDate(selectedDate)}
        </h3>
        <p className="text-gray-600">
          {slots.length} horário{slots.length !== 1 ? 's' : ''} disponível{slots.length !== 1 ? 'is' : ''}
        </p>
      </div>

      <div className="space-y-3">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`
              border rounded-lg p-4 transition-all duration-200 cursor-pointer
              ${slot.available 
                ? 'border-green-200 bg-green-50 hover:bg-green-100 hover:shadow-md' 
                : 'border-red-200 bg-red-50 opacity-75'
              }
            `}
            onClick={() => handleSlotClick(slot)}
          >
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              {/* Time and Status Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-base font-bold text-gray-900">
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </span>
                </div>
                <div className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${slot.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                  }
                `}>
                  {slot.available ? 'Disponível' : 'Lotado'}
                </div>
              </div>

              {/* Service Name */}
              <div className="mb-2">
                <span className="text-sm font-semibold text-gray-800">
                  {slot.serviceName}
                </span>
              </div>

              {/* Details Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{slot.booked}/{slot.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    <span className="truncate max-w-[80px]">{slot.staffName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">€{slot.price}</span>
                    <span className="text-gray-500">•</span>
                    <span>{slot.duration}min</span>
                  </div>
                </div>
              </div>

              {/* Action Button - Full Width on Mobile */}
              <div className="w-full">
                {isStaff ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSlotClick(slot);
                    }}
                  >
                    Ver Detalhes
                  </Button>
                ) : (
                  slot.available && (
                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSlotClick(slot);
                      }}
                    >
                      Inscrever-se
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              {/* Left side - Time and Service Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-lg font-bold text-gray-900">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>
                  </div>
                  <div className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${slot.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                    }
                  `}>
                    {slot.available ? 'Disponível' : 'Lotado'}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-gray-800">
                      {slot.serviceName}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{slot.booked}/{slot.capacity} pessoas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserCheck className="h-4 w-4" />
                      <span>{slot.staffName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">€{slot.price}</span>
                      <span className="text-gray-500">•</span>
                      <span>{slot.duration}min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Action Button */}
              <div className="ml-4">
                {isStaff ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSlotClick(slot);
                    }}
                  >
                    Ver Detalhes
                  </Button>
                ) : (
                  slot.available && (
                    <>
                      {isSlotTimePassed(slot) ? (
                        <div className="text-center">
                          <div className="text-xs text-red-500 font-medium mb-1">
                            Horário Passado
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            className="border-red-200 text-red-400 cursor-not-allowed"
                          >
                            Indisponível
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSlotClick(slot);
                          }}
                        >
                          Inscrever-se
                        </Button>
                      )}
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
