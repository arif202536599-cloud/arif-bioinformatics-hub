import React, { useState } from 'react';
import { useUserData } from '../../context/UserDataContext';
import { ResearchNote } from '../../types';
import { Bookmark, Plus, Trash2, Edit3, Save, Download, FileText, Tag, Search, X, Sparkles } from 'lucide-react';

export const ResearchNotes: React.FC = () => {
  const { savedNotes, addNote, updateNote, deleteNote } = useUserData();
  const [selectedNoteId, setSelectedNoteId] = useState<string>(savedNotes[0]?.id || '');
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

  const currentNote = savedNotes.find(n => n.id === selectedNoteId) || savedNotes[0];

  const handleStartEdit = (note: ResearchNote) => {
    setSelectedNoteId(note.id);
    setEditTitle(note.title);
    setEditCategory(note.category);
    setEditContent(note.content);
    setEditTags(note.tags.join(', '));
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return;

    if (currentNote) {
      updateNote(currentNote.id, {
        title: editTitle,
        category: editCategory || 'General',
        content: editContent,
        tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
      });
    }
    setIsEditing(false);
  };

  const handleCreateNewNote = () => {
    addNote({
      title: 'New Research Hypothesis & Notes',
      category: 'General',
      content: `# New Research Observation\n- Date: ${new Date().toLocaleDateString()}\n- Key computational findings:\n- Questions for supervisor:\n`,
      tags: ['Research', 'Ideas'],
    });
    setIsEditing(false);
  };

  const handleDownloadNote = (note: ResearchNote) => {
    const blob = new Blob([note.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredNotes = savedNotes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-orange-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-orange-700">
            <Bookmark className="w-4 h-4 text-orange-600" />
            <span>Private Research Notepad</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
            Saved Research Notes & Notebook
          </h2>
          <p className="text-xs sm:text-sm text-slate-800 font-medium mt-1">
            Capture computational observations, command snippets, thesis outlines, and step-by-step pathway notes.
          </p>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Note</span>
        </button>
      </div>

      {/* Main 2-Column Note Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Notes List */}
        <div className="lg:col-span-4 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white border border-orange-200 text-xs font-semibold text-slate-950 placeholder-slate-400 focus:outline-none focus:border-orange-500 shadow-xs"
            />
          </div>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const isSelected = currentNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setIsEditing(false);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-orange-50/90 border-orange-400 shadow-sm ring-1 ring-orange-300'
                      : 'bg-white border-orange-200/80 hover:border-orange-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                      {note.category}
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono font-medium">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-950 line-clamp-1">
                    {note.title}
                  </h4>

                  <p className="text-[11px] text-slate-700 font-medium line-clamp-2 mt-1">
                    {note.content.replace(/[#*`]/g, '')}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {note.tags.map((t, idx) => (
                      <span key={idx} className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Note Content / Editor */}
        <div className="lg:col-span-8">
          {currentNote ? (
            <div className="rounded-3xl bg-white border border-orange-200/90 shadow-sm p-6 sm:p-8 space-y-5">
              {/* Note Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-orange-200">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300">
                      {currentNote.category}
                    </span>
                    <span className="text-xs text-slate-600 font-mono font-medium">
                      Last edited: {new Date(currentNote.updatedAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-950 mt-1.5">
                    {currentNote.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={() => handleStartEdit(currentNote)}
                      className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-300 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-orange-700" />
                      <span>Edit Note</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveEdit}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDownloadNote(currentNote)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-950 border border-slate-200 transition-colors cursor-pointer"
                    title="Download Note (.md)"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteNote(currentNote.id)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 border border-slate-200 transition-colors cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Editing Form vs Markdown Preview */}
              {isEditing ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-900 font-bold mb-1">Note Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-orange-50/50 border border-orange-200 text-slate-950 font-bold text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-900 font-bold mb-1">Category</label>
                      <input
                        type="text"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-orange-50/50 border border-orange-200 text-slate-950 font-bold text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-900 font-bold mb-1">Tags (Comma-separated)</label>
                      <input
                        type="text"
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-orange-50/50 border border-orange-200 text-slate-950 font-bold text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold mb-1">Content (Markdown Supported)</label>
                    <textarea
                      rows={12}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-3 rounded-xl bg-orange-50/50 border border-orange-200 text-slate-950 font-mono text-xs focus:outline-none focus:border-orange-500 leading-relaxed font-semibold"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-orange-50/40 border border-orange-200/80">
                  <pre className="text-xs font-mono text-slate-950 whitespace-pre-wrap leading-relaxed overflow-x-auto font-medium">
                    {currentNote.content}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-600 rounded-3xl bg-white border border-orange-200 shadow-sm">
              <FileText className="w-10 h-10 mx-auto text-orange-400 mb-2" />
              <p className="text-sm font-bold text-slate-900">No note selected</p>
              <p className="text-xs text-slate-600 mt-1">Create a new note or select a step note to start reviewing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
