import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@consta/uikit/TextField';
import { RadioGroup } from '@consta/uikit/RadioGroup';
import { Select } from '@consta/uikit/Select';
import { Button } from '@consta/uikit/Button';
import { rcTableAdapter } from '@consta/rc-table-adapter/rcTableAdapter';
import RCTable from 'rc-table';

import type { Customer } from '@/types/customer';
import CustomerService from '@/services/CustomerService';

/* сортировка */
type SortValue = 'name-asc' | 'name-desc' | 'code-asc' | 'code-desc';

interface SortItem { value: SortValue; label: string; }

const sortItems: SortItem[] = [
  { value: 'name-asc', label: 'Имя ↑'  },
  { value: 'name-desc', label: 'Имя ↓'  },
  { value: 'code-asc', label: 'Код ↑'  },
  { value: 'code-desc', label: 'Код ↓'  },
];

/* фильтрация */
type SearchField =
  | 'all'
  | 'customerCode'
  | 'customerName'
  | 'customerInn'
  | 'customerKpp'
  | 'customerLegalAddress'
  | 'customerPostalAddress'
  | 'customerEmail'
  | 'type';

interface FieldItem { value: SearchField; label: string; }

const fieldItems: FieldItem[] = [
  { value: 'all', label: 'По всем полям' },
  { value: 'customerCode', label: 'Код' },
  { value: 'customerName', label: 'Название' },
  { value: 'customerInn', label: 'ИНН' },
  { value: 'customerKpp', label: 'КПП' },
  { value: 'customerLegalAddress', label: 'Адрес' },
  { value: 'customerPostalAddress', label:'Почт. индекс' },
  { value: 'customerEmail', label: 'E-mail' },
  { value: 'type', label: 'Тип' },
];

const CustomerList: React.FC = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [filter, setFilter] = useState('');
  const [field, setField] = useState<FieldItem>(fieldItems[0]); // «по всем»
  const [sort, setSort] = useState<SortItem>(sortItems[0]);
  const navigate = useNavigate();

  /* загрузка */
  useEffect(() => {
    CustomerService.getAll()
      .then(setData)
      .catch(console.error);
  }, []);

  const getTypeLabel = (c: Customer) =>
    c.isOrganization ? 'Юр. лицо' : c.isPerson ? 'Физ. лицо' : '';

  /* фильтр + сортировка */
  const viewData = useMemo(() => {
    const q = filter.toLowerCase();

    const fits = (c: Customer): boolean => {
      if (!q) return true;

      /* поиск только по одному столбцу */
      if (field.value !== 'all') {
        const val =
          field.value === 'type'
            ? getTypeLabel(c)
            : String((c as any)[field.value] ?? '');
        return val.toLowerCase().includes(q);
      }

      /* поиск по всем столбцам */
      return [
        c.customerCode,
        c.customerName,
        c.customerInn,
        c.customerKpp,
        c.customerLegalAddress,
        c.customerPostalAddress,
        c.customerEmail,
        getTypeLabel(c),
      ]
        .map((s) => String(s).toLowerCase())
        .some((v) => v.includes(q));
    };

    const filtered = data.filter(fits);

    return [...filtered].sort((a, b) => {
      switch (sort.value) {
        case 'name-asc': return a.customerName.localeCompare(b.customerName);
        case 'name-desc': return b.customerName.localeCompare(a.customerName);
        case 'code-asc': return a.customerCode.localeCompare(b.customerCode);
        case 'code-desc': return b.customerCode.localeCompare(a.customerCode);
        default: return 0;
      }
    });
  }, [data, filter, field, sort]);

  /* удаление */
  const handleDelete = (code: string) => {
    if (!window.confirm(`Удалить клиента ${code}?`)) return;
    CustomerService.remove(code)
      .then(() => setData((prev) => prev.filter((c) => c.customerCode !== code)))
      .catch(console.error);
  };

  const columns = [
    { title: 'Код', dataIndex: 'customerCode', key: 'code',  width: 110 },
    { title: 'Название', dataIndex: 'customerName', key: 'name' },
    { title: 'ИНН', dataIndex: 'customerInn', key: 'inn' },
    { title: 'КПП', dataIndex: 'customerKpp', key: 'kpp' },
    { title: 'Адрес', dataIndex: 'customerLegalAddress', key: 'legAdr' },
    { title: 'Почтовый индекс', dataIndex: 'customerPostalAddress', key: 'postAdr' },
    { title: 'E-mail', dataIndex: 'customerEmail', key: 'email' },
    {
      title : 'Тип',
      key : 'type',
      width : 80,
      render: (r: Customer) => getTypeLabel(r),
    },
    {
      title : 'Действия',
      key : 'actions',
      render: (r: Customer) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            size="xs"
            label="Edit"
            onClick={() => navigate(`/customers/edit/${r.customerCode}`)}
          />
          <Button
            size="xs"
            view="secondary"
            label="Del"
            onClick={() => handleDelete(r.customerCode)}
          />
        </div>
      ),
    },
  ];

  const tableProps = rcTableAdapter<Customer>({
    size: 'm',
    zebraStriped: 'odd',
    borderBetweenColumns: true,
    borderBetweenRows: true,
  });

  /* render */

  return (
    <div>
      <h2>Customers</h2>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <TextField
          placeholder="Поиск…"
          value={filter}
          onChange={(v) => setFilter((v ?? '').toString())}
          style={{ width: 240 }}
        />

        {/* выбор поля для поиска */}
        <Select<FieldItem>
          items={fieldItems}
          value={field}
          getItemLabel={(i) => i.label}
          getItemKey={(i) => i.value}
          onChange={(item) => item && setField(item)} 
          size="s"
          style={{ width: 170 }}
        />

        {/* сортировка */}
        <RadioGroup<SortItem>
          value={sort}
          items={sortItems}
          getItemLabel={(i) => i.label}
          getItemKey={(i) => i.value}
          onChange={({ value }) =>
            setSort(sortItems.find((i) => i.value === value) || sortItems[0])
          }
          name="sort"
          direction="row"
        />

        <Button label="Add" onClick={() => navigate('/customers/new')} />
      </div>

      <RCTable<Customer>
        columns={columns}
        data={viewData}
        {...tableProps}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default CustomerList;
