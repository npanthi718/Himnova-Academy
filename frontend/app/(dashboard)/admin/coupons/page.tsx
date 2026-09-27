'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';
import { Tag, Plus, CheckCircle2, X, Trash2, Edit2 } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: 15,
    minPurchaseAmount: 10000,
    maxDiscountAmount: 4000,
    expiryDate: '2026-12-31',
    usageLimit: 100,
  });

  const loadCoupons = () => {
    api.getCoupons().then(setCoupons).catch(console.error);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleOpenCreate = () => {
    setEditingCouponId(null);
    setFormData({
      code: '',
      type: 'PERCENTAGE',
      value: 15,
      minPurchaseAmount: 10000,
      maxDiscountAmount: 4000,
      expiryDate: '2026-12-31',
      usageLimit: 100,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cpn: any) => {
    setEditingCouponId(cpn.id);
    setFormData({
      code: cpn.code,
      type: cpn.type || 'PERCENTAGE',
      value: cpn.value,
      minPurchaseAmount: cpn.minPurchaseAmount || 0,
      maxDiscountAmount: cpn.maxDiscountAmount || 0,
      expiryDate: cpn.expiryDate ? cpn.expiryDate.split('T')[0] : '2026-12-31',
      usageLimit: cpn.usageLimit || 100,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this coupon?')) return;
    try {
      await api.deleteCoupon(id);
      loadCoupons();
    } catch (err: any) {
      alert(err.message || 'Failed to delete coupon');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCouponId) {
        await api.updateCoupon(editingCouponId, formData);
      } else {
        await api.createCoupon(formData);
      }
      setIsModalOpen(false);
      loadCoupons();
    } catch (err: any) {
      alert(err.message || 'Failed to save coupon');
    }
  };

  return (
    <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Coupons & Discount Engine</h1>
            <p className="text-xs text-slate-400">Configure promotional discount codes with limits and expiration rules</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-brand-cyan/20"
          >
            <Plus className="h-4 w-4" />
            <span>Create Coupon Code</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((cpn) => (
            <div key={cpn.id} className="p-6 rounded-3xl bg-alpine-900 border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/40 text-xs font-mono font-extrabold uppercase">
                  {cpn.code}
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">● ACTIVE</span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold font-display text-white">
                  {cpn.type === 'PERCENTAGE' ? `${cpn.value}% OFF` : `Rs. ${cpn.value} FLAT OFF`}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Min Purchase: Rs. {cpn.minPurchaseAmount || 0}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-1.5 text-xs font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Usage Count:</span>
                  <span className="text-white font-bold">{cpn.usageCount} / {cpn.usageLimit} Redeemed</span>
                </div>
                <div className="flex justify-between">
                  <span>Expires On:</span>
                  <span>{formatDate(cpn.expiryDate)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(cpn)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-brand-cyan/20 text-slate-300 hover:text-brand-cyan border border-white/10 hover:border-brand-cyan/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(cpn.id)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all"
                  title="Delete Coupon"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-alpine-900/95 p-6 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold font-display text-white">
                  {editingCouponId ? 'Edit Promotional Coupon' : 'Create Promotional Coupon'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-mono font-bold text-slate-300">Coupon Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                    placeholder="e.g. SUMMER25"
                    className="w-full px-3.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white font-mono uppercase focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Discount Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    >
                      <option value="PERCENTAGE">PERCENTAGE (%)</option>
                      <option value="FIXED_AMOUNT">FIXED AMOUNT (NPR)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Value</label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Min Purchase (NPR)</label>
                    <input
                      type="number"
                      value={formData.minPurchaseAmount}
                      onChange={(e) => setFormData({ ...formData, minPurchaseAmount: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Max Discount Limit</label>
                    <input
                      type="number"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Usage Limit</label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-brand-cyan text-white font-bold text-xs shadow-md shadow-brand-cyan/20"
                >
                  Create Coupon
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
