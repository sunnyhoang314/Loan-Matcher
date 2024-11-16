-- Create the database
CREATE DATABASE LOAN_MATCHER;

-- Switch to the new database
USE LOAN_MATCHER;

-- Create the CLIENT table
CREATE TABLE CLIENT
    (
        CEmail             VARCHAR(20)         NOT NULL,
        Fname              VARCHAR(15)         NOT NULL,
        Lname              VARCHAR(15)         NOT NULL,
        Credit             INT,
        CPassword          VARCHAR             NOT NULL,
        CLocation          VARCHAR,
        DOB/Establishment  DATE,
        CPhone             CHAR(10),
        Financial_details  VARCHAR,
        PRIMARY KEY(CEmail),
        CONSTRAINT CPW CHECK(LENGTH(CPassword) >= 8 AND CPassword ~ '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=\-{}\[\]:;"''<>,.?/]).+$')
    );

-- Create the LOAN_PROVIDER table
CREATE TABLE LOAN_PROVIDER
    (
        LEmail             VARCHAR(20)         NOT NULL,
        Fname              VARCHAR(15)         NOT NULL,
        Lname              VARCHAR(15)         NOT NULL,
        Terms              VARCHAR,
        LPassword          VARCHAR             NOT NULL,
        LLocation          VARCHAR,
        LPhone             CHAR(10),
        LicenseNo          CHAR(10),
        PRIMARY KEY(LEmail),
        CONSTRAINT LPW CHECK(LENGTH(LPassword) >= 8 AND LPassword ~ '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=\-{}\[\]:;"''<>,.?/]).+$')
    );

-- Create the LOAN_POST table
CREATE TABLE LOAN_POST
    (
        PName              VARCHAR,
        MaxRate            INT,
        MinTermL           DATE,
        MaxTermL           DATE,
        PStatus            VARCHAR,
        LType              VARCHAR,
        P_ID               CHAR(10)            NOT NULL,
        Desired_amt        VARCHAR,
        CEmail             VARCHAR(20),
        M_ID               CHAR(10)            NOT NULL,           
        PRIMARY KEY(P_ID),
        FOREIGN KEY(CEmail) REFERENCES CLIENT(CEmail)
    );

-- Create the LOAN_OFFER table
CREATE TABLE LOAN_OFFER
    (
        OName              VARCHAR,
        MinRate            INT,
        MinTermL           DATE,
        MaxTermL           DATE,
        OStatus            VARCHAR,
        LType              VARCHAR,
        O_ID               CHAR(10),           NOT NULL,
        Min_amt            VARCHAR,
        Max_amt            VARCHAR,
        LEmail             VARCHAR(20)         NOT NULL,
        PRIMARY KEY(O_ID),
        FOREIGN KEY(LEmail) REFERENCES LOAN_PROVIDER(LEmail)
    );

-- Create the ADMIN table
CREATE TABLE ADMIN
    (
        AEmail             VARCHAR(20)         NOT NULL,
        Fname              VARCHAR,
        Lname              VARCHAR,
        APassword          VARCHAR,
        PRIMARY KEY(AEmail)
    );

-- Create the MATCHED_POST table
CREATE TABLE MATCHED_POST
    (
        MRate           INT,
        MDate           DATE,
        MStatus         VARCHAR,
        M_ID            CHAR(10),
        P_ID            CHAR(10)            NOT NULL,
        O_ID            CHAR(10)            NOT NULL,
        CDecision       BOOLEAN,
        LDecision       BOOLEAN,
        CEmail          VARCHAR(20)         NOT NULL,
        LEmail          VARCHAR(20)         NOT NULL,
        PRIMARY KEY(M_ID),
        FOREIGN KEY(P_ID) REFERENCES LOAN_POST(P_ID),
        FOREIGN KEY(O_ID) REFERENCES LOAN_OFFER(O_ID),
        FOREIGN KEY(CEmail) REFERENCES CLIENT(CEmail),
        FOREIGN KEY(LEmail) REFERENCES LOAN_PROVIDER(LEmail)
    );

-- Create the CLIENT_DASHBOARD table
CREATE TABLE CLIENT_DASHBOARD
    (
        CD_ID       CHAR(10)            NOT NULL,
        P_ID        CHAR(10)            NOT NULL,
        CEmail      VARCHAR(20)         NOT NULL,
        PRIMARY KEY(CD_ID),
        FOREIGN KEY(P_ID) REFERENCES LOAN_POST(P_ID),
        FOREIGN KEY(CEmail) REFERENCES CLIENT(CEmail)
    );

-- Create the PROVIDER_DASHBOARD table
CREATE TABLE PROVIDER_DASHBOARD
    (
        PD_ID       CHAR(10)            NOT NULL,
        O_ID        CHAR(10)            NOT NULL,
        LEmail      VARCHAR(20)         NOT NULL,
        PRIMARY KEY(PD_ID),
        FOREIGN KEY(O_ID) REFERENCES LOAN_OFFER(O_ID),
        FOREIGN KEY(LEmail) REFERENCES LOAN_PROVIDER(LEmail)
    );

-- Create the POST_MATCH table
CREATE TABLE POST_MATCH
    (
        P_ID        CHAR(10)            NOT NULL,
        O_ID        CHAR(10)            NOT NULL,
        M_ID        CHAR(10)            NOT NULL,
        FOREIGN KEY(P_ID) REFERENCES LOAN_POST(P_ID),
        FOREIGN KEY(O_ID) REFERENCES LOAN_OFFER(O_ID),
        FOREIGN KEY(M_ID) REFERENCES MATCHED_POST(M_ID)
    );

-- Create the AUTHENTICATES table
CREATE TABLE AUTHENTICATES
    (
        AEmail      VARCHAR(20)         NOT NULL,
        CEmail      VARCHAR(20)         NOT NULL,
        LEmail      VARCHAR(20)         NOT NULL,
        FOREIGN KEY(AEmail) REFERENCES ADMIN(AEmail),
        FOREIGN KEY(CEmail) REFERENCES CLIENT(CEmail),
        FOREIGN KEY(LEmail) REFERENCES LOAN_PROVIDER(LEmail)
    );

-- Create the MATCH_CHECK table
CREATE TABLE MATCH_CHECK
    (
        O_ID        CHAR(10)            NOT NULL,
        P_ID        CHAR(10)            NOT NULL,
        MRate       INT,
        FOREIGN KEY(O_ID) REFERENCES LOAN_OFFER(O_ID),
        FOREIGN KEY(P_ID) REFERENCES LOAN_POST(P_ID)
    );

-- Stored Procedure to Add Client Information
CREATE PROCEDURE AddClientInformation
    (
        IN p_CEmail VARCHAR(20),
        IN p_FName VARCHAR(15),
        IN p_LName VARCHAR(15),
        IN p_Credit INT,
        IN p_CPassword VARCHAR(255),
        IN p_CLocation VARCHAR(255),
        IN p_DOB DATE,
        IN p_CPhone CHAR(10),
        IN p_FinancialDetails VARCHAR(255)
    )
BEGIN
    INSERT INTO CLIENT 
    (
        CEmail, Fname, Lname, Credit, CPassword, CLocation, DOB/Establishment, CPhone, Financial_details
    )
    VALUES
    (
        p_CEmail, p_FName, p_LName, p_Credit, p_CPassword, p_CLocation, p_DOB, p_CPhone, p_FinancialDetails
    );
END;

-- Stored Procedure to Add Loan Provider Information
CREATE PROCEDURE AddLoanProviderInformation
    (
        IN p_LEmail VARCHAR(20),
        IN p_FName VARCHAR(15),
        IN p_LName VARCHAR(15),
        IN p_Terms VARCHAR(255),
        IN p_LPassword VARCHAR(255),
        IN p_LLocation VARCHAR(255),
        IN p_LPhone CHAR(10),
        IN p_LicenseNo CHAR(10)
    )
BEGIN
    INSERT INTO LOAN_PROVIDER
    (
        LEmail, Fname, Lname, Terms, LPassword, LLocation, LPhone, LicenseNo
    )
    VALUES
    (
        p_LEmail, p_FName, p_LName, p_Terms, p_LPassword, p_LLocation, p_LPhone, p_LicenseNo
    );
END;

CREATE PROCEDURE EDITCLIENTINFO
    (
        IN p_CEmail VARCHAR(20),
        IN p_FName VARCHAR(15),
        IN p_LName VARCHAR(15),
        IN p_Credit INT,
        IN p_CPassword VARCHAR(255),
        IN p_CLocation VARCHAR(255),
        IN p_DOB DATE,
        IN p_CPhone CHAR(10),
        IN p_FinancialDetails VARCHAR(255)
    )
BEGIN
    UPDATE CLIENT
    SET 
        Fname = p_FName,
        Lname = p_LName,
        Credit = p_Credit,
        CPassword = p_CPassword,
        CLocation = p_CLocation,
        DOB/Establishment = p_DOB,
        CPhone = p_CPhone,
        Financial_details = p_FinancialDetails
    WHERE CEmail = p_CEmail;
END;

CREATE PROCEDURE EDITLOANPROVIDERINFO
    (
        IN p_LEmail VARCHAR(20),
        IN p_FName VARCHAR(15),
        IN p_LName VARCHAR(15),
        IN p_Terms VARCHAR(255),
        IN p_LPassword VARCHAR(255),
        IN p_LLocation VARCHAR(255),
        IN p_LPhone CHAR(10),
        IN p_LicenseNo CHAR(10)
    )
BEGIN
    UPDATE LOAN_PROVIDER
    SET 
        Fname = p_FName,
        Lname = p_LName,
        Terms = p_Terms,
        LPassword = p_LPassword,
        LLocation = p_LLocation,
        LPhone = p_LPhone,
        LicenseNo = p_LicenseNo
    WHERE LEmail = p_LEmail;
END;
