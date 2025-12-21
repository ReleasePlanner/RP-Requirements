-- ===================================================
-- Script de Ejemplo - Datos de Prueba
-- Gestión de Requisitos
-- ===================================================
-- Este script inserta datos de ejemplo para desarrollo y pruebas
-- Ejecutar después de database.sql
-- ===================================================

-- ===================================================
-- 1. USUARIOS DE EJEMPLO
-- ===================================================

INSERT INTO "User" (UserID, Name, Role) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Juan Pérez', 'Product Owner'),
    ('550e8400-e29b-41d4-a716-446655440002', 'María García', 'Scrum Master'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Carlos López', 'Desarrollador'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Ana Martínez', 'QA Engineer'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Luis Rodríguez', 'Sponsor Ejecutivo');

-- ===================================================
-- 2. PORTAFOLIO E INICIATIVAS
-- ===================================================

INSERT INTO Portfolio (PortfolioID, Name, SponsorUserID) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'Portafolio Digital', '550e8400-e29b-41d4-a716-446655440005');

INSERT INTO Initiative (InitiativeID, Title, StrategicGoal, EstimatedBusinessBenefit, DateProposed, PortfolioID) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'Transformación Digital',
     'Modernizar procesos mediante tecnología digital', 5000000.00,
     '2024-01-15 10:00:00', '660e8400-e29b-41d4-a716-446655440001');

-- ===================================================
-- 3. ÉPICOS
-- ===================================================

INSERT INTO Epic (EpicID, Name, Goal, InitiativeID) VALUES
    ('880e8400-e29b-41d4-a716-446655440001', 'Portal de Clientes',
     'Crear portal web para gestión de clientes', '770e8400-e29b-41d4-a716-446655440001'),
    ('880e8400-e29b-41d4-a716-446655440002', 'API de Integración',
     'Desarrollar API REST para integraciones', '770e8400-e29b-41d4-a716-446655440001');

-- ===================================================
-- 4. PRODUCTOS Y SPRINTS
-- ===================================================

INSERT INTO Product (ProductID, Name) VALUES
    ('990e8400-e29b-41d4-a716-446655440001', 'Sistema de Gestión de Requisitos'),
    ('990e8400-e29b-41d4-a716-446655440002', 'Portal Web Cliente');

INSERT INTO Sprint (SprintID, StartDate, EndDate, ProductID) VALUES
    ('aa0e8400-e29b-41d4-a716-446655440001', '2024-02-01', '2024-02-14',
     '990e8400-e29b-41d4-a716-446655440001'),
    ('aa0e8400-e29b-41d4-a716-446655440002', '2024-02-15', '2024-02-28',
     '990e8400-e29b-41d4-a716-446655440001');

INSERT INTO Release (ReleaseID, VersionNumber, ReleaseDate, ProductID) VALUES
    ('bb0e8400-e29b-41d4-a716-446655440001', '1.0.0', '2024-03-01',
     '990e8400-e29b-41d4-a716-446655440001');

-- ===================================================
-- 5. REQUISITOS DE EJEMPLO
-- ===================================================

INSERT INTO Requirement (
    RequirementID, Title, StoryStatement, AcceptanceCriteria,
    EffortEstimate, BusinessValue, CreationDate, GoLiveDate,
    PriorityID, StatusID, TypeID, ComplexityID, SourceID,
    EffortTypeID, OwnerID, EpicID, RiskLevelID, MetricID, ReleaseID
) VALUES
    ('cc0e8400-e29b-41d4-a716-446655440001',
     'Login de Usuario',
     'Como usuario, quiero iniciar sesión para acceder al sistema',
     '1. Usuario puede ingresar email y contraseña\n2. Sistema valida credenciales\n3. Usuario accede al dashboard',
     5, 10000.00, '2024-01-20 09:00:00', '2024-03-01',
     2, 4, 1, 2, 1, 1, '550e8400-e29b-41d4-a716-446655440001',
     '880e8400-e29b-41d4-a716-446655440001', 3, 1, 'bb0e8400-e29b-41d4-a716-446655440001'),

    ('cc0e8400-e29b-41d4-a716-446655440002',
     'Gestión de Requisitos',
     'Como Product Owner, quiero crear y editar requisitos para gestionar el backlog',
     '1. PO puede crear nuevo requisito\n2. PO puede editar requisitos existentes\n3. PO puede cambiar estado',
     8, 25000.00, '2024-01-22 10:30:00', '2024-03-01',
     1, 4, 1, 3, 3, 1, '550e8400-e29b-41d4-a716-446655440001',
     '880e8400-e29b-41d4-a716-446655440001', 2, 1, 'bb0e8400-e29b-41d4-a716-446655440001'),

    ('cc0e8400-e29b-41d4-a716-446655440003',
     'Bug en Cálculo de Métricas',
     'Corregir error en cálculo de métricas de negocio',
     '1. Métricas se calculan correctamente\n2. Valores se muestran en dashboard',
     3, 0.00, '2024-02-05 14:00:00', NULL,
     1, 5, 2, 1, 4, 2, '550e8400-e29b-41d4-a716-446655440003',
     '880e8400-e29b-41d4-a716-446655440001', 1, 1, NULL);

-- ===================================================
-- 6. BACKLOG
-- ===================================================

INSERT INTO Backlog (BacklogID, ItemID, RankingOrder, RankDate, ProductID, SprintID) VALUES
    ('dd0e8400-e29b-41d4-a716-446655440001', 'cc0e8400-e29b-41d4-a716-446655440001',
     1, '2024-01-25 08:00:00', '990e8400-e29b-41d4-a716-446655440001',
     'aa0e8400-e29b-41d4-a716-446655440001'),
    ('dd0e8400-e29b-41d4-a716-446655440001', 'cc0e8400-e29b-41d4-a716-446655440002',
     2, '2024-01-25 08:00:00', '990e8400-e29b-41d4-a716-446655440001',
     'aa0e8400-e29b-41d4-a716-446655440001'),
    ('dd0e8400-e29b-41d4-a716-446655440001', 'cc0e8400-e29b-41d4-a716-446655440003',
     3, '2024-02-05 14:30:00', '990e8400-e29b-41d4-a716-446655440001',
     'aa0e8400-e29b-41d4-a716-446655440002');

-- ===================================================
-- 7. TAREAS TÉCNICAS
-- ===================================================

INSERT INTO TechnicalTask (TaskID, Title, RequirementID, AssignedUserID) VALUES
    ('ee0e8400-e29b-41d4-a716-446655440001', 'Implementar autenticación JWT',
     'cc0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'),
    ('ee0e8400-e29b-41d4-a716-446655440002', 'Crear formulario de requisitos',
     'cc0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'),
    ('ee0e8400-e29b-41d4-a716-446655440003', 'Corregir función de cálculo',
     'cc0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003');

-- ===================================================
-- 8. CASOS DE PRUEBA
-- ===================================================

INSERT INTO TestCase (TestCaseID, Description) VALUES
    ('ff0e8400-e29b-41d4-a716-446655440001',
     'Verificar login con credenciales válidas'),
    ('ff0e8400-e29b-41d4-a716-446655440002',
     'Verificar login con credenciales inválidas'),
    ('ff0e8400-e29b-41d4-a716-446655440003',
     'Verificar creación de requisito con datos válidos'),
    ('ff0e8400-e29b-41d4-a716-446655440004',
     'Verificar cálculo correcto de métricas');

-- Relacionar casos de prueba con requisitos
INSERT INTO Req_TestCase (RequirementID, TestCaseID) VALUES
    ('cc0e8400-e29b-41d4-a716-446655440001', 'ff0e8400-e29b-41d4-a716-446655440001'),
    ('cc0e8400-e29b-41d4-a716-446655440001', 'ff0e8400-e29b-41d4-a716-446655440002'),
    ('cc0e8400-e29b-41d4-a716-446655440002', 'ff0e8400-e29b-41d4-a716-446655440003'),
    ('cc0e8400-e29b-41d4-a716-446655440003', 'ff0e8400-e29b-41d4-a716-446655440004');

-- ===================================================
-- 9. DEFECTOS
-- ===================================================

INSERT INTO Defect (DefectID, Title, AssignedUserID) VALUES
    ('110e8400-e29b-41d4-a716-446655440001',
     'Error en validación de email durante registro',
     '550e8400-e29b-41d4-a716-446655440004'),
    ('110e8400-e29b-41d4-a716-446655440002',
     'Métricas no se actualizan en tiempo real',
     '550e8400-e29b-41d4-a716-446655440004');

-- Relacionar defectos con requisitos
INSERT INTO Req_Defect (RequirementID, DefectID) VALUES
    ('cc0e8400-e29b-41d4-a716-446655440001', '110e8400-e29b-41d4-a716-446655440001'),
    ('cc0e8400-e29b-41d4-a716-446655440002', '110e8400-e29b-41d4-a716-446655440002');

-- ===================================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- ===================================================

-- Consultas de verificación (descomentar para ejecutar)
/*
SELECT COUNT(*) as total_usuarios FROM "User";
SELECT COUNT(*) as total_portfolios FROM Portfolio;
SELECT COUNT(*) as total_requisitos FROM Requirement;
SELECT COUNT(*) as total_backlog_items FROM Backlog;
SELECT COUNT(*) as total_tareas FROM TechnicalTask;
SELECT COUNT(*) as total_test_cases FROM TestCase;
SELECT COUNT(*) as total_defectos FROM Defect;
*/

-- ===================================================
-- FIN DEL SCRIPT DE EJEMPLO
-- ===================================================

