
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const RichTextEditor = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "Enter content...", 
  required = false,
  error 
}: RichTextEditorProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block',
    'link', 'image'
  ];

  if (!mounted) {
    return (
      <div className="space-y-2">
        {label && (
          <Label>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        <div className="h-32 bg-gray-100 rounded-md animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div className="prose-editor">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{ minHeight: '200px' }}
        />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default RichTextEditor;
