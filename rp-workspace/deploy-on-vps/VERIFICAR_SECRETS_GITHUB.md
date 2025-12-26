# 🔍 Verificar Secrets en GitHub

## ❌ Problema Común

Si el workflow está intentando usar SSH key en lugar de contraseña, probablemente el secret `VPS_SSH_PASSWORD` no está configurado correctamente en GitHub.

## ✅ Pasos para Verificar y Configurar

### Paso 1: Verificar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, busca **Secrets and variables**
4. Click en **Actions**
5. Verifica que existan estos secrets:

#### Secrets Requeridos:

- ✅ `VPS_HOST` - IP del servidor (ej: `72.60.63.240`)
- ✅ `VPS_USER` - Usuario SSH (ej: `root`)
- ✅ `VPS_SSH_PASSWORD` - **Tu contraseña SSH** (ej: `Aar-Beto-2026`)

#### Secrets Opcionales:

- `VPS_SSH_KEY` - Solo si quieres usar claves SSH en lugar de contraseña

### Paso 2: Agregar o Actualizar VPS_SSH_PASSWORD

1. En la página de Secrets, busca `VPS_SSH_PASSWORD`
2. Si **NO existe**, click en **New repository secret**
3. Si **existe**, click en el secret y luego en **Update**

**Configuración:**
- **Name:** `VPS_SSH_PASSWORD`
- **Secret:** Tu contraseña SSH del servidor Hostinger
- Click en **Add secret** o **Update secret**

### Paso 3: Verificar que NO hay VPS_SSH_KEY (Opcional)

Si tienes `VPS_SSH_KEY` configurado pero quieres usar contraseña:

1. Puedes **eliminar** `VPS_SSH_KEY` de los secrets, O
2. Dejar ambos configurados (el workflow priorizará contraseña)

### Paso 4: Ejecutar Workflow Nuevamente

1. Ve a **Actions** en GitHub
2. Selecciona **Deploy to Hostinger VPS**
3. Click en **Run workflow**
4. Selecciona el environment (development o production)
5. Click en **Run workflow**

### Paso 5: Revisar Logs de Debug

En los logs del workflow, busca:

```
🔍 Checking SSH credentials...
✅ VPS_SSH_PASSWORD is configured (WILL BE USED)
📋 Authentication method will be:
   🔑 PASSWORD (prioritized)
```

Si ves esto, el workflow debería usar contraseña correctamente.

## 🐛 Troubleshooting

### Problema: El workflow sigue usando SSH key

**Solución:**
1. Verifica que `VPS_SSH_PASSWORD` esté configurado en GitHub Secrets
2. Verifica que el valor no esté vacío
3. Verifica que no tenga espacios al inicio o final
4. Revisa los logs del step "Check SSH credentials" para ver qué detecta

### Problema: "has_ssh_password: ''" en los logs

**Solución:**
- El secret `VPS_SSH_PASSWORD` no está configurado o está vacío
- Agrega o actualiza el secret en GitHub

### Problema: "Permission denied" con contraseña

**Solución:**
1. Verifica que la contraseña sea correcta
2. Verifica que el usuario (`VPS_USER`) sea correcto (generalmente `root`)
3. Prueba conectarte manualmente:
   ```bash
   ssh root@72.60.63.240
   ```

## 📋 Checklist de Verificación

- [ ] `VPS_HOST` configurado en GitHub Secrets
- [ ] `VPS_USER` configurado en GitHub Secrets (o usando default `root`)
- [ ] `VPS_SSH_PASSWORD` configurado en GitHub Secrets
- [ ] El valor de `VPS_SSH_PASSWORD` es correcto (sin espacios extra)
- [ ] El workflow muestra "PASSWORD (prioritized)" en los logs
- [ ] El step "Copy deployment script" muestra "using SSH password"

## 💡 Recomendación

**Para desarrollo/testing:** Usa `VPS_SSH_PASSWORD` (más simple)

**Para producción:** Considera migrar a `VPS_SSH_KEY` (más seguro)

## 🔗 Referencias

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Configurar Secrets en GitHub](CONFIGURAR_SECRETS_GITHUB.md)

