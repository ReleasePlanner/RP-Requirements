# 🚀 Instrucciones Finales para Deployment

## ⚡ Método Más Simple (Recomendado)

Ejecuta estos **3 comandos** en tu terminal:

```bash
# 1. Copiar script al VPS (te pedirá la contraseña)
scp scripts/deploy-on-vps.sh root@72.60.63.240:/tmp/
# Contraseña cuando la pida: Aar-Beto-2026

# 2. Conectar al VPS (te pedirá la contraseña)
ssh root@72.60.63.240
# Contraseña cuando la pida: Aar-Beto-2026

# 3. En el VPS, ejecutar el script
bash /tmp/deploy-on-vps.sh
```

El script hará todo automáticamente:
- ✅ Instalará Docker, Docker Compose, Nginx
- ✅ Clonará el repositorio
- ✅ Generará passwords automáticamente
- ✅ Build y deploy de contenedores
- ✅ Ejecutará migraciones
- ✅ Verificará que todo funciona

---

## 📋 Información de Conexión

- **VPS IP:** 72.60.63.240
- **Usuario:** root
- **Contraseña SSH:** Aar-Beto-2026
- **Repositorio:** https://github.com/ReleasePlanner/RP-Requirements.git

---

## 🔍 Verificación Previa (Opcional)

Antes de ejecutar, puedes probar la conexión:

```bash
ssh root@72.60.63.240
# Ingresa contraseña: Aar-Beto-2026
# Si conecta, presiona Ctrl+D para salir
```

---

## ⚠️ Si Tienes Problemas con SSH

### Error: "Host key verification failed"

```bash
# Aceptar la clave del host automáticamente
ssh -o StrictHostKeyChecking=no root@72.60.63.240
```

### Error: "Permission denied"

- Verifica que la contraseña sea correcta: `Aar-Beto-2026`
- Verifica que el usuario sea `root`
- Verifica que el VPS esté encendido

---

## 📝 Qué Hacer Durante el Deployment

1. **Cuando copies el script:** Ingresa la contraseña `Aar-Beto-2026`
2. **Cuando te conectes al VPS:** Ingresa la contraseña `Aar-Beto-2026`
3. **Cuando el script pida confirmación:** Responde `y` (yes)
4. **El script generará passwords automáticamente** - no necesitas hacerlo manualmente

---

## ✅ Después del Deployment

Una vez que el script termine:

1. **Configurar DNS:**
   - `requirements.beyondnet.cloud` → `72.60.63.240`
   - `requirements-api.beyondnet.cloud` → `72.60.63.240`

2. **Configurar Nginx y SSL:**
   ```bash
   ssh root@72.60.63.240
   # Seguir: docs/QUICK_START_VPS.md (Paso 5)
   ```

3. **Verificar acceso:**
   - Portal: `https://requirements.beyondnet.cloud`
   - API: `https://requirements-api.beyondnet.cloud/api/v1/health/liveness`

---

## 🚨 Troubleshooting

### Ver logs durante el deployment:
```bash
# En otra terminal, conectarte al VPS
ssh root@72.60.63.240
cd /opt/modules/requirements-management
docker-compose logs -f
```

### Ver estado de contenedores:
```bash
ssh root@72.60.63.240
cd /opt/modules/requirements-management
docker-compose ps
```

### Reiniciar si algo falla:
```bash
ssh root@72.60.63.240
cd /opt/modules/requirements-management
docker-compose down
docker-compose build
docker-compose up -d
```

---

## 🎯 Comandos para Copiar y Pegar

```bash
scp scripts/deploy-on-vps.sh root@72.60.63.240:/tmp/
ssh root@72.60.63.240
bash /tmp/deploy-on-vps.sh
```

**¡Ejecuta estos 3 comandos ahora!** 🚀

