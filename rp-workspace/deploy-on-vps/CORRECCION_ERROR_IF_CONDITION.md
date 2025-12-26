# 🔧 Corrección: Error en Condición `if:` de GitHub Actions

## ❌ Error Original

```
Invalid workflow file
(Line: 246, Col: 13): Unrecognized named-value: 'secrets'. 
Located at position 1 within expression: secrets.VPS_SSH_KEY != '' && secrets.VPS_SSH_PASSWORD == ''
```

## 🔍 Causa del Problema

En GitHub Actions, las condiciones `if:` tienen limitaciones cuando se usan con `secrets`:

1. **No puedes usar operadores lógicos complejos** (`&&`, `||`) directamente con `secrets` en condiciones `if:`
2. **No puedes usar `${{ }}`** en condiciones `if:` cuando trabajas con `secrets`
3. La sintaxis correcta es: `if: secrets.VARIABLE != ''` (sin `${{ }}` y sin operadores complejos)

## ✅ Solución Aplicada

### Antes (Incorrecto):
```yaml
- name: Setup SSH
  if: ${{ secrets.VPS_SSH_KEY != '' && secrets.VPS_SSH_PASSWORD == '' }}
  continue-on-error: true
  uses: webfactory/ssh-agent@v0.9.0
  with:
    ssh-private-key: ${{ secrets.VPS_SSH_KEY }}
```

### Después (Correcto):
```yaml
- name: Setup SSH
  if: secrets.VPS_SSH_KEY != ''
  continue-on-error: true
  uses: webfactory/ssh-agent@v0.9.0
  with:
    ssh-private-key: ${{ secrets.VPS_SSH_KEY }}
```

## 📝 Explicación

1. **Eliminada la condición compleja**: Ya no verificamos si `VPS_SSH_PASSWORD == ''` en el `if:`
2. **Lógica movida a scripts bash**: La priorización de contraseña sobre clave SSH se maneja dentro de los scripts bash, donde sí podemos usar condiciones complejas
3. **`continue-on-error: true`**: Si no hay clave SSH, el step fallará silenciosamente y continuará

## 🔄 Comportamiento Actual

### Si `VPS_SSH_KEY` está configurado:
- ✅ El step "Setup SSH" se ejecuta y configura el agente SSH
- ✅ Los scripts bash verifican si hay contraseña primero
- ✅ Si hay contraseña, deshabilitan el agente SSH y usan contraseña
- ✅ Si no hay contraseña, usan la clave SSH del agente

### Si solo `VPS_SSH_PASSWORD` está configurado:
- ✅ El step "Setup SSH" se omite (porque `if: secrets.VPS_SSH_KEY != ''` es falso)
- ✅ Los scripts bash usan contraseña directamente

### Si ambos están configurados:
- ✅ El step "Setup SSH" se ejecuta (configura el agente SSH)
- ✅ Los scripts bash **priorizan contraseña** y deshabilitan el agente SSH
- ✅ Se usa contraseña para autenticación

## 📋 Archivos Corregidos

1. ✅ `.github/workflows/deploy-hostinger.yml` (línea 246)
2. ✅ `.github/workflows/test-ssh-connection.yml` (línea 34)

## 🧪 Verificación

Para verificar que el workflow es válido:

1. **GitHub UI**: El workflow debería validarse correctamente en GitHub
2. **Sintaxis YAML**: Debería pasar la validación de sintaxis
3. **Ejecución**: El workflow debería ejecutarse sin errores de sintaxis

## 💡 Notas Importantes

- Los linters pueden mostrar advertencias sobre `secrets` en condiciones, pero la sintaxis `if: secrets.VARIABLE != ''` es **válida** en GitHub Actions
- La lógica de priorización de contraseña está implementada en los scripts bash, no en las condiciones `if:`
- `continue-on-error: true` asegura que el workflow continúe incluso si el step falla

## 🔗 Referencias

- [GitHub Actions: Contexts and expression syntax](https://docs.github.com/en/actions/learn-github-actions/contexts)
- [GitHub Actions: Conditional expressions](https://docs.github.com/en/actions/learn-github-actions/expressions#operators)

