
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type NewsArticle = Tables<'news'>;

interface NewsTableProps {
  news: NewsArticle[];
  onEdit: (article: NewsArticle) => void;
  onDelete: (id: string) => void;
}

const NewsTable = ({ news, onEdit, onDelete }: NewsTableProps) => {
  if (!news || news.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">No news articles</h3>
        <p className="text-slate-600">Create your first news article to get started.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Published</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {news.map((article) => (
          <TableRow key={article.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                {article.featured_image_url ? (
                  <img 
                    src={article.featured_image_url} 
                    alt={article.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center">
                    <FileText className="w-6 h-6 text-slate-500" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-900">{article.title}</p>
                  {article.excerpt && (
                    <p className="text-sm text-slate-500 truncate max-w-xs">{article.excerpt}</p>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={article.is_published ? 'default' : 'secondary'}>
                {article.is_published ? 'Published' : 'Draft'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                {article.published_at 
                  ? format(new Date(article.published_at), 'MMM dd, yyyy')
                  : 'Not published'
                }
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm text-slate-600">
                {format(new Date(article.created_at), 'MMM dd, yyyy')}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(article)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete News Article</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{article.title}"? 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(article.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default NewsTable;
