import type { NextConfig } from "next";

// Fix: Node.js não encontra o CA intermediário do Supabase neste ambiente.
// Apenas em dev — em produção o ambiente deve ter os certificados corretos.
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const nextConfig: NextConfig = {};

export default nextConfig;
