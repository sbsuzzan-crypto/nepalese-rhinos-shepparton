
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Send, User } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Comment {
  id: string;
  author_name: string;
  author_email: string;
  content: string;
  created_at: string;
  parent_id?: string;
}

interface NewsCommentsProps {
  newsId: string;
}

const NewsComments = ({ newsId }: NewsCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['news-comments', newsId],
    queryFn: async () => {
      console.log('Fetching comments for news:', newsId);
      const { data, error } = await supabase
        .from('news_comments')
        .select('*')
        .eq('news_id', newsId)
        .eq('is_approved', true)
        .eq('is_published', true)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching comments:', error);
        throw error;
      }
      
      console.log('Comments fetched successfully:', data);
      return data as Comment[];
    },
  });

  const submitCommentMutation = useMutation({
    mutationFn: async (commentData: {
      content: string;
      author_name: string;
      author_email: string;
      parent_id?: string;
    }) => {
      const { error } = await supabase
        .from('news_comments')
        .insert({
          news_id: newsId,
          ...commentData,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-comments', newsId] });
      setNewComment("");
      setAuthorName("");
      setAuthorEmail("");
      setReplyToId(null);
      toast.success("Comment submitted successfully! It will be reviewed before publishing.");
    },
    onError: (error) => {
      console.error('Error submitting comment:', error);
      toast.error("Failed to submit comment. Please try again.");
    },
  });

  const handleSubmitComment = () => {
    if (!newComment.trim() || !authorName.trim() || !authorEmail.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    submitCommentMutation.mutate({
      content: newComment,
      author_name: authorName,
      author_email: authorEmail,
      parent_id: replyToId,
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  // Group comments by parent/child relationship
  const rootComments = comments?.filter(comment => !comment.parent_id) || [];
  const childComments = comments?.filter(comment => comment.parent_id) || [];

  const getChildComments = (parentId: string) => {
    return childComments.filter(comment => comment.parent_id === parentId);
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-rhino-blue" />
        <h3 className="text-xl font-semibold text-rhino-blue">
          Comments ({comments?.length || 0})
        </h3>
      </div>

      {/* Comment Form */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold text-rhino-blue mb-4">Leave a Comment</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Your name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Your email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
              />
            </div>
            <Textarea
              placeholder={replyToId ? "Write your reply..." : "Write your comment..."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
            />
            <div className="flex justify-between items-center">
              {replyToId && (
                <Button
                  variant="ghost"
                  onClick={() => setReplyToId(null)}
                  className="text-rhino-gray"
                >
                  Cancel Reply
                </Button>
              )}
              <Button
                onClick={handleSubmitComment}
                disabled={submitCommentMutation.isPending}
                className="bg-rhino-blue hover:bg-blue-700 ml-auto"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-rhino-gray">Loading comments...</p>
        </div>
      ) : rootComments.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 text-rhino-gray mx-auto mb-4" />
          <p className="text-rhino-gray">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rootComments.map((comment) => (
            <Card key={comment.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="bg-rhino-blue/10 p-2 rounded-full">
                    <User className="h-4 w-4 text-rhino-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-rhino-blue">{comment.author_name}</span>
                      <span className="text-sm text-rhino-gray">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-rhino-gray mb-3">{comment.content}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyToId(comment.id)}
                      className="text-rhino-red hover:text-red-700"
                    >
                      Reply
                    </Button>
                  </div>
                </div>

                {/* Child Comments */}
                {getChildComments(comment.id).map((childComment) => (
                  <div key={childComment.id} className="ml-12 mt-4 pl-4 border-l-2 border-rhino-gray/20">
                    <div className="flex items-start gap-3">
                      <div className="bg-rhino-red/10 p-2 rounded-full">
                        <User className="h-3 w-3 text-rhino-red" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-rhino-blue text-sm">
                            {childComment.author_name}
                          </span>
                          <span className="text-xs text-rhino-gray">
                            {formatDate(childComment.created_at)}
                          </span>
                        </div>
                        <p className="text-rhino-gray text-sm">{childComment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsComments;
