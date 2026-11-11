/* common.js - ตัวช่วยเชื่อมต่อ Apps Script (ใช้ร่วมกันทั้ง index.html และ admin.html) */
(function () {
  const RE = /^https:\/\/script\.google\.com\/(a\/[^\/]+\/)?macros\/s\/[A-Za-z0-9_-]+\/exec$/;
  const cfg = (typeof CONFIG !== 'undefined' && CONFIG) ? CONFIG : {};
  const NETERR = 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ (Failed to fetch)\n' +
    '1) ลิงก์ API ใน config.js ต้องตรงกับ Deployment ล่าสุด (ลงท้าย /exec)\n' +
    '2) Deploy ต้องตั้ง Execute as: Me และ Who has access: Anyone\n' +
    '3) ตรวจสัญญาณอินเทอร์เน็ต แล้วกด Ctrl+F5';

  window.FS = {
    apiUrl() {
      let o = '';
      try { o = localStorage.getItem('fs_api') || ''; } catch (e) {}
      return (o || cfg.API_URL || '').trim();
    },
    logo() { return cfg.LOGO_URL || 'logo.png'; },

    /** เรียก API แบบ POST (ส่งเป็น text/plain เพื่อเลี่ยง CORS preflight ของ Apps Script) */
    async post(action, data) {
      const url = this.apiUrl();
      if (!url) throw new Error('ยังไม่ได้ตั้งค่าลิงก์ API ใน config.js');
      if (!RE.test(url)) throw new Error('ลิงก์ API ไม่ถูกต้อง ต้องขึ้นต้น https://script.google.com/macros/s/ และลงท้าย /exec');
      let res;
      try {
        res = await fetch(url, { method: 'POST', redirect: 'follow', body: JSON.stringify(Object.assign({ action: action }, data || {})) });
      } catch (e) { throw new Error(NETERR); }
      const txt = await res.text();
      try { return JSON.parse(txt); }
      catch (e) { throw new Error('เซิร์ฟเวอร์ตอบกลับไม่ถูกต้อง (ไม่ใช่ JSON)\nตรวจว่า Deploy เป็น New version แล้ว และโค้ด Code.gs วางครบ แล้วรัน setup() 1 ครั้ง'); }
    },

    /** ทดสอบการเชื่อมต่อ (GET) คืนค่า {ok:true,...} หรือ {ok:false,error} */
    async ping() {
      const url = this.apiUrl();
      if (!url) return { ok: false, error: 'ยังไม่ได้ตั้งค่าลิงก์ API ใน config.js' };
      if (!RE.test(url)) return { ok: false, error: 'ลิงก์ API ไม่ถูกต้อง ต้องขึ้นต้น https://script.google.com/macros/s/ และลงท้าย /exec' };
      try {
        const r = await fetch(url, { redirect: 'follow' });
        const j = JSON.parse(await r.text());
        return j && j.ok ? j : { ok: false, error: 'เซิร์ฟเวอร์ตอบกลับไม่ถูกต้อง' };
      } catch (e) { return { ok: false, error: NETERR }; }
    },

    /** ตั้งลิงก์ API เฉพาะเครื่องนี้ (เก็บในเบราว์เซอร์) เว้นว่าง = ล้างค่า กลับไปใช้ config.js */
    setUrl() {
      const cur = this.apiUrl();
      const v = prompt('วางลิงก์ Web app URL (ลงท้าย /exec)\nเว้นว่างเพื่อกลับไปใช้ค่าใน config.js', cur);
      if (v === null) return;
      const u = v.trim();
      if (u && !RE.test(u)) return alert('ลิงก์ไม่ถูกต้อง ต้องขึ้นต้น https://script.google.com/macros/s/ และลงท้าย /exec');
      try { if (u) localStorage.setItem('fs_api', u); else localStorage.removeItem('fs_api'); } catch (e) {}
      location.reload();
    }
  };
})();