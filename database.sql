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
        Credit             INT                 NOT NULL,
        CPassword          VARCHAR             NOT NULL,
        CLocation          VARCHAR             NOT NULL,
        DOB/Establishment  DATE                NOT NULL,
        CPhone             CHAR(10)            NOT NULL,            
        Financial_details  VARCHAR             NOT NULL,
        CONSTRAINT CPK PRIMARY KEY(CEmail),
        CONSTRAINT CPW CHECK(LENGTH(CPassword) >= 8 AND CPassword ~ '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=\-{}\[\]:;"''<>,.?/]).+$')
    );

-- Create the LOAN_PROVIDER table
CREATE TABLE LOAN_PROVIDER
    (
        LEmail             VARCHAR(20)         NOT NULL,
        Fname              VARCHAR(15)         NOT NULL,
        Lname              VARCHAR(15)         NOT NULL,
        Terms              VARCHAR             NOT NULL,
        LPassword          VARCHAR             NOT NULL,
        LLocation          VARCHAR             NOT NULL,
        LPhone             CHAR(10)            NOT NULL,
        LicenseNo          CHAR(10)            NOT NULL,
        CONSTRAINT LPK PRIMARY KEY(LEmail),
        CONSTRAINT LPW CHECK(LENGTH(LPassword) >= 8 AND LPassword ~ '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=\-{}\[\]:;"''<>,.?/]).+$')
    );

-- Create the LOAN_POST table
CREATE TABLE LOAN_POST
    (
        PName              VARCHAR             NOT NULL,
        MaxRate            INT                 NOT NULL,
        MinTermL           DATE                NOT NULL,
        MaxTermL           DATE                NOT NULL,
        PStatus            VARCHAR             NOT NULL,
        LType              VARCHAR             NOT NULL,
        P_ID               CHAR(10)            NOT NULL,
        Desired_amt        VARCHAR             NOT NULL,
        CEmail             VARCHAR(20),
        M_ID               CHAR(10),          
        CONSTRAINT LPPK PRIMARY KEY(P_ID),
        CONSTRAINT LPSK UNIQUE(CEmail),
        CONSTRAINT LPSK2 UNIQUE(M_ID),
        CONSTRAINT LPFK FOREIGN KEY(CEmail) REFERENCES CLIENT(CEmail),
        CONSTRAINT LPFK2 FOREIGN KEY(M_ID) REFERENCES MATCHED_POST(M_ID)
    );

-- Create the LOAN_OFFER table
CREATE TABLE LOAN_OFFER
    (
        OName              VARCHAR             NOT NULL,
        MinRate            INT                 NOT NULL,
        MinTermL           DATE                NOT NULL,
        MaxTermL           DATE                NOT NULL,
        OStatus            VARCHAR             NOT NULL,
        LType              VARCHAR             NOT NULL,
        O_ID               CHAR(10),           NOT NULL,
        Min_amt            VARCHAR             NOT NULL,
        Max_amt            VARCHAR             NOT NULL,
        LEmail             VARCHAR(20),
        M_ID               CHAR(10),
        CONSTRAINT LOPK PRIMARY KEY(O_ID),
        CONSTRAINT LOSK UNIQUE(LEmail),
        CONSTRAINT LOSK2 UNIQUE(M_ID),
        CONSTRAINT LOFK FOREIGN KEY(LEmail) REFERENCES LOAN_PROVIDER(LEmail),
        CONSTRAINT LOFK2 FOREIGN KEY(M_ID) REFERENCES MATCHED_POST(M_ID)
    );

-- Create the ADMIN table
CREATE TABLE ADMIN
    (
        AEmail             VARCHAR(20)         NOT NULL,
        Fname              VARCHAR             NOT NULL,
        Lname              VARCHAR             NOT NULL,
        APassword          VARCHAR             NOT NULL,
        CONSTRAINT APK PRIMARY KEY(AEmail)
    );

-- Create the MATCHED_POST table
CREATE TABLE MATCHED_POST
    (
        MRate           INT,
        MDate           DATE,
        MStatus         VARCHAR,
        M_ID            CHAR(10)            NOT NULL,
        P_ID            CHAR(10),            
        O_ID            CHAR(10),          
        CDecision       BOOLEAN,
        LDecision       BOOLEAN,
        CEmail          VARCHAR(20),         
        LEmail          VARCHAR(20),         
        CONSTRAINT MPPK PRIMARY KEY(M_ID),
        CONSTRAINT MPSK UNIQUE(P_ID),
        CONSTRAINT MPSK2 UNIQUE(O_ID),
        CONSTRAINT MPSK3 UNIQUE(CEmail),
        CONSTRAINT MPSK4 UNIQUE(LEmail),
        CONSTRAINT MPFK FOREIGN KEY(P_ID) REFERENCES LOAN_POST(P_ID),
        CONSTRAINT MPFK2 FOREIGN KEY(O_ID) REFERENCES LOAN_OFFER(O_ID),
        CONSTRAINT MPFK3 FOREIGN KEY(CEmail) REFERENCES CLIENT(CEmail),
        CONSTRAINT MPFK4 FOREIGN KEY(LEmail) REFERENCES LOAN_PROVIDER(LEmail)
    );

-- Create the CLIENT_DASHBOARD table
CREATE TABLE CLIENT_DASHBOARD
    (
        CD_ID       CHAR(10)            NOT NULL,
        P_ID        CHAR(10),          
        CEmail      VARCHAR(20),        
        CONSTRAINT CDPK PRIMARY KEY(CD_ID),
        CONSTRAINT CDSK UNIQUE(P_ID),
        CONSTRAINT CDSK2 UNIQUE(CEmail),
        CONSTRAINT CPFK FOREIGN KEY(P_ID) REFERENCES LOAN_POST(P_ID),
        CONSTRAINT CDFK2 FOREIGN KEY(CEmail) REFERENCES CLIENT(CEmail)
    );

-- Create the PROVIDER_DASHBOARD table
CREATE TABLE PROVIDER_DASHBOARD
    (
        PD_ID       CHAR(10)            NOT NULL,
        O_ID        CHAR(10)            
        LEmail      VARCHAR(20)         
        CONSTRAINT PDPK PRIMARY KEY(PD_ID),
        CONSTRAINT PDSK UNIQUE(O_ID),
        CONSTRAINT PDSK2 UNIQUE(LEmail),
        CONSTRAINT PDFK FOREIGN KEY(O_ID) REFERENCES LOAN_OFFER(O_ID),
        CONSTRAINT PDFK2 FOREIGN KEY(LEmail) REFERENCES LOAN_PROVIDER(LEmail)
    );

-- Create the POST_MATCH table
CREATE TABLE POST_MATCH
    (
        P_ID        CHAR(10),            
        O_ID        CHAR(10),           
        M_ID        CHAR(10),            
        CONSTRAINT PMFK FOREIGN KEY(P_ID) REFERENCES LOAN_POST(P_ID),
        CONSTRAINT PMFK2 FOREIGN KEY(O_ID) REFERENCES LOAN_OFFER(O_ID),
        CONSTRAINT PMFK3 FOREIGN KEY(M_ID) REFERENCES MATCHED_POST(M_ID)
    );

-- Create the AUTHENTICATES table
CREATE TABLE AUTHENTICATES
    (
        AEmail      VARCHAR(20),
        CEmail      VARCHAR(20),
        LEmail      VARCHAR(20),
        CONSTRAINT AFK FOREIGN KEY(AEmail) REFERENCES ADMIN(AEmail),
        CONSTRAINT AFK2 FOREIGN KEY(CEmail) REFERENCES CLIENT(CEmail),
        CONSTRAINT AFK3 FOREIGN KEY(LEmail) REFERENCES LOAN_PROVIDER(LEmail)
    );

-- Create the MATCH_CHECK table
CREATE TABLE MATCH_CHECK
    (
        O_ID        CHAR(10),
        P_ID        CHAR(10),
        MRate       INT,
        CONSTRAINT MCFK FOREIGN KEY(O_ID) REFERENCES LOAN_OFFER(O_ID),
        CONSTRAINT MCFK2 FOREIGN KEY(P_ID) REFERENCES LOAN_POST(P_ID)
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
