'use client';
import { useEffect, useState } from 'react';
import { contactAPI } from '../../../lib/api';
import toast from 'react-hot-toast';
import s from '../admin-shared.module.css';

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');
  const [viewing, setViewing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = (status='') => contactAPI.getContacts(status?{status}:{}).then(r=>setContacts(r.data.contacts)).catch(()=>{});
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try { await contactAPI.updateStatus(id, {status}); toast.success('Updated'); load(filter); if(viewing?._id===id) setViewing({...viewing,status}); }
    catch { toast.error('Failed'); }
  };

  const handleDelete = async () => {
    try { await contactAPI.deleteContact(confirm._id); toast.success('Deleted'); setConfirm(null); setViewing(null); load(filter); }
    catch { toast.error('Failed'); }
  };

  const handleFilter = (f) => { setFilter(f); load(f); };

  return (
    <div>
      <div className={s.header}>
        <div><div className={s.title}>Messages</div><div className={s.subtitle}>Contact form submissions</div></div>
      </div>
      <div className={s.filters}>
        {['','new','read','replied','archived'].map(f => <button key={f} className={`${s.filterBtn} ${filter===f?s.filterActive:''}`} onClick={()=>handleFilter(f)}>{f||'All'}</button>)}
      </div>
      <div className={s.panel}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Type</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {contacts.length===0&&<tr><td colSpan={7} className={s.empty}>No messages found.</td></tr>}
              {contacts.map(c=>(
                <tr key={c._id} style={{fontWeight:c.status==='new'?600:'normal'}}>
                  <td>{c.name}</td>
                  <td style={{color:'#5a6b58',fontSize:'0.82rem'}}>{c.email}</td>
                  <td style={{maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.subject}</td>
                  <td style={{textTransform:'capitalize'}}>{c.type}</td>
                  <td><span className={`${s.badge} ${s[c.status]}`}>{c.status}</span></td>
                  <td style={{color:'#9ca89a',fontSize:'0.78rem'}}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td><div className={s.actions}>
                    <button className={s.iconBtn} onClick={()=>{setViewing(c);updateStatus(c._id,'read');}}>👁️</button>
                    <button className={s.iconBtn} onClick={()=>updateStatus(c._id,'replied')} title="Mark replied">✅</button>
                    <button className={`${s.iconBtn} ${s.iconBtnDanger}`} onClick={()=>setConfirm(c)}>🗑️</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewing && (
        <div className={s.modalOverlay} onClick={e=>e.target===e.currentTarget&&setViewing(null)}>
          <div className={s.modal}>
            <div className={s.modalTitle}>Message from {viewing.name}</div>
            <p style={{marginBottom:8,fontSize:'0.85rem',color:'#5a6b58'}}><strong>Email:</strong> {viewing.email} | <strong>Phone:</strong> {viewing.phone||'N/A'}</p>
            <p style={{marginBottom:8,fontSize:'0.85rem',color:'#5a6b58'}}><strong>Type:</strong> {viewing.type} | <strong>Date:</strong> {new Date(viewing.createdAt).toLocaleString()}</p>
            <p style={{marginBottom:16,fontSize:'0.9rem',fontWeight:600,color:'#111c10'}}>{viewing.subject}</p>
            <div style={{background:'#f8f9f7',padding:16,borderRadius:12,lineHeight:1.7,fontSize:'0.9rem',color:'#2c3b2a',marginBottom:20,whiteSpace:'pre-wrap'}}>{viewing.message}</div>
            <div className={s.modalFooter}>
              <button className="btn btn-outline-green" onClick={()=>updateStatus(viewing._id,'archived')}>Archive</button>
              <button className="btn btn-primary" onClick={()=>updateStatus(viewing._id,'replied')}>Mark Replied</button>
              <button className="btn btn-outline-green" onClick={()=>setViewing(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <div className={s.modalOverlay} onClick={e=>e.target===e.currentTarget&&setConfirm(null)}>
          <div className={s.modal} style={{maxWidth:380}}>
            <div className={s.modalTitle}>Delete Message?</div>
            <p className={s.confirmText}>Delete message from <strong>{confirm.name}</strong>? Cannot be undone.</p>
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
