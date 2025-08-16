import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Share2, ZoomIn, ZoomOut, FileText } from 'lucide-react';
import { useState } from 'react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  title: string;
  type: 'document' | 'script';
}

export function DocumentModal({ isOpen, onClose, documentUrl, title, type }: DocumentModalProps) {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = title || 'document';
    link.click();
  };

  // For demo purposes, showing dummy content
  const dummyContent = type === 'script' ? `
FADE IN:

EXT. PARK - DAY

A beautiful sunny day in the park. SARAH (25), a young writer, sits on a bench with her laptop.

SARAH
(typing furiously)
This is the story of how everything changed...

She pauses, looks up at the sky, and smiles.

SARAH (CONT'D)
Sometimes the best stories come from the most unexpected places.

A DOG runs by, chasing a frisbee. Sarah watches and gets an idea.

SARAH (CONT'D)
(excited)
That's it! The dog is the key to everything!

She starts typing again with renewed energy.

FADE OUT.

THE END
` : `
BUSINESS PROPOSAL

Title: Revolutionary Content Creation Platform

Executive Summary:
This document outlines a comprehensive plan for developing a next-generation content creation platform that will revolutionize how creators share their work with audiences worldwide.

Key Features:
• Advanced media handling capabilities
• Real-time collaboration tools
• AI-powered content optimization
• Community-driven discovery algorithms

Market Analysis:
The content creation market is experiencing unprecedented growth, with creators seeking better tools and platforms to showcase their talents.

Financial Projections:
Year 1: $500K revenue target
Year 2: $2M revenue target
Year 3: $10M revenue target

Implementation Timeline:
Q1: Platform development begins
Q2: Beta testing with select creators
Q3: Public launch
Q4: Feature expansion and scaling
`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-mono">{Math.round(zoom * 100)}%</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 2}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto border rounded-md">
          <div 
            className="p-6 bg-white text-black min-h-full"
            style={{ 
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              width: `${100 / zoom}%`
            }}
          >
            {type === 'script' ? (
              <pre className="font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {dummyContent}
              </pre>
            ) : (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {dummyContent}
                </pre>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}