import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@consta/uikit/TextField';
import { Select } from '@consta/uikit/Select';
import { RadioGroup } from '@consta/uikit/RadioGroup';
import { Button } from '@consta/uikit/Button';
import { rcTableAdapter } from '@consta/rc-table-adapter/rcTableAdapter';
import RCTable from 'rc-table';

import type{ Lot } from '@/types/lot';
import LotService from '@/services/LotService';

/* сортировка */

type SortValue =
  | 'name-asc' | 'name-desc'
  | 'price-asc' | 'price-desc'
  | 'id-asc'| 'id-desc';

interface SortItem { value: SortValue; label: string; }

const sortItems: SortItem[] = [
  { value: 'name-asc', label: 'Название ↑' },
  { value: 'name-desc', label: 'Название ↓' },
  { value: 'price-asc', label: 'Цена ↑' },
  { value: 'price-desc', label: 'Цена ↓' },
  { value: 'id-asc', label: 'ID ↑' },
  { value: 'id-desc', label: 'ID ↓' },
];

type SearchField =
  | 'all'
  | 'id'
  | 'lotName'
  | 'customerCode'
  | 'price'
  | 'currencyCode'
  | 'ndsRate'
  | 'placeDelivery'
  | 'dateDelivery';

interface FieldItem { value: SearchField; label: string; }

const fieldItems: FieldItem[] = [
  { value: 'all', label: 'По всем полям' },
  { value: 'id', label: 'ID' },
  { value: 'lotName', label: 'Название' },
  { value: 'customerCode', label: 'Код клиента' },
  { value: 'price', label: 'Цена' },
  { value: 'currencyCode', label: 'Валюта' },
  { value: 'ndsRate', label: 'НДС' },
  { value: 'placeDelivery', label: 'Грузополучатель' },
  { value: 'dateDelivery', label: 'Дата' },
];

const LotList: React.FC = () => {
  const [data, setData] = useState<Lot[]>([]);
  const [filter, setFilter] = useState('');
  const [field, setField] = useState<FieldItem>(fieldItems[0]); // «по всем»
  const [sort, setSort] = useState<SortItem>(sortItems[0]);
  const navigate = useNavigate();

  /* загрузка */
  useEffect(() => {
    LotService.getAll()
      .then(setData)
      .catch(console.error);
  }, []);

  /* helper для числовых id и price */
  const toStr = (l: Lot, f: SearchField): string => {
    switch (f) {
      case 'id': return String(l.id ?? '');
      case 'price': return String(l.price ?? '');
      default: return String((l as any)[f] ?? '');
    }
  };

  /* фильтрация + сортировка */
  const viewData = useMemo(() => {
    const q = filter.toLowerCase();

    const fits = (l: Lot): boolean => {
      if (!q) return true;

      // поиск по одному столбцу
      if (field.value !== 'all') {
        return toStr(l, field.value).toLowerCase().includes(q);
      }

      // поиск по всем столбцам
      return (
        [
          toStr(l, 'id'),
          toStr(l, 'lotName'),
          toStr(l, 'customerCode'),
          toStr(l, 'price'),
          toStr(l, 'currencyCode'),
          toStr(l, 'ndsRate'),
          toStr(l, 'placeDelivery'),
          toStr(l, 'dateDelivery'),
        ]
          .some((v) => v.toLowerCase().includes(q))
      );
    };

    const filtered = data.filter(fits);

    return [...filtered].sort((a, b) => {
      switch (sort.value) {
        case 'name-asc': return a.lotName.localeCompare(b.lotName);
        case 'name-desc': return b.lotName.localeCompare(a.lotName);
        case 'price-asc': return (a.price ?? 0) - (b.price ?? 0);
        case 'price-desc': return (b.price ?? 0) - (a.price ?? 0);
        case 'id-asc': return (a.id ?? 0) - (b.id ?? 0);
        case 'id-desc': return (b.id ?? 0) - (a.id ?? 0);
        default: return 0;
      }
    });
  }, [data, filter, field, sort]);

  const handleDelete = (id: number | null) => {
    if (id == null) return;
    if (!window.confirm(`Удалить лот ${id}?`)) return;

    LotService.remove(id)
      .then(() => setData((prev) => prev.filter((l) => l.id !== id)))
      .catch(console.error);
  };

  const columns = [
    { title: 'ID',  dataIndex: 'id', key: 'id',   width: 80 },
    { title: 'Название', dataIndex: 'lotName', key: 'name' },
    { title: 'Код клиента', dataIndex: 'customerCode',  key: 'cust' },
    { title: 'Цена', dataIndex: 'price', key: 'price'  },
    { title: 'Валюта', dataIndex: 'currencyCode',  key: 'curr' },
    { title: 'НДС', dataIndex: 'ndsRate', key: 'nds' },
    { title: 'Грузополучатель', dataIndex: 'placeDelivery', key: 'place' },
    { title: 'Дата', dataIndex: 'dateDelivery',  key: 'date' },
    {
      title : 'Действия',
      key   : 'actions',
      render: (r: Lot) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            size="xs"
            label="Edit"
            onClick={() => navigate(`/lots/edit/${r.id}`)}
          />
          <Button
            size="xs"
            view="secondary"
            label="Del"
            onClick={() => handleDelete(r.id)}
          />
        </div>
      ),
    },
  ];

  const tableProps = rcTableAdapter<Lot>({
    size: 'm',
    zebraStriped: 'odd',
    borderBetweenColumns: true,
    borderBetweenRows: true,
  });


  return (
    <div>
      <h2>Lots</h2>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <TextField
          placeholder="Поиск…"
          value={filter}
          onChange={(v) => setFilter((v ?? '').toString())}
          style={{ width: 240 }}
        />

        <Select<FieldItem>
          items={fieldItems}
          value={field}
          getItemLabel={(i) => i.label}
          getItemKey={(i) => i.value}
          onChange={(item) => item && setField(item)}
          size="s"
          style={{ width: 170 }}
        />

        <RadioGroup<SortItem>
          value={sort}
          items={sortItems}
          getItemLabel={(i) => i.label}
          getItemKey={(i) => i.value}
          name="sortLots"
          direction="row"
          onChange={({ value }) =>
            setSort(sortItems.find((i) => i.value === value) || sortItems[0])
          }
        />

        <Button label="Add" onClick={() => navigate('/lots/new')} />
      </div>

      <RCTable<Lot>
        columns={columns}
        data={viewData}
        {...tableProps}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default LotList;