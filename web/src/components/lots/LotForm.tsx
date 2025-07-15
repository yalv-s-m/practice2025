import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField } from '@consta/uikit/TextField';
import { Button } from '@consta/uikit/Button';

import type { Lot } from '@/types/lot';
import { emptyLot } from '@/types/lot';
import LotService from '@/services/LotService';

/* валидация */

const reCurrency = /^(RUB|USD|EUR)$/i;
const reNds      = /^(Без НДС|18%|20%)$/;
const reDate     = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/; // YYYY-MM-DD HH:mm

const validateCurrency = (v: string) =>
  v && !reCurrency.test(v) ? 'Только RUB, USD или EUR' : undefined;

const validateNds = (v: string) =>
  v && !reNds.test(v) ? 'Только «Без НДС», 18 % или 20 %' : undefined;

const validateDate = (v: string) => {
  if (!v) return undefined;
  if (!reDate.test(v)) return 'Формат: YYYY-MM-DD HH:mm';
  const [date, time] = v.split(' ');
  const jsDate = new Date(`${date}T${time}:00`);
  return Number.isNaN(jsDate.getTime()) ? 'Некорректная дата' : undefined;
};

const validatePrice = (p: number | null) =>
  p !== null && p <= 0 ? 'Цена должна быть > 0' : undefined;

const LotForm: React.FC = () => {
  const { mode, id } = useParams<{ mode: 'new' | 'edit'; id?: string }>();
  const isEdit = mode === 'edit';
  const numericId = isEdit && id ? Number(id) : null;

  const [form, setForm] = useState<Lot>(emptyLot);
  const [loaded, setLoaded] = useState(!isEdit);
  const [errors, setErrors] = useState<{ cur?: string; nds?: string; date?: string; price?: string }>({});
  const [submitErr, setSubmitErr] = useState<string>();

  const navigate = useNavigate();

  /* загрузка (edit) */
  useEffect(() => {
    if (!isEdit || numericId == null) return;

    LotService.get(numericId)
      .then((lot) => {
        setForm(lot);
        setLoaded(true);
        setErrors({
          cur  : validateCurrency(lot.currencyCode),
          nds  : validateNds(lot.ndsRate),
          date : validateDate(lot.dateDelivery),
          price: validatePrice(lot.price),
        });
      })
      .catch(() => navigate('/lots'));
  }, [isEdit, numericId, navigate]);

  /* апдейтер + локальная валидация */
  const upd = <K extends keyof Lot>(k: K, v: Lot[K]) => {
    setForm((p) => ({ ...p, [k]: v }));

    if (k === 'currencyCode')
      setErrors((e) => ({ ...e, cur:  validateCurrency(String(v)) }));
    if (k === 'ndsRate')
      setErrors((e) => ({ ...e, nds:  validateNds(String(v)) }));
    if (k === 'dateDelivery')
      setErrors((e) => ({ ...e, date: validateDate(String(v)) }));
    if (k === 'price')
      setErrors((e) => ({ ...e, price: validatePrice(Number(v)) }));
  };

  /* сохранение */
  const handleSave = async () => {
    try {
      if (isEdit && numericId != null) {
        await LotService.update(numericId, form);
      } else {
        const { id: _omit, ...payload } = form; // id генерирует БД
        await LotService.create(payload);
      }
      navigate('/lots');
    } catch {
      setSubmitErr('Не удалось сохранить, проверьте данные');
    }
  };

  if (!loaded) return <p>Loading…</p>;

  const hasFieldErrors = Object.values(errors).some(Boolean);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>{isEdit ? `Edit Lot ${numericId}` : 'Add Lot'}</h2>

      {submitErr && (
        <div style={{ color: '#eb5757', marginBottom: 16 }}>{submitErr}</div>
      )}

      {/* поля формы (без <form>) */}
      {isEdit && (
        <TextField disabled label="ID" value={String(form.id)} />
      )}

      <TextField
        required
        label="Название"
        value={form.lotName}
        onChange={(v) => upd('lotName', v ?? '')}
      />

      <TextField
        required
        label="Код клиента"
        value={form.customerCode}
        onChange={(v) => upd('customerCode', v ?? '')}
      />

      <TextField
        required
        type="number"
        label="Цена"
        value={form.price !== null ? String(form.price) : ''}
        onChange={(v) => upd('price', v ? Number(v) : null)}
        status={errors.price ? 'alert' : undefined}
        caption={errors.price}
      />

      <TextField
        required
        label="Валюта (RUB|USD|EUR)"
        value={form.currencyCode}
        onChange={(v) => upd('currencyCode', (v ?? '').toUpperCase())}
        status={errors.cur ? 'alert' : undefined}
        caption={errors.cur}
      />

      <TextField
        required
        label="НДС (Без НДС|18%|20%)"
        value={form.ndsRate}
        onChange={(v) => upd('ndsRate', v ?? '')}
        status={errors.nds ? 'alert' : undefined}
        caption={errors.nds}
      />

      <TextField
        label="Место поставки"
        value={form.placeDelivery}
        onChange={(v) => upd('placeDelivery', v ?? '')}
      />

      <TextField
        label="Дата поставки (YYYY-MM-DD HH:mm)"
        value={form.dateDelivery}
        onChange={(v) => upd('dateDelivery', v ?? '')}
        status={errors.date ? 'alert' : undefined}
        caption={errors.date}
      />

      {/* кнопки */}
      <div style={{ marginTop: 16 }}>
        <Button
          view="secondary"
          label="Cancel"
          onClick={() => navigate('/lots')}
          style={{ marginRight: 8 }}
        />
        <Button
          label="Save"
          onClick={handleSave}
          disabled={
            hasFieldErrors ||
            !form.lotName ||
            !form.customerCode ||
            !form.currencyCode ||
            !form.ndsRate ||
            form.price === null
          }
        />
      </div>
    </div>
  );
};

export default LotForm;
