IF DB_ID(N'case_management_mvp') IS NULL
BEGIN
    CREATE DATABASE case_management_mvp;
END
GO

USE case_management_mvp;
GO

IF OBJECT_ID(N'dbo.cases', N'U') IS NOT NULL DROP TABLE dbo.cases;
IF OBJECT_ID(N'dbo.clients', N'U') IS NOT NULL DROP TABLE dbo.clients;
IF OBJECT_ID(N'dbo.users', N'U') IS NOT NULL DROP TABLE dbo.users;
IF OBJECT_ID(N'dbo.categories', N'U') IS NOT NULL DROP TABLE dbo.categories;
IF OBJECT_ID(N'dbo.roles', N'U') IS NOT NULL DROP TABLE dbo.roles;
GO

CREATE TABLE roles (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    code NVARCHAR(50) NOT NULL UNIQUE,
    title NVARCHAR(100) NOT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT df_roles_created_at DEFAULT SYSDATETIME()
);
GO

CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    username NVARCHAR(100) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL,
    is_active BIT NOT NULL CONSTRAINT df_users_is_active DEFAULT 1,
    created_at DATETIME2 NOT NULL CONSTRAINT df_users_created_at DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL CONSTRAINT df_users_updated_at DEFAULT SYSDATETIME(),

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
);
GO

CREATE TABLE clients (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    national_code NVARCHAR(10) NULL,
    mobile NVARCHAR(11) NULL,
    phone NVARCHAR(20) NULL,
    address NVARCHAR(MAX) NULL,
    description NVARCHAR(MAX) NULL,
    created_by BIGINT NOT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT df_clients_created_at DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL CONSTRAINT df_clients_updated_at DEFAULT SYSDATETIME(),

    CONSTRAINT uq_clients_national_code UNIQUE (national_code),

    CONSTRAINT fk_clients_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id),

    CONSTRAINT chk_clients_national_code
        CHECK (national_code IS NULL OR LEN(national_code) = 10),

    CONSTRAINT chk_clients_mobile
        CHECK (mobile IS NULL OR LEN(mobile) = 11)
);
GO

CREATE TABLE categories (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(150) NOT NULL UNIQUE,
    sort_order INT NOT NULL CONSTRAINT df_categories_sort_order DEFAULT 0,
    is_active BIT NOT NULL CONSTRAINT df_categories_is_active DEFAULT 1,
    created_at DATETIME2 NOT NULL CONSTRAINT df_categories_created_at DEFAULT SYSDATETIME()
);
GO

CREATE TABLE cases (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    internal_number NVARCHAR(100) NOT NULL UNIQUE,
    title NVARCHAR(255) NOT NULL,
    client_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    status NVARCHAR(20) NOT NULL CONSTRAINT df_cases_status DEFAULT N'ACTIVE',
    description NVARCHAR(MAX) NULL,
    created_by BIGINT NOT NULL,
    archived_by BIGINT NULL,
    archived_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT df_cases_created_at DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL CONSTRAINT df_cases_updated_at DEFAULT SYSDATETIME(),

    CONSTRAINT fk_cases_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id),

    CONSTRAINT fk_cases_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id),

    CONSTRAINT fk_cases_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id),

    CONSTRAINT fk_cases_archived_by
        FOREIGN KEY (archived_by)
        REFERENCES users(id),

    CONSTRAINT chk_cases_status
        CHECK (status IN (N'ACTIVE', N'ARCHIVED'))
);
GO

CREATE INDEX idx_users_role_id
ON users(role_id);
GO

CREATE INDEX idx_clients_name
ON clients(last_name, first_name);
GO

CREATE INDEX idx_clients_created_by
ON clients(created_by);
GO

CREATE INDEX idx_clients_national_code
ON clients(national_code);
GO

CREATE INDEX idx_cases_client_id
ON cases(client_id);
GO

CREATE INDEX idx_cases_category_id
ON cases(category_id);
GO

CREATE INDEX idx_cases_created_by
ON cases(created_by);
GO

CREATE INDEX idx_cases_status
ON cases(status);
GO

CREATE INDEX idx_cases_created_at
ON cases(created_at DESC);
GO
