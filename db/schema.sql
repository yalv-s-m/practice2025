/* Взято из DBeaver: Генерация SQL -> DDL*/

CREATE SCHEMA IF NOT EXISTS purchase;
SET search_path TO purchase;

/* TABLE: customer */
CREATE TABLE IF NOT EXISTS customer (
    customer_code          varchar PRIMARY KEY,
    customer_name          varchar NOT NULL,
    customer_inn           varchar NOT NULL,
    customer_kpp           varchar,
    customer_legal_address varchar NOT NULL,
    customer_postal_address varchar,
    customer_email         varchar NOT NULL,
    customer_code_main     varchar REFERENCES customer(customer_code),
    is_organization        bool    NOT NULL DEFAULT true,
    is_person              bool    NOT NULL DEFAULT false,
    CONSTRAINT chk_customer_role
        CHECK (
          (is_organization = true  AND is_person = false) OR
          (is_organization = false AND is_person = true )
        )
);

/*  TABLE: lot */
CREATE TABLE IF NOT EXISTS lot (
    id             bigserial PRIMARY KEY,
    lot_name       varchar NOT NULL,
    customer_code  varchar REFERENCES customer(customer_code),
    price          numeric NOT NULL,
    currency_code  varchar NOT NULL
        CHECK (currency_code IN ('RUB','USD','EUR')),
    nds_rate       varchar NOT NULL
        CHECK (nds_rate IN ('Без НДС','18%','20%')),
    place_delivery varchar,
    date_delivery  timestamp
);
