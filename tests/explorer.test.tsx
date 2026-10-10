// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CentralDogmaExplorer from '../src/components/central-dogma/CentralDogmaExplorer';
import { sequenceDownloads } from '../src/components/central-dogma/exports';
import { centralDogmaDemo } from '../src/components/central-dogma/demo';
vi.mock('../src/components/central-dogma/api',()=>({explorerAPI:vi.fn(async (input:any)=>{
  if(input.action==='health')return {available:true};
  if(input.action==='submit')return {rid:'TEST1234',status:'WAITING',next_poll_at:Date.now()+60100};
  throw new Error('Unexpected network request');
})}));
beforeEach(()=>sessionStorage.clear());afterEach(cleanup);
describe('web explorer controls and exports',()=>{
  it('validates pasted input and requires sequence-search consent',async()=>{
    const user=userEvent.setup();render(<CentralDogmaExplorer/>);
    await user.type(screen.getByLabelText('Protein sequence or FASTA'),'M-12');
    expect(screen.getByRole('alert').textContent).toContain('invalid');
    expect((screen.getByRole('button',{name:'Analyse proteins'}) as HTMLButtonElement).disabled).toBe(true);
    await user.clear(screen.getByLabelText('Protein sequence or FASTA'));
    await user.type(screen.getByLabelText('Protein sequence or FASTA'),'>dup\nMAEFG\n>dup\nMAEFG');
    expect(screen.getByText(/2 protein\(s\) validated/)).toBeTruthy();expect(screen.getByText(/Duplicate identifiers/)).toBeTruthy();
    await user.click(screen.getByLabelText(/Send the selected protein sequences/));
    await user.click(screen.getByRole('button',{name:'Analyse proteins'}));
    await waitFor(()=>expect(screen.getByText(/Search requests saved/)).toBeTruthy());
    const state=JSON.parse(sessionStorage.getItem('central_dogma_v1')!);expect(state.queries.map((q:any)=>q.order)).toEqual([1,2]);expect(state.jobs).toHaveLength(2);
  });
  it('offers dynamic organism options without a preset organism',async()=>{
    const user=userEvent.setup();render(<CentralDogmaExplorer/>);
    expect((screen.getByLabelText('Organism options') as HTMLSelectElement).value).toBe('auto');
    await user.selectOptions(screen.getByLabelText('Organism options'),'specific');
    expect(screen.getByLabelText('Search organism name or taxonomy ID')).toBeTruthy();
    expect((screen.getByLabelText('Matching organisms / groups') as HTMLSelectElement).value).toBe('');
  });
  it('shows labelled synthetic central-dogma details and separates available FASTA downloads',async()=>{
    const user=userEvent.setup();render(<CentralDogmaExplorer/>);
    await user.click(screen.getByRole('button',{name:'Try offline demonstration'}));
    expect(screen.getByText(/OFFLINE SYNTHETIC DEMO/)).toBeTruthy();
    await user.click(screen.getByRole('tab',{name:'Transcript & CDS'}));
    expect(screen.getByText(/Spliced transcript ·/)).toBeTruthy();
    await user.click(screen.getByRole('tab',{name:'Gene structure'}));
    expect(screen.getByRole('img',{name:/Annotated gene and transcript structure/}).getAttribute('src')).toContain('data:image/svg+xml');
    const files=sequenceDownloads(centralDogmaDemo().details);expect(Object.keys(files)).toHaveLength(6);
    expect(files['cds.fasta']).toContain('ATGGCTGAATTTGGTTAA');expect(files['genomic_dna.fasta']).toContain('strand=1');
  });
  it('restores waiting requests from session storage on remount',()=>{
    sessionStorage.setItem('central_dogma_v1',JSON.stringify({queries:[{order:1,id:'q',sequence:'MA'}],jobs:[{query:{order:1,id:'q',sequence:'MA'},rid:'SAVED123',status:'WAITING',next_poll_at:Date.now()+60000,candidates:[]}],details:{},demo:false}));
    render(<CentralDogmaExplorer/>);expect(screen.getByText('SAVED123')).toBeTruthy();
  });
});

it('explains the gene-expression pathway and the limits of protein-origin lookup',async()=>{
  const user=userEvent.setup();render(<CentralDogmaExplorer/>);
  await user.click(screen.getByText('Understand the central dogma: DNA → RNA → protein'));
  expect(screen.getByRole('heading',{name:'Genomic DNA'})).toBeTruthy();
  expect(screen.getByRole('heading',{name:'RNA, mRNA and CDS'})).toBeTruthy();
  expect(screen.getByText('Reference transcript ≠ RNA-seq')).toBeTruthy();
  expect(screen.getByText(/different codons, genes and organisms can produce the same protein/)).toBeTruthy();
});
