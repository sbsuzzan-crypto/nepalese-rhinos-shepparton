import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, FileImage, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  maxSize?: number;
  existingUrl?: string;
  fileType?: 'image' | 'document' | 'any';
}

const FileUpload = ({ 
  onUpload, 
  accept = "image/*", 
  maxSize = 5 * 1024 * 1024, // 5MB default
  existingUrl,
  fileType = 'any'
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(existingUrl || null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setFileName(file.name);

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
      return;
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Organize files by type
      let folderPath = '';
      if (fileType === 'image' || file.type.startsWith('image/')) {
        folderPath = 'images/';
      } else if (fileType === 'document' || file.type.includes('pdf') || file.type.includes('document')) {
        folderPath = 'documents/';
      } else {
        folderPath = 'uploads/';
      }
      
      const filePath = `${folderPath}${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('rhinos-media')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('rhinos-media')
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
    setFileName('');
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      // Create a proper FileList object and trigger the file select handler
      const fileInput = fileInputRef.current;
      if (fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        // Create a proper change event
        const changeEvent = new Event('change', { bubbles: true });
        Object.defineProperty(changeEvent, 'target', {
          writable: false,
          value: fileInput
        });
        fileInput.dispatchEvent(changeEvent);
      }
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
        {(preview || fileName) && (
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

      {preview && fileType !== 'document' && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="max-w-xs max-h-48 object-cover rounded-lg border"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-white text-sm">Uploading...</div>
            </div>
          )}
        </div>
      )}

      {fileName && !preview && (
        <div className="flex items-center gap-2 p-4 border rounded-lg">
          <File className="h-8 w-8 text-gray-400" />
          <span className="text-sm text-gray-600">{fileName}</span>
          {uploading && (
            <div className="text-sm text-blue-600">Uploading...</div>
          )}
        </div>
      )}

      {!preview && !fileName && !uploading && (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
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
