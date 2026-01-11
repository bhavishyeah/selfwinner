import React, { useEffect, useState, useRef } from 'react';
import { User, Note } from '../types';
import api from '../services/api';

interface SecurePDFViewerProps {
  user: User;
  note: Note;
}

const SecurePDFViewer: React.FC<SecurePDFViewerProps> = ({ user, note }) => {
  const [warnings, setWarnings] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pages, setPages] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Security: Disable right click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setWarnings(prev => prev + 1);
  };

  // Security: Block keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+P (Print), Ctrl+S (Save), Ctrl+Shift+I (DevTools), PrintScreen
      if (
        (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'u')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        setWarnings(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch and Load PDF using PDF.js
  useEffect(() => {
      const loadPdf = async () => {
          try {
              // Fetch blob from backend
              const response = await api.get(`/viewer/${note.id}`, {
                  responseType: 'arraybuffer'
              });
              
              const pdfData = response.data;
              const pdfjsLib = (window as any).pdfjsLib;
              
              if (!pdfjsLib) {
                  throw new Error("PDF.js library not loaded");
              }

              const loadingTask = pdfjsLib.getDocument({ data: pdfData });
              const pdf = await loadingTask.promise;
              
              setPdfDoc(pdf);
              setPages(Array.from({ length: pdf.numPages }, (_, i) => i + 1));
              setLoading(false);

          } catch (err) {
              console.error(err);
              setError('Failed to secure content stream. Please try again.');
              setLoading(false);
          }
      };

      if (note.id) {
          loadPdf();
      }
  }, [note.id]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[800px] bg-gray-900 overflow-hidden secure-view flex flex-col items-center border border-gray-700 rounded-lg shadow-2xl"
      onContextMenu={handleContextMenu}
    >
      {/* Header / Security Status */}
      <div className="w-full bg-gray-800 text-gray-300 px-4 py-2 flex justify-between items-center text-xs select-none z-50 shadow-md">
          <div className="flex items-center">
              <i className="fas fa-shield-alt text-green-400 mr-2"></i>
              Secure Viewer Active
          </div>
          <div>
              {pages.length > 0 && <span>{pages.length} Pages</span>}
          </div>
      </div>

      {/* Warnings */}
      {warnings > 0 && (
        <div className="absolute top-16 bg-red-500 text-white px-6 py-2 rounded shadow-lg z-50 animate-bounce font-bold">
          <i className="fas fa-exclamation-triangle mr-2"></i> Screen Capture / Saving Disabled ({warnings})
        </div>
      )}

      {/* Content Layer (Canvas Scroll) */}
      <div className="w-full flex-1 overflow-y-auto overflow-x-hidden relative bg-gray-500/50 p-4 space-y-4 no-scrollbar">
         {error ? (
             <div className="flex items-center justify-center h-full text-white font-bold bg-gray-900">
                 <i className="fas fa-exclamation-circle text-red-500 mr-2"></i> {error}
             </div>
         ) : loading ? (
             <div className="flex flex-col items-center justify-center h-full text-gray-300">
                 <i className="fas fa-circle-notch fa-spin text-4xl mb-4 text-primary"></i> 
                 <p>Decrypting secure stream...</p>
             </div>
         ) : (
             pages.map(pageNum => (
                 <PDFPage 
                    key={pageNum} 
                    pdfDoc={pdfDoc} 
                    pageNum={pageNum} 
                    width={containerRef.current?.clientWidth ? containerRef.current.clientWidth - 60 : 600} 
                 />
             ))
         )}
      </div>

      {/* Watermark Layer */}
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden flex flex-wrap items-center justify-center opacity-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="transform -rotate-45 m-16 text-white font-black text-2xl select-none whitespace-nowrap">
            {user.email} <br />
            <span className="text-sm font-mono">{user.id.substring(0,8)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sub-component to render individual pages to canvas
const PDFPage: React.FC<{ pdfDoc: any, pageNum: number, width: number }> = ({ pdfDoc, pageNum, width }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const renderPage = async () => {
            const page = await pdfDoc.getPage(pageNum);
            // Calculate scale to fit width
            const unscaledViewport = page.getViewport({ scale: 1 });
            const scale = width / unscaledViewport.width;
            const viewport = page.getViewport({ scale });

            const canvas = canvasRef.current;
            if (canvas) {
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                await page.render(renderContext).promise;
            }
        };
        renderPage();
    }, [pdfDoc, pageNum, width]);

    return (
        <div className="relative shadow-lg">
            <canvas ref={canvasRef} className="bg-white rounded block" />
        </div>
    );
};

export default SecurePDFViewer;