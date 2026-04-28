'use client';
import { useEffect, useState } from 'react';
import { teamAPI } from '../../../lib/api';
import toast from 'react-hot-toast';
import s from '../admin-shared.module.css';

export default function TeamAdmin() {
  const [team, setTeam] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState({ name:'', title:'', bio:'', email:'', phone:'', order:0, isFeatured:false });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => teamAPI.getAllTeam().then(r=>setTeam(r.data.team)).catch(()=>{});
  useEffect(()=>{load();},[]);

  const openAdd = () => { setEditing(null); setForm({name:'',title:'',bio:'',email:'',phone:'',order:0,isFeatured:false}); setImageFile(null); setPreview(''); setModal(true); };
  const openEdit = (m) => { setEditing(m); setForm({name:m.name,title:m.title,bio:m.bio||'',email:m.email||'',phone:m.phone||'',order:m.order,isFeatured:m.isFeatured}); setPreview(m.image||''); setImageFile(null); setModal(true); };
  const handleFile = (e) => { const f=e.target.files[0]; if(f){setImageFile(f);setPreview(URL.createObjectURL(f));} };

  const handleSave = async () => {
    if(!form.name||!form.title) { toast.error('Name and title required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v])=>fd.append(k,v));
      if(imageFile) fd.append('image',imageFile);
      if(editing) { await teamAPI.updateMember(editing._id,fd); toast.success('Updated!'); }
      else { await teamAPI.createMember(fd); toast.success('Added!'); }
      setModal(false); load();
    } catch(e) { toast.error(e.response?.data?.message||'Error'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    try { await teamAPI.deleteMember(confirm._id); toast.success('Deleted'); setConfirm(null); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className={s.header}>
        <div><div className={s.title}>Team Members</div><div className={s.subtitle}>Manage team profiles</div></div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Member</button>
      </div>
      <div className={s.panel}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Photo</th><th>Name</th><th>Title</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {team.length===0&&<tr><td colSpan={6} className={s.empty}>No team members yet.</td></tr>}
              {team.map(m=>(
                <tr key={m._id}>
                  <td>{m.image?<img src={m.image} alt="" className={s.thumb} style={{borderRadius:'50%',width:42,height:42}}/>:<div className={s.noImg} style={{borderRadius:'50%',width:42,height:42}}>👤</div>}</td>
                  <td style={{fontWeight:600}}>{m.name}</td>
                  <td style={{color:'#5a6b58',fontSize:'0.85rem'}}>{m.title}</td>
                  <td style={{fontSize:'0.82rem',color:'#9ca89a'}}>{m.email||'—'}</td>
                  <td><span className={`${s.badge} ${m.isActive?s.active:s.inactive}`}>{m.isActive?'Active':'Hidden'}</span></td>
                  <td><div className={s.actions}>
                    <button className={s.iconBtn} onClick={()=>openEdit(m)}>✏️</button>
                    <button className={`${s.iconBtn} ${s.iconBtnDanger}`} onClick={()=>setConfirm(m)}>🗑️</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal&&(
        <div className={s.modalOverlay} onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className={s.modal}>
            <div className={s.modalTitle}>{editing?'Edit Member':'Add Team Member'}</div>
            {preview&&<img src={preview} alt="" className={s.imgPreview} style={{borderRadius:'50%',width:80,height:80,objectFit:'cover',margin:'0 auto 16px'}}/>}
            <div className="form-group"><label className="form-label">Photo</label><input type="file" accept="image/*" className="form-control" onChange={handleFile}/></div>
            <div className={s.formRow}>
              <div className="form-group"><label className="form-label">Full Name *</label><input className="form-control" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Title/Position *</label><input className="form-control" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
            </div>
            <div className="form-group"><label className="form-label">Bio</label><textarea className="form-control" rows={3} value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}/></div>
            <div className={s.formRow}>
              <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-control" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-control" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
            </div>
            <div className={s.formRow}>
              <div className="form-group"><label className="form-label">Order</label><input type="number" className="form-control" value={form.order} onChange={e=>setForm({...form,order:Number(e.target.value)})}/></div>
              <div className="form-group" style={{display:'flex',alignItems:'center',gap:10,paddingTop:28}}>
                <input type="checkbox" id="feat3" checked={form.isFeatured} onChange={e=>setForm({...form,isFeatured:e.target.checked})}/>
                <label htmlFor="feat3" style={{cursor:'pointer'}}>Featured</label>
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
            <div className={s.modalTitle}>Remove Member?</div>
            <p className={s.confirmText}>Remove <strong>{confirm.name}</strong> from the team?</p>
            <div className={s.modalFooter}>
              <button className="btn btn-outline-green" onClick={()=>setConfirm(null)}>Cancel</button>
              <button className="btn btn-primary" style={{background:'#dc2626'}} onClick={handleDelete}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
