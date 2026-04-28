'use client';
import { useEffect, useState } from 'react';
import { programsAPI } from '../../../lib/api';
import toast from 'react-hot-toast';
import s from '../admin-shared.module.css';

const CATEGORIES = ['women-empowerment','youth-development','education','healthcare','community-welfare','sustainable-development'];
const ICONS = { 'women-empowerment':'👩','youth-development':'🎓','education':'📚','healthcare':'🏥','community-welfare':'🤝','sustainable-development':'🌱' };

export default function ProgramsAdmin() {
  const [programs, setPrograms] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState({ title:'', description:'', longDescription:'', category:'women-empowerment', icon:'👩', order:0, beneficiaries:0, isFeatured:false });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => programsAPI.getAllPrograms().then(r=>setPrograms(r.data.programs)).catch(()=>{});
  useEffect(()=>{load();},[]);

  const openAdd = () => { setEditing(null); setForm({title:'',description:'',longDescription:'',category:'women-empowerment',icon:'👩',order:0,beneficiaries:0,isFeatured:false}); setImageFile(null); setPreview(''); setModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({title:p.title,description:p.description,longDescription:p.longDescription||'',category:p.category,icon:p.icon||'🌟',order:p.order,beneficiaries:p.beneficiaries||0,isFeatured:p.isFeatured}); setPreview(p.image||''); setImageFile(null); setModal(true); };
  const handleFile = (e) => { const f=e.target.files[0]; if(f){setImageFile(f);setPreview(URL.createObjectURL(f));} };

  const handleSave = async () => {
    if(!form.title||!form.description) { toast.error('Title and description required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v])=>fd.append(k,v));
      if(imageFile) fd.append('image',imageFile);
      if(editing) { await programsAPI.updateProgram(editing._id,fd); toast.success('Updated!'); }
      else { await programsAPI.createProgram(fd); toast.success('Created!'); }
      setModal(false); load();
    } catch(e) { toast.error(e.response?.data?.message||'Error'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    try { await programsAPI.deleteProgram(confirm._id); toast.success('Deleted'); setConfirm(null); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className={s.header}>
        <div><div className={s.title}>Programs</div><div className={s.subtitle}>Manage focus area programs</div></div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Program</button>
      </div>
      <div className={s.panel}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Beneficiaries</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {programs.length===0&&<tr><td colSpan={6} className={s.empty}>No programs yet.</td></tr>}
              {programs.map(p=>(
                <tr key={p._id}>
                  <td>{p.image?<img src={p.image} alt="" className={s.thumb}/>:<div className={s.noImg}>{p.icon||ICONS[p.category]||'🌟'}</div>}</td>
                  <td style={{fontWeight:600}}>{p.title}</td>
                  <td style={{textTransform:'capitalize',fontSize:'0.82rem'}}>{p.category?.replace(/-/g,' ')}</td>
                  <td>{p.beneficiaries>0?p.beneficiaries.toLocaleString():'—'}</td>
                  <td><span className={`${s.badge} ${p.isActive?s.active:s.inactive}`}>{p.isActive?'Active':'Hidden'}</span></td>
                  <td><div className={s.actions}>
                    <button className={s.iconBtn} onClick={()=>openEdit(p)}>✏️</button>
                    <button className={`${s.iconBtn} ${s.iconBtnDanger}`} onClick={()=>setConfirm(p)}>🗑️</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className={s.modalOverlay} onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className={s.modal}>
            <div className={s.modalTitle}>{editing?'Edit Program':'New Program'}</div>
            {preview&&<img src={preview} alt="" className={s.imgPreview}/>}
            <div className="form-group"><label className="form-label">Image</label><input type="file" accept="image/*" className="form-control" onChange={handleFile}/></div>
            <div className={s.formRow}>
              <div className="form-group"><label className="form-label">Title *</label><input className="form-control" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Icon (emoji)</label><input className="form-control" value={form.icon} onChange={e=>setForm({...form,icon:e.target.value})}/></div>
            </div>
            <div className={s.formRow}>
              <div className="form-group"><label className="form-label">Category</label>
                <select className="form-control" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                  {CATEGORIES.map(c=><option key={c} value={c}>{c.replace(/-/g,' ')}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Beneficiaries</label><input type="number" className="form-control" value={form.beneficiaries} onChange={e=>setForm({...form,beneficiaries:Number(e.target.value)})}/></div>
            </div>
            <div className="form-group"><label className="form-label">Short Description *</label><textarea className="form-control" rows={2} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">Long Description</label><textarea className="form-control" rows={3} value={form.longDescription} onChange={e=>setForm({...form,longDescription:e.target.value})}/></div>
            <div className={s.formRow}>
              <div className="form-group"><label className="form-label">Order</label><input type="number" className="form-control" value={form.order} onChange={e=>setForm({...form,order:Number(e.target.value)})}/></div>
              <div className="form-group" style={{display:'flex',alignItems:'center',gap:10,paddingTop:28}}>
                <input type="checkbox" id="featured2" checked={form.isFeatured} onChange={e=>setForm({...form,isFeatured:e.target.checked})}/>
                <label htmlFor="featured2" style={{cursor:'pointer'}}>Featured</label>
              </div>
            </div>
            <div className={s.modalFooter}>
              <button className="btn btn-outline-green" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {confirm&&(
        <div className={s.modalOverlay} onClick={e=>e.target===e.currentTarget&&setConfirm(null)}>
          <div className={s.modal} style={{maxWidth:380}}>
            <div className={s.modalTitle}>Delete Program?</div>
            <p className={s.confirmText}>Delete "<strong>{confirm.title}</strong>"? Cannot be undone.</p>
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
