CREATE TABLE transactions (
                              id          BIGSERIAL      PRIMARY KEY,
                              occurred_at TIMESTAMP      NOT NULL,
                              description VARCHAR(255)   NOT NULL,
                              vendor      VARCHAR(100)   NOT NULL,
                              amount      NUMERIC(12, 2) NOT NULL CHECK (amount <> 0),
                              created_at  TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_occurred_at ON transactions (occurred_at DESC);
CREATE INDEX idx_transactions_vendor ON transactions (LOWER(vendor));