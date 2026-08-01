-- Enable UUIDs if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. members table
CREATE TABLE members (
    id BIGSERIAL PRIMARY KEY,
    member_code INT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    commission_rate NUMERIC(5,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Member 999
INSERT INTO members (member_code, name, commission_rate) 
VALUES (999, 'Fund Manager (Fees)', 0.00)
ON CONFLICT (member_code) DO NOTHING;

-- 2. valuations table
CREATE TABLE valuations (
    id BIGSERIAL PRIMARY KEY,
    valuation_date DATE NOT NULL UNIQUE,
    portfolio_value NUMERIC(15,2) NOT NULL,
    total_units NUMERIC(18,6) NOT NULL,
    unit_price NUMERIC(18,6) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. operations table
CREATE TABLE operations (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    operation_date DATE NOT NULL,
    member_id BIGINT REFERENCES members(id) NOT NULL,
    op_type TEXT NOT NULL CHECK (op_type IN ('DEPOSIT', 'WITHDRAWAL', 'FEE_CREDIT')),
    gross_amount NUMERIC(15,2) NOT NULL,
    unit_price NUMERIC(18,6) NOT NULL,
    units_changed NUMERIC(18,6) NOT NULL,
    fee_amount NUMERIC(15,2) DEFAULT 0.00,
    net_payment NUMERIC(15,2) NOT NULL,
    principal_change NUMERIC(15,2) NOT NULL,
    profit_change NUMERIC(15,2) NOT NULL
);

-- Ensure a same-day valuation exists for an operation
-- (this will be heavily enforced in application logic, 
-- but a foreign key is good if operation_date exactly matches valuation_date)
ALTER TABLE operations 
ADD CONSTRAINT fk_operation_valuation 
FOREIGN KEY (operation_date) REFERENCES valuations(valuation_date)
DEFERRABLE INITIALLY DEFERRED;
