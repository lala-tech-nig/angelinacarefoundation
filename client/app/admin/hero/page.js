'use client';
import { useEffect, useState } from 'react';
import { heroAPI } from '../../../lib/api';
import toast from 'react-hot-toast';
import s from '../admin-shared.module.css';

export default function HeroAdmin() {
  const [slides, setSlides] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState({ title:'', subtitle:'', description:'', ctaText:'Learn More', ctaLink:'#programs', ctaSecondaryText:'Donate Now', ctaSecondaryLink:'#donate', order:0, overlay:0.55 });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => heroAPI.getAllSlides().then(r => setSlides(r.data.slides)).catch(()=>{});
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ title:'', subtitle:'', description:'', ctaText:'Learn More', ctaLink:'#programs', ctaSecondaryText:'Donate Now', ctaSecondaryLink:'#donate', order:0, overlay:0.55 }); setImageFile(null); setPreview(''); setModal(true); };
  const openEdit = (slide) => { setEditing(slide); setForm({ title:slide.title, subtitle:slide.subtitle||'', description:slide.description||'', ctaText:slide.ctaText, ctaLink:slide.ctaLink, ctaSecondaryText:slide.ctaSecondaryText, ctaSecondaryLink:slide.ctaSecondaryLink, order:slide.order, overlay:slide.overlay }); setPreview(slide.image); setImageFile(null); setModal(true); };

  const handleFile = (e) => { const f = e.target.files[0]; if(f){ setImageFile(f); setPreview(URL.createObjectURL(f)); } };

  const handleSave = async () => {
    if (!editing && !imageFile) { toast.error('Please select an image'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (editing) { await heroAPI.updateSlide(editing._id, fd); toast.success('Slide updated!'); }
      else { await heroAPI.createSlide(fd); toast.success('Slide created!'); }
      setModal(false); load();
    } catch(e) { toast.error(e.response?.data?.message || 'Error saving slide'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    try { await heroAPI.deleteSlide(confirm._id); toast.success('Slide deleted'); setConfirm(null); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const toggleActive = async (slide) => {
    try { await heroAPI.updateSlide(slide._id, { isActive: !slide.isActive }); load(); toast.success('Updated'); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className={s.header}>
        <div><div className={s.title}>Hero Slides</div><div className={s.subtitle}>Manage the homepage carousel slides</div></div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Slide</button>
      </div>
      <div className={s.panel}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Image</th><th>Title</th><th>Subtitle</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {slides.length === 0 && <tr><td colSpan={6} className={s.empty}>No slides yet. Add your first slide.</td></tr>}
              {slides.map(slide => (
                <tr key={slide._id}>
                  <td>{slide.image ? <img src={slide.image} alt="" className={s.thumb} /> : <div className={s.noImg}>🖼️</div>}</td>
                  <td style={{fontWeight:600}}>{slide.title}</td>
                  <td style={{color:'#5a6b58'}}>{slide.subtitle}</td>
                  <td>{slide.order}</td>
                  <td><span className={`${s.badge} ${slide.isActive ? s.active : s.inactive}`}>{slide.isActive ? 'Active' : 'Hidden'}</span></td>
                  <td>
                    <div className={s.actions}>
                      <button className={s.iconBtn} onClick={() => openEdit(slide)} title="Edit">✏️</button>
                      <button className={s.iconBtn} onClick={() => toggleActive(slide)} title="Toggle">{slide.isActive ? '🙈' : '👁️'}</button>
                      <button className={`${s.iconBtn} ${s.iconBtnDanger}`} onClick={() => setConfirm(slide)} title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className={s.modalOverlay} onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className={s.modal}>
            <div className={s.modalTitle}>{editing ? 'Edit Slide' : 'New Hero Slide'}</div>
            {preview && <img src={preview} alt="Preview" className={s.imgPreview} />}
            <div className="form-group"><label className="form-label">Image {!editing && '*'}</label><input type="file" accept="image/*" className="form-control" onChange={handleFile} /></div>
            <div className={s.formRow}>
              <div className="form-group"><label className="form-label">Title *</label><input className="form-control" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Subtitle</label><input className="form-control" value={form.subtitle} onChange={e=>setForm({...form,subtitle:e.target.value})} /></div>
            </div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-control" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
            <div className={s.formRow}>
              <div className="form-group"><label className="form-label">Primary CTA Text</label><input className="form-control" value={form.ctaText} onChange={e=>setForm({...form,ctaText:e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Primary CTA Link</label><input className="form-control" value={form.ctaLink} onChange={e=>setForm({...form,ctaLink:e.target.value})} /></div>
            </div>
            <div className={s.formRow}>
              <div className="form-group"><label className="form-label">Secondary CTA Text</label><input className="form-control" value={form.ctaSecondaryText} onChange={e=>setForm({...form,ctaSecondaryText:e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Secondary CTA Link</label><input className="form-control" value={form.ctaSecondaryLink} onChange={e=>setForm({...form,ctaSecondaryLink:e.target.value})} /></div>
            </div>
            <div className={s.formRow}>
              <div className="form-group"><label className="form-label">Order</label><input type="number" className="form-control" value={form.order} onChange={e=>setForm({...form,order:Number(e.target.value)})} /></div>
              <div className="form-group"><label className="form-label">Overlay ({form.overlay})</label><input type="range" min="0" max="0.9" step="0.05" value={form.overlay} onChange={e=>setForm({...form,overlay:Number(e.target.value)})} style={{width:'100%',marginTop:10}} /></div>
            </div>
            <div className={s.modalFooter}>
              <button className="btn btn-outline-green" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Slide'}</button>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <div className={s.modalOverlay} onClick={e => e.target === e.currentTarget && setConfirm(null)}>
          <div className={s.modal} style={{maxWidth:380}}>
            <div className={s.modalTitle}>Delete Slide?</div>
            <p className={s.confirmText}>Are you sure you want to delete "<strong>{confirm.title}</strong>"? This action cannot be undone.</p>
            <div className={s.modalFooter}>
              <button className="btn btn-outline-green" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="btn btn-primary" style={{background:'#dc2626'}} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
