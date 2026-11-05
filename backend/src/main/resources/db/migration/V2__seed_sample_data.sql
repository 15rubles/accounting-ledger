INSERT INTO transactions (occurred_at, description, vendor, amount) VALUES
    -- this month
    (date_trunc('day', now()) - interval '1 day'  + time '09:15', 'Invoice 1001 paid',    'Joe',          1500.00),
    (date_trunc('day', now()) - interval '1 day'  + time '14:30', 'ergonomic keyboard',   'Amazon',        -89.50),
    (date_trunc('day', now())                     + time '08:05', 'coffee beans',         'Starbucks',     -18.75),

    -- last month
    (date_trunc('month', now()) - interval '20 days' + time '10:00', 'Invoice 998 paid',  'Acme Corp',    2300.00),
    (date_trunc('month', now()) - interval '15 days' + time '16:45', 'office chair',      'IKEA',         -249.99),
    (date_trunc('month', now()) - interval '5 days'  + time '12:20', 'monitor',           'Amazon',       -329.00),

    -- last year
    (date_trunc('year', now()) - interval '60 days'  + time '11:00', 'annual bonus',      'Employer',     5000.00),
    (date_trunc('year', now()) - interval '30 days'  + time '13:10', 'laptop',            'Best Buy',    -1199.99),

    -- spec sample rows
    ('2023-04-15 10:13:25', 'ergonomic keyboard', 'Amazon', -89.50),
    ('2023-04-15 11:15:00', 'Invoice 1001 paid',  'Joe',    1500.00);