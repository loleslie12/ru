import { initialUsers, mockRoleResponse, previewAdmin } from '../data/mockData';

/**
 * Sprint 17 integration boundary.
 * Existing endpoints listed in the brief: login, refresh, logout, logout-all,
 * me, 2FA and role change. Proposed endpoints are intentionally mocked here:
 * users list/detail, status, activity, verify, permissions and roles.
 * No route paths are invented in this file. Replace each mock with the confirmed
 * Swagger operation when Backend supplies the contract.
 */
const wait = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));
let users = structuredClone(initialUsers);
let twoFactorEnabled = true;

export const api = {
  async login({ email, password }) {
    await wait(350);
    if (email === 'blocked@runr.app') return { ok: false, reason: 'suspended' };
    if (email !== 'admin@runr.app' || password !== 'RunrDemo!') return { ok: false, reason: 'credentials' };
    return { ok: true, admin: { ...previewAdmin, twoFactorEnabled }, requires2FA: twoFactorEnabled };
  },
  async getMe() { await wait(); return { ...previewAdmin, twoFactorEnabled }; },
  async setTwoFactorEnabled(enabled) { await wait(); twoFactorEnabled = enabled; return { ok: true }; },
  async getUsers() { await wait(); return { items: structuredClone(users), total: users.length, source: 'mock' }; },
  async getRoles() { await wait(); return structuredClone(mockRoleResponse); },
  async changeRole(userId, role, reason) {
    await wait();
    users = users.map((user) => user.id === userId ? { ...user, role, activity: [[`Role changed to ${role}`, 'Just now'], ...user.activity] } : user);
    return { ok: true, source: 'mock', reason };
  },
  async changeStatus(userId, status, reason) {
    await wait();
    users = users.map((user) => user.id === userId ? { ...user, status, activity: [[`Status changed to ${status}`, 'Just now'], ...user.activity] } : user);
    return { ok: true, source: 'mock', reason };
  },
  async verifyUser(userId) {
    await wait();
    users = users.map((user) => user.id === userId ? { ...user, verified: true, activity: [['Account verified', 'Just now'], ...user.activity] } : user);
    return { ok: true, source: 'mock' };
  },
  async sendRecovery(userId) { await wait(); return { ok: true, source: 'mock', userId }; },
  async logoutAll() { await wait(); return { ok: true }; }
};
