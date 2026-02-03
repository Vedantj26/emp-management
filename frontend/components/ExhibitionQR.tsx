'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { Button } from './ui/button';

export default function ExhibitionQR({ exhibitionId }: { exhibitionId: number }) {
    const url = `${window.location.origin}/visit/${exhibitionId}`;

    return (
        <div className="flex flex-col items-center gap-3">
            <QRCodeCanvas value={url} size={200} />
            <p className="text-xs text-gray-500">{url}</p>
            <Button
                onClick={() => {
                    const canvas = document.querySelector('canvas');
                    const link = document.createElement('a');
                    link.download = 'exhibition-qr.png';
                    link.href = canvas!.toDataURL();
                    link.click();
                }}
            >
                Download QR
            </Button>

        </div>
    );
}
