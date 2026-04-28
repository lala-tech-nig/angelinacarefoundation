'use client';
import { useEffect, useState } from 'react';
import { newsAPI } from '../../../lib/api';
import toast from 'react-hot-toast';
import s from '../admin-shared.module.css';

export default function NewsAdmin() {
  const [news, setNews] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState({ title:'', excerpt:'', content:'', author:'Angelina Care Foundation', category:'News', tags:'', isPublished:false, isFeatured:false });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => newsAPI.getAllNews().then(r=>setNews(r.data.news)).catch(()=>{});
  useEffect(()=>{load();},[]);

  const openAdd = () => { setEditing(null); setForm({title:'',excerpt:'',content:'',author:'Angelina Care Foundation',category:'News',tags:'',isPublished:false,isFeatured:false}); setImageFile(null); setPreview(''); setModal(true); };
  const openEdit = (n) => { setEditing(n); setForm({title:n.title,excerpt:n.excerpt||'',content:n.content,author:n.author,category:n.category,tags:(n.tags||[]).join(', '),isPublished:n.isPublished,isFeatured:n.isFeatured}); setPreview(n.image||''); setImageFile(null); setModal(true); };
  const handleFile = (e) => { const f=e.target.files[0]; if(f){setImageFile(f);setPreview(URL.createObjectURL(f));} };

  const handleSave = async () => {
    if(!form.title||!form.content) { toast.error('Title and content required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v])=>fd.append(k,v));
      if(imageFile) fd.append('image',imageFile);
      if(editing) { await newsAPI.updateNews(editing._id,fd); toast.success('Updated!'); }
      else { await newsAPI.createNews(fd); toast.success('Created!'); }
      setModal(false); load();
    } catch(e) { toast.error(e.response?.data?.message||'Error'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    try { await newsAPI.deleteNews(confirm._id); toast.success('Deleted'); setConfirm(null); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className={s.header}>
        <div><div className={s.title}>News & Articles</div><div className={s.subtitle}>Manage blog posts and announcements</div></div>
        <button className="btn btn-primary" onClick={openAdd}>+ Write Article</button>
      </div>
      <div className={s.panel}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Author</th><th>Views</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {news.length===0&&<tr><td colSpan={7} className={s.empty}>No articles yet.</td></tr>}
              {news.map(n=>(
                <tr key={n._id}>
                  <td>{n.image?<img src={n.image} alt="" className={s.thumb}/>:<div className={s.noImg}>📰</div>}</td>
                  <td style={{fontWeight:600,maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{n.title}</td>
                  <td style={{fontSize:'0.82rem'}}>{n.category}</td>
                  <td style={{fontSize:'0.82rem',color:'#5a6b58'}}>{n.author}</td>
                  <td style={{color:'#9ca89a'}}>{n.views||0}</td>
                  <td><span className={`${s.badge} ${n.isPublished?s.published:s.draft}`}>{n.isPublished?'Published':'Draft'}</span></td>
                  <td><div className={s.actions}>
                    <button className={s.iconBtn} onClick={()=>openEdit(n)}>✏️</button>
                    <button className={`${s.iconBtn} ${s.iconBtnDanger}`} onClick={()=>setConfirm(n)}>🗑️</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal&&(
        <div className={s.modalOverlay} onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className={s.modal} style={{maxWidth:640}}>
            <div className={s.modalTitle}>{editing?'Edit Article':'New Article'}</div>
            {preview&&<img src={preview} alt="" className={s.imgPreview}/>}
            <div className="form-group"><label className="form-label">Featured Image</label><input type="file" accept="image/*" className="form-control" onChange={handleFile}/></div>
            <div className="form-group"><label className="form-label">Title *</label><input className="form-control" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
            <div className={s.formRow}>
              <div className="form-group"><label className="form-label">Category</label><input className="form-control" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Author</label><input className="form-control" value={form.author} onChange={e=>setForm({...form,author:e.target.value})}/></div>
            </div>
            <div className="form-group"><label className="form-label">Excerpt</label><textarea className="form-control" rows={2} value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">Content *</label><textarea className="form-control" rows={6} value={form.content} onChange={e=>setForm({...form,content:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">Tags (comma separated)</label><input className="form-control" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} placeholder="empowerment, youth, health"/></div>
            <div style={{display:'flex',gap:20,marginTop:8}}>
              <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:'0.88rem'}}>
                <input type="checkbox" checked={form.isPublished} onChange={e=>setForm({...form,isPublished:e.target.checked})}/> Publish
              </label>
              <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:'0.88rem'}}>
                <input type="checkbox" checked={form.isFeatured} onChange={e=>setForm({...form,isFeatured:e.target.checked})}/> Featured
              </label>
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
            <div className={s.modalTitle}>Delete Article?</div>
            <p className={s.confirmText}>Delete "<strong>{confirm.title}</strong>"?</p>
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
