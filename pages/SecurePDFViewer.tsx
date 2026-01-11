import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNote } from '../services/notesService';
import { checkAccess } from '../services/paymentService';
import authService from '../services/authService';

const SecurePDFViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [rotation, setRotation] = useState(0);
  const [rendering, setRendering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<any>(null);
  const renderTaskRef = useRef<any>(null);

  const user = authService.getStoredUser();
  const token = authService.getToken();

  useEffect(() => {
    loadNote();
    setupMaximumSecurity();
    loadPDFJS();

    return cleanupSecurity;
  }, [id]);

  const loadPDFJS = () => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    document.head.appendChild(script);
  };

  const downloadFakePDF = () => {
    const fakeContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >>
endobj
5 0 obj
<< /Length 200 >>
stream
BT
/F1 48 Tf
100 600 Td
(CAUGHT IN 4K!) Tj
0 -100 Td
/F1 24 Tf
(Unauthorized Download Attempt) Tj
0 -50 Td
/F1 16 Tf
(User: ${user?.email}) Tj
0 -30 Td
(Time: ${new Date().toLocaleString()}) Tj
0 -30 Td
(IP Logged & Reported) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000214 00000 n
0000000317 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
567
%%EOF`;

    const blob = new Blob([fakeContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CAUGHT_IN_4K.pdf';
    a.click();
    URL.revokeObjectURL(url);
    alert('⚠️ SECURITY ALERT!\n\nUnauthorized download attempt detected!\nThis incident has been logged.\n\nUser: ' + user?.email + '\nTime: ' + new Date().toLocaleString());
  };

  const setupMaximumSecurity = () => {
    const blockAll = (e: any) => {
      const key = e.key?.toLowerCase();
      const isF12 = e.key === 'F12';
      const isDevTools = e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c');
      const isViewSource = e.ctrlKey && key === 'u';
      const isSave = e.ctrlKey && key === 's';
      const isPrint = e.ctrlKey && key === 'p';

      if (isF12 || isDevTools || isViewSource || isSave || isPrint) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        if (isSave || isPrint) {
          downloadFakePDF();
        }
        
        return false;
      }
    };

    const blockRightClick = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    document.addEventListener('keydown', blockAll, true);
    document.addEventListener('keyup', blockAll, true);
    window.addEventListener('keydown', blockAll, true);
    window.addEventListener('keyup', blockAll, true);
    document.addEventListener('contextmenu', blockRightClick, true);
    window.addEventListener('contextmenu', blockRightClick, true);
    
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    (window as any).__cleanup = () => {
      document.removeEventListener('keydown', blockAll, true);
      document.removeEventListener('keyup', blockAll, true);
      window.removeEventListener('keydown', blockAll, true);
      window.removeEventListener('keyup', blockAll, true);
      document.removeEventListener('contextmenu', blockRightClick, true);
      window.removeEventListener('contextmenu', blockRightClick, true);
    };
  };

  const cleanupSecurity = () => {
    if ((window as any).__cleanup) (window as any).__cleanup();
  };

  const loadNote = async () => {
    if (!id || !user || !token) {
      navigate('/auth');
      return;
    }

    try {
      const noteData = await getNote(id);
      if (!noteData) {
        setLoading(false);
        return;
      }
      setNote(noteData);

      if (noteData.price === 0) {
        setHasAccess(true);
        setPdfUrl(`http://localhost:5000/api/viewer/note/${id}?token=${token}`);
      } else {
        const access = await checkAccess('note', id);
        setHasAccess(access);
        if (access) {
          setPdfUrl(`http://localhost:5000/api/viewer/note/${id}?token=${token}`);
        }
      }
    } catch (error) {
      console.error('Load note error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pdfUrl && hasAccess) {
      loadPDF();
    }
  }, [pdfUrl, hasAccess]);

  const loadPDF = async () => {
    const pdfjsLib = (window as any).pdfjsLib;
    if (!pdfjsLib) {
      setTimeout(loadPDF, 100);
      return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    pdfDocRef.current = pdf;
    setTotalPages(pdf.numPages);
    renderPage(1);
  };

  const renderPage = async (pageNum: number) => {
    if (!pdfDocRef.current || !canvasRef.current || rendering) return;

    // Cancel any ongoing render
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
    }

    setRendering(true);

    try {
      const page = await pdfDocRef.current.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const viewport = page.getViewport({ scale, rotation });
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      context.clearRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      renderTaskRef.current = page.render(renderContext);
      await renderTaskRef.current.promise;
      renderTaskRef.current = null;
      
      // Draw watermark
      context.save();
      context.globalAlpha = 0.1;
      context.font = 'bold 18px Arial';
      context.fillStyle = '#000000';
      context.rotate(-30 * Math.PI / 180);
      
      const text = `${user?.email} • ${new Date().toLocaleString()}`;
      const textWidth = context.measureText(text).width;
      
      for (let y = -canvas.height; y < canvas.height * 2; y += 180) {
        for (let x = -canvas.width; x < canvas.width * 2; x += textWidth + 80) {
          context.fillText(text, x, y);
        }
      }
      context.restore();
    } catch (error: any) {
      if (error.name !== 'RenderingCancelledException') {
        console.error('Render error:', error);
      }
    } finally {
      setRendering(false);
    }
  };

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      renderPage(newPage);
    }
  };

  const changeScale = (newScale: number) => {
    const clampedScale = Math.max(0.5, Math.min(3.0, newScale));
    setScale(clampedScale);
    setTimeout(() => renderPage(currentPage), 0);
  };

  const changeRotation = (newRotation: number) => {
    setRotation(newRotation % 360);
    setTimeout(() => renderPage(currentPage), 0);
  };

  const fitToWidth = () => {
    if (containerRef.current && pdfDocRef.current) {
      const containerWidth = containerRef.current.clientWidth - 40;
      pdfDocRef.current.getPage(currentPage).then((page: any) => {
        const viewport = page.getViewport({ scale: 1, rotation });
        const newScale = containerWidth / viewport.width;
        changeScale(newScale);
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#323639] flex items-center justify-center">
        <div className="text-white text-xl">Loading PDF...</div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#323639] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <button onClick={() => navigate('/notes')} className="bg-[#5f6368] hover:bg-[#6e7175] text-white px-6 py-3 rounded">
            Back to Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#323639] flex flex-col" style={{ userSelect: 'none' }}>
      {/* Chrome-Style Toolbar */}
      <div className="bg-[#323639] shadow-lg">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left Section */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => window.close() || navigate('/notes')}
              className="w-10 h-10 flex items-center justify-center text-[#e8eaed] hover:bg-[#5f6368] rounded-full transition"
              title="Close"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            <div className="h-8 w-px bg-[#5f6368]"></div>
            <div className="text-[#e8eaed] text-sm font-medium truncate max-w-[200px]">
              {note?.title}
            </div>
          </div>

          {/* Center Section - Page Navigation */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center text-[#e8eaed] hover:bg-[#5f6368] rounded-full transition disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous page"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            
            <div className="flex items-center space-x-1 text-[#e8eaed] text-sm">
              <input 
                type="number" 
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (!isNaN(page)) changePage(page);
                }}
                className="w-12 bg-[#5f6368] text-center rounded px-1 py-1 outline-none"
                min="1"
                max={totalPages}
              />
              <span>/</span>
              <span>{totalPages}</span>
            </div>
            
            <button 
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center text-[#e8eaed] hover:bg-[#5f6368] rounded-full transition disabled:opacity-30 disabled:cursor-not-allowed"
              title="Next page"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>

          {/* Right Section - Zoom & Tools */}
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => changeScale(scale - 0.25)}
              className="w-10 h-10 flex items-center justify-center text-[#e8eaed] hover:bg-[#5f6368] rounded-full transition"
              title="Zoom out"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                <path d="M7 9h5v1H7z"/>
              </svg>
            </button>
            
            <div className="px-2 py-1 bg-[#5f6368] text-[#e8eaed] text-sm rounded min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </div>
            
            <button 
              onClick={() => changeScale(scale + 0.25)}
              className="w-10 h-10 flex items-center justify-center text-[#e8eaed] hover:bg-[#5f6368] rounded-full transition"
              title="Zoom in"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2z"/>
              </svg>
            </button>

            <div className="h-8 w-px bg-[#5f6368] mx-1"></div>

            <button 
              onClick={fitToWidth}
              className="w-10 h-10 flex items-center justify-center text-[#e8eaed] hover:bg-[#5f6368] rounded-full transition"
              title="Fit to width"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              </svg>
            </button>

            <button 
              onClick={() => changeRotation(rotation + 90)}
              className="w-10 h-10 flex items-center justify-center text-[#e8eaed] hover:bg-[#5f6368] rounded-full transition"
              title="Rotate clockwise"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45zM19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* PDF Canvas */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto bg-[#525659] flex items-start justify-center p-4"
      >
        <canvas 
          ref={canvasRef} 
          className="shadow-2xl bg-white max-w-full h-auto"
          style={{ 
            userSelect: 'none',
            imageRendering: 'high-quality'
          }}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>

      {/* Status Bar */}
      <div className="bg-[#323639] border-t border-[#5f6368] px-4 py-2 flex items-center justify-between text-xs text-[#9aa0a6]">
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
            Secure View
          </span>
          <span>•</span>
          <span>{user?.email}</span>
        </div>
        <span>© SelfWinner {new Date().getFullYear()}</span>
      </div>
    </div>
  );
};

export default SecurePDFViewer;