
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import LayoutAdmin from '@/components/LayoutAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type{ User } from '@/lib/types';
import { getUsers, deleteUser } from '@/services/parking.service';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Check, Trash2, User as UserIcon } from 'lucide-react';
import UserDialog from '@/components/UserDialog';

const AdminUsers = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getUsers,
    staleTime: 60000, // 1 minute
    meta: {
      onError: () => {
        toast.error('Failed to load users data');
      }
    }
  });

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteUser(userToDelete);
      toast.success('User deleted successfully');
      setIsDeleteAlertOpen(false);
      refetch();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const confirmDelete = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteAlertOpen(true);
  };

  // Fallback to empty array if API fails
  const displayUsers = users || [];

  return (
    <LayoutAdmin>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 rounded-md border p-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Failed to load users. Please try again later.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between space-x-4 rounded-md border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center ${
                      user.isVerified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {user.isVerified && <Check className="h-3 w-3 mr-1" />}
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
                      <UserIcon className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => confirmDelete(user.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <UserDialog 
        open={isViewDialogOpen} 
        onOpenChange={setIsViewDialogOpen}
        user={selectedUser}
      />

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this user account. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} disabled={isDeleting} className='bg-red-500 hover:bg-red-600'>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LayoutAdmin>
  );
};

export default AdminUsers;
