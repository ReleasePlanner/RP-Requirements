# 🚀 Deployment en VPS Hostinger

Esta carpeta contiene todos los scripts, comandos y documentación para desplegar Requirements Management en tu VPS de Hostinger.

## 📋 Archivos Incluidos

### 🚀 Scripts de Deployment

- **`scripts/deploy-on-vps.sh`** - ⭐ **PRINCIPAL** - Script para ejecutar directamente en el VPS
- **`EJECUTAR_AUTOMATICO.sh`** - Script automático con contraseña incluida
- **`EJECUTAR_CON_PASSWORD.sh`** - Script con soporte de contraseña SSH
- **`EJECUTAR_DEPLOYMENT_COMPLETO.sh`** - Script completo de deployment
- **`EJECUTAR_AHORA.sh`** - Script rápido de ejecución
- **`EJECUTAR_DEPLOYMENT.sh`** - Script básico de deployment

### 📝 Guías y Documentación

#### ⭐ Guías Principales (Empezar Aquí)

- **`GITHUB_HOSTINGER_INTEGRATION.md`** - 🔗 **GitHub Actions Integration** - Deployment automático desde GitHub
- **`PLAN_DEPLOYMENT_REQUIREMENTS.md`** - ⭐ **EMPEZAR AQUÍ** - Plan completo paso a paso para Requirements Management
- **`QUICK_START_VPS.md`** - ⚡ Guía rápida de 5 comandos
- **`INICIO_DEPLOYMENT.md`** - Guía de inicio del deployment
- **`README.md`** - Este archivo (índice)

#### 📋 Planes Detallados

- **`PLAN_DEPLOYMENT_VPS.md`** - Plan completo multi-módulo
- **`DEPLOYMENT_MULTI_MODULE.md`** - Guía técnica multi-módulo
- **`RESUMEN_PLAN_VPS.md`** - Resumen ejecutivo del plan

#### ⚙️ Configuración y Setup

- **`CONFIGURAR_VARIABLES.md`** - Cómo configurar variables de entorno
- **`SSH_SETUP.md`** - Configuración de SSH y claves
- **`INSTALAR_SSHPASS.md`** - Instrucciones para instalar sshpass

#### 🔧 Troubleshooting

- **`TROUBLESHOOTING_SSH.md`** - Solución de problemas SSH
- **`VERIFICAR_HOSTINGER.md`** - Verificar información en panel de Hostinger

#### 📄 Archivos de Comandos Rápidos

- **`COMANDOS_A_EJECUTAR.txt`** - Comandos listos para copiar/pegar
- **`EJECUTAR_EN_VPS.txt`** - Instrucciones para ejecutar en VPS
- **`DEPLOYMENT_MANUAL_PASOS.txt`** - Pasos manuales detallados
- **`COMANDO_DEPLOYMENT.txt`** - Comandos de deployment
- **`COMANDO_FINAL.txt`** - Comando final resumido
- **`EJECUTAR_DEPLOYMENT_FINAL.txt`** - Instrucciones finales
- **`DEPLOY_NOW.md`** - Guía rápida de deployment
- **`INSTRUCCIONES_DEPLOYMENT.md`** - Instrucciones de deployment
- **`INSTRUCCIONES_FINALES.md`** - Instrucciones finales

## 🎯 Inicio Rápido

### ⭐ Opción 1: Deployment Automático con GitHub Actions (Más Fácil)

**Si ya configuraste los secrets en GitHub:**

1. **Haz push a `develop` o `main`**

   ```bash
   git push origin develop  # Para desarrollo
   git push origin main      # Para producción
   ```

2. **Ve a GitHub Actions** y observa el deployment automático

Ver **[PRIMER_DEPLOYMENT.md](PRIMER_DEPLOYMENT.md)** para guía completa

### Opción 2: Ejecutar Script en VPS (Manual)

```bash
# 1. Copiar script al VPS
scp scripts/deploy-on-vps.sh root@72.60.63.240:/tmp/

# 2. Conectar al VPS
ssh root@72.60.63.240

# 3. Ejecutar script
bash /tmp/deploy-on-vps.sh
```

### Opción 3: Seguir Plan Completo

Ver **[PLAN_DEPLOYMENT_REQUIREMENTS.md](PLAN_DEPLOYMENT_REQUIREMENTS.md)**

### Opción 4: Guía Rápida

Ver **[QUICK_START_VPS.md](QUICK_START_VPS.md)**

## 📊 Configuración

- **VPS IP:** 72.60.63.240
- **Usuario SSH:** root
- **Dominio:** beyondnet.cloud
- **Repositorio:** https://github.com/ReleasePlanner/RP-Requirements.git

## 📚 Estructura de Archivos

```
deploy-on-vps/
├── README.md (este archivo)
├── Scripts (.sh)
│   ├── scripts/deploy-on-vps.sh ⭐
│   └── EJECUTAR_*.sh
├── Guías Principales (.md)
│   ├── PLAN_DEPLOYMENT_REQUIREMENTS.md ⭐
│   ├── QUICK_START_VPS.md ⚡
│   └── INICIO_DEPLOYMENT.md
├── Planes Detallados (.md)
│   ├── PLAN_DEPLOYMENT_VPS.md
│   ├── DEPLOYMENT_MULTI_MODULE.md
│   └── RESUMEN_PLAN_VPS.md
├── Configuración (.md)
│   ├── CONFIGURAR_VARIABLES.md
│   ├── SSH_SETUP.md
│   └── INSTALAR_SSHPASS.md
├── Troubleshooting (.md)
│   ├── TROUBLESHOOTING_SSH.md
│   └── VERIFICAR_HOSTINGER.md
└── Comandos Rápidos (.txt)
    ├── COMANDOS_A_EJECUTAR.txt
    ├── EJECUTAR_EN_VPS.txt
    └── ...
```

## 🔗 Enlaces Útiles

- [Plan Completo](PLAN_DEPLOYMENT_REQUIREMENTS.md) - ⭐ Empezar aquí
- [Guía Rápida](QUICK_START_VPS.md) - ⚡ 5 comandos
- [Troubleshooting SSH](TROUBLESHOOTING_SSH.md) - Solución de problemas
- [Verificar Hostinger](VERIFICAR_HOSTINGER.md) - Verificar configuración

## 📝 Notas

- Los scripts en `scripts/` deben ejecutarse desde la raíz del proyecto
- Los scripts `EJECUTAR_*.sh` pueden ejecutarse desde cualquier lugar
- Los archivos `.txt` contienen comandos listos para copiar/pegar
- Los archivos `.md` contienen documentación detallada

---

**¡Todo listo para deployment!** 🚀

Para empezar, lee **[PLAN_DEPLOYMENT_REQUIREMENTS.md](PLAN_DEPLOYMENT_REQUIREMENTS.md)**
