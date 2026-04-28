'use client';
import { useEffect, useState } from 'react';
import { galleryAPI } from '../../../lib/api';
import toast from 'react-hot-toast';
import s from '../admin-shared.module.css';

export default function GalleryAdmin() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState({ title:'', description:'', category:'general', isFeatured:false });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');

  const load = () => galleryAPI.getAllGallery().then(r => setItems(r.data.items)).catch(()=>{});
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ title:'', description:'', category:'general', isFeatured:false }); setImageFile(null); setPreview(''); setModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({ title:item.title, description:item.description||'', category:item.category||'general', isFeatured:item.isFeatured }); setPreview(item.image); setImageFile(null); setModal(true); };
  const handleFile = (e) => { const f = e.target.files[0]; if(f){ setImageFile(f); setPreview(URL.createObjectURL(f)); } };

  const handleSave = async () => {
    if (!editing && !imageFile) { toast.error('Please select an image'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (editing) { await galleryAPI.updateImage(editing._id, fd); toast.success('Updated!'); }
      else { await galleryAPI.uploadImage(fd); toast.success('Uploaded!'); }
      setModal(false); load();
    } catch(e) { toast.error(e.response?.data?.message || 'Error'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    try { await galleryAPI.deleteImage(confirm._id); toast.success('Deleted'); setConfirm(null); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const categories = ['all', ...new Set(items.map(i => i.category).filter(Boolean))];
  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);

  return (
    <div>
      <div className={s.header}>
        <div><div className={s.title}>Gallery</div><div className={s.subtitle}>Manage gallery images</div></div>
        <button className="btn btn-primary" onClick={openAdd}>+ Upload Image</button>
      </div>
      <div className={s.filters}>
        {categories.map(c => <button key={c} className={`${s.filterBtn} ${filter===c?s.filterActive:''}`} onClick={()=>setFilter(c)}>{c}</button>)}
      </div>
      <div className={s.panel}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Featured</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={6} className={s.empty}>No images yet.</td></tr>}
              {filtered.map(item => (
                <tr key={item._id}>
                  <td><img src={item.image} alt={item.title} className={s.thumb} /></td>
                  <td style={{fontWeight:600}}>{item.title}</td>
                  <td style={{textTransform:'capitalize'}}>{item.category}</td>
                  <td>{item.isFeatured ? '⭐' : '—'}</td>
                  <td><span className={`${s.badge} ${item.isActive ? s.active : s.inactive}`}>{item.isActive ? 'Visible' : 'Hidden'}</span></td>
                  <td><div className={s.actions}>
                    <button className={s.iconBtn} onClick={()=>openEdit(item)}>✏️</button>
                    <button className={`${s.iconBtn} ${s.iconBtnDanger}`} onClick={()=>setConfirm(item)}>🗑️</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className={s.modalOverlay} onClick={e => e.target===e.currentTarget&&setModal(false)}>
          <div className={s.modal}>
            <div className={s.modalTitle}>{editing ? 'Edit Image' : 'Upload Image'}</div>
            {preview && <img src={preview} alt="Preview" className={s.imgPreview} />}
            <div className="form-group"><label className="form-label">Image {!editing && '*'}</label><input type="file" accept="image/*" className="form-control" onChange={handleFile} /></div>
            <div className={s.formRow}>
              <div className="form-group"><label className="form-label">Title *</label><input className="form-control" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Category</label><input className="form-control" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="e.g. outreach, events" /></div>
            </div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-control" rows={2} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
            <div className="form-group" style={{display:'flex',alignItems:'center',gap:10}}>
              <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e=>setForm({...form,isFeatured:e.target.checked})} />
              <label htmlFor="featured" style={{fontWeight:500,cursor:'pointer'}}>Mark as Featured</label>
            </div>
            <div className={s.modalFooter}>
              <button className="btn btn-outline-green" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <div className={s.modalOverlay} onClick={e => e.target===e.currentTarget&&setConfirm(null)}>
          <div className={s.modal} style={{maxWidth:380}}>
            <div className={s.modalTitle}>Delete Image?</div>
            <p className={s.confirmText}>This will permanently delete "<strong>{confirm.title}</strong>" from Cloudinary. Cannot be undone.</p>
            <div className={s.modalFooter}>
              <button className="btn btn-outline-green" onClick={()=>setConfirm(null)}>Cancel</button>
              <button className="btn btn-primary" style={{background:'#dc2626'}} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
