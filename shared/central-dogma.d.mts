export interface ProteinQuery { order: number; id: string; description: string; sequence: string; }
export function parseProteins(text: string): ProteinQuery[];
export function exactMatch(query: string, reference: string): string;
export function unionLength(intervals: number[][]): number;
export function blastCandidates(data: any, query: ProteinQuery): any[];
export function locationParts(location: string): any[];
export function reverseComplement(sequence: string): string;
export function translateCDS(record: any, feature: any, reference: string, query: string): any;
export function transcriptEvidence(record: any, protein: any, query: string): any[];
export function fasta(entries: { id: string; sequence: string }[]): string;
export function geneStructureSvg(detail: any): string;
