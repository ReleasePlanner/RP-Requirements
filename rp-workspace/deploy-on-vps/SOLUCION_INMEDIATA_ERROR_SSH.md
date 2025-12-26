# 🚨 Solución Inmediata: Error SSH Permission Denied

## ❌ Problema Actual

El workflow está intentando usar SSH key en lugar de contraseña, causando "Permission denied".

## ✅ Solución Rápida (5 minutos)

### Paso 1: Verificar/Crear Secret VPS_SSH_PASSWORD

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, busca **Secrets and variables**
4. Click en **Actions**
5. Busca `VPS_SSH_PASSWORD`

**Si NO existe:**

- Click en **New repository secret**
- **Name:** `VPS_SSH_PASSWORD`
- **Secret:** Tu contraseña SSH del servidor Hostinger (ej: `Aar-Beto-2026`)
- Click en **Add secret**

**Si existe:**

- Verifica que el valor sea correcto
- Si es incorrecto, click en el secret y luego en **Update**

### Paso 2: Verificar Otros Secrets Requeridos

Asegúrate de que estos secrets también estén configurados:

- ✅ `VPS_HOST` = `72.60.63.240`
- ✅ `VPS_USER` = `root` (o tu usuario SSH)
- ✅ `VPS_SSH_PASSWORD` = Tu contraseña SSH

### Paso 3: Ejecutar Workflow Nuevamente

1. Ve a **Actions** en GitHub
2. Selecciona **Deploy to Hostinger VPS**
3. Click en **Run workflow**
4. Selecciona environment (development o production)
5. Click en **Run workflow**

### Paso 4: Revisar Logs

En los logs, busca:

```
🔍 Checking SSH credentials...
✅ VPS_SSH_PASSWORD is configured (WILL BE USED)
📋 Authentication method will be:
   🔑 PASSWORD (prioritized)
```

Si ves esto, el workflow debería usar contraseña correctamente.

## 🔍 Verificación de Logs

### Logs Correctos (Usando Contraseña):

```
🔍 Debug SSH credentials check:
  has_ssh_password: 'true'
  VPS_SSH_PASSWORD configured: true
🔑 Using SSH password authentication (prioritized)
📤 Copying deployment script using SSH password...
```

### Logs Incorrectos (Intentando Usar SSH Key):

```
🔍 Debug SSH credentials check:
  has_ssh_password: 'false'
  VPS_SSH_PASSWORD configured: false
📤 Copying deployment script using SSH key...
```

Si ves "has_ssh_password: 'false'", significa que `VPS_SSH_PASSWORD` no está configurado correctamente.

## 🐛 Troubleshooting

### Problema: "has_ssh_password: 'false'" en los logs

**Causa:** `VPS_SSH_PASSWORD` no está configurado o está vacío

**Solución:**

1. Ve a Settings > Secrets > Actions
2. Verifica que `VPS_SSH_PASSWORD` exista
3. Si no existe, créalo (ver Paso 1)
4. Si existe, verifica que el valor sea correcto (sin espacios extra)

### Problema: "Permission denied" incluso con contraseña

**Causa:** La contraseña es incorrecta o el usuario es incorrecto

**Solución:**

1. Verifica la contraseña SSH del servidor
2. Verifica que `VPS_USER` sea correcto (generalmente `root`)
3. Prueba conectarte manualmente:
   ```bash
   ssh root@72.60.63.240
   ```

### Problema: El workflow sigue usando SSH key

**Causa:** Tienes `VPS_SSH_KEY` configurado pero no `VPS_SSH_PASSWORD`

**Solución:**

1. Agrega `VPS_SSH_PASSWORD` a los secrets (ver Paso 1)
2. O elimina `VPS_SSH_KEY` si solo quieres usar contraseña

## 📋 Checklist de Verificación

Antes de ejecutar el workflow, verifica:

- [ ] `VPS_HOST` está configurado en GitHub Secrets
- [ ] `VPS_USER` está configurado en GitHub Secrets (o usando default `root`)
- [ ] `VPS_SSH_PASSWORD` está configurado en GitHub Secrets
- [ ] El valor de `VPS_SSH_PASSWORD` es correcto (sin espacios extra)
- [ ] Puedes conectarte manualmente con: `ssh root@72.60.63.240`

## 💡 Recomendación

**Para desarrollo/testing:** Usa `VPS_SSH_PASSWORD` (más simple y rápido de configurar)

**Para producción:** Considera migrar a `VPS_SSH_KEY` (más seguro, pero requiere configuración adicional)

## 🔗 Referencias

- [Configurar Secrets en GitHub](CONFIGURAR_SECRETS_GITHUB.md)
- [Verificar Secrets en GitHub](VERIFICAR_SECRETS_GITHUB.md)
