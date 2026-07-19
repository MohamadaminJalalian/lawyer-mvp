CREATE DATABASE case_management_mvp;
GO

USE case_management_mvp;
GO

CREATE TABLE roles (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    code NVARCHAR(50) NOT NULL UNIQUE,
    title NVARCHAR(100) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    username NVARCHAR(100) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
);
GO

CREATE TABLE clients (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    national_code NVARCHAR(10) NULL UNIQUE,
    mobile NVARCHAR(11) NULL,
    phone NVARCHAR(20) NULL,
    address NVARCHAR(MAX) NULL,
    description NVARCHAR(MAX) NULL,
    created_by BIGINT NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT fk_clients_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
);
GO

CREATE TABLE categories (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(150) NOT NULL UNIQUE,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

CREATE TABLE cases (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    internal_number NVARCHAR(100) NOT NULL UNIQUE,
    title NVARCHAR(255) NOT NULL,
    client_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    description NVARCHAR(MAX) NULL,
    created_by BIGINT NOT NULL,
    archived_by BIGINT NULL,
    archived_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

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
        CHECK (status IN ('ACTIVE', 'ARCHIVED'))
);
GO

CREATE INDEX idx_clients_name
ON clients(last_name, first_name);
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

CREATE INDEX idx_cases_status
ON cases(status);
GO

CREATE INDEX idx_cases_created_at
ON cases(created_at DESC);
GO
