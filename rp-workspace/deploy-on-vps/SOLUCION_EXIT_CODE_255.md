# 🔧 Solución: Exit Code 255 en SSH

## ⚠️ Problema

El workflow está fallando con `exit code 255`, que es el código de error estándar de SSH cuando falla la conexión o autenticación.

## 🔍 Causas Posibles

### 1. Contraseña Incorrecta (Más Probable) ❌

**Síntomas:**
- Exit code 255
- "Permission denied" en los logs
- La contraseña tiene la longitud correcta pero falla

**Solución:**
1. Verifica manualmente: `ssh root@72.60.63.240`
2. Usa la contraseña exacta que funciona
3. Copia esa contraseña EXACTA
4. Actualiza `VPS_SSH_PASSWORD` en GitHub Secrets

### 2. Caracteres Especiales Mal Codificados

**Síntomas:**
- La contraseña parece correcta pero falla
- Caracteres especiales (guiones) pueden estar mal codificados

**Solución:**
1. Escribe la contraseña manualmente carácter por carácter
2. No uses copiar/pegar si hay problemas
3. Verifica cada carácter: `A-a-r---B-e-t-o---2-0-2-6`

### 3. Espacios Ocultos

**Síntomas:**
- La contraseña tiene la longitud correcta pero falla
- Puede haber espacios al inicio o final

**Solución:**
1. Elimina completamente el secret en GitHub
2. Crea uno nuevo escribiendo la contraseña manualmente
3. No agregues espacios al inicio o final

### 4. Usuario Incorrecto

**Síntomas:**
- Exit code 255
- "Permission denied"

**Solución:**
1. Verifica que `VPS_USER` sea `root`
2. Si el usuario es diferente, actualiza `VPS_USER` en GitHub Secrets

## ✅ Solución Paso a Paso

### Paso 1: Verificar Contraseña Manualmente

```bash
ssh root@72.60.63.240
```

**Cuando te pida la contraseña, ingresa:** `Aar-Beto-2026`

**Si funciona:** ✅ Esta es la contraseña correcta
**Si no funciona:** ❌ Necesitas obtener la contraseña correcta

### Paso 2: Eliminar y Recrear el Secret

**IMPORTANTE:** A veces es mejor eliminar y recrear el secret:

1. Ve a: `Settings` → `Secrets` → `Actions`
2. Busca `VPS_SSH_PASSWORD`
3. Click en el secret
4. Click en "Delete" (eliminar)
5. Confirma la eliminación
6. Click "New repository secret"
7. Name: `VPS_SSH_PASSWORD`
8. Value: Escribe manualmente `Aar-Beto-2026`
   - ⚠️ Escribe cada carácter manualmente
   - ⚠️ No uses copiar/pegar
   - ⚠️ Verifica cada carácter
9. Click "Add secret"

### Paso 3: Verificar con Workflow

1. Ejecuta "Verify SSH Password Configuration"
2. Revisa los resultados
3. Si pasa, ejecuta "Test SSH Connection"
4. Si pasa, ejecuta el deployment

## 🔍 Debugging Mejorado

El workflow ahora muestra:
- Longitud de la contraseña
- Primer y último carácter
- Output completo de SSH con `-vvv` (muy verbose)
- Análisis específico del tipo de error

## 📋 Valores Esperados

**VPS_SSH_PASSWORD:**
- Valor: `Aar-Beto-2026`
- Longitud: 13 caracteres
- Primer carácter: `A`
- Último carácter: `6`
- Caracteres especiales: `-` (guión)

**VPS_HOST:**
- Valor: `72.60.63.240`

**VPS_USER:**
- Valor: `root`

## 🚨 Si Nada Funciona

Si después de seguir todos los pasos sigue fallando:

1. **Verifica que el servidor esté accesible:**
   ```bash
   ping 72.60.63.240
   ```

2. **Verifica que SSH esté funcionando:**
   ```bash
   ssh -v root@72.60.63.240
   ```

3. **Verifica la configuración del servidor:**
   ```bash
   ssh root@72.60.63.240
   sudo cat /etc/ssh/sshd_config | grep PasswordAuthentication
   ```

4. **Contacta al administrador del servidor:**
   - Verifica que la contraseña no haya cambiado
   - Verifica que el usuario sea correcto
   - Verifica que el servidor permita conexiones desde GitHub Actions

## 📚 Archivos Relacionados

- [Corregir Contraseña GitHub](CORREGIR_CONTRASEÑA_GITHUB.md)
- [Verificar Contraseña GitHub Secrets](VERIFICAR_CONTRASEÑA_GITHUB_SECRETS.md)
- [Solución Definitiva Permission Denied](SOLUCION_DEFINITIVA_PERMISSION_DENIED.md)

---

**El exit code 255 generalmente indica que la contraseña es incorrecta. Sigue los pasos arriba para corregirlo.**

