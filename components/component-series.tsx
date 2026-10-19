"use client"
import {useState} from 'react'
import {MedicalCards} from '@/components/medical-catalog'
export function ComponentSeries({parts}:{parts:{slug:string;name:string;group:string;image:string}[]}){const[selected,setSelected]=useState(parts[0]?.group||'');const groups=[...new Set(parts.map(p=>p.group))];return <><div className="series-tabs" role="group" aria-label="Component series">{groups.map(g=><button aria-pressed={selected===g} key={g} onClick={()=>setSelected(g)}>{g}</button>)}</div><MedicalCards items={parts.filter(p=>p.group===selected)} base="/contract-manufacturing"/></>}
