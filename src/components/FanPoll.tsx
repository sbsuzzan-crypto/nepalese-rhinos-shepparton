import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Vote, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Poll {
  id: string;
  title: string;
  description?: string;
  expires_at?: string;
  multiple_choice: boolean;
}

interface PollOption {
  id: string;
  option_text: string;
  votes_count: number;
}

interface PollVote {
  option_id: string;
}

const FanPoll = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const queryClient = useQueryClient();

  const { data: polls, isLoading: pollsLoading } = useQuery({
    queryKey: ['active-polls'],
    queryFn: async () => {
      console.log('Fetching active polls...');
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .eq('is_active', true)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error fetching polls:', error);
        throw error;
      }
      
      console.log('Polls fetched successfully:', data);
      return data as Poll[];
    },
  });

  const currentPoll = polls?.[0];

  const { data: pollOptions, isLoading: optionsLoading } = useQuery({
    queryKey: ['poll-options', currentPoll?.id],
    queryFn: async () => {
      if (!currentPoll?.id) return [];
      
      console.log('Fetching poll options for:', currentPoll.id);
      const { data, error } = await supabase
        .from('poll_options')
        .select('*')
        .eq('poll_id', currentPoll.id)
        .order('option_text', { ascending: true });
      
      if (error) {
        console.error('Error fetching poll options:', error);
        throw error;
      }
      
      console.log('Poll options fetched successfully:', data);
      return data as PollOption[];
    },
    enabled: !!currentPoll?.id,
  });

  const { data: userVotes } = useQuery({
    queryKey: ['user-poll-votes', currentPoll?.id],
    queryFn: async () => {
      if (!currentPoll?.id) return [];
      
      const { data, error } = await supabase
        .from('poll_votes')
        .select('option_id')
        .eq('poll_id', currentPoll.id);
      
      if (error) {
        console.error('Error fetching user votes:', error);
        return [];
      }
      
      return data as PollVote[];
    },
    enabled: !!currentPoll?.id,
  });

  const voteMutation = useMutation({
    mutationFn: async (optionIds: string[]) => {
      if (!currentPoll?.id) throw new Error('No poll selected');
      
      const votes = optionIds.map(optionId => ({
        poll_id: currentPoll.id,
        option_id: optionId,
        voter_ip: 'anonymous',
      }));

      const { error } = await supabase
        .from('poll_votes')
        .insert(votes);
      
      if (error) throw error;

      // Update vote counts manually since we can't use the RPC function
      for (const optionId of optionIds) {
        const { data: currentOption } = await supabase
          .from('poll_options')
          .select('votes_count')
          .eq('id', optionId)
          .single();
        
        if (currentOption) {
          await supabase
            .from('poll_options')
            .update({ votes_count: currentOption.votes_count + 1 })
            .eq('id', optionId);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['poll-options', currentPoll?.id] });
      queryClient.invalidateQueries({ queryKey: ['user-poll-votes', currentPoll?.id] });
      setHasVoted(true);
      setSelectedOptions([]);
      toast.success("Vote submitted successfully!");
    },
    onError: (error) => {
      console.error('Error submitting vote:', error);
      toast.error("Failed to submit vote. You may have already voted.");
    },
  });

  const handleOptionToggle = (optionId: string) => {
    if (!currentPoll?.multiple_choice) {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  const handleSubmitVote = () => {
    if (selectedOptions.length === 0) {
      toast.error("Please select an option");
      return;
    }
    
    voteMutation.mutate(selectedOptions);
  };

  const getTotalVotes = () => {
    return pollOptions?.reduce((total, option) => total + option.votes_count, 0) || 0;
  };

  const getVotePercentage = (votes: number) => {
    const total = getTotalVotes();
    return total === 0 ? 0 : Math.round((votes / total) * 100);
  };

  const isExpired = () => {
    if (!currentPoll?.expires_at) return false;
    return new Date(currentPoll.expires_at) < new Date();
  };

  const hasUserVoted = userVotes && userVotes.length > 0;

  if (pollsLoading || optionsLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentPoll) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <Vote className="h-12 w-12 text-rhino-gray mx-auto mb-4" />
          <p className="text-rhino-gray">No active polls at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  const showResults = hasUserVoted || hasVoted || isExpired();

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-rhino-blue to-blue-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Fan Poll
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <h3 className="text-xl font-bold text-rhino-blue mb-3">
          {currentPoll.title}
        </h3>
        
        {currentPoll.description && (
          <p className="text-rhino-gray mb-4 leading-relaxed">{currentPoll.description}</p>
        )}

        {currentPoll.expires_at && (
          <div className="flex items-center gap-2 text-sm text-rhino-gray mb-6 bg-gray-50 p-3 rounded-lg">
            <Clock className="h-4 w-4" />
            <span>
              {isExpired() 
                ? 'Poll has ended' 
                : `Ends ${format(new Date(currentPoll.expires_at), "MMM dd, yyyy 'at' h:mm a")}`
              }
            </span>
          </div>
        )}

        <div className="space-y-4">
          {pollOptions?.map((option) => (
            <div key={option.id} className="space-y-2">
              {showResults ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-rhino-blue font-semibold">{option.option_text}</span>
                    <span className="text-sm text-rhino-gray font-medium">
                      {option.votes_count} votes ({getVotePercentage(option.votes_count)}%)
                    </span>
                  </div>
                  <Progress 
                    value={getVotePercentage(option.votes_count)} 
                    className="h-3"
                  />
                </div>
              ) : (
                <button
                  onClick={() => handleOptionToggle(option.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedOptions.includes(option.id)
                      ? 'border-rhino-blue bg-rhino-blue/10 text-rhino-blue shadow-md'
                      : 'border-gray-200 hover:border-rhino-blue/50 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{option.option_text}</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {showResults ? (
          <div className="mt-6 text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-rhino-gray font-medium">
              Total votes: <span className="text-rhino-blue font-bold">{getTotalVotes()}</span>
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {currentPoll.multiple_choice && (
              <p className="text-sm text-rhino-gray bg-blue-50 p-3 rounded-lg">
                💡 You can select multiple options
              </p>
            )}
            <Button
              onClick={handleSubmitVote}
              disabled={voteMutation.isPending || selectedOptions.length === 0}
              className="w-full bg-rhino-blue hover:bg-blue-700 text-white font-semibold py-3"
            >
              <Vote className="h-4 w-4 mr-2" />
              {voteMutation.isPending ? "Submitting..." : "Submit Vote"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FanPoll;
