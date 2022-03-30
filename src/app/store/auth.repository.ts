import { createStore, withProps, select, setProps } from '@ngneat/elf';

interface AuthProps {
  token: string | null;
  modalOpened: boolean;
}

export const authStore = createStore(
  { name: 'auth '},
  withProps<AuthProps>({ token: '', modalOpened: false })
  );

export const token$ = authStore.pipe(select((state) => state.token));
export const modalOpened$ = authStore.pipe(select((state) => state.modalOpened));

export const setToken = (token: string | null): void => {
  authStore.update(
    setProps({
      token,
    })
  );
}

export const setModal = (modalOpened: boolean): void => {
  authStore.update(
    setProps({
      modalOpened,
    })
  );
}
