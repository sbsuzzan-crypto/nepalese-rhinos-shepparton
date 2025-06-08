
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Users, Edit, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Team = Tables<'teams'> & {
  players?: { count: number }[];
};

interface TeamsTableProps {
  teams: Team[] | undefined;
  isLoading: boolean;
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
}

export const TeamsTable = ({ teams, isLoading, onEdit, onDelete }: TeamsTableProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Teams
          </CardTitle>
          <CardDescription>
            Manage all club teams and squads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-rhino-red border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Loading teams...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Teams
          </CardTitle>
          <CardDescription>
            Manage all club teams and squads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No teams found</h3>
            <p className="text-slate-600">No teams match your search criteria.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Teams
        </CardTitle>
        <CardDescription>
          Manage all club teams and squads
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Team Name</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Players</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead className="hidden xl:table-cell">Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">{team.name}</p>
                      {team.description && (
                        <p className="text-sm text-slate-500 line-clamp-2 mt-1">{team.description}</p>
                      )}
                      {/* Show category on mobile */}
                      <div className="sm:hidden mt-1">
                        {team.category && (
                          <Badge variant="outline" className="text-xs">{team.category}</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {team.category && (
                      <Badge variant="outline">{team.category}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium">
                        {team.players?.[0]?.count || 0} players
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant={team.is_active ? 'default' : 'secondary'}>
                      {team.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {team.created_at ? format(new Date(team.created_at), 'MMM dd, yyyy') : 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(team)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => onDelete(team)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
