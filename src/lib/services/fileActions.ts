'use server'
import { mnestixFetch } from 'lib/api/infrastructure';

export async function fetchFileServerSide(fileUrl: string) {
    const { fetch } = mnestixFetch();
    return await fetch<Blob>(fileUrl);
}
