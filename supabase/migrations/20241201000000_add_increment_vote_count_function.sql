
-- Create function to increment vote count for poll options
CREATE OR REPLACE FUNCTION increment_vote_count(option_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.poll_options 
  SET votes_count = votes_count + 1 
  WHERE id = option_id;
END;
$$;
