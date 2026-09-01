import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserPlus, Trash2, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { useI18n } from '../../i18n/i18nContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ApiClient } from '../../services/api';

export const TrustedHelperPage: React.FC = () => {
  const { t } = useI18n();

  const [helpers, setHelpers] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [helperName, setHelperName] = useState('');
  const [helperMobile, setHelperMobile] = useState('');
  const [relationship, setRelationship] = useState('Son');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      let res = await ApiClient.getProfile();
      if (!res?.user && !localStorage.getItem('kisan_pehele_token')) {
        await ApiClient.demoLogin('FARMER');
        res = await ApiClient.getProfile();
      }
      const helperList = res?.user?.helperAuthorizations || res?.data?.helperAuthorizations || res?.helperAuthorizations || [];
      setHelpers(helperList);
    } catch (e) {
      console.error('Error fetching trusted helpers:', e);
    }
  };

  const handleAddHelper = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await ApiClient.addHelper({
        name: helperName,
        mobile: helperMobile,
        relationship,
        isRevoked: false,
      });
      setIsAddModalOpen(false);
      setHelperName('');
      setHelperMobile('');
      setMessage(`${t('helper.title')} ${t('status.accepted')}`);
      fetchProfile();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!window.confirm(t('helper.revoke_title') + '?')) return;
    try {
      await ApiClient.revokeHelper(id);
      fetchProfile();
    } catch (e) {}
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-kisan-600 dark:text-kisan-400" />
            <span>{t('helper.title')}</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
            {t('helper.subtitle')}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="font-bold"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          {t('helper.add_btn')}
        </Button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-kisan-50 dark:bg-kisan-950/80 border border-kisan-300 dark:border-kisan-700 text-xs text-kisan-950 dark:text-kisan-100 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-kisan-600 dark:text-kisan-400 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Helper List */}
      <div className="space-y-3">
        {helpers.length === 0 ? (
          <Card className="p-8 text-center text-stone-500 dark:text-stone-400 text-sm space-y-2">
            <User className="w-8 h-8 mx-auto text-stone-400 dark:text-stone-500" />
            <p className="font-medium">{t('helper.empty')}</p>
          </Card>
        ) : (
          helpers.map((h) => (
            <Card key={h.id} variant="default" className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-kisan-100 dark:bg-kisan-950 text-kisan-900 dark:text-kisan-200 border border-kisan-300 dark:border-kisan-700 flex items-center justify-center font-black text-sm">
                  {h.helper?.name?.charAt(0) || 'H'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-stone-900 dark:text-white">{h.helper?.name}</span>
                    <Badge variant={h.isRevoked ? 'danger' : 'success'}>
                      {h.isRevoked ? t('helper.revoked') : t('helper.active')}
                    </Badge>
                  </div>
                  <div className="text-xs font-semibold text-stone-600 dark:text-stone-300 flex items-center gap-2 mt-0.5">
                    <span>{t('helper.relationship')} {h.relationship}</span>
                    <span>•</span>
                    <span>{t('helper.mobile')} {h.helper?.mobile}</span>
                  </div>
                </div>
              </div>

              {!h.isRevoked && (
                <button
                  onClick={() => handleRevoke(h.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                  title={t('helper.revoke_title')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Add Helper Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t('helper.modal_title')}>
        <form onSubmit={handleAddHelper} className="space-y-4 text-xs">
          <div>
            <label className="block font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">{t('helper.name_label')}</label>
            <input
              type="text"
              required
              value={helperName}
              onChange={(e) => setHelperName(e.target.value)}
              placeholder="e.g. Rahul Patel"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-500 rounded-xl font-bold focus:ring-2 focus:ring-kisan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">{t('helper.mobile_label')}</label>
            <input
              type="tel"
              required
              pattern="[0-9]{10}"
              value={helperMobile}
              onChange={(e) => setHelperMobile(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-500 rounded-xl font-mono font-bold focus:ring-2 focus:ring-kisan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">{t('helper.rel_label')}</label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl font-bold focus:ring-2 focus:ring-kisan-500 focus:outline-none"
            >
              <option value="Son">{t('helper.rel_son')}</option>
              <option value="Daughter">{t('helper.rel_daughter')}</option>
              <option value="Spouse">{t('helper.rel_spouse')}</option>
              <option value="Brother">{t('helper.rel_brother')}</option>
              <option value="Relative">{t('helper.rel_relative')}</option>
            </select>
          </div>

          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/80 rounded-xl text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
            <div className="font-black text-xs mb-0.5">{t('helper.consent_title')}</div>
            <p className="font-medium text-[11px]">{t('helper.consent_text')}</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" className="font-bold" onClick={() => setIsAddModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" size="sm" type="submit" className="font-bold" isLoading={isSubmitting}>
              {t('helper.authorize_btn')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
