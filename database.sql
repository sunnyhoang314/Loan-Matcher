-- Create the database
CREATE DATABASE LOAN_MATCHER;

-- Switch to the new database
USE LOAN_MATCHER;

-- Create the CLIENT table
CREATE TABLE CLIENT
    (
        CEmail             VARCHAR(50)         NOT NULL,
        Fname              VARCHAR(15)         NOT NULL,
        Lname              VARCHAR(15)         NOT NULL,
        Credit             INT                 ,
        CPassword          VARCHAR(255)        NOT NULL,
        CLocation          VARCHAR(255)        ,
        DOB_Establishment  DATE                ,
        CPhone             CHAR(20)            ,            
        Financial_details  VARCHAR(255)        ,
        CONSTRAINT CPK PRIMARY KEY(CEmail)
    );

-- Create the LOAN_PROVIDER table
CREATE TABLE LOAN_PROVIDER
    (
        LEmail             VARCHAR(50)         NOT NULL,
        Fname              VARCHAR(15)         NOT NULL,
        Lname              VARCHAR(15)         NOT NULL,
        LPassword          VARCHAR(255)        NOT NULL,
        LLocation          VARCHAR(255)        ,
        LPhone             CHAR(20)            ,
        LicenseNo          CHAR(10)            ,
        CONSTRAINT LPK PRIMARY KEY(LEmail)
    );

-- Create the ADMIN table
CREATE TABLE ADMIN
    (
        AEmail             VARCHAR(50)         NOT NULL,
        Fname              VARCHAR(255)        NOT NULL,
        Lname              VARCHAR(255)        NOT NULL,
        APassword          VARCHAR(255)        NOT NULL,
        CONSTRAINT APK PRIMARY KEY(AEmail)
    );

-- Create the LOAN_POST table (moved before MATCHED_POST due to foreign key reference)
CREATE TABLE LOAN_POST
    (
        P_ID               INT AUTO_INCREMENT  NOT NULL,
        PTitle             VARCHAR(255)        NOT NULL,
        Description        VARCHAR(255)        NOT NULL,
        MaxRate            INT                 NOT NULL,
        MinTermStart       DATE                NOT NULL,
        MinTermEnd         DATE                NOT NULL,
        MaxTermStart       DATE                NOT NULL,
        MaxTermEnd         DATE                NOT NULL,
        PStatus            VARCHAR(255)        NOT NULL,
        LType              VARCHAR(255)        NOT NULL,
        Desired_amt        VARCHAR(255)        NOT NULL,
        CEmail             VARCHAR(50),
        M_ID               INT,          
        CONSTRAINT LPPK PRIMARY KEY(P_ID),
        CONSTRAINT LPFK FOREIGN KEY(CEmail) REFERENCES CLIENT(CEmail) ON DELETE RESTRICT ON UPDATE CASCADE
    );

-- Create the LOAN_OFFER table (moved before MATCHED_POST due to foreign key reference)
CREATE TABLE LOAN_OFFER
    (
        O_ID               INT AUTO_INCREMENT  NOT NULL,
        Description        VARCHAR(255)        NOT NULL,
        OName              VARCHAR(255)        NOT NULL,
        MinRate            INT                 NOT NULL,
        MinTermStart       DATE                NOT NULL,
        MinTermEnd         DATE                NOT NULL,
        MaxTermStart       DATE                NOT NULL,
        MaxTermEnd         DATE                NOT NULL,
        OStatus            VARCHAR(255)        NOT NULL,
        LType              VARCHAR(255)        NOT NULL,
        Min_amt            VARCHAR(255)        NOT NULL,
        Max_amt            VARCHAR(255)        NOT NULL,
        LEmail             VARCHAR(50),
        M_ID               INT,
        CONSTRAINT LOPK PRIMARY KEY(O_ID),
        CONSTRAINT LOFK FOREIGN KEY(LEmail) REFERENCES LOAN_PROVIDER(LEmail) ON DELETE RESTRICT ON UPDATE CASCADE
    );

-- Create the MATCHED_POST table
CREATE TABLE MATCHED_POST
    (
        M_ID            INT AUTO_INCREMENT    NOT NULL,
        MRate           INT,
        MDate           DATE,
        MStatus         VARCHAR(255),
        P_ID            INT,            
        O_ID            INT,          
        CDecision       BOOLEAN DEFAULT FALSE, -- Default is FALSE
        LDecision       BOOLEAN DEFAULT FALSE, -- Default is FALSE
        CEmail          VARCHAR(50),         
        LEmail          VARCHAR(50),         
        CONSTRAINT MPPK PRIMARY KEY(M_ID),
        CONSTRAINT MPFK FOREIGN KEY(P_ID) REFERENCES LOAN_POST(P_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT MPFK2 FOREIGN KEY(O_ID) REFERENCES LOAN_OFFER(O_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT MPFK3 FOREIGN KEY(CEmail) REFERENCES CLIENT(CEmail) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT MPFK4 FOREIGN KEY(LEmail) REFERENCES LOAN_PROVIDER(LEmail) ON DELETE RESTRICT ON UPDATE CASCADE
    );


-- Update LOAN_POST with MATCHED_POST foreign key
ALTER TABLE LOAN_POST
    ADD CONSTRAINT LPFK2 FOREIGN KEY(M_ID) REFERENCES MATCHED_POST(M_ID) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Update LOAN_OFFER with MATCHED_POST foreign key
ALTER TABLE LOAN_OFFER
    ADD CONSTRAINT LOFK2 FOREIGN KEY(M_ID) REFERENCES MATCHED_POST(M_ID) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create the CLIENT_DASHBOARD table
CREATE TABLE CLIENT_DASHBOARD
    (
        CD_ID           CHAR(10)            NOT NULL,
        P_ID            CHAR(10),          
        CEmail          VARCHAR(50),        
        CONSTRAINT CDPK PRIMARY KEY(CD_ID),
        CONSTRAINT CDSK UNIQUE(P_ID),
        CONSTRAINT CDSK2 UNIQUE(CEmail),
        CONSTRAINT CPFK FOREIGN KEY(P_ID) REFERENCES LOAN_POST(P_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT CDFK2 FOREIGN KEY(CEmail) REFERENCES CLIENT(CEmail) ON DELETE RESTRICT ON UPDATE CASCADE
    );

-- Create the PROVIDER_DASHBOARD table
CREATE TABLE PROVIDER_DASHBOARD
    (
        PD_ID           CHAR(10)            NOT NULL,
        O_ID            CHAR(10),
        LEmail          VARCHAR(50),
        CONSTRAINT PDPK PRIMARY KEY(PD_ID),
        CONSTRAINT PDSK UNIQUE(O_ID),
        CONSTRAINT PDSK2 UNIQUE(LEmail),
        CONSTRAINT PDFK FOREIGN KEY(O_ID) REFERENCES LOAN_OFFER(O_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT PDFK2 FOREIGN KEY(LEmail) REFERENCES LOAN_PROVIDER(LEmail) ON DELETE RESTRICT ON UPDATE CASCADE
    );

-- Create the POST_MATCH table
CREATE TABLE POST_MATCH
    (
        P_ID            CHAR(10),            
        O_ID            CHAR(10),           
        M_ID            CHAR(10),            
        CONSTRAINT PMFK FOREIGN KEY(P_ID) REFERENCES LOAN_POST(P_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT PMFK2 FOREIGN KEY(O_ID) REFERENCES LOAN_OFFER(O_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT PMFK3 FOREIGN KEY(M_ID) REFERENCES MATCHED_POST(M_ID) ON DELETE RESTRICT ON UPDATE CASCADE
    );

-- Create the AUTHENTICATES table
CREATE TABLE AUTHENTICATES
    (
        AEmail          VARCHAR(50),
        CEmail          VARCHAR(50),
        LEmail          VARCHAR(50),
        CONSTRAINT AFK FOREIGN KEY(AEmail) REFERENCES ADMIN(AEmail) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT AFK2 FOREIGN KEY(CEmail) REFERENCES CLIENT(CEmail) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT AFK3 FOREIGN KEY(LEmail) REFERENCES LOAN_PROVIDER(LEmail) ON DELETE RESTRICT ON UPDATE CASCADE
    );

-- Create the MATCH_CHECK table
CREATE TABLE MATCH_CHECK
    (
        O_ID            CHAR(10),
        P_ID            CHAR(10),
        MRate           INT,
        CONSTRAINT MCFK FOREIGN KEY(O_ID) REFERENCES LOAN_OFFER(O_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT MCFK2 FOREIGN KEY(P_ID) REFERENCES LOAN_POST(P_ID) ON DELETE RESTRICT ON UPDATE CASCADE
    );

-- Stored Procedure to Add Client Information
CREATE PROCEDURE AddClientInformation
    (
        IN p_CEmail VARCHAR(50),
        IN p_FName VARCHAR(15),
        IN p_LName VARCHAR(15),
        IN p_Credit INT,
        IN p_CPassword VARCHAR(255),
        IN p_CLocation VARCHAR(255),
        IN p_DOB DATE,
        IN p_CPhone CHAR(20),
        IN p_FinancialDetails VARCHAR(255)
    )
BEGIN
    INSERT INTO CLIENT 
    (
        CEmail, Fname, Lname, Credit, CPassword, CLocation, DOB_Establishment, CPhone, Financial_details
    )
    VALUES
    (
        p_CEmail, p_FName, p_LName, p_Credit, p_CPassword, p_CLocation, p_DOB, p_CPhone, p_FinancialDetails
    );
END;

-- Stored Procedure to Add Loan Provider Information
CREATE PROCEDURE AddLoanProviderInformation
    (
        IN p_LEmail VARCHAR(50),
        IN p_FName VARCHAR(15),
        IN p_LName VARCHAR(15),
        IN p_Terms VARCHAR(255),
        IN p_LPassword VARCHAR(255),
        IN p_LLocation VARCHAR(255),
        IN p_LPhone CHAR(20),
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

CREATE PROCEDURE EditClientInformation
    (
        IN p_CEmail VARCHAR(50),
        IN p_FName VARCHAR(15),
        IN p_LName VARCHAR(15),
        IN p_Credit INT,
        IN p_CPassword VARCHAR(255),
        IN p_CLocation VARCHAR(255),
        IN p_DOB DATE,
        IN p_CPhone CHAR(20),
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
        DOB_Establishment = p_DOB,
        CPhone = p_CPhone,
        Financial_details = p_FinancialDetails
    WHERE CEmail = p_CEmail;
END;

CREATE PROCEDURE EditLoanProviderInformation
    (
        IN p_LEmail VARCHAR(50),
        IN p_FName VARCHAR(15),
        IN p_LName VARCHAR(15),
        IN p_Terms VARCHAR(255),
        IN p_LPassword VARCHAR(255),
        IN p_LLocation VARCHAR(255),
        IN p_LPhone CHAR(20),
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

CREATE PROCEDURE CreateLoanPost
    (
        IN p_PName VARCHAR(255),
        IN p_MaxRate INT,
        IN p_MinTermL DATE,
        IN p_MaxTermL DATE,
        IN p_PStatus VARCHAR(255),
        IN p_LType VARCHAR(255),
        IN p_P_ID CHAR(10),
        IN p_Desired_amt VARCHAR(255),
        IN p_CEmail VARCHAR(50)
    )
BEGIN
    -- First check if the client exists
    IF NOT EXISTS (SELECT 1 FROM CLIENT WHERE CEmail = p_CEmail) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Client email does not exist';
    END IF;

    -- Begin transaction
    START TRANSACTION;
    
    -- Insert into LOAN_POST table
    INSERT INTO LOAN_POST
        (
            PName,
            MaxRate,
            MinTermL,
            MaxTermL,
            PStatus,
            LType,
            P_ID,
            Desired_amt,
        )
    VALUES
        (
            p_PName,
            p_MaxRate,
            p_MinTermL,
            p_MaxTermL,
            p_PStatus,
            p_LType,
            p_P_ID,
            p_Desired_amt,
        );

    -- Create a view of the complete loan post with client details
    SELECT 
        LP.*,
        C.Fname,
        C.Lname,
        C.Credit,
        C.CLocation,
        C.Financial_details
    FROM LOAN_POST LP
    JOIN CLIENT C ON LP.CEmail = C.CEmail
    WHERE LP.P_ID = p_P_ID;

    -- Commit transaction
    COMMIT;

END;

CREATE PROCEDURE CreateLoanOffer
    (
        IN p_OName VARCHAR(255),
        IN p_MinRate INT,
        IN p_MinTermL DATE,
        IN p_MaxTermL DATE,
        IN p_OStatus VARCHAR(255),
        IN p_LType VARCHAR(255),
        IN p_O_ID CHAR(10),
        IN p_Min_amt VARCHAR(255),
        IN p_Max_amt VARCHAR(255),
        IN p_LEmail VARCHAR(50)
    )
BEGIN
    -- First check if the loan provider exists
    IF NOT EXISTS (SELECT 1 FROM LOAN_PROVIDER WHERE LEmail = p_LEmail) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Loan provider email does not exist';
    END IF;

    -- Begin transaction
    START TRANSACTION;
    
    -- Insert into LOAN_OFFER table
    INSERT INTO LOAN_OFFER
        (
            OName,
            MinRate,
            MinTermL,
            MaxTermL,
            OStatus,
            LType,
            O_ID,
            Min_amt,
            Max_amt,
        )
    VALUES
        (
            p_OName,
            p_MinRate,
            p_MinTermL,
            p_MaxTermL,
            p_OStatus,
            p_LType,
            p_O_ID,
            p_Min_amt,
            p_Max_amt,
        );

    -- Create a view of the complete loan offer with provider details
    SELECT 
        LO.*,
        LP.Fname,
        LP.Lname,
        LP.Terms,
        LP.LLocation,
        LP.LPhone,
        LP.LicenseNo
    FROM LOAN_OFFER LO
    JOIN LOAN_PROVIDER LP ON LO.LEmail = LP.LEmail
    WHERE LO.O_ID = p_O_ID;

    -- Commit transaction
    COMMIT;

END;

CREATE PROCEDURE ViewClientDashboard
    (
        IN p_CEmail VARCHAR(50)
    )
BEGIN
    -- First check if the client exists
    IF NOT EXISTS (SELECT 1 FROM CLIENT WHERE CEmail = p_CEmail) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Client email does not exist';
    END IF;

    -- Get all loan posts for the client with complete information
    SELECT 
        -- Loan Post Information
        LP.P_ID,
        LP.PName,
        LP.MaxRate,
        LP.MinTermL,
        LP.MaxTermL,
        LP.PStatus,
        LP.LType,
        LP.Desired_amt,
        
        -- Client Information
        C.CEmail,
        C.Fname,
        C.Lname,
        C.Credit,
        C.CLocation,
        C.Financial_details,
        C.CPhone,
        
        -- Match Information (if exists)
        MP.MRate AS Matched_Rate,
        MP.MDate AS Match_Date,
        MP.MStatus AS Match_Status,
        MP.CDecision AS Client_Decision,
        MP.LDecision AS Provider_Decision,
        
        -- Loan Provider Information (if matched)
        LP2.Fname AS Provider_Fname,
        LP2.Lname AS Provider_Lname,
        LP2.Terms AS Provider_Terms,
        LP2.LLocation AS Provider_Location,
        LP2.LPhone AS Provider_Phone,
        LP2.LicenseNo AS Provider_License
        
    FROM LOAN_POST LP
    JOIN CLIENT C ON LP.CEmail = C.CEmail
    LEFT JOIN MATCHED_POST MP ON LP.P_ID = MP.P_ID
    LEFT JOIN LOAN_PROVIDER LP2 ON MP.LEmail = LP2.LEmail
    WHERE LP.CEmail = p_CEmail
    ORDER BY 
        CASE 
            WHEN LP.PStatus = 'Active' THEN 1
            WHEN LP.PStatus = 'Matched' THEN 2
            WHEN LP.PStatus = 'Closed' THEN 3
            ELSE 4
        END,
        LP.MinTermL DESC;

    -- Get simple post count statistics
    SELECT
        COUNT(*) AS Total_Posts,
        COUNT(CASE WHEN PStatus = 'Active' THEN 1 END) AS Active_Posts,
        COUNT(CASE WHEN PStatus = 'Matched' THEN 1 END) AS Matched_Posts,
        COUNT(CASE WHEN PStatus = 'Closed' THEN 1 END) AS Closed_Posts
    FROM LOAN_POST
    WHERE CEmail = p_CEmail;

END;

CREATE PROCEDURE ViewLoanProviderDashboard
    (
        IN p_LEmail VARCHAR(50)
    )
BEGIN
    -- First check if the loan provider exists
    IF NOT EXISTS (SELECT 1 FROM LOAN_PROVIDER WHERE LEmail = p_LEmail) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Loan provider email does not exist';
    END IF;

    -- Get all loan offers for the provider with complete information
    SELECT 
        -- Loan Offer Information
        LO.O_ID,
        LO.OName,
        LO.MinRate,
        LO.MinTermL,
        LO.MaxTermL,
        LO.OStatus,
        LO.LType,
        LO.Min_amt,
        LO.Max_amt,
        
        -- Loan Provider Information
        LP.LEmail,
        LP.Fname,
        LP.Lname,
        LP.Terms,
        LP.LLocation,
        LP.LPhone,
        LP.LicenseNo,
        
        -- Match Information (if exists)
        MP.MRate AS Matched_Rate,
        MP.MDate AS Match_Date,
        MP.MStatus AS Match_Status,
        MP.CDecision AS Client_Decision,
        MP.LDecision AS Provider_Decision,
        
        -- Client Information (if matched)
        C.Fname AS Client_Fname,
        C.Lname AS Client_Lname,
        C.Credit AS Client_Credit,
        C.CLocation AS Client_Location,
        C.Financial_details AS Client_Financial_Details,
        C.CPhone AS Client_Phone
        
    FROM LOAN_OFFER LO
    JOIN LOAN_PROVIDER LP ON LO.LEmail = LP.LEmail
    LEFT JOIN MATCHED_POST MP ON LO.O_ID = MP.O_ID
    LEFT JOIN CLIENT C ON MP.CEmail = C.CEmail
    WHERE LO.LEmail = p_LEmail
    ORDER BY 
        CASE 
            WHEN LO.OStatus = 'Active' THEN 1
            WHEN LO.OStatus = 'Matched' THEN 2
            WHEN LO.OStatus = 'Closed' THEN 3
            ELSE 4
        END,
        LO.MinTermL DESC;

    -- Get simple offer count statistics
    SELECT
        COUNT(*) AS Total_Offers,
        COUNT(CASE WHEN OStatus = 'Active' THEN 1 END) AS Active_Offers,
        COUNT(CASE WHEN OStatus = 'Matched' THEN 1 END) AS Matched_Offers,
        COUNT(CASE WHEN OStatus = 'Closed' THEN 1 END) AS Closed_Offers
    FROM LOAN_OFFER
    WHERE LEmail = p_LEmail;

END;

CREATE PROCEDURE ViewClientContact
    (
        IN p_LEmail VARCHAR(50),
        IN p_M_ID CHAR(10)
    )
BEGIN
    -- First verify that both parties have accepted and the match exists
    IF NOT EXISTS (
        SELECT 1 
        FROM MATCHED_POST 
        WHERE M_ID = p_M_ID 
        AND LEmail = p_LEmail
        AND CDecision = TRUE 
        AND LDecision = TRUE
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Contact information unavailable. Both parties must accept the match first.';
    END IF;

    -- Retrieve client's contact information
    SELECT 
        C.Fname,
        C.Lname,
        C.CEmail,
        C.CPhone,
        LP.PName AS Loan_Post_Name,
        MP.MRate AS Agreed_Rate,
        MP.MDate AS Match_Date
    FROM MATCHED_POST MP
    JOIN CLIENT C ON MP.CEmail = C.CEmail
    JOIN LOAN_POST LP ON MP.P_ID = LP.P_ID
    WHERE MP.M_ID = p_M_ID 
    AND MP.LEmail = p_LEmail;
END;

CREATE PROCEDURE ViewLoanProviderContact
    (
        IN p_CEmail VARCHAR(50),
        IN p_M_ID CHAR(10)
    )
BEGIN
    -- First verify that both parties have accepted and the match exists
    IF NOT EXISTS (
        SELECT 1 
        FROM MATCHED_POST 
        WHERE M_ID = p_M_ID 
        AND CEmail = p_CEmail
        AND CDecision = TRUE 
        AND LDecision = TRUE
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Contact information unavailable. Both parties must accept the match first.';
    END IF;

    -- Retrieve loan provider's contact information
    SELECT 
        LP.Fname,
        LP.Lname,
        LP.LEmail,
        LP.LPhone,
        LP.LicenseNo,
        LO.OName AS Loan_Offer_Name,
        MP.MRate AS Agreed_Rate,
        MP.MDate AS Match_Date
    FROM MATCHED_POST MP
    JOIN LOAN_PROVIDER LP ON MP.LEmail = LP.LEmail
    JOIN LOAN_OFFER LO ON MP.O_ID = LO.O_ID
    WHERE MP.M_ID = p_M_ID 
    AND MP.CEmail = p_CEmail;
END;