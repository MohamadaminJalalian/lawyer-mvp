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
(N'Admin', N'User', N'admin', N'CHANGE_THIS_HASH_IN_BACKEND', 1, 1),
(N'Staff', N'User', N'staff', N'CHANGE_THIS_HASH_IN_BACKEND', 2, 1);
GO

INSERT INTO clients (
    first_name,
    last_name,
    national_code,
    mobile,
    phone,
    address,
    description,
    created_by
)
VALUES
(N'علی', N'احمدی', N'1234567890', N'09121234567', N'02112345678', N'تهران', N'موکل تست اول', 1),
(N'مریم', N'کریمی', N'2234567890', N'09129876543', N'02187654321', N'تهران', N'موکل تست دوم', 1);
GO

INSERT INTO cases (
    internal_number,
    title,
    client_id,
    category_id,
    status,
    description,
    created_by,
    archived_by,
    archived_at
)
VALUES
(N'CASE-1405-0001', N'مطالبه وجه', 1, 1, N'ACTIVE', N'پرونده تست فعال', 1, NULL, NULL),
(N'CASE-1405-0002', N'اختلاف ملکی', 2, 4, N'ARCHIVED', N'پرونده تست بایگانی شده', 1, 1, SYSDATETIME());
GO
