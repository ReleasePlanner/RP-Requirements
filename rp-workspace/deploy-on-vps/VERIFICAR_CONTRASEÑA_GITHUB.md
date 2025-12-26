# 🔐 Verificar Contraseña en GitHub Secrets

## ⚠️ Problema Actual

El servidor SSH **SÍ permite** autenticación por contraseña (`Authentications that can continue: publickey,password`), pero la autenticación está fallando. Esto indica que **la contraseña en GitHub Secrets es incorrecta o tiene caracteres mal codificados**.

## 🔍 Diagnóstico

### Síntomas:
- ✅ Servidor permite autenticación por contraseña
- ✅ PasswordAuthentication está habilitado en el servidor
- ❌ La autenticación falla con "Permission denied"

### Causa más probable:
- ❌ La contraseña en GitHub Secrets no coincide con la contraseña real
- ❌ Hay espacios extra al inicio o final
- ❌ Caracteres especiales mal codificados

## ✅ Solución Paso a Paso

### 1. Verificar Contraseña Manualmente

Conéctate al servidor manualmente usando la contraseña que debería funcionar:

```bash
ssh root@72.60.63.240
```

**IMPORTANTE:** Usa la contraseña exacta que funciona aquí. Esta es la contraseña correcta.

### 2. Copiar Contraseña Exacta

Una vez que confirmes que la contraseña funciona manualmente:

1. **Copia la contraseña EXACTA** que usaste para conectarte
2. **NO agregues espacios** al inicio o final
3. **NO agregues comillas** alrededor de la contraseña
4. **Copia todos los caracteres** exactamente como están

### 3. Actualizar GitHub Secrets

1. Ve a tu repositorio en GitHub
2. Ve a: `Settings` → `Secrets and variables` → `Actions`
3. Busca `VPS_SSH_PASSWORD`
4. Click en "Update" (o crea el secret si no existe)
5. **Pega la contraseña EXACTA** (sin espacios extra)
6. Click "Update secret"

### 4. Verificar que se Guardó Correctamente

**Nota:** GitHub no muestra el valor del secret por seguridad, pero puedes verificar:

1. El secret debería existir en la lista
2. Debería mostrar "Updated" con la fecha reciente
3. El workflow debería poder leerlo

### 5. Probar de Nuevo

1. Ve a "Actions" en GitHub
2. Ejecuta "Test SSH Connection"
3. Revisa los logs para ver:
   - Longitud de la contraseña
   - Primer y último carácter (ocultos)
   - Si la autenticación funciona ahora

## 🔍 Verificación de Caracteres Especiales

Si tu contraseña tiene caracteres especiales (guiones, números, símbolos):

### Ejemplo de contraseña con guiones:
```
Aar-Beto-2026
```

**En GitHub Secrets:**
- ✅ Correcto: `Aar-Beto-2026`
- ❌ Incorrecto: `"Aar-Beto-2026"` (con comillas)
- ❌ Incorrecto: `Aar-Beto-2026 ` (con espacio al final)
- ❌ Incorrecto: ` Aar-Beto-2026` (con espacio al inicio)

### Verificar en el Workflow

El workflow ahora muestra:
- Longitud de la contraseña
- Primer y último carácter (ocultos)
- Caracteres especiales presentes

Compara estos valores con tu contraseña real para verificar que coincidan.

## 🚨 Troubleshooting Específico

### Error: "Permission denied (publickey,password)"

**Causa:** La contraseña es incorrecta

**Solución:**
1. Conéctate manualmente: `ssh root@72.60.63.240`
2. Usa la contraseña que funciona
3. Copia esa contraseña EXACTA
4. Actualiza `VPS_SSH_PASSWORD` en GitHub Secrets

### Error: "No more authentication methods to try"

**Causa:** El servidor rechazó la contraseña

**Solución:**
1. Verifica que `PasswordAuthentication yes` en el servidor
2. Verifica que la contraseña sea correcta
3. Verifica que no haya espacios extra

### La contraseña funciona manualmente pero no en GitHub Actions

**Causa:** Caracteres especiales o espacios extra en GitHub Secrets

**Solución:**
1. Copia la contraseña directamente desde donde funciona
2. Pégala en GitHub Secrets sin modificar
3. No agregues comillas ni espacios

## 📋 Checklist de Verificación

Antes de ejecutar el workflow, verifica:

- [ ] La contraseña funciona manualmente: `ssh root@72.60.63.240`
- [ ] La contraseña en GitHub Secrets es exactamente la misma
- [ ] No hay espacios al inicio o final
- [ ] No hay comillas alrededor de la contraseña
- [ ] Todos los caracteres especiales están presentes
- [ ] `PasswordAuthentication yes` está configurado en el servidor
- [ ] El servicio SSH está corriendo en el servidor

## 🔗 Archivos Relacionados

- [Verificar Servidor SSH](VERIFICAR_SERVIDOR_SSH.md)
- [Comandos Rápidos Servidor](COMANDOS_RAPIDOS_SERVIDOR.md)
- [Solución Definitiva Permission Denied](SOLUCION_DEFINITIVA_PERMISSION_DENIED.md)

