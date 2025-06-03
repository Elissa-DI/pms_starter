
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { User } from '@/lib/types';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const UserDialog = ({ open, onOpenChange, user }: UserDialogProps) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
            <div className="bg-muted/50 p-3 rounded-md">{user.name}</div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
            <div className="bg-muted/50 p-3 rounded-md">{user.email}</div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Role</h3>
            <div className="bg-muted/50 p-3 rounded-md">{user.role}</div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Verification Status</h3>
            <div className="bg-muted/50 p-3 rounded-md">
              {user.isVerified ? 'Verified' : 'Not Verified'}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
