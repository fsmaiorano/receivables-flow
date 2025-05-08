import { Injectable, signal, WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { StoreModel } from './store.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private store: WritableSignal<StoreModel> = signal<StoreModel>({
    name: '',
    token: '',
    userId: '',
  });

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  updateStore(update: Partial<StoreModel>) {
    const currentStore = this.store();
    this.store.set({ ...currentStore, ...update });
  }

  getStore(): StoreModel {
    let currentStore = this.store();

    // Only access sessionStorage in browser environment
    if (this.isBrowser) {
      if (currentStore.token === '') {
        const token = sessionStorage.getItem('token') || '';
        if (token !== '') {
          currentStore = { ...currentStore, token };
          this.store.set(currentStore);
        }
      }

      if (currentStore.userId === '') {
        const userId = sessionStorage.getItem('userId') || '';
        if (userId !== '') {
          currentStore = { ...currentStore, userId };
          this.store.set(currentStore);
        }
      }

      if (currentStore.name === '') {
        const name = sessionStorage.getItem('name') || '';
        if (name !== '') {
          currentStore = { ...currentStore, name };
          this.store.set(currentStore);
        }
      }
    }

    return currentStore;
  }

  clearStore() {
    this.store.set({ name: '', token: '', userId: '' });
  }
}
