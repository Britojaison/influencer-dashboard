"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontSize } from '@tiptap/extension-font-size';
import { Button } from './button';
import { Bold as BoldIcon, Italic as ItalicIcon, Underline as UnderlineIcon, List, ListOrdered, Type } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Bold,
      Italic,
      Underline,
      TextStyle,
      FontSize,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    immediatelyRender: false,
  });

  const setFontSize = (size: string) => {
    if (editor) {
      editor.chain().focus().setFontSize(size).run();
    }
  };

  if (!isMounted || !editor) {
    return (
      <div className={`border rounded-md ${className}`}>
        <div className="border-b bg-gray-50 p-2 flex items-center space-x-1">
          {/* Font Size */}
          <div className="flex items-center space-x-1 mr-2">
            <Type className="h-4 w-4 text-gray-500" />
            <Select disabled>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
            </Select>
          </div>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          {/* Text Formatting */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
            <BoldIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
            <ItalicIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
            <UnderlineIcon className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          {/* Lists */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 min-h-[200px] flex items-center justify-center text-gray-500">
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2 flex items-center space-x-1">
        {/* Font Size */}
        <div className="flex items-center space-x-1 mr-2">
          <Type className="h-4 w-4 text-gray-500" />
          <Select onValueChange={setFontSize} defaultValue="16px">
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12px">12px</SelectItem>
              <SelectItem value="14px">14px</SelectItem>
              <SelectItem value="16px">16px</SelectItem>
              <SelectItem value="18px">18px</SelectItem>
              <SelectItem value="20px">20px</SelectItem>
              <SelectItem value="24px">24px</SelectItem>
              <SelectItem value="28px">28px</SelectItem>
              <SelectItem value="32px">32px</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* Text Formatting */}
        <Button
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0"
        >
          <BoldIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0"
        >
          <ItalicIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('underline') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="h-8 w-8 p-0"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* Lists */}
        <Button
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            console.log('Toggling bullet list');
            editor.chain().focus().toggleBulletList().run();
          }}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            console.log('Toggling ordered list');
            editor.chain().focus().toggleOrderedList().run();
          }}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Editor Content */}
      <div className="p-4 min-h-[200px]">
        <EditorContent editor={editor} />
        {!value && (
          <div className="text-gray-400 pointer-events-none absolute top-4 left-4">
            {placeholder || "Start typing..."}
          </div>
        )}
      </div>
    </div>
  );
}
