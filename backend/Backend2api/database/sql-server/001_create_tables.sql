------------------------------------------------------------
-- Database: case_management_mvp
-- Purpose : Core schema for Case Management MVP (GUID-based)
-- Authors : Tarokh Torabi & Mohammad Amin Jalalian
-- Note    : This script is intended for development environment.
--           DO NOT use DROP TABLE section in production.
------------------------------------------------------------

IF NOT EXISTS (
    SELECT 1 FROM sys.databases WHERE name = N'case_management_mvp'
)
BEGIN
    CREATE DATABASE case_management_mvp;
END;
GO

USE case_management_mvp;
GO

------------------------------------------------------------
-- DEVELOPMENT-ONLY: drop existing tables (dangerous in prod)
------------------------------------------------------------

IF OBJECT_ID(N'dbo.cases', N'U') IS NOT NULL
    DROP TABLE dbo.cases;
IF OBJECT_ID(N'dbo.clients', N'U') IS NOT NULL
    DROP TABLE dbo.clients;
IF OBJECT_ID(N'dbo.users', N'U') IS NOT NULL
    DROP TABLE dbo.users;
IF OBJECT_ID(N'dbo.categories', N'U') IS NOT NULL
    DROP TABLE dbo.categories;
IF OBJECT_ID(N'dbo.roles', N'U') IS NOT NULL
    DROP TABLE dbo.roles;
GO

------------------------------------------------------------
-- ROLES
------------------------------------------------------------

CREATE TABLE dbo.roles (
    id UNIQUEIDENTIFIER NOT NULL
        CONSTRAINT pk_roles PRIMARY KEY
        CONSTRAINT df_roles_id DEFAULT NEWSEQUENTIALID(),
    code NVARCHAR(50) NOT NULL UNIQUE,
    title NVARCHAR(100) NOT NULL,
    created_at DATETIME2(3) NOT NULL
        CONSTRAINT df_roles_created_at DEFAULT SYSUTCDATETIME()
);
GO

------------------------------------------------------------
-- USERS
------------------------------------------------------------

CREATE TABLE dbo.users (
    id UNIQUEIDENTIFIER NOT NULL
        CONSTRAINT pk_users PRIMARY KEY
        CONSTRAINT df_users_id DEFAULT NEWSEQUENTIALID(),

    first_name NVARCHAR(100) NOT NULL,
    last_name  NVARCHAR(100) NOT NULL,

    username NVARCHAR(100) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,

    role_id UNIQUEIDENTIFIER NOT NULL,

    is_active BIT NOT NULL
        CONSTRAINT df_users_is_active DEFAULT (1),

    created_at DATETIME2(3) NOT NULL
        CONSTRAINT df_users_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(3) NOT NULL
        CONSTRAINT df_users_updated_at DEFAULT SYSUTCDATETIME()
);
GO

ALTER TABLE dbo.users
ADD CONSTRAINT fk_users_role_id
    FOREIGN KEY (role_id) REFERENCES dbo.roles(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

------------------------------------------------------------
-- CLIENTS
-- Contract: fullName, nationalCode(10, required, unique), mobile/phone,
--           address <= 1000, description <= 1000
------------------------------------------------------------

CREATE TABLE dbo.clients (
    id UNIQUEIDENTIFIER NOT NULL
        CONSTRAINT pk_clients PRIMARY KEY
        CONSTRAINT df_clients_id DEFAULT NEWSEQUENTIALID(),

    full_name NVARCHAR(150) NOT NULL,
    national_code NVARCHAR(10) NOT NULL UNIQUE,

    mobile NVARCHAR(20) NULL,
    phone  NVARCHAR(20) NULL,

    address NVARCHAR(1000) NULL,
    description NVARCHAR(1000) NULL,

    created_by UNIQUEIDENTIFIER NOT NULL,

    created_at DATETIME2(3) NOT NULL
        CONSTRAINT df_clients_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(3) NOT NULL
        CONSTRAINT df_clients_updated_at DEFAULT SYSUTCDATETIME()
);
GO

ALTER TABLE dbo.clients
ADD CONSTRAINT fk_clients_created_by
    FOREIGN KEY (created_by) REFERENCES dbo.users(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Constraints according to JSON contract
ALTER TABLE dbo.clients
ADD CONSTRAINT ck_clients_full_name_length
    CHECK (LEN(LTRIM(RTRIM(full_name))) BETWEEN 3 AND 150);
GO

ALTER TABLE dbo.clients
ADD CONSTRAINT ck_clients_national_code_digits
    CHECK (
        national_code NOT LIKE '%[^0-9]%' AND
        LEN(national_code) = 10
    );
GO

ALTER TABLE dbo.clients
ADD CONSTRAINT ck_clients_mobile_length
    CHECK (mobile IS NULL OR LEN(mobile) <= 20);
GO

ALTER TABLE dbo.clients
ADD CONSTRAINT ck_clients_phone_length
    CHECK (phone IS NULL OR LEN(phone) <= 20);
GO

------------------------------------------------------------
-- CATEGORIES
-- Contract: name, sortOrder, isActive
------------------------------------------------------------

CREATE TABLE dbo.categories (
    id UNIQUEIDENTIFIER NOT NULL
        CONSTRAINT pk_categories PRIMARY KEY
        CONSTRAINT df_categories_id DEFAULT NEWSEQUENTIALID(),

    name NVARCHAR(100) NOT NULL UNIQUE,
    sort_order INT NOT NULL
        CONSTRAINT df_categories_sort_order DEFAULT (0),
    is_active BIT NOT NULL
        CONSTRAINT df_categories_is_active DEFAULT (1),

    created_at DATETIME2(3) NOT NULL
        CONSTRAINT df_categories_created_at DEFAULT SYSUTCDATETIME()
);
GO

------------------------------------------------------------
-- CASES
-- Contract: internalNumber(<=50, unique), title(<=200),
--           clientId, categoryId,
--           courtCaseNumber(<=100), courtName(<=200), opponentName(<=150),
--           description(<=2000),
--           status in (ACTIVE, ARCHIVED),
--           createdBy, archivedBy, archivedAt, createdAt, updatedAt
------------------------------------------------------------

CREATE TABLE dbo.cases (
    id UNIQUEIDENTIFIER NOT NULL
        CONSTRAINT pk_cases PRIMARY KEY
        CONSTRAINT df_cases_id DEFAULT NEWSEQUENTIALID(),

    internal_number NVARCHAR(50) NOT NULL UNIQUE,
    title NVARCHAR(200) NOT NULL,

    client_id UNIQUEIDENTIFIER NOT NULL,
    category_id UNIQUEIDENTIFIER NOT NULL,

    court_case_number NVARCHAR(100) NULL,
    court_name        NVARCHAR(200) NULL,
    opponent_name     NVARCHAR(150) NULL,

    description NVARCHAR(2000) NULL,

    status NVARCHAR(20) NOT NULL
        CONSTRAINT df_cases_status DEFAULT N'ACTIVE',

    created_by UNIQUEIDENTIFIER NOT NULL,
    archived_by UNIQUEIDENTIFIER NULL,
    archived_at DATETIME2(3) NULL,

    created_at DATETIME2(3) NOT NULL
        CONSTRAINT df_cases_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(3) NOT NULL
        CONSTRAINT df_cases_updated_at DEFAULT SYSUTCDATETIME()
);
GO

ALTER TABLE dbo.cases
ADD CONSTRAINT fk_cases_client_id
    FOREIGN KEY (client_id) REFERENCES dbo.clients(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

ALTER TABLE dbo.cases
ADD CONSTRAINT fk_cases_category_id
    FOREIGN KEY (category_id) REFERENCES dbo.categories(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

ALTER TABLE dbo.cases
ADD CONSTRAINT fk_cases_created_by
    FOREIGN KEY (created_by) REFERENCES dbo.users(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

ALTER TABLE dbo.cases
ADD CONSTRAINT fk_cases_archived_by
    FOREIGN KEY (archived_by) REFERENCES dbo.users(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

ALTER TABLE dbo.cases
ADD CONSTRAINT ck_cases_status_valid
    CHECK (status IN (N'ACTIVE', N'ARCHIVED'));
GO

------------------------------------------------------------
-- INDEXES
------------------------------------------------------------

-- Users
CREATE INDEX idx_users_role_id
    ON dbo.users (role_id);
GO

-- Clients
CREATE INDEX idx_clients_full_name
    ON dbo.clients (full_name);
GO

CREATE INDEX idx_clients_national_code
    ON dbo.clients (national_code);
GO

CREATE INDEX idx_clients_created_by
    ON dbo.clients (created_by);
GO

-- Categories
CREATE INDEX idx_categories_is_active_sort
    ON dbo.categories (is_active, sort_order);
GO

-- Cases
CREATE INDEX idx_cases_client_id_status
    ON dbo.cases (client_id, status);
GO

CREATE INDEX idx_cases_category_id_status
    ON dbo.cases (category_id, status);
GO

CREATE INDEX idx_cases_status_created_at
    ON dbo.cases (status, created_at DESC);
GO

CREATE INDEX idx_cases_internal_number
    ON dbo.cases (internal_number);
GO

CREATE INDEX idx_cases_court_fields
    ON dbo.cases (court_case_number, court_name, opponent_name);
GO
