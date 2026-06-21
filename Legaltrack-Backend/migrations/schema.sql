-- LegalTrack Database Schema
-- MySQL 8+

CREATE DATABASE IF NOT EXISTS legaltrack;
USE legaltrack;

-- ============================================
-- Table: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(120) NOT NULL,
    lastName VARCHAR(120) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    userRole ENUM('admin', 'manager', 'user') DEFAULT 'user',
    username VARCHAR(150),
    theme ENUM('light', 'dark') DEFAULT 'light',
    language ENUM('en', 'he') DEFAULT 'en',
    notificationsEnabled BOOLEAN DEFAULT TRUE,
    createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    updateDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Table: clients
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
    clientId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(200) NOT NULL,
    address TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

-- ============================================
-- Table: cases
-- ============================================
CREATE TABLE IF NOT EXISTS cases (
    caseId INT AUTO_INCREMENT PRIMARY KEY,
    clientId INT NOT NULL,
    type ENUM('Civil', 'Criminal', 'Contract', 'Family', 'Labor', 'Other') NOT NULL,
    status ENUM('open', 'pending', 'closed') DEFAULT 'open',
    description TEXT NOT NULL,
    openedDate DATE DEFAULT (CURRENT_DATE),
    closedDate DATE NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clientId) REFERENCES clients(clientId) ON DELETE CASCADE
);

-- ============================================
-- Table: folders
-- ============================================
CREATE TABLE IF NOT EXISTS folders (
    folderId INT AUTO_INCREMENT PRIMARY KEY,
    caseId INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (caseId) REFERENCES cases(caseId) ON DELETE CASCADE
);

-- ============================================
-- Table: documents
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
    documentId INT AUTO_INCREMENT PRIMARY KEY,
    caseId INT NOT NULL,
    folderId INT NULL,
    filename VARCHAR(255) NOT NULL,
    filePath VARCHAR(500) NOT NULL,
    mimetype VARCHAR(100) NOT NULL,
    size INT NOT NULL,
    aiSummary TEXT,
    uploadDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (caseId) REFERENCES cases(caseId) ON DELETE CASCADE,
    FOREIGN KEY (folderId) REFERENCES folders(folderId) ON DELETE SET NULL
);

-- ============================================
-- Table: notes
-- ============================================
CREATE TABLE IF NOT EXISTS notes (
    noteId INT AUTO_INCREMENT PRIMARY KEY,
    caseId INT NOT NULL,
    userId INT NOT NULL,
    content TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (caseId) REFERENCES cases(caseId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

-- ============================================
-- Table: user_cases (Junction table - Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS user_cases (
    userId INT NOT NULL,
    caseId INT NOT NULL,
    assignedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, caseId),
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
    FOREIGN KEY (caseId) REFERENCES cases(caseId) ON DELETE CASCADE
);