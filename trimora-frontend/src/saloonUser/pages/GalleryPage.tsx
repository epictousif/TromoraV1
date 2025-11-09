import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';

export default function GalleryPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <div className="flex items-center gap-3">
          <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={() => { /* handle later */ }} />
          <Button onClick={() => inputRef.current?.click()} disabled={uploading}>Upload Images</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square rounded-md border border-dashed flex items-center justify-center text-sm text-muted-foreground">
                Image placeholder
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
