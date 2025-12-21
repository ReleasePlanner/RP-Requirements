-- ===================================================
-- Script de Migración - Base de Datos PostgreSQL
-- Gestión de Requisitos
-- ===================================================
-- Este script permite eliminar y recrear la base de datos
-- ÚSELO CON PRECAUCIÓN: Eliminará todos los datos existentes
-- ===================================================

-- Conectarse a la base de datos antes de ejecutar este script
-- psql -U tu_usuario -d tu_base_de_datos -f database-migration.sql

-- ===================================================
-- ELIMINAR TABLAS EN ORDEN INVERSO (respetando dependencias)
-- ===================================================

-- Eliminar tablas de relación N:N primero
DROP TABLE IF EXISTS Req_Defect CASCADE;
DROP TABLE IF EXISTS Req_TestCase CASCADE;

-- Eliminar tablas dependientes
DROP TABLE IF EXISTS TechnicalTask CASCADE;
DROP TABLE IF EXISTS Backlog CASCADE;
DROP TABLE IF EXISTS Defect CASCADE;
DROP TABLE IF EXISTS TestCase CASCADE;
DROP TABLE IF EXISTS Requirement CASCADE;
DROP TABLE IF EXISTS Epic CASCADE;
DROP TABLE IF EXISTS Initiative CASCADE;
DROP TABLE IF EXISTS Portfolio CASCADE;
DROP TABLE IF EXISTS Sprint CASCADE;
DROP TABLE IF EXISTS Release CASCADE;
DROP TABLE IF EXISTS Product CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Eliminar catálogos
DROP TABLE IF EXISTS Metric CASCADE;
DROP TABLE IF EXISTS RiskLevel CASCADE;
DROP TABLE IF EXISTS EffortEstimateType CASCADE;
DROP TABLE IF EXISTS Source CASCADE;
DROP TABLE IF EXISTS Complexity CASCADE;
DROP TABLE IF EXISTS Type CASCADE;
DROP TABLE IF EXISTS Status CASCADE;
DROP TABLE IF EXISTS Priority CASCADE;

-- ===================================================
-- Ejecutar el script principal de creación
-- ===================================================
-- \i database.sql

