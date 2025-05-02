import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import rateLimit from './rateLimit.js'

const app = new Hono()

const baslangicZamani = Date.now();

const apiRateLimit = rateLimit(1, 60 * 1000);
app.use('/*', apiRateLimit);

// ----------------------------------------------- \\

// ------------------- Yöntemler -------------------

app.get('/api', (c) => {
  return c.json({ durum: 'Başarılı', yöntemler: ['/v1' ,'/v1/uptime', '/v1/status'] })
})

app.get('/api/v1', (c) => {
  return c.json({ durum: 'Başarılı', yöntemler: ['/uptime', '/status'] })
})

app.get('/', (c) => {
  return c.json({ durum: 'Başarılı', yöntemler: ['/api', '/v1' , '/api/v1', '/api/v1/uptime', '/api/v1/status'] })
})

// --------------------------------------------------

// ------------------- Uptime -------------------

app.get('/api/v1/uptime', (c) => {
  const gecenSure = Date.now() - baslangicZamani;
  const saniye = Math.floor(gecenSure / 1000);
  const dakika = Math.floor(saniye / 60);
  const saat = Math.floor(dakika / 60);
  const gun = Math.floor(saat / 24);
  const ay = Math.floor(gun / 30);
  const kalanSaniye = saniye % 60;
  const kalanDakika = dakika % 60;
  const kalanSaat = saat % 24;
  const kalanGun = gun % 30;
  let uptime;
  if (ay > 0) {
    uptime = `${ay} Ay ${kalanGun} Gün ${kalanSaat} Saat ${kalanDakika} Dakika ${kalanSaniye} Saniye`;
  } else if (gun > 0) {
    uptime = `${gun} Gün ${kalanSaat} Saat ${kalanDakika} Dakika ${kalanSaniye} Saniye`;
  } else if (saat > 0) {
    uptime = `${saat} Saat ${kalanDakika} Dakika ${kalanSaniye} Saniye`;
  } else if (dakika > 0) {
    uptime = `${dakika} Dakika ${kalanSaniye} Saniye`;
  } else {
    uptime = `${saniye} Saniye`;
  }
  return c.json({ durum: 'Başarılı', uptime });
})

// --------------------------------------------------

// ------------------- Status -------------------

app.get('/api/v1/status', (c) => {
  return c.json({ durum: 'Başarılı', message: 'Sunucu Çalışıyor' })
})

// --------------------------------------------------

serve({
  fetch: app.fetch,
  port: 5000
}, (info) => {
  console.log(`Backend Başarıyla Başlatıldı ✅`)
})
