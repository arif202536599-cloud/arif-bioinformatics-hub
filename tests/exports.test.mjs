import { it, expect, vi } from 'vitest';
import ExcelJS from 'exceljs';
import { downloadExcel, sequenceDownloads } from '../src/components/central-dogma/exports';
import { centralDogmaDemo } from '../src/components/central-dogma/demo';
it('writes a real multi-sheet workbook, preserving evidence and preventing formulas',async()=>{
  const demo=centralDogmaDemo(), click=vi.fn();let blob;
  vi.stubGlobal('document',{body:{appendChild:vi.fn()},createElement:()=>({click,remove:vi.fn()})});vi.spyOn(URL,'createObjectURL').mockImplementation(value=>{blob=value;return 'blob:test';});
  try {
    demo.queries[0].id='=malicious_formula';
    await downloadExcel(demo.queries,demo.jobs,demo.details);
    const wb=new ExcelJS.Workbook();await wb.xlsx.load(await blob.arrayBuffer());
    expect(wb.worksheets).toHaveLength(13);expect(wb.getWorksheet('Queries').getCell('B2').value).toBe("'=malicious_formula");
    const checks=wb.getWorksheet('Translation_Checks');const key=checks.getRow(1).values.indexOf('computed_equals_reference');expect(checks.getRow(2).getCell(key).value).toBe(true);
    expect(wb.getWorksheet('Candidates').rowCount).toBe(2);expect(click).toHaveBeenCalledOnce();
  } finally {vi.unstubAllGlobals();}
});
it('exports all uploaded queries in input order even if no candidates are selected',()=>{
  const files=sequenceDownloads({},[{order:2,id:'same',sequence:'MK'},{order:1,id:'same',sequence:'MA'}]);
  expect(files['query_proteins.fasta']).toBe('>1:same\nMA\n>2:same\nMK\n');
});
