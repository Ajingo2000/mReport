import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Upload, MapPin, AlertTriangle } from 'lucide-react';
import { useCreateReport } from '@/hooks';
import { useToast } from '@/hooks/use-toast';
import { CreateReportRequest } from '@/types/api';

interface CreateReportModalProps {
  trigger?: React.ReactNode;
}

const CreateReportModal: React.FC<CreateReportModalProps> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateReportRequest>>({
    title: '',
    description: '',
    type: 'srhr' as const,
    subtype: '',
    latitude: 0,
    longitude: 0,
    address: '',
    priority: 'medium',
  });
  const [images, setImages] = useState<File[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);

  const createReportMutation = useCreateReport();
  const { toast } = useToast();

  const reportTypes: Record<string, string[]> = {
    srhr: [
      'Maternal Health Emergency',
      'Contraceptive Access Issue',
      'HIV/STI Services',
      'Family Planning',
      'Adolescent Sexual Health',
      'Other SRHR'
    ],
    gbv: [
      'Physical Violence',
      'Sexual Violence',
      'Emotional/Psychological Abuse',
      'Economic Violence',
      'FGM',
      'Child/Early Marriage',
      'Help & Support Request',
      'Other GBV'
    ],
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Reset subtype when type changes
    if (field === 'type') {
      setFormData(prev => ({ ...prev, subtype: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude,
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        }));
        setLocationLoading(false);
        toast({
          title: "Location captured",
          description: "Your current location has been added to the report.",
        });
      },
      (error) => {
        setLocationLoading(false);
        toast({
          title: "Location Error",
          description: "Failed to get your current location. Please enter manually.",
          variant: "destructive",
        });
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.type || !formData.subtype) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.latitude === 0 && formData.longitude === 0) {
      toast({
        title: "Location Required",
        description: "Please provide a location for the report.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createReportMutation.mutateAsync({
        ...formData as CreateReportRequest,
        images,
      });

      toast({
        title: "Report Created",
        description: "Your report has been submitted successfully.",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'Infrastructure',
        subtype: '',
        latitude: 0,
        longitude: 0,
        address: '',
        priority: 'medium',
      });
      setImages([]);
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Create New Report
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Report Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Brief title for the issue"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of the issue"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Report Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(reportTypes).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subtype">Subtype *</Label>
                <Select
                  value={formData.subtype}
                  onValueChange={(value) => handleInputChange('subtype', value)}
                  disabled={!formData.type}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subtype" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.type && reportTypes[formData.type as keyof typeof reportTypes]?.map((subtype) => (
                      <SelectItem key={subtype} value={subtype}>
                        {subtype}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-medium">Location Information</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {locationLoading ? 'Getting Location...' : 'Use Current Location'}
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Street address or description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value) || 0)}
                      placeholder="0.000000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value) || 0)}
                      placeholder="0.000000"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <div>
            <Label>Images (Optional)</Label>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center justify-center px-4 py-2 border border-dashed border-muted-foreground rounded-lg cursor-pointer hover:bg-muted/50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Images ({images.length}/5)
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createReportMutation.isPending}
            >
              {createReportMutation.isPending ? 'Creating...' : 'Create Report'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReportModal;