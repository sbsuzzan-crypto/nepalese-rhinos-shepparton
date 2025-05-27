
import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, FileImage } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  maxSize?: number;
  existingUrl?: string;
}

const FileUpload = ({ 
  onUpload, 
  accept = "image/*", 
  maxSize = 5 * 1024 * 1024, // 5MB default
  existingUrl 
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(existingUrl || null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('club-media')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('club-media')
        .getPublicUrl(filePath);

      onUpload(data.publicUrl);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || 'Upload failed');
      toast({
        title: "Error",
        description: error.message || 'Upload failed',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label htmlFor="file-upload">Upload File</Label>
          <Input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={uploading}
            className="mt-1"
          />
        </div>
        {preview && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
            Remove
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {preview && (
        <div className="relative inline-block">
          {accept.includes('image') ? (
            <img
              src={preview}
              alt="Preview"
              className="max-w-xs max-h-48 object-cover rounded-lg border"
            />
          ) : (
            <div className="flex items-center gap-2 p-4 border rounded-lg">
              <FileImage className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-600">File selected</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-white text-sm">Uploading...</div>
            </div>
          )}
        </div>
      )}

      {!preview && !uploading && (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500">
            Max size: {Math.round(maxSize / (1024 * 1024))}MB
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
