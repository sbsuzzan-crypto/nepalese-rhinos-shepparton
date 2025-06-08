
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Tables } from '@/integrations/supabase/types';

type Team = Tables<'teams'>;

interface TeamsStatsProps {
  teams: Team[] | undefined;
}

export const TeamsStats = ({ teams }: TeamsStatsProps) => {
  const activeTeams = teams?.filter(t => t.is_active) || [];
  const inactiveTeams = teams?.filter(t => !t.is_active) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Active Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{activeTeams.length}</div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Inactive Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">{inactiveTeams.length}</div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Total Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{teams?.length || 0}</div>
        </CardContent>
      </Card>
    </div>
  );
};
