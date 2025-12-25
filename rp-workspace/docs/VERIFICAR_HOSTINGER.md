# 🔍 Verificar Configuración de Hostinger

## 📋 Información a Verificar en el Panel de Hostinger

### Paso 1: Acceder al Panel
1. Ve a https://www.hostinger.com
2. Inicia sesión
3. Ve a "VPS" o "Servidores VPS"

### Paso 2: Seleccionar tu VPS
1. Haz click en tu VPS
2. Verifica la información

### Paso 3: Verificar Estos Datos

#### ✅ IP del VPS
- **Ubicación:** VPS → Overview → IP Address
- **Debería ser:** `72.60.63.240`
- **Si es diferente:** Actualiza los scripts con la IP correcta

#### ✅ Estado del VPS
- **Ubicación:** VPS → Overview → Status
- **Debería estar:** Running/Online
- **Si está apagado:** Enciéndelo desde el panel

#### ✅ Credenciales SSH
- **Ubicación:** VPS → SSH Access o Access Details
- **Verifica:**
  - **Usuario SSH:** ¿Es `root` o otro? (puede ser `admin`, `ubuntu`, etc.)
  - **Puerto SSH:** ¿Es `22` o otro? (puede ser `2222`, `2200`, etc.)
  - **Contraseña:** ¿Es `Aar-Beto-2026` o diferente?
  - **Método:** ¿Usa contraseña o clave SSH?

#### ✅ Firewall
- **Ubicación:** VPS → Firewall o Security
- **Verifica:** Que el puerto SSH esté abierto
- **Puertos necesarios:**
  - SSH: `22` (o el que uses)
  - HTTP: `80`
  - HTTPS: `443`

---

## 🔧 Comandos Actualizados Según Hostinger

Una vez que verifiques la información, actualiza los comandos:

### Si el Usuario NO es `root`:

```bash
# Reemplaza 'root' con tu usuario real
ssh TU_USUARIO@72.60.63.240
```

### Si el Puerto NO es `22`:

```bash
# Reemplaza '22' con tu puerto real
ssh -p TU_PUERTO root@72.60.63.240
```

### Si ambos son diferentes:

```bash
ssh -p TU_PUERTO TU_USUARIO@72.60.63.240
```

---

## 🆘 Si No Puedes Encontrar la Información

### Opción 1: Resetear Contraseña SSH
1. Panel Hostinger → VPS → Reset Password
2. Genera nueva contraseña
3. Usa esa contraseña para conectarte

### Opción 2: Usar Terminal Web de Hostinger
1. Panel Hostinger → VPS → "Terminal" o "Web Terminal"
2. Ejecuta comandos directamente desde ahí
3. No necesitas SSH externo

### Opción 3: Contactar Soporte Hostinger
- Pregunta sobre:
  - Credenciales SSH correctas
  - Puerto SSH
  - Configuración de acceso

---

## 📝 Información que Necesito

Para ayudarte mejor, comparte:

1. **Usuario SSH:** ¿Qué usuario aparece en el panel?
2. **Puerto SSH:** ¿Qué puerto aparece en el panel?
3. **Estado VPS:** ¿Está encendido?
4. **Método de acceso:** ¿Contraseña o clave SSH?
5. **Mensaje de error exacto:** ¿Qué dice cuando intentas conectar?

---

## 🔄 Comandos de Prueba

Prueba estos comandos con diferentes combinaciones:

```bash
# Prueba 1: Usuario root, puerto 22
ssh root@72.60.63.240

# Prueba 2: Usuario root, puerto 2222
ssh -p 2222 root@72.60.63.240

# Prueba 3: Usuario admin, puerto 22
ssh admin@72.60.63.240

# Prueba 4: Con información detallada
ssh -vvv root@72.60.63.240
```

---

**Verifica la información en el panel de Hostinger y compártela para actualizar los comandos.**

