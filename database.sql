CREATE DATABASE LOAN_MATCHER;

CREATE TABLE CLIENT
    (
        CEmail             VARCHAR(20)         NOT NULL,
        Fname              VARCHAR(15),          
        Lname              VARCHAR(15),
        Credit             INT,
        CPassword          VARCHAR,
        CLocation          VARCHAR,
        DOB/Establishment  DATE,
        CPhone             CHAR(10),
        Financial_details  VARCHAR,
        PRIMARY KEY(CEmail)
    );

CREATE TABLE LOAN_PROVIDER
    (
        LEmail             VARCHAR(20)         NOT NULL,
        Fname              VARCHAR(15),
        Lname              VARCHAR(15),
        Terms              VARCHAR,
        LPassword          VARCHAR,
        LLocation          VARCHAR,
        LPhone             CHAR(10),
        LicenseNo          CHAR(10),
        PRIMARY KEY(LEmail)
    );

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

CREATE TABLE ADMIN
    (
        AEmail             VARCHAR(20)         NOT NULL,
        Fname              VARCHAR,
        Lname              VARCHAR,
        APassword          VARCHAR,
        PRIMARY KEY(AEmail)
    );

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

CREATE TABLE CLIENT_DASHBOARD
    (
        CD_ID       CHAR(10)            NOT NULL,
        P_ID        CHAR(10)            NOT NULL,
        CEmail      VARCHAR(20)         NOT NULL,
        PRIMARY KEY(CD_ID),
        FOREIGN KEY(P_ID) REFERENCES LOAN_POST(P_ID),
        FOREIGN KEY(CEmail) REFERENCES CLIENT(CEmail)
    );

CREATE TABLE PROVIDER_DASHBOARD
    (
        PD_ID       CHAR(10)            NOT NULL,
        O_ID        CHAR(10)            NOT NULL,
        LEmail      VARCHAR(20)         NOT NULL,
        PRIMARY KEY(PD_ID),
        FOREIGN KEY(O_ID) REFERENCES LOAN_OFFER(O_ID),
        FOREIGN KEY(LEmail) REFERENCES LOAN_PROVIDER(LEmail)
    );

CREATE TABLE POST_MATCH
    (
        P_ID        CHAR(10)            NOT NULL,
        O_ID        CHAR(10)            NOT NULL,
        M_ID        CHAR(10)            NOT NULL,
        FOREIGN KEY(P_ID) REFERENCES LOAN_POST(P_ID),
        FOREIGN KEY(O_ID) REFERENCES LOAN_OFFER(O_ID),
        FOREIGN KEY(M_ID) REFERENCES MATCHED_POST(M_ID)
    );

CREATE TABLE AUTHENTICATES
    (
        AEmail      VARCHAR(20)         NOT NULL,
        CEmail      VARCHAR(20)         NOT NULL,
        LEmail      VARCHAR(20)         NOT NULL,
        FOREIGN KEY(AEmail) REFERENCES ADMIN(AEmail),
        FOREIGN KEY(CEmail) REFERENCES CLIENT(CEmail),
        FOREIGN KEY(LEmail) REFERENCES LOAN_PROVIDER(LEmail)
    );

CREATE TABLE MATCH_CHECK
    (
        O_ID        CHAR(10)            NOT NULL,
        P_ID        CHAR(10)            NOT NULL,
        MRate       INT,
        FOREIGN KEY(O_ID) REFERENCES LOAN_OFFER(O_ID),
        FOREIGN KEY(P_ID) REFERENCES LOAN_POST(P_ID)
    );