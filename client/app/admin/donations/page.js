'use client';
import { useEffect, useState } from 'react';
import { donationAPI } from '../../../lib/api';
import s from '../admin-shared.module.css';

export default function DonationsAdmin() {
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);
  const [raised, setRaised] = useState(0);
  const [filter, setFilter] = useState('');

  const load = (status='') => {
    donationAPI.getDonations(status?{status}:{}).then(r=>{
      setDonations(r.data.donations);
      setTotal(r.data.total);
      setRaised(r.data.totalRaised||0);
    }).catch(()=>{});
  };
  useEffect(()=>{ load(); },[]);

  return (
    <div>
      <div className={s.header}>
        <div><div className={s.title}>Donations</div><div className={s.subtitle}>Track all donation records</div></div>
        <div style={{background:'#1a6b3c',color:'#fff',padding:'10px 20px',borderRadius:12,fontWeight:700,fontSize:'1.1rem'}}>
          ₦{raised.toLocaleString()} <span style={{fontSize:'0.75rem',opacity:0.8,fontWeight:400}}>Total Raised</span>
        </div>
      </div>
      <div className={s.filters}>
        {['','success','pending','failed'].map(f=><button key={f} className={`${s.filterBtn} ${filter===f?s.filterActive:''}`} onClick={()=>{setFilter(f);load(f);}}>{f||'All'}</button>)}
      </div>
      <div className={s.panel}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Donor</th><th>Email</th><th>Amount</th><th>Reference</th><th>Program</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {donations.length===0&&<tr><td colSpan={7} className={s.empty}>No donations found.</td></tr>}
              {donations.map(d=>(
                <tr key={d._id}>
                  <td style={{fontWeight:600}}>{d.isAnonymous?'Anonymous':d.name}</td>
                  <td style={{fontSize:'0.82rem',color:'#5a6b58'}}>{d.email}</td>
                  <td style={{fontWeight:700,color:'#1a6b3c'}}>₦{d.amount?.toLocaleString()}</td>
                  <td style={{fontSize:'0.75rem',color:'#9ca89a',fontFamily:'monospace'}}>{d.reference}</td>
                  <td style={{fontSize:'0.82rem'}}>{d.program||'General'}</td>
                  <td><span className={`${s.badge} ${s[d.status]}`}>{d.status}</span></td>
                  <td style={{fontSize:'0.78rem',color:'#9ca89a'}}>{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
