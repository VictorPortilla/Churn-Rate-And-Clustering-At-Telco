'use server'
import { sha256, sha224 } from 'js-sha256';

export async function encryptNDI(DNI: string) {
  const  hashing_key = 'beCodePepo03161101';
  return sha256(DNI + hashing_key);
}
