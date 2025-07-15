import React, { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField } from '@consta/uikit/TextField';
import { Checkbox } from '@consta/uikit/Checkbox';
import { Button } from '@consta/uikit/Button';

import type { Customer } from '@/types/customer';
import { emptyCustomer } from '@/types/customer';
import CustomerService from '@/services/CustomerService';

/* валидация */
const reInn = /^\d{10}(\d{2})?$/;
const reKpp = /^\d{9}$/;
const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

const validateInn = (v: string) => v && !reInn.test(v) ? 'ИНН: 10 или 12 цифр' : undefined;
const validateKpp = (v: string) => v && !reKpp.test(v) ? 'КПП: 9 цифр': undefined;
const validateEmail = (v: string) => v && !reEmail.test(v) ? 'Некорректный e-mail' : undefined;

const CustomerForm: React.FC = () => {
  const { mode, code } = useParams<{ mode: 'new' | 'edit'; code?: string }>();
  const isEdit = mode === 'edit';

  const [form, setForm]   = useState<Customer>(emptyCustomer);
  const [loaded, setLoaded] = useState(!isEdit);
  const [errors, setErrors] = useState<{ inn?: string; kpp?: string; email?: string }>({});
  const [submitErr, setSubmitErr] = useState<string>();

  const navigate = useNavigate();

  /* загрузка при редактировании */
  useEffect(() => {
    if (!isEdit || !code) return;

    CustomerService.get(code)
      .then((c) => {
        setForm(c);
        setLoaded(true);

        /* сразу проверим поля */
        setErrors({
          inn: validateInn(c.customerInn),
          kpp: validateKpp(c.customerKpp),
          email: validateEmail(c.customerEmail),
        });
      })
      .catch(() => navigate('/customers'));
  }, [isEdit, code, navigate]);

  /* апдейтер поля с локальной валидацией */
  const upd = <K extends keyof Customer>(k: K, v: Customer[K]) => {
    setForm((p) => ({ ...p, [k]: v }));

    if (k === 'customerInn')
      setErrors((e) => ({ ...e, inn: validateInn(String(v)) }));
    if (k === 'customerKpp')
      setErrors((e) => ({ ...e, kpp: validateKpp(String(v)) }));
    if (k === 'customerEmail')
      setErrors((e) => ({ ...e, email: validateEmail(String(v)) }));
  };

  const handleSave = async () => {
    try {
      if (isEdit && code) await CustomerService.update(code, form);
      else await CustomerService.create(form);

      navigate('/customers');
    } catch (e) {
      setSubmitErr('Не удалось сохранить, проверьте данные');
    }
  };

  if (!loaded) return <p>Loading…</p>;

  const hasFieldErrors = Object.values(errors).some(Boolean);
  const isSaveDisabled =
    hasFieldErrors ||
    !form.customerCode ||
    !form.customerName ||
    !form.customerLegalAddress ||
    (isEdit ? false : form.customerCode.trim() === '');

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>{isEdit ? `Edit ${code}` : 'Add Customer'}</h2>

      {submitErr && (
        <div style={{ color: '#eb5757', marginBottom: 16 }}>{submitErr}</div>
      )}

      <TextField
        required
        disabled={isEdit}
        label="Код"
        value={form.customerCode}
        onChange={(v) => upd('customerCode', v ?? '')}
      />

      <TextField
        required
        label="Название"
        value={form.customerName}
        onChange={(v) => upd('customerName', v ?? '')}
      />

      <TextField
        required
        label="ИНН"
        value={form.customerInn}
        onChange={(v) => upd('customerInn', v ?? '')}
        status={errors.inn ? 'alert' : undefined}
        caption={errors.inn}
      />

      <TextField
        label="КПП"
        value={form.customerKpp}
        onChange={(v) => upd('customerKpp', v ?? '')}
        status={errors.kpp ? 'alert' : undefined}
        caption={errors.kpp}
      />

      <TextField
        required
        label="Юр-адрес"
        value={form.customerLegalAddress}
        onChange={(v) => upd('customerLegalAddress', v ?? '')}
      />

      <TextField
        label="Почтовый индекс"
        value={form.customerPostalAddress}
        onChange={(v) => upd('customerPostalAddress', v ?? '')}
      />

      <TextField
        label="E-mail"
        value={form.customerEmail}
        onChange={(v) => upd('customerEmail', v ?? '')}
        status={errors.email ? 'alert' : undefined}
        caption={errors.email}
      />

      <TextField
        required
        label="Код головной орг."
        value={form.customerCodeMain}
        onChange={(v) => upd('customerCodeMain', v ?? '')}
      />

      <Checkbox
        label="Юр. лицо"
        checked={!!form.isOrganization}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setForm((p) => ({
            ...p,
            isOrganization: e.target.checked,
            isPerson: e.target.checked ? false : p.isPerson,
          }))
        }
      />

      <Checkbox
        label="Физ. лицо"
        checked={!!form.isPerson}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setForm((p) => ({
            ...p,
            isPerson: e.target.checked,
            isOrganization: e.target.checked ? false : p.isOrganization,
          }))
        }
      />

      <div style={{ marginTop: 16 }}>
        <Button
          view="secondary"
          label="Cancel"
          onClick={() => navigate('/customers')}
          style={{ marginRight: 8 }}
        />
        <Button
          label="Save"
          onClick={handleSave}
          disabled={isSaveDisabled}
        />
      </div>
    </div>
  );
};

export default CustomerForm;

