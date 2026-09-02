'use client';

import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Users,
  Layers,
  Activity,
  Search,
  Lock,
  Unlock,
  Shield,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  KeyRound
} from 'lucide-react';
import { adminService, type AdminStatsDto, type AdminUserDto } from '@/features/admin/services/admin-service';
import { useAuthStore } from '@/store/auth-store';

export default function AdminDashboardPage() {
  const currentUser = useAuthStore((state) => state.user);
  const [stats, setStats] = useState<AdminStatsDto | null>(null);
  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAllUsers(),
      ]);
      setStats(statsRes);
      setUsers(usersRes);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const [passwordResetUserId, setPasswordResetUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchData();
    const handleUserCreated = () => fetchData();
    window.addEventListener('user_created', handleUserCreated);
    return () => window.removeEventListener('user_created', handleUserCreated);
  }, []);

  const handleChangePassword = async (userId: string) => {
    if (!newPassword || newPassword.trim().length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    try {
      setActionLoadingId(userId);
      await adminService.changeUserPassword(userId, newPassword.trim());
      setSuccessMsg(`Đã đổi mật khẩu thành công!`);
      setPasswordResetUserId(null);
      setNewPassword('');
    } catch (err) {
      alert('Không thể đổi mật khẩu.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleLock = async (user: AdminUserDto) => {
    try {
      setActionLoadingId(user.id);
      const newStatus = user.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
      await adminService.updateUserStatus(user.id, newStatus);
      setSuccessMsg(`Đã ${newStatus === 'LOCKED' ? 'khóa' : 'mở khóa'} tài khoản ${user.email} thành công!`);
      fetchData();
    } catch (err) {
      alert('Không thể thay đổi trạng thái tài khoản.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleChangeRole = async (user: AdminUserDto, targetRole: 'ADMIN' | 'MANAGER' | 'USER') => {
    try {
      setActionLoadingId(user.id);
      await adminService.updateUserRole(user.id, targetRole);
      setSuccessMsg(`Đã phân quyền ${targetRole} cho tài khoản ${user.email}!`);
      fetchData();
    } catch (err) {
      alert('Không thể thay đổi vai trò tài khoản.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (user: AdminUserDto) => {
    if (!confirm(`Bạn có chắc chắn muốn vô hiệu hóa tài khoản ${user.email}?`)) return;
    try {
      setActionLoadingId(user.id);
      await adminService.deleteUser(user.id);
      setSuccessMsg(`Đã vô hiệu hóa tài khoản ${user.email}.`);
      fetchData();
    } catch (err) {
      alert('Không thể vô hiệu hóa tài khoản.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN') || currentUser?.email === 'admin@gmail.com';

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 text-text-primary">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 shadow-md">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-lg font-bold font-heading text-text-primary">Quyền truy cập bị từ chối (403 Forbidden)</h2>
          <p className="text-xs text-text-secondary max-w-md mt-1">
            Trang Cấu hình & Quản trị Hệ thống chỉ dành riêng cho tài khoản Quản trị viên (<span className="font-semibold text-red-500">ROLE_ADMIN</span>). Quản lý dự án và Nhân viên không có quyền truy cập trang này.
          </p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 text-text-primary">
      {/* Admin Dedicated Banner Header */}
      <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-950/40 via-purple-950/40 to-slate-900 p-6 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500 text-white shadow-lg ring-4 ring-red-500/20">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold tracking-tight font-heading">
                  Hệ Thống Quản Trị Quản Lý (Admin Portal)
                </h1>
                <span className="rounded-full bg-red-500/20 border border-red-500/40 px-2.5 py-0.5 text-[10px] font-bold text-red-400 uppercase">
                  System Administrator
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                Quản lý toàn bộ người dùng, quyền hạn hệ thống và giám sát tài nguyên TaskFlow.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>System: {stats?.systemHealth || 'ONLINE'}</span>
            </span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="font-bold underline">
            Đóng
          </button>
        </div>
      )}

      {/* Admin Stats Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center space-x-4 rounded-2xl border border-surface-border bg-surface p-5 shadow-xs">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-text-primary font-heading">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.totalUsers || 0}
            </div>
            <div className="text-xs text-text-muted">Tổng số người dùng hệ thống</div>
          </div>
        </div>

        <div className="flex items-center space-x-4 rounded-2xl border border-surface-border bg-surface p-5 shadow-xs">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-text-primary font-heading">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.activeUsers || 0}
            </div>
            <div className="text-xs text-text-muted">Tài khoản đang hoạt động</div>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
          <div>
            <h2 className="text-base font-bold text-text-primary font-heading">
              Danh Sách & Quản Lý Người Dùng
            </h2>
            <p className="text-xs text-text-secondary">
              Xem, khóa/mở khóa tài khoản hoặc gán quyền Admin cho các tài khoản trong hệ thống.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-surface-alt pl-9 pr-3 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-hidden"
            />
          </div>
        </div>

        {/* User Table */}
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-surface-border bg-surface-alt/50 text-[11px] font-bold text-text-muted uppercase">
                <tr>
                  <th className="px-4 py-3">Người dùng</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Quyền hệ thống</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredUsers.map((u) => {
                  const isAdmin = u.roles?.includes('ROLE_ADMIN');
                  const isManager = u.roles?.includes('ROLE_MANAGER');
                  const isUser = !isAdmin && !isManager;
                  const currentRole = isAdmin ? 'ADMIN' : isManager ? 'MANAGER' : 'USER';

                  const isLocked = u.status === 'LOCKED';

                  return (
                    <tr key={u.id} className="hover:bg-surface-alt/40 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-xs">
                            {u.fullName?.substring(0, 1).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <span className="font-semibold text-text-primary block">{u.fullName}</span>
                            {u.id === currentUser?.id && (
                              <span className="text-[10px] text-primary font-bold">(Bạn)</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 font-medium text-text-secondary">{u.email}</td>

                      <td className="px-4 py-3">
                        {isAdmin && (
                          <span className="inline-flex items-center space-x-1 rounded-full bg-red-500/10 border border-red-500/30 px-2.5 py-0.5 text-[10px] font-bold text-red-500">
                            <Shield className="h-3 w-3" />
                            <span>ROLE_ADMIN</span>
                          </span>
                        )}
                        {isManager && (
                          <span className="inline-flex items-center space-x-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-500">
                            <Shield className="h-3 w-3" />
                            <span>ROLE_MANAGER</span>
                          </span>
                        )}
                        {isUser && (
                          <span className="inline-flex items-center space-x-1 rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-bold text-blue-500">
                            <span>ROLE_USER</span>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {isLocked ? (
                          <span className="inline-flex items-center space-x-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-500">
                            <Lock className="h-3 w-3" />
                            <span>BỊ KHÓA</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>HOẠT ĐỘNG</span>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Toggle Lock */}
                          <button
                            disabled={actionLoadingId === u.id || u.id === currentUser?.id}
                            onClick={() => handleToggleLock(u)}
                            className={`flex items-center space-x-1 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition ${isLocked
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                              : 'border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white'
                              } disabled:opacity-30`}
                            title={isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                          >
                            {isLocked ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                            <span>{isLocked ? 'Mở khóa' : 'Khóa'}</span>
                          </button>

                          {/* Change Password */}
                          <button
                            disabled={actionLoadingId === u.id}
                            onClick={() => setPasswordResetUserId(u.id)}
                            className="flex items-center space-x-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-500 hover:bg-blue-500 hover:text-white transition disabled:opacity-30"
                            title="Đổi mật khẩu"
                          >
                            <KeyRound className="h-3 w-3" />
                            <span className="hidden sm:inline">Mật khẩu</span>
                          </button>

                          {/* Change Role */}
                          <select
                            disabled={actionLoadingId === u.id || u.id === currentUser?.id}
                            value={currentRole}
                            onChange={(e) => handleChangeRole(u, e.target.value as 'ADMIN' | 'MANAGER' | 'USER')}
                            className="cursor-pointer rounded-lg border border-purple-500/30 bg-surface-alt px-2 py-1 text-[11px] font-semibold text-purple-500 hover:border-purple-500 outline-none focus:ring-1 focus:ring-purple-500 transition disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Đổi quyền người dùng"
                          >
                            <option value="USER" className="text-text-primary bg-surface">Về User</option>
                            <option value="MANAGER" className="text-text-primary bg-surface">Lên Manager</option>
                            <option value="ADMIN" className="text-text-primary bg-surface">Lên Admin</option>
                          </select>

                          {/* Deactivate User */}
                          <button
                            disabled={actionLoadingId === u.id || u.id === currentUser?.id}
                            onClick={() => handleDeleteUser(u)}
                            className="rounded-lg border border-red-500/30 bg-red-500/10 p-1 text-red-500 hover:bg-red-500 hover:text-white transition disabled:opacity-30"
                            title="Xóa / Vô hiệu hóa tài khoản"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reset Password Modal */}
      {passwordResetUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl">
            <h3 className="mb-4 flex items-center space-x-2 text-lg font-bold text-text-primary">
              <KeyRound className="h-5 w-5 text-primary" />
              <span>Đổi mật khẩu người dùng</span>
            </h3>
            <div className="mb-4">
              <label className="mb-2 block text-xs font-semibold text-text-secondary">
                Mật khẩu mới (tối thiểu 6 ký tự)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới..."
                className="w-full rounded-xl border border-surface-border bg-surface-alt px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setPasswordResetUserId(null);
                  setNewPassword('');
                }}
                className="rounded-xl border border-surface-border px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-alt transition"
              >
                Hủy
              </button>
              <button
                onClick={() => handleChangePassword(passwordResetUserId)}
                disabled={actionLoadingId === passwordResetUserId || newPassword.length < 6}
                className="flex items-center space-x-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-hover transition disabled:opacity-50"
              >
                {actionLoadingId === passwordResetUserId && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Lưu mật khẩu</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
