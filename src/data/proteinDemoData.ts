import { ProteinProfile } from '../types';

export const demoProteins: ProteinProfile[] = [
  // 1. Rice OsGA20ox2 (sd1) - Plant Lodging Resistance & Green Revolution Gene
  {
    id: 'osga20ox2',
    name: 'Gibberellin 20-oxidase 2 (Semi-Dwarf 1)',
    geneSymbol: 'OsGA20ox2 / sd1',
    organism: 'Oryza sativa subsp. japonica (Rice)',
    uniprotId: 'Q8H8S6',
    pdbId: '4L80',
    alphaFoldId: 'AF-Q8H8S6-F1',
    length: 384,
    molecularWeight: '43.28 kDa',
    isoelectricPoint: 6.42,
    predictedLocalization: 'Cytoplasm / Soluble Cytosolic Fraction (DeepLoc score: 0.91)',
    functionSummary: 'Catalyzes the sequential oxidation steps at carbon-20 of gibberellin intermediates (GA53 -> GA44 -> GA19 -> GA20), representing the key regulatory checkpoint in the biosynthesis of active gibberellin (GA1). Mutations in this gene confer the semi-dwarf phenotype (sd1) in rice, dramatically improving culm mechanical strength, lodging resistance, and harvest index under heavy nitrogen fertilization.',
    sequence: 'MASSPEAATAAAPLGFVFSDAELVRVPAEYVRAAVAGRGFTVVRDGVGRSELAEAYERLLDCARELGVRVRVVESGVPVEVARRVAAASARGGAGGGGEVELLRRCERLASALVVELGAEVTLWRDTFSTTYPAYSRSPVDPDALLELLRDALDVYRWLADLVVVSGGTGLGEALLRHLVEEGRLPPVVVFPATPEAAGGGEGVPAVGAGGEVVVPAEVRELAREAGVHVHRGTVVQVFDATWSSVRPPAELVYCEQCYSLSLGLHAEERARLAARGAA',
    domains: [
      { name: 'DIOX_N (Non-haem dioxygenase N-term)', start: 42, end: 148, description: 'Conserved N-terminal structural scaffold in 2-oxoglutarate-dependent dioxygenases', color: '#06b6d4' },
      { name: '2OG-FeII_Oxy (2-oxoglutarate/iron dioxygenase catalytic domain)', start: 195, end: 342, description: 'Contains the catalytic triad (His-Asp-His) coordinating the catalytic Fe(II) cofactor and 2-oxoglutarate cosubstrate', color: '#0d9488' }
    ],
    pathways: [
      'Gibberellin Biosynthetic Process (GO:0009686)',
      'Plant Hormone Signal Transduction (KEGG: osa04075)',
      'Culm / Stem Internode Elongation (GO:0010082)',
      'Mechanical Lodging Resistance Regulatory Network'
    ],
    goTerms: [
      { id: 'GO:0004339', name: 'gibberellin 20-oxidase activity', type: 'Molecular Function' },
      { id: 'GO:0005506', name: 'iron ion binding', type: 'Molecular Function' },
      { id: 'GO:0009686', name: 'gibberellin biosynthetic process', type: 'Biological Process' },
      { id: 'GO:0005737', name: 'cytoplasm', type: 'Cellular Component' }
    ],
    suggestedAnalyses: [
      'Molecular docking with gibberellin precursor analogs and 2-oxoglutarate inhibitors',
      'Pan-genomic allelic variation analysis across wild and cultivated Asian rice accessions',
      'Comparative expression profiling under exogenous brassinosteroid, paclobutrazol, and gibberellin treatments',
      'Molecular dynamics (MD) simulation of catalytic site His232-Asp234-His298 coordination stability'
    ],
    externalLinks: [
      { label: 'UniProtKB Q8H8S6', url: 'https://www.uniprot.org/uniprotkb/Q8H8S6/entry', badge: 'UniProt', type: 'Database' },
      { label: 'AlphaFold DB AF-Q8H8S6-F1', url: 'https://alphafold.ebi.ac.uk/entry/AF-Q8H8S6-F1', badge: 'AlphaFold', type: '3D Structure' },
      { label: 'Ensembl Plants Os01g0883800', url: 'https://plants.ensembl.org/Oryza_sativa/Gene/Summary?g=Os01g0883800', badge: 'Ensembl Plants', type: 'Genomics' },
      { label: 'Gramene Pathway GA Biosynthesis', url: 'https://www.gramene.org/', badge: 'Gramene', type: 'Pathway' },
      { label: 'STRING PPI Network for OsGA20ox2', url: 'https://string-db.org/network/39947.LOC_Os01g66100.1', badge: 'STRING', type: 'Interactome' }
    ]
  },

  // 2. Human TP53 - Benchmark Tumor Suppressor
  {
    id: 'tp53-human',
    name: 'Cellular Tumor Antigen p53 (Tumor Suppressor p53)',
    geneSymbol: 'TP53',
    organism: 'Homo sapiens (Human)',
    uniprotId: 'P04637',
    pdbId: '1TUP',
    alphaFoldId: 'AF-P04637-F1',
    length: 393,
    molecularWeight: '43.65 kDa',
    isoelectricPoint: 6.32,
    predictedLocalization: 'Nucleus (Active transcription factor) / Cytoplasm / Mitochondria',
    functionSummary: 'Acts as a master tumor suppressor and sequence-specific transcription factor in cellular response to DNA damage, hypoxia, and oncogenic stress. Induces cell cycle arrest (p21/CDKN1A), DNA repair, senescence, or apoptosis (BAX, PUMA). Mutated in >50% of human malignancies.',
    sequence: 'MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYQGSYGFRLGFLHSGTAKSVTCTYSPALNKMFCQLAKTCPVQLWVDSTPPPGTRVRAMAIYKQSQHMTEVVRRCPHHERCSDSDGLAPPQHLIRVEGNLRVEYLDDRNTFRHSVVVPYEPPEVGSDCTTIHYNYMCNSSCMGGMNRRPILTIITLEDSSGNLLGRNSFEVRVCACPGRDRRTEEENLRKKGEPHHELPPGSTKRALPNNTSSSPQPKKKPLDGEYFTLQIRGRERFEMFRELNEALELKDAQAGKEPGGSRAHSSHLKSKKGQSTSRHKKLMFKTEGPDSD',
    domains: [
      { name: 'TAD (Transactivation Domain 1 & 2)', start: 1, end: 61, description: 'Binds transcriptional co-activators (p300/CBP) and negative regulator MDM2', color: '#38bdf8' },
      { name: 'Proline-Rich Domain (PRD)', start: 63, end: 97, description: 'Contains PXXP motifs mediating protein-protein interactions and apoptotic signaling', color: '#a855f7' },
      { name: 'DBD (DNA-Binding Core Domain)', start: 102, end: 292, description: 'Central immunoglobulin-like fold that binds sequence-specific response elements; hotspot for oncogenic mutations (R175, R248, R273)', color: '#0d9488' },
      { name: 'TET (Tetramerization Domain)', start: 325, end: 356, description: 'Coordinates four identical monomers into an active DNA-binding homotetramer', color: '#10b981' }
    ],
    pathways: [
      'p53 Signaling Pathway (KEGG: hsa04115)',
      'Apoptosis & Cell Cycle Arrest (Reactome: R-HSA-69481)',
      'Direct DNA Damage Response & Repair (GO:0006974)',
      'Cellular Senescence (GO:0090398)'
    ],
    goTerms: [
      { id: 'GO:0003677', name: 'DNA binding', type: 'Molecular Function' },
      { id: 'GO:0006915', name: 'apoptotic process', type: 'Biological Process' },
      { id: 'GO:0000082', name: 'G1/S transition of mitotic cell cycle', type: 'Biological Process' },
      { id: 'GO:0005634', name: 'nucleus', type: 'Cellular Component' }
    ],
    suggestedAnalyses: [
      'In silico screening of MDM2-p53 interaction disruptors (Nutlin-3 analogs)',
      'Thermodynamic stability analysis of oncogenic driver missense mutations (R273H, R248Q)',
      'ChIP-seq peak binding analysis across target promoter response elements',
      'Structural superimposition of mutant vs wild-type core domain conformations'
    ],
    externalLinks: [
      { label: 'UniProtKB P04637', url: 'https://www.uniprot.org/uniprotkb/P04637/entry', badge: 'UniProt', type: 'Database' },
      { label: 'PDB 1TUP (p53-DNA Complex)', url: 'https://www.rcsb.org/structure/1TUP', badge: 'PDB', type: '3D Structure' },
      { label: 'AlphaFold DB AF-P04637-F1', url: 'https://alphafold.ebi.ac.uk/entry/AF-P04637-F1', badge: 'AlphaFold', type: '3D Structure' },
      { label: 'STRING PPI Network for TP53', url: 'https://string-db.org/network/9606.ENSP00000269305', badge: 'STRING', type: 'Interactome' }
    ]
  },

  // 3. Arabidopsis CLAVATA3 (CLV3) - Model Plant Stem Cell Regulator
  {
    id: 'clv3-arabidopsis',
    name: 'CLAVATA3 (Stem Cell Homeostasis Peptide)',
    geneSymbol: 'CLV3',
    organism: 'Arabidopsis thaliana (Thale cress)',
    uniprotId: 'Q9SLS6',
    pdbId: '6LK0',
    alphaFoldId: 'AF-Q9SLS6-F1',
    length: 96,
    molecularWeight: '10.35 kDa',
    isoelectricPoint: 9.15,
    predictedLocalization: 'Secreted / Extracellular Matrix / Apoplast',
    functionSummary: 'Encodes a small, secreted 12-amino-acid arabinosylated glycopeptide signaling ligand that restricts stem cell accumulation in the shoot and floral apical meristems. Binds the leucine-rich repeat receptor kinase CLAVATA1 (CLV1) and receptor-like protein CLV2 to repress the homeobox stem cell identity gene WUSCHEL (WUS) through a negative feedback loop.',
    sequence: 'MDSRVRPRLAVILVTALLCVLTASAAHGGGDNVLGGGSVDSVEESLEEEGLSGDFRRRPLHNTRTLPAGDVLHHGDRSVHGSRRTVPSGPDPLHH',
    domains: [
      { name: 'Signal Peptide', start: 1, end: 23, description: 'Directs peptide to the secretory pathway via the endoplasmic reticulum', color: '#f59e0b' },
      { name: 'CLE Domain (Active 12-AA Peptide)', start: 70, end: 82, description: 'RTVPSGPDPLHH - Post-translationally processed and hydroxylated/arabinosylated mature signaling peptide', color: '#10b981' }
    ],
    pathways: [
      'Shoot Apical Meristem Maintenance (GO:0010073)',
      'CLV-WUS Signaling Feedback Pathway (Plant Reactome)',
      'Cell-to-Cell Peptide Signaling (GO:0007267)'
    ],
    goTerms: [
      { id: 'GO:0005102', name: 'signaling receptor binding', type: 'Molecular Function' },
      { id: 'GO:0010073', name: 'meristem maintenance', type: 'Biological Process' },
      { id: 'GO:0005576', name: 'extracellular region', type: 'Cellular Component' }
    ],
    suggestedAnalyses: [
      'Receptor-ligand docking with the CLV1 leucine-rich repeat (LRR) ectodomain',
      'Evolutionary CLE gene family expansion across monocot and dicot lineages',
      'Analysis of post-translational arabinosylation modifications on proline residues',
      'Spatial transcriptomics correlation with WUSCHEL organizing center expression'
    ],
    externalLinks: [
      { label: 'UniProtKB Q9SLS6', url: 'https://www.uniprot.org/uniprotkb/Q9SLS6/entry', badge: 'UniProt', type: 'Database' },
      { label: 'AlphaFold DB AF-Q9SLS6-F1', url: 'https://alphafold.ebi.ac.uk/entry/AF-Q9SLS6-F1', badge: 'AlphaFold', type: '3D Structure' },
      { label: 'TAIR AT2G27250', url: 'https://www.arabidopsis.org/servlets/TairObject?id=30252&type=locus', badge: 'TAIR', type: 'Genomics' },
      { label: 'STRING PPI Network for CLV3', url: 'https://string-db.org/network/3702.AT2G27250.1', badge: 'STRING', type: 'Interactome' }
    ]
  },

  // 4. SARS-CoV-2 Spike Glycoprotein (RBD Domain)
  {
    id: 'sars-cov-2-spike',
    name: 'Spike Glycoprotein (Receptor-Binding Domain)',
    geneSymbol: 'S (Spike)',
    organism: 'SARS-CoV-2 (Severe acute respiratory syndrome coronavirus 2)',
    uniprotId: 'P0DTC2',
    pdbId: '6VXX',
    alphaFoldId: 'AF-P0DTC2-F1',
    length: 1273,
    molecularWeight: '141.18 kDa',
    isoelectricPoint: 6.24,
    predictedLocalization: 'Virion Envelope / Host Cell Membrane',
    functionSummary: 'Trimeric class I viral fusion protein mediating host cell entry. The S1 subunit contains the Receptor-Binding Domain (RBD) which specifically engages human Angiotensin-Converting Enzyme 2 (ACE2), while the S2 subunit facilitates viral-host membrane fusion upon furin cleavage.',
    sequence: 'MFVFLVLLPLVSSQCVNLTTRTQLPPAYTNSFTRGVYYPDKVFRSSVLHSTQDLFLPFFSNVTWFHAIHVSGTNGTKRFDNPVLPFNDGVYFASTEKSNIIRGWIFGTTLDSKTQSLLIVNNATNVVIKVCEFQFCNDPFLGVYYHKNNKSWMESEFRVYSSANNCTFEYVSQPFLMDLEGKQGNFKNLREFVFKNIDGYFKIYSKHTPINLVRDLPQGFSALEPLVDLPIGINITRFQTLLALHRSYLTPGDSSSGWTAGAAAYYVGYLQPRTFLLKYNENGTITDAVDCALDPLSETKCTLKSFTVEKGIYQTSNFRVQPTESIVRFPNITNLCPFGEVFNATRFASVYAWNRKRISNCVADYSVLYNSASFSTFKCYGVSPTKLNDLCFTNVYADSFVIRGDEVRQIAPGQTGKIADYNYKLPDDFTGCVIAWNSNNLDSKVGGNYNYLYRLFRKSNLKPFERDISTEIYQAGSTPCNGVEGFNCYFPLQSYGFQPTNGVGYQPYRVVVLSFELLHAPATVCGPKKSTNLVKNKCVNFNFNGLTGTGVLTESNKKFLPFQQFGRDIADTTDAVRDPQTLEILDITPCSFGGVSVITPGTNTSNQVAVLYQDVNCTEVPVAIHADQLTPTWRVYSTGSNVFQTRAGCLIGAEHVNNSYECDIPIGAGICASYQTQTNSPRRARSVASQSIIAYTMSLGAENSVAYSNNSIAIPTNFTISVTTEILPVSMTKTSVDCTMYICGDSTECSNLLLQYGSFCTQLNRALTGIAVEQDKNTQEVFAQVKQIYKTPPIKDFGGFNFSQILPDPSKPSKRSFIEDLLFNKVTLADAGFIKQYGDCLGDIAARDLICAQKFNGLTVLPPLLTDEMIAQYTSALLAGTITSGWTFGAGAALQIPFAMQMAYRFNGIGVTQNVLYENQKLIANQFNSAIGKIQDSLSSTASALGKLQDVVNQNAQALNTLVKQLSSNFGAISSVLNDILSRLDKVEAEVQIDRLITGRLQSLQTYVTQQLIRAAEIRASANLAATKMSECVLGQSKRVDFCGKGYHLMSFPQSAPHGVVFLHVTYVPAQEKNFTTAPAICHDGKAHFPREGVFVSNGTHWFVTQRNFYEPQIITTDNTFVSGNCDVVIGIVNNTVYDPLQPELDSFKEELDKYFKNHTSPDVDLGDISGINASVVNIQKEIDRLNEVAKNLNESLIDLQELGKYEQYIKWPWYIWLGFIAGLIAIVMVTIMLCCMTSCCSCLKGCCSCGSCCKFDEDDSEPVLKGVKLHYT',
    domains: [
      { name: 'NTD (N-terminal Domain)', start: 14, end: 305, description: 'Binds auxiliary co-factors and neutralizing antibodies', color: '#06b6d4' },
      { name: 'RBD (Receptor-Binding Domain)', start: 319, end: 541, description: 'Directly contacts human ACE2 receptor; contains the receptor-binding motif (RBM 437-508)', color: '#0d9488' },
      { name: 'S2 Fusion Machinery (HR1/HR2)', start: 686, end: 1213, description: 'Drives viral and host membrane fusion upon proteolytic cleavage at S1/S2 and S2\' sites', color: '#8b5cf6' }
    ],
    pathways: [
      'Viral Host Entry Pathway (Reactome: R-HSA-9679506)',
      'ACE2 Receptor Binding & Internalization',
      'Neutralizing Antibody Interaction & Immune Evasion'
    ],
    goTerms: [
      { id: 'GO:0019062', name: 'virion attachment to host cell', type: 'Biological Process' },
      { id: 'GO:0046718', name: 'viral entry into host cell', type: 'Biological Process' },
      { id: 'GO:0005576', name: 'extracellular region', type: 'Cellular Component' }
    ],
    suggestedAnalyses: [
      'Virtual screening of small-molecule fusion inhibitors targeting the HR1/HR2 heptad repeats',
      'Epitope mapping of therapeutic monoclonal antibodies against the RBD surface',
      'Calculation of electrostatic surface charge distribution across VOC (Variants of Concern)',
      'Protein-protein docking with human ACE2 (PDB: 6M0J)'
    ],
    externalLinks: [
      { label: 'UniProtKB P0DTC2', url: 'https://www.uniprot.org/uniprotkb/P0DTC2/entry', badge: 'UniProt', type: 'Database' },
      { label: 'PDB 6VXX (Spike Closed State)', url: 'https://www.rcsb.org/structure/6VXX', badge: 'PDB', type: '3D Structure' },
      { label: 'AlphaFold DB AF-P0DTC2-F1', url: 'https://alphafold.ebi.ac.uk/entry/AF-P0DTC2-F1', badge: 'AlphaFold', type: '3D Structure' }
    ]
  },

  // 5. Rice OsWRKY45 - Master Plant Disease & Abiotic Stress Transcription Factor
  {
    id: 'oswrky45-rice',
    name: 'Transcription Factor WRKY45',
    geneSymbol: 'OsWRKY45',
    organism: 'Oryza sativa subsp. japonica (Rice)',
    uniprotId: 'Q7XSU4',
    pdbId: '2LEX',
    alphaFoldId: 'AF-Q7XSU4-F1',
    length: 326,
    molecularWeight: '35.82 kDa',
    isoelectricPoint: 8.84,
    predictedLocalization: 'Nucleus (Plant Transcription Factor)',
    functionSummary: 'Essential central transcription factor conferring broad-spectrum blast disease (Magnaporthe oryzae) and bacterial blight (Xanthomonas oryzae) resistance in the salicylic acid (SA) and benzothiadiazole (BTH) signaling pathway. Specifically binds to W-box elements [C/T]TGAC[T/C] in downstream defense gene promoters to activate PR gene cascades.',
    sequence: 'MDNGSSSQEEGEAASEEVRRVRAALDAALAGAAARGVGPRRRRGGAAARGVGVVAAARRRRVAVARRGGGGDAAGGRRPEELVEALELAVGAAGGGGGRRRRGGGDAAGGRRPEELVEALELAVGAAGGGGGERRPEELVEALELAVGAAGGGGGGGKSSWRKYGQKPIKGSPYPRGYYKCSTVRGCPARKHVERALDDPAMLIVTYEGEHNHPQPRPAAPAPAAHHPGHPHHPLHPGSPHHGSSHHPPAPAPALVHHHGGSSAAAAVELEELVLEEMVAMVADSSPAAAAASELAAVVRRLLGG',
    domains: [
      { name: 'WRKY DNA-Binding Domain', start: 142, end: 202, description: 'Contains the highly conserved WRKYGQK heptapeptide signature and C2H2 zinc-finger motif', color: '#0d9488' },
      { name: 'Nuclear Localization Signal (NLS)', start: 30, end: 55, description: 'Basic amino acid stretch directing transport through the nuclear pore complex', color: '#38bdf8' }
    ],
    pathways: [
      'Plant-Pathogen Interaction (KEGG: osa04626)',
      'Salicylic Acid / BTH Defense Signaling',
      'Regulation of Defense-Related PR Gene Transcription (GO:0006355)'
    ],
    goTerms: [
      { id: 'GO:0003700', name: 'DNA-binding transcription factor activity', type: 'Molecular Function' },
      { id: 'GO:0006952', name: 'defense response', type: 'Biological Process' },
      { id: 'GO:0005634', name: 'nucleus', type: 'Cellular Component' }
    ],
    suggestedAnalyses: [
      'Promoter scanning of downstream rice PR genes for W-box cis-regulatory elements',
      'Molecular modeling of the zinc finger domain coordinated with Zn(II) ion',
      'Co-expression network analysis using Rice Expression Database (RED)',
      'Structural comparison between OsWRKY45-1 (japonica) and OsWRKY45-2 (indica) alleles'
    ],
    externalLinks: [
      { label: 'UniProtKB Q7XSU4', url: 'https://www.uniprot.org/uniprotkb/Q7XSU4/entry', badge: 'UniProt', type: 'Database' },
      { label: 'AlphaFold DB AF-Q7XSU4-F1', url: 'https://alphafold.ebi.ac.uk/entry/AF-Q7XSU4-F1', badge: 'AlphaFold', type: '3D Structure' },
      { label: 'PlantTFDB Os05g0322900', url: 'http://planttfdb.gao-lab.org/', badge: 'PlantTFDB', type: 'Transcription Factor' },
      { label: 'STRING PPI Network for OsWRKY45', url: 'https://string-db.org/network/39947.LOC_Os05g25770.1', badge: 'STRING', type: 'Interactome' }
    ]
  }
];
