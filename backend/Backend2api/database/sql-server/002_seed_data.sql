------------------------------------------------------------
-- 002_seed_data.sql
-- Seed data for case_management_mvp (GUID-based)
-- Authors : Tarokh Torabi & Mohammad Amin Jalalian
-- NOTE    : Idempotent – safe to run multiple times
------------------------------------------------------------

USE case_management_mvp;
GO

SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRANSACTION;
GO

------------------------------------------------------------
-- Seed constants (stable GUIDs and timestamps)
------------------------------------------------------------

DECLARE @AdminRoleId UNIQUEIDENTIFIER =
    '11111111-1111-1111-1111-111111111111';

DECLARE @StaffRoleId UNIQUEIDENTIFIER =
    '22222222-2222-2222-2222-222222222222';

DECLARE @AdminUserId UNIQUEIDENTIFIER =
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

DECLARE @StaffUserId UNIQUEIDENTIFIER =
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

DECLARE @LegalCategoryId UNIQUEIDENTIFIER =
    '10000000-0000-0000-0000-000000000001';

DECLARE @CriminalCategoryId UNIQUEIDENTIFIER =
    '10000000-0000-0000-0000-000000000002';

DECLARE @FamilyCategoryId UNIQUEIDENTIFIER =
    '10000000-0000-0000-0000-000000000003';

DECLARE @RegistrationCategoryId UNIQUEIDENTIFIER =
    '10000000-0000-0000-0000-000000000004';

DECLARE @FirstClientId UNIQUEIDENTIFIER =
    '20000000-0000-0000-0000-000000000001';

DECLARE @SecondClientId UNIQUEIDENTIFIER =
    '20000000-0000-0000-0000-000000000002';

DECLARE @ActiveCaseId UNIQUEIDENTIFIER =
    '30000000-0000-0000-0000-000000000001';

DECLARE @ArchivedCaseId UNIQUEIDENTIFIER =
    '30000000-0000-0000-0000-000000000002';

DECLARE @SeedCreatedAt DATETIME2(3) =
    CONVERT(DATETIME2(3), '2026-07-14T08:30:00');
DECLARE @SeedUpdatedAt DATETIME2(3) =
    @SeedCreatedAt;

DECLARE @ArchiveAt DATETIME2(3) =
    CONVERT(DATETIME2(3), '2026-07-14T09:00:00');
GO

------------------------------------------------------------
-- ROLES (ADMIN, STAFF)
------------------------------------------------------------

IF NOT EXISTS (
    SELECT 1 FROM dbo.roles WHERE id = @AdminRoleId
)
BEGIN
    INSERT INTO dbo.roles
    (
        id,
        code,
        title,
        created_at
    )
    VALUES
    (
        @AdminRoleId,
        N'ADMIN',
        N'مدیر سیستم',
        @SeedCreatedAt
    );
END;

IF NOT EXISTS (
    SELECT 1 FROM dbo.roles WHERE id = @StaffRoleId
)
BEGIN
    INSERT INTO dbo.roles
    (
        id,
        code,
        title,
        created_at
    )
    VALUES
    (
        @StaffRoleId,
        N'STAFF',
        N'کارمند',
        @SeedCreatedAt
    );
END;
GO

------------------------------------------------------------
-- USERS (admin, staff)
-- NOTE: password_hash must be replaced in backend config.
------------------------------------------------------------

IF NOT EXISTS (
    SELECT 1 FROM dbo.users WHERE id = @AdminUserId
)
BEGIN
    INSERT INTO dbo.users
    (
        id,
        first_name,
        last_name,
        username,
        password_hash,
        role_id,
        is_active,
        created_at,
        updated_at
    )
    VALUES
    (
        @AdminUserId,
        N'کاربر',
        N'مدیر',
        N'admin',
        N'CHANGE_THIS_HASH_IN_BACKEND',
        @AdminRoleId,
        1,
        @SeedCreatedAt,
        @SeedUpdatedAt
    );
END;

IF NOT EXISTS (
    SELECT 1 FROM dbo.users WHERE id = @StaffUserId
)
BEGIN
    INSERT INTO dbo.users
    (
        id,
        first_name,
        last_name,
        username,
        password_hash,
        role_id,
        is_active,
        created_at,
        updated_at
    )
    VALUES
    (
        @StaffUserId,
        N'کاربر',
        N'کارمند',
        N'staff',
        N'CHANGE_THIS_HASH_IN_BACKEND',
        @StaffRoleId,
        1,
        @SeedCreatedAt,
        @SeedUpdatedAt
    );
END;
GO

------------------------------------------------------------
-- CATEGORIES (حقوقی، کیفری، خانواده، ثبتی)
------------------------------------------------------------

IF NOT EXISTS (
    SELECT 1 FROM dbo.categories WHERE id = @LegalCategoryId
)
BEGIN
    INSERT INTO dbo.categories
    (
        id,
        name,
        sort_order,
        is_active,
        created_at
    )
    VALUES
    (
        @LegalCategoryId,
        N'حقوقی',
        1,
        1,
        @SeedCreatedAt
    );
END;

IF NOT EXISTS (
    SELECT 1 FROM dbo.categories WHERE id = @CriminalCategoryId
)
BEGIN
    INSERT INTO dbo.categories
    (
        id,
        name,
        sort_order,
        is_active,
        created_at
    )
    VALUES
    (
        @CriminalCategoryId,
        N'کیفری',
        2,
        1,
        @SeedCreatedAt
    );
END;

IF NOT EXISTS (
    SELECT 1 FROM dbo.categories WHERE id = @FamilyCategoryId
)
BEGIN
    INSERT INTO dbo.categories
    (
        id,
        name,
        sort_order,
        is_active,
        created_at
    )
    VALUES
    (
        @FamilyCategoryId,
        N'خانواده',
        3,
        1,
        @SeedCreatedAt
    );
END;

IF NOT EXISTS (
    SELECT 1 FROM dbo.categories WHERE id = @RegistrationCategoryId
)
BEGIN
    INSERT INTO dbo.categories
    (
        id,
        name,
        sort_order,
        is_active,
        created_at
    )
    VALUES
    (
        @RegistrationCategoryId,
        N'ثبتی',
        4,
        1,
        @SeedCreatedAt
    );
END;
GO

------------------------------------------------------------
-- CLIENTS (دو موکل نمونه طبق قرارداد Client)
------------------------------------------------------------

IF NOT EXISTS (
    SELECT 1 FROM dbo.clients WHERE id = @FirstClientId
)
BEGIN
    INSERT INTO dbo.clients
    (
        id,
        full_name,
        national_code,
        mobile,
        phone,
        address,
        description,
        is_active,
        created_by,
        created_at,
        updated_at
    )
    VALUES
    (
        @FirstClientId,
        N'علی رضایی',
        N'0012345678',
        N'09121234567',
        N'02112345678',
        N'تهران، میدان ونک',
        N'موکل نمونه اول برای تست فهرست و جستجو',
        1,
        @AdminUserId,
        @SeedCreatedAt,
        @SeedUpdatedAt
    );
END;

IF NOT EXISTS (
    SELECT 1 FROM dbo.clients WHERE id = @SecondClientId
)
BEGIN
    INSERT INTO dbo.clients
    (
        id,
        full_name,
        national_code,
        mobile,
        phone,
        address,
        description,
        is_active,
        created_by,
        created_at,
        updated_at
    )
    VALUES
    (
        @SecondClientId,
        N'مریم کریمی',
        N'0023456789',
        N'09129876543',
        N'02187654321',
        N'تهران، خیابان انقلاب',
        N'موکل نمونه دوم برای تست فیلترها و آرشیو',
        1,
        @AdminUserId,
        @SeedCreatedAt,
        @SeedUpdatedAt
    );
END;
GO

------------------------------------------------------------
-- CASES (یک ACTIVE، یک ARCHIVED)
-- طبق موجودیت Case در PDF (دادگاه، وضعیت، آرشیو)
------------------------------------------------------------

-- ACTIVE case
IF NOT EXISTS (
    SELECT 1 FROM dbo.cases WHERE id = @ActiveCaseId
)
BEGIN
    INSERT INTO dbo.cases
    (
        id,
        internal_number,
        title,
        client_id,
        category_id,
        court_case_number,
        court_name,
        opponent_name,
        description,
        status,
        archived_at,
        archived_by,
        created_by,
        created_at,
        updated_at
    )
    VALUES
    (
        @ActiveCaseId,
        N'1405-001',
        N'پرونده مطالبه وجه',
        @FirstClientId,
        @LegalCategoryId,
        N'0301405123456789',
        N'دادگاه حقوقی تهران، شعبه ۱۲',
        N'شرکت نمونه الف',
        N'پرونده نمونه فعال برای تست فهرست، جستجو و فیلتر وضعیت ACTIVE',
        N'ACTIVE',
        NULL,
        NULL,
        @StaffUserId,
        @SeedCreatedAt,
        @SeedUpdatedAt
    );
END;

-- ARCHIVED case
IF NOT EXISTS (
    SELECT 1 FROM dbo.cases WHERE id = @ArchivedCaseId
)
BEGIN
    INSERT INTO dbo.cases
    (
        id,
        internal_number,
        title,
        client_id,
        category_id,
        court_case_number,
        court_name,
        opponent_name,
        description,
        status,
        archived_at,
        archived_by,
        created_by,
        created_at,
        updated_at
    )
    VALUES
    (
        @ArchivedCaseId,
        N'1405-002',
        N'پرونده اختلاف ملکی',
        @SecondClientId,
        @RegistrationCategoryId,
        N'0301405123456790',
        N'اداره ثبت اسناد تهران',
        N'شرکت نمونه ب',
        N'پرونده نمونه آرشیوشده برای تست فهرست آرشیو و محدودیت دسترسی ADMIN',
        N'ARCHIVED',
        @ArchiveAt,
        @AdminUserId,
        @StaffUserId,
        @SeedCreatedAt,
        @ArchiveAt
    );
END;
GO

COMMIT TRANSACTION;
GO
