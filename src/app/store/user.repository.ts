import { createStore } from '@ngneat/elf';
import { selectAllEntities, setEntities, withEntities } from '@ngneat/elf-entities';
import { createRequestsStatusOperator, initializeAsPending, selectRequestStatus, updateRequestStatus, withRequestsStatus } from '@ngneat/elf-requests';
import { map } from 'rxjs';
import { User } from '../models/user';

const usersStore = createStore(
  { name: 'users' },
  withEntities<User>(),
  withRequestsStatus<'users'>(
    initializeAsPending('users')
  )
);

export const users$ = usersStore.pipe(selectAllEntities());
export const usersStatus$ = usersStore.pipe(selectRequestStatus('users'), map((status) => status.value));

export const trackUsersRequestsStatus = createRequestsStatusOperator(usersStore);

export const setUsers = (users: User[]): void => {
  usersStore.update(
    setEntities(users.sort((a, b) => a.id - b.id)),
    updateRequestStatus('users', 'success')
    );
}
