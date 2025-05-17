import { User } from '../types';
import { fetchApi } from './api';

export const updateProfile = async (userId: string, profileData: Partial<User>): Promise<User> => {
  return await fetchApi<User>(`/users/${userId}`, 'PUT', profileData);
};

export const updateSettings = async (userId: string, settingsData: Partial<User>): Promise<User> => {
  return await fetchApi<User>(`/users/${userId}/settings`, 'PUT', settingsData);
};

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export const updatePassword = async (userId: string, passwordData: PasswordChangeData): Promise<void> => {
  await fetchApi<void>(`/users/${userId}/password`, 'PUT', passwordData);
};

export const deactivateAccount = async (userId: string): Promise<void> => {
  await fetchApi<void>(`/users/${userId}/deactivate`, 'PUT');
};

export const deleteAccount = async (userId: string): Promise<void> => {
  await fetchApi<void>(`/users/${userId}`, 'DELETE');
}; 