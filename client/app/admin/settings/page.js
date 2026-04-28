'use client';
import { useEffect, useState } from 'react';
import { settingsAPI } from '../../../lib/api';
import toast from 'react-hot-toast';
import s from '../admin-shared.module.css';

export default function SettingsAdmin() {
  const [settings, setSettings] = useState([]);
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsAPI.getAll().then(r => {
      setSettings(r.data.settings);
      const v = {};
      r.data.settings.forEach(s => { v[s.key] = s.value; });
      setValues(v);
    }).catch(()=>{});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsAPI.update(values);
      toast.success('Settings saved!');
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const grouped = settings.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const groupLabels = { general:'General Information', payment:'Payment Settings', social:'Social Media Links', about:'About Content' };

  return (
    <div>
      <div className={s.header}>
        <div><div className={s.title}>Site Settings</div><div className={s.subtitle}>Control all website content and configurations</div></div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':'Save All Changes'}</button>
      </div>

      <div className={s.settingsGrid}>
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className={s.settingsGroup}>
            <div className={s.groupTitle}>{groupLabels[cat] || cat}</div>
            <div className={s.settingsFormGrid}>
              {items.map(item => (
                <div key={item.key} className="form-group">
                  <label className="form-label">{item.label || item.key}</label>
                  {item.key.includes('text') || item.key.includes('mission') || item.key.includes('vision') || item.key.includes('about') ? (
                    <textarea className="form-control" rows={3} value={values[item.key] || ''} onChange={e => setValues({ ...values, [item.key]: e.target.value })} />
                  ) : (
                    <input className="form-control" value={values[item.key] || ''} onChange={e => setValues({ ...values, [item.key]: e.target.value })} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:24,textAlign:'right'}}>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':'Save All Changes'}</button>
      </div>
    </div>
  );
}
