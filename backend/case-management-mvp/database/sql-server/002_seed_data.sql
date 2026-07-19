USE case_management_mvp;
GO

INSERT INTO roles (code, title)
VALUES
(N'ADMIN', N'مدیر سیستم'),
(N'STAFF', N'کارمند');
GO

INSERT INTO categories (title, sort_order, is_active)
VALUES
(N'حقوقی', 1, 1),
(N'کیفری', 2, 1),
(N'خانواده', 3, 1),
(N'ثبتی', 4, 1);
GO

INSERT INTO users (
    first_name,
    last_name,
    username,
    password_hash,
    role_id,
    is_active
)
VALUES
(
    N'Admin',
    N'User',
    N'admin',
    N'CHANGE_THIS_HASH_IN_BACKEND',
    1,
    1
);
GO
