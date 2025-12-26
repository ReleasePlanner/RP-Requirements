# ✅ Solución Final: Error con `secrets` en Condiciones `if:`

## ❌ Problema

GitHub Actions no permite usar `secrets` directamente en condiciones `if:` sin `${{ }}`, y cuando se usa `${{ }}` con operadores lógicos complejos, también falla.

**Error:**
```
Invalid workflow file
(Line: 246, Col: 13): Unrecognized named-value: 'secrets'. 
Located at position 1 within expression: secrets.VPS_SSH_KEY != ''
```

## ✅ Solución Implementada

### Estrategia: Usar Outputs de Steps

En lugar de usar `secrets` directamente en `if:`, creamos un paso previo que verifica la existencia de los secrets y establece outputs, luego usamos esos outputs en las condiciones `if:`.

### Implementación

#### Paso 1: Crear Step que Verifica Secrets

```yaml
- name: Check SSH credentials
  id: check-ssh
  run: |
    if [ -n "${{ secrets.VPS_SSH_KEY }}" ]; then
      echo "has_ssh_key=true" >> $GITHUB_OUTPUT
    else
      echo "has_ssh_key=false" >> $GITHUB_OUTPUT
    fi
    if [ -n "${{ secrets.VPS_SSH_PASSWORD }}" ]; then
      echo "has_ssh_password=true" >> $GITHUB_OUTPUT
    else
      echo "has_ssh_password=false" >> $GITHUB_OUTPUT
    fi
```

#### Paso 2: Usar Outputs en Condición `if:`

```yaml
- name: Setup SSH
  if: steps.check-ssh.outputs.has_ssh_key == 'true' && steps.check-ssh.outputs.has_ssh_password == 'false'
  continue-on-error: true
  uses: webfactory/ssh-agent@v0.9.0
  with:
    ssh-private-key: ${{ secrets.VPS_SSH_KEY }}
```

## 📋 Cambios Aplicados

### `.github/workflows/deploy-hostinger.yml`

**Antes:**
```yaml
- name: Setup SSH
  if: secrets.VPS_SSH_KEY != ''  # ❌ Error
  continue-on-error: true
  uses: webfactory/ssh-agent@v0.9.0
  with:
    ssh-private-key: ${{ secrets.VPS_SSH_KEY }}
```

**Después:**
```yaml
- name: Check SSH credentials
  id: check-ssh
  run: |
    if [ -n "${{ secrets.VPS_SSH_KEY }}" ]; then
      echo "has_ssh_key=true" >> $GITHUB_OUTPUT
    else
      echo "has_ssh_key=false" >> $GITHUB_OUTPUT
    fi
    if [ -n "${{ secrets.VPS_SSH_PASSWORD }}" ]; then
      echo "has_ssh_password=true" >> $GITHUB_OUTPUT
    else
      echo "has_ssh_password=false" >> $GITHUB_OUTPUT
    fi

- name: Setup SSH
  if: steps.check-ssh.outputs.has_ssh_key == 'true' && steps.check-ssh.outputs.has_ssh_password == 'false'
  continue-on-error: true
  uses: webfactory/ssh-agent@v0.9.0
  with:
    ssh-private-key: ${{ secrets.VPS_SSH_KEY }}
```

### `.github/workflows/test-ssh-connection.yml`

Mismo cambio aplicado.

## 🔍 Cómo Funciona

1. **Step "Check SSH credentials"**:
   - Se ejecuta siempre
   - Verifica si `VPS_SSH_KEY` existe (no vacío)
   - Verifica si `VPS_SSH_PASSWORD` existe (no vacío)
   - Establece outputs: `has_ssh_key` y `has_ssh_password`

2. **Step "Setup SSH"**:
   - Solo se ejecuta si:
     - `has_ssh_key == 'true'` (hay clave SSH)
     - Y `has_ssh_password == 'false'` (NO hay contraseña)
   - Esto asegura que solo configuremos el agente SSH cuando hay clave y NO hay contraseña

## ✅ Ventajas de Esta Solución

1. **Cumple con las restricciones de GitHub Actions**: No usa `secrets` directamente en `if:`
2. **Mantiene la lógica original**: Solo configura SSH cuando hay clave y NO hay contraseña
3. **Más legible**: Los outputs tienen nombres descriptivos
4. **Reutilizable**: Los outputs pueden usarse en otros steps si es necesario

## 🧪 Verificación

Para verificar que funciona:

1. **Validación de sintaxis**: GitHub debería aceptar el workflow ahora
2. **Ejecución**: El workflow debería ejecutarse correctamente
3. **Comportamiento**: 
   - Si hay `VPS_SSH_KEY` y NO hay `VPS_SSH_PASSWORD` → Configura SSH agent
   - Si hay `VPS_SSH_PASSWORD` → NO configura SSH agent (usa contraseña)
   - Si no hay ninguno → NO configura SSH agent

## 📝 Notas Importantes

- Los outputs se establecen como strings (`'true'` o `'false'`), por eso comparamos con `== 'true'`
- `$GITHUB_OUTPUT` es el archivo donde GitHub Actions almacena los outputs de los steps
- El `id: check-ssh` permite referenciar los outputs como `steps.check-ssh.outputs.has_ssh_key`

## 🔗 Referencias

- [GitHub Actions: Contexts and expression syntax](https://docs.github.com/en/actions/learn-github-actions/contexts)
- [GitHub Actions: Setting output parameters](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-output-parameters)

